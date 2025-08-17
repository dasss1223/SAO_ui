// ==================== CHARACTER MANAGEMENT ====================
class CharacterManager {
    static getCharacterList() {
        const localData = gameState.localCopy;
        if (!localData || Object.keys(localData).length === 0) return [];

        const characters = [];
        const skillsByOwner = {};
        
        // 1. Group skills by owner
        if (localData.skills) {
            Object.entries(localData.skills).forEach(([key, skill]) => {
                if (skill && skill.owner) {
                    const ownerName = skill.owner === '{{user}}' ? '主角' : skill.owner;
                    if (!skillsByOwner[ownerName]) skillsByOwner[ownerName] = {};
                    skillsByOwner[ownerName][key] = skill;
                }
            });
        }

        // 2. All equipment is in a single pool.
        const allEquipment = localData.equipment || {};

        // 3. Assemble character objects
        if (localData.user) {
            characters.push({
                name: '主角',
                isPlayer: true,
                isTeammate: true,
                equipment: allEquipment,
                skills: skillsByOwner['主角'] || {},
                stats: localData.user
            });
        }

        if (localData.npcs) {
            Object.entries(localData.npcs).forEach(([name, char]) => {
                // Correctly check for the is_teammate flag.
                const isTeammate = char.info?.is_teammate === true || char.info?.is_teammate === 'true';
                characters.push({
                    name: name,
                    isPlayer: false,
                    isTeammate: isTeammate,
                    equipment: allEquipment,
                    skills: skillsByOwner[name] || {},
                    stats: char
                });
            });
        }
        
        if (localData.角色) {
            Object.entries(localData.角色).forEach(([name, char]) => {
                if (!characters.some(c => c.name === name)) {
                    characters.push({
                        name: name,
                        isPlayer: false,
                        isTeammate: false,
                        equipment: allEquipment,
                        skills: skillsByOwner[name] || {},
                        stats: char
                    });
                }
            });
        }
        
        return characters;
    }


    static getCharacterByName(name) {
        return this.getCharacterList().find(c => c.name === name);
    }

    static selectCharacter(name) {
        gameState.selectedCharacterName = name;
        gameState.activeEquipmentTabKey = null; // Reset active tab
        UIManager.renderCharacterSelector();
        UIManager.renderUserStatus();
        UIManager.renderEquipment();
        UIManager.renderSkills();
    }
}

// ==================== DATA MANAGEMENT ====================
class DataManager {
    static hashData(data) {
        return JSON.stringify(data);
    }

    static async loadData() {
        try {
            const getChatMessages = window.getChatMessages || window.parent.getChatMessages;
            const getCurrentMessageId = window.getCurrentMessageId || window.parent.getCurrentMessageId;
            const _ = window._ || window.parent._;

            if (typeof getChatMessages !== 'function' || typeof getCurrentMessageId !== 'function' || typeof _ !== 'function') {
                console.error("Required functions not found.");
                return;
            }
            window._ = _;

            gameState.currentMessageId = getCurrentMessageId();
            const messages = await getChatMessages(gameState.currentMessageId);
            const message = messages[0];

            if (message?.data) {
                const newHash = this.hashData(message.data);
                if (newHash !== gameState.lastDataHash) {
                    gameState.currentSwipeId = message.swipe_id ?? 0;
                    gameState.updateData(message.data);
                    
                    const chars = CharacterManager.getCharacterList();
                    if (!chars.some(c => c.name === gameState.selectedCharacterName)) {
                        gameState.selectedCharacterName = chars[0]?.name || '主角';
                    }
                    
                    UIManager.updateUI();
                }
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }
}

// ==================== MODAL MANAGEMENT ====================
class ModalManager {
    static positionModal(modalContent) {
        const card = document.getElementById('equipment-card');
        const container = document.querySelector('.container');

        if (!card || !container) {
            // Fallback to screen center if card not found
            modalContent.style.top = '50%';
            modalContent.style.left = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const cardRect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Temporarily display to measure
        const originalDisplay = modalContent.parentElement.style.display;
        modalContent.parentElement.style.display = 'block';
        const modalRect = modalContent.getBoundingClientRect();
        modalContent.parentElement.style.display = originalDisplay;

        // Position it to the right of the sidebar, vertically aligned with the card
        let top = cardRect.top;
        let left = cardRect.right + 15; // 15px gap to match container gap

        // Adjust if it goes off-screen
        if (left + modalRect.width > window.innerWidth) {
            left = window.innerWidth - modalRect.width - 15;
        }
        if (top + modalRect.height > window.innerHeight) {
            top = window.innerHeight - modalRect.height - 15;
        }
        if (top < containerRect.top) {
            top = containerRect.top;
        }
        if (left < 0) {
            left = 15;
        }

        modalContent.style.left = `${left}px`;
        modalContent.style.top = `${top}px`;
        modalContent.style.transform = 'none'; // Reset transform
    }

    static openManageEquippedModal(slotName) {
        const modal = document.getElementById('equipment-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);
        
        if (!character) return;

        if (!character.isPlayer && !character.isTeammate) {
            alert(`无法管理 ${character.name} 的装备，因为他/她不是你的队友。`);
            return;
        }

        modalTitle.textContent = `管理【${character.name} - ${slotName}】装备`;
        modalBody.innerHTML = '';

        const expectedOwner = character.isPlayer ? '{{user}}' : character.name;
        const slotInfo = equipmentManager.equipmentSlots[slotName];
        const equippedItems = Object.entries(character.equipment || {})
            .filter(([key, item]) => item && item.equip_by === expectedOwner && slotInfo.types.includes(item.type));

        if (equippedItems.length > 0) {
            equippedItems.forEach(([key, item]) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'modal-item';
                itemDiv.innerHTML = `
                    <span class="modal-item-name" style="color: ${equipmentManager.getRarityColor(item.rarity)}">${item.name} (Lvl ${item.level})</span>
                    <button class="modal-equip-btn" onclick="equipmentManager.unequipItem('${key}')">卸下</button>
                `;
                modalBody.appendChild(itemDiv);
            });
        } else {
            modalBody.innerHTML = '<div style="text-align:center; padding: 20px;">没有已装备的物品</div>';
        }
        
        if (equippedItems.length < slotInfo.capacity) {
            const equipMoreBtn = document.createElement('button');
            equipMoreBtn.textContent = '装备更多...';
            equipMoreBtn.className = 'btn';
            equipMoreBtn.style.cssText = 'margin-top: 10px; display: block; margin-left: auto; margin-right: auto;';
            equipMoreBtn.onclick = () => {
                ModalManager.openEquipmentModal(slotName);
            };
            modalBody.appendChild(equipMoreBtn);
        }

        modal.style.display = 'block';
        this.positionModal(modal.querySelector('.modal-content'));
    }

    static openEquipmentModal(slotName) {
        const modal = document.getElementById('equipment-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);
        
        if (!character) return;

        if (!character.isPlayer && !character.isTeammate) {
            alert(`无法为 ${character.name} 装备物品，因为他/她不是你的队友。`);
            return;
        }

        modalTitle.textContent = `为【${character.name} - ${slotName}】选择装备`;
        modalBody.innerHTML = '';

        const slotTypes = equipmentManager.equipmentSlots[slotName].types;
        // Use the character's already-assembled equipment list, which handles sharing for teammates.
        const availableItems = Object.entries(character.equipment || {})
            .filter(([key, item]) => {
                if (!item || !slotTypes.includes(item.type)) return false;
                // An item is available if it's not equipped by the current character.
                const equipperName = character.isPlayer ? '{{user}}' : character.name;
                return item.equip_by !== equipperName;
            });

        if (availableItems.length > 0) {
            availableItems.forEach(([key, item]) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'modal-item';

                let ownerInfo = '';
                if (item.equip_by) {
                    const equipperName = item.equip_by === '{{user}}' ? '主角' : item.equip_by;
                    ownerInfo = `<div style="font-size: 0.7rem; color: #888; margin-left: 10px;">(装备于: ${equipperName})</div>`;
                }

                itemDiv.innerHTML = `
                    <div>
                        <span class="modal-item-name" style="color: ${equipmentManager.getRarityColor(item.rarity)}">${item.name} (Lvl ${item.level})</span>
                        ${ownerInfo}
                    </div>
                    <button class="modal-equip-btn" onclick="equipmentManager.equipItemFromModal('${key}', '${slotName}')">装备</button>
                `;
                modalBody.appendChild(itemDiv);
            });
        } else {
            modalBody.innerHTML = '<div style="text-align:center; padding: 20px;">没有可用的装备</div>';
        }
        modal.style.display = 'block';
        this.positionModal(modal.querySelector('.modal-content'));
    }

    static closeEquipmentModal() {
        document.getElementById('equipment-modal').style.display = 'none';
    }
}
