// ==================== EQUIPMENT SYSTEM ====================
class EquipmentManager {
    constructor() {
        const weaponTypes = ['武器', '剑', '刀', '弓', '法杖', '双手剑', '单手剑'];
        this.equipmentSlots = {
            '头部': { 
                types: ['头盔', '帽子', '头饰', '面具'], capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C9.2 2 6.8 3.4 5.4 5.5C5.2 5.8 5.3 6.2 5.5 6.5L6.8 8.5C7 8.8 7.4 9 7.8 9H16.2C16.6 9 17 8.8 17.2 8.5L18.5 6.5C18.7 6.2 18.8 5.8 18.6 5.5C17.2 3.4 14.8 2 12 2M19 10H5C4.4 10 4 10.4 4 11V17C4 19.2 5.8 21 8 21H9V20C9 18.9 9.9 18 11 18H13C14.1 18 15 18.9 15 20V21H16C18.2 21 20 19.2 20 17V11C20 10.4 19.6 10 19 10Z"/></svg>`
            },
            '胸部': { 
                types: ['盔甲', '胸甲', '防具', '衣服'], capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L3 5V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V5L12 2M12 4.2L19 6.5V11C19 15.5 16 19.5 12 20.9C8 19.5 5 15.5 5 11V6.5L12 4.2Z"/></svg>`
            },
            '手部': { 
                types: ['手套', '护手'], capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.5 13.3C20.5 13.3 21.3 14.1 21.3 15.3C21.3 16.5 20.4 17.4 19.2 17.4C18 17.4 17.1 16.5 17.1 15.3C17.1 14.1 17.9 13.3 17.9 13.3L17.5 13.1C16.9 12.8 16.5 12.2 16.5 11.5V6.3C16.5 5.2 15.6 4.3 14.5 4.3H10.3C9.2 4.3 8.3 5.2 8.3 6.3V11.4C8.3 12.1 7.9 12.7 7.3 13L3.5 14.4C2.9 14.6 2.5 15.2 2.5 15.9C2.5 17.3 3.7 18.5 5.1 18.5C6.2 18.5 7.1 17.8 7.4 16.8L9.4 13.2V19.5C9.4 20.3 10.1 21 10.9 21H14.9C15.7 21 16.4 20.3 16.4 19.5V14.5C16.4 14.2 16.5 13.9 16.7 13.7L20.5 13.3Z"/></svg>`
            },
            '腿部': { 
                types: ['护腿', '裤子'], capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 6H9V12H15V6M15 14H9V22H15V14M17 6H20V22H17V6M7 6H4V22H7V6Z"/></svg>`
            },
            '脚部': { 
                types: ['靴子', '鞋子'], capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.5 19.2L16.3 21.3L14.5 16.8L18.8 14.7C19.5 14.4 20.3 14.7 20.6 15.4L21.8 18.1C22.1 18.8 21.8 19.6 21.1 19.9L20.5 19.2M12.5 2.5C12.5 2.5 12.5 2.5 12.5 2.5C12.5 3.9 11.4 5 10 5H4C2.9 5 2 5.9 2 7V18C2 19.1 2.9 20 4 20H12C13.1 20 14 19.1 14 18V10.5C14 10.5 14 10.5 14 10.5C15.4 10.5 16.5 9.4 16.5 8C16.5 6.6 15.4 5.5 14 5.5C14 5.5 14 5.5 14 5.5C14 4 12.5 2.5 12.5 2.5Z"/></svg>`
            },
            '武器': { 
                types: weaponTypes, capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.4 4.6L19.4 2.6C19.2 2.4 18.8 2.4 18.6 2.6L13.5 7.7L9.3 3.5C9.1 3.3 8.8 3.3 8.6 3.5L2.6 9.5C2.4 9.7 2.4 10 2.6 10.2L13.8 21.4C14 21.6 14.3 21.6 14.5 21.4L21.4 14.5C21.6 14.3 21.6 14 21.4 13.8L16.3 8.7L21.4 3.6C21.6 3.4 21.6 3.1 21.4 2.6L21.4 4.6Z"/></svg>`
            },
            '副武器': { 
                types: weaponTypes, capacity: 1,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L3 5V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V5L12 2M12 4.2L19 6.5V11C19 15.5 16 19.5 12 20.9C8 19.5 5 15.5 5 11V6.5L12 4.2Z"/></svg>`
            },
            '饰品': { 
                types: ['项链', '耳环', '手镯', '饰品', '徽章', '戒指'], capacity: 4,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C9.2 2 7 4.2 7 7V9H5C3.9 9 3 9.9 3 11V17C3 18.1 3.9 19 5 19H6V21C6 21.6 6.4 22 7 22H9C9.6 22 10 21.6 10 21V19H14V21C14 21.6 14.4 22 15 22H17C17.6 22 18 21.6 18 21V19H19C20.1 19 21 18.1 21 17V11C21 9.9 20.1 9 19 9H17V7C17 4.2 14.8 2 12 2M12 4C13.7 4 15 5.3 15 7V9H9V7C9 5.3 10.3 4 12 4Z"/></svg>`
            }
        };

        this.rarityColors = {
            '白色': '#FFFFFF', '绿色': '#4CAF50', '蓝色': '#2196F3',
            '紫色': '#9C27B0', '橙色': '#FF9800', '红色': '#F44336', '金色': '#FFD700',
            '彩虹': '#FF6B6B', 'SSR': '#FF6B6B', 'SR': '#9C27B0', 'R': '#2196F3', 'N': '#CCCCCC',
            '传说': '#FFD700', '史诗': '#9C27B0', '稀有': '#2196F3', '精良': '#4CAF50', '普通品质': '#CCCCCC'
        };
    }

    getRarityColor(rarity) {
        return this.rarityColors[rarity] || '#CCCCCC';
    }

    async unequipItem(itemKey) {
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);
        if (!character) {
            console.log("Cannot unequip - no character selected");
            return;
        }

        // 从本地副本获取装备信息
        const item = gameState.localCopy.equipment?.[itemKey];
        const expectedEquipper = character.isPlayer ? '{{user}}' : character.name;

        if (!item || item.equip_by !== expectedEquipper) {
            console.log("Item not equipped by selected character");
            return;
        }

        try {
            // 1. 先更新本地副本
            gameState.updateLocalEquipment(itemKey, { equip_by: null });
            
            // 2. 更新本地副本中的角色属性（移除装备加成）
            const itemStats = item.stats || item.属性;
            if (itemStats) {
                const statUpdates = {};
                const statTranslation = { 
                    "最大生命值": "hp", "max_hp": "hp", "hp": "hp",
                    "最大法力值": "mp", "max_mp": "mp", "mp": "mp",
                    "每回合MP恢复": "mpre", "mpre": "mpre",
                    "基础闪避率": "agl", "agl": "agl"
                };
                
                Object.entries(itemStats).forEach(([statKey, value]) => {
                    const translatedKey = statTranslation[statKey] || statKey;
                    if (['hp', 'mp', 'mpre', 'agl'].includes(translatedKey) && typeof value === 'number') {
                        // 从本地副本获取当前值
                        const currentStats = character.isPlayer ? 
                            gameState.localCopy.user?.stats : 
                            gameState.localCopy.npcs?.[character.name]?.stats;
                        
                        const currentValue = currentStats?.[translatedKey] || 0;
                        statUpdates[translatedKey] = currentValue - value;
                    }
                });
                
                // 更新本地副本中的属性
                gameState.updateLocalCharacterStats(character.name, character.isPlayer, statUpdates);
                
                // 同步属性到MVU
                await gameState.syncCharacterStatsToMVU(character.name, character.isPlayer, statUpdates);
            }
            
            // 3. 同步装备状态到MVU
            await gameState.syncEquipmentChangeToMVU(itemKey, null);
            
            // 4. 立即更新UI（从本地副本读取）
            UIManager.forceUpdateUI();
            ModalManager.closeEquipmentModal(); // Close modal after action
            
            console.log(`Unequipped ${item.name} from ${character.name}`);
        } catch (error) {
            console.error('Error during unequipItem:', error);
            // 错误时恢复本地副本状态
            gameState.updateLocalEquipment(itemKey, { equip_by: expectedEquipper });
            UIManager.forceUpdateUI();
        }
    }

    async equipItemFromModal(itemKeyToEquip, slotName) {
        const toCharacter = CharacterManager.getCharacterByName(gameState.selectedCharacterName);
        if (!toCharacter) {
            console.log("Cannot equip - no character selected");
            ModalManager.closeEquipmentModal();
            return;
        }
        if (!toCharacter.isPlayer && !toCharacter.isTeammate) {
            alert(`无法为 ${toCharacter.name} 装备物品，因为他/她不是你的队友。`);
            ModalManager.closeEquipmentModal();
            return;
        }

        try {
            const newItem = gameState.localCopy.equipment?.[itemKeyToEquip];
            if (!newItem) {
                console.error("Item to equip not found in local copy.");
                return;
            }

            const fromCharacterName = newItem.equip_by === '{{user}}' ? '主角' : newItem.equip_by;
            const fromCharacter = fromCharacterName ? CharacterManager.getCharacterByName(fromCharacterName) : null;
            const newEquipperName = toCharacter.isPlayer ? '{{user}}' : toCharacter.name;

            // --- Stat Update Logic ---
            const applyStatChange = (character, item, action) => {
                if (!character || !item) return {};
                
                const statUpdates = {};
                const baseStats = character.isPlayer ? gameState.localCopy.user?.stats : gameState.localCopy.npcs?.[character.name]?.stats;
                if (!baseStats) return {};

                const allEffects = [];
                // Add base stats from the item itself
                if (item.stats) {
                    Object.entries(item.stats).forEach(([stat, value]) => {
                        allEffects.push({ stat, value });
                    });
                }
                // Add stats from traits
                if (item.traits && Array.isArray(item.traits)) {
                    item.traits.forEach(trait => {
                        if (trait.effects && Array.isArray(trait.effects)) {
                            trait.effects.forEach(effect => allEffects.push(effect));
                        }
                    });
                }

                const statTranslation = { "hp": "hp", "mp": "mp", "mpre": "mpre", "agl": "agl", "sd": "sd", "atk": "atk" };

                allEffects.forEach(effect => {
                    const translatedKey = statTranslation[effect.stat] || effect.stat;
                    if (statUpdates[translatedKey] === undefined) {
                        statUpdates[translatedKey] = baseStats[translatedKey] || 0;
                    }
                    
                    let valueChange = 0;
                    if (effect.isPercent) {
                        // For now, let's assume percentage bonuses apply to base character stats.
                        // This could be changed to item base stats if needed.
                        const charBaseStat = baseStats[translatedKey] || 0;
                        valueChange = Math.ceil(charBaseStat * (effect.value / 100));
                    } else {
                        valueChange = effect.value;
                    }

                    if (action === 'add') {
                        statUpdates[translatedKey] += valueChange;
                    } else {
                        statUpdates[translatedKey] -= valueChange;
                    }
                });
                
                // We only want to return the final values, not deltas
                const finalStatValues = {};
                Object.keys(statUpdates).forEach(key => {
                    finalStatValues[key] = statUpdates[key];
                });

                return finalStatValues;
            };

            // 1. If the item is currently equipped by another character, unequip it from them first.
            if (newItem.equip_by && fromCharacter && fromCharacter.name !== toCharacter.name) {
                console.log(`Swapping item: Unequipping ${newItem.name} from ${fromCharacter.name}`);
                // a. Update item state in local copy
                gameState.updateLocalEquipment(itemKeyToEquip, { equip_by: null });
                // b. Calculate and apply stat changes for the original owner
                const fromCharStatUpdates = applyStatChange(fromCharacter, newItem, 'subtract');
                if (Object.keys(fromCharStatUpdates).length > 0) {
                    gameState.updateLocalCharacterStats(fromCharacter.name, fromCharacter.isPlayer, fromCharStatUpdates);
                    await gameState.syncCharacterStatsToMVU(fromCharacter.name, fromCharacter.isPlayer, fromCharStatUpdates);
                }
                // c. Sync unequip status to MVU
                await gameState.syncEquipmentChangeToMVU(itemKeyToEquip, null);
            }

            // 2. Check slot capacity on the new character and unequip if necessary.
            const slotInfo = this.equipmentSlots[slotName];
            const slotTypes = slotInfo.types;
            const isWeaponSlot = slotName === '武器' || slotName === '副武器';

            if (isWeaponSlot) {
                const allEquippedWeapons = Object.entries(gameState.localCopy.equipment || {})
                    .filter(([, item]) => item && item.equip_by === newEquipperName && slotTypes.includes(item.type));

                let slotToClear = -1; // 0 for main, 1 for off-hand
                if (slotName === '武器') slotToClear = 0;
                if (slotName === '副武器') slotToClear = 1;

                if (slotToClear !== -1 && allEquippedWeapons.length > slotToClear) {
                    // An item exists in the target slot, so we need to unequip it.
                    const [oldKey, oldItem] = allEquippedWeapons[slotToClear];
                    console.log(`Making space: Unequipping ${oldItem.name} from ${toCharacter.name} in slot ${slotName}`);
                    gameState.updateLocalEquipment(oldKey, { equip_by: null });
                    const oldItemStatUpdates = applyStatChange(toCharacter, oldItem, 'subtract');
                    if (Object.keys(oldItemStatUpdates).length > 0) {
                        gameState.updateLocalCharacterStats(toCharacter.name, toCharacter.isPlayer, oldItemStatUpdates);
                        await gameState.syncCharacterStatsToMVU(toCharacter.name, toCharacter.isPlayer, oldItemStatUpdates);
                    }
                    await gameState.syncEquipmentChangeToMVU(oldKey, null);
                }
            } else {
                // Original logic for other slots
                const capacity = slotInfo.capacity || 1;
                const currentlyEquippedItems = Object.entries(gameState.localCopy.equipment || {})
                    .filter(([, item]) => item && item.equip_by === newEquipperName && slotTypes.includes(item.type));

                if (currentlyEquippedItems.length >= capacity) {
                    if (capacity === 1) {
                        const [oldKey, oldItem] = currentlyEquippedItems[0];
                        console.log(`Making space: Unequipping ${oldItem.name} from ${toCharacter.name}`);
                        gameState.updateLocalEquipment(oldKey, { equip_by: null });
                        const oldItemStatUpdates = applyStatChange(toCharacter, oldItem, 'subtract');
                        if (Object.keys(oldItemStatUpdates).length > 0) {
                            gameState.updateLocalCharacterStats(toCharacter.name, toCharacter.isPlayer, oldItemStatUpdates);
                            await gameState.syncCharacterStatsToMVU(toCharacter.name, toCharacter.isPlayer, oldItemStatUpdates);
                        }
                        await gameState.syncEquipmentChangeToMVU(oldKey, null);
                    } else {
                        alert(`无法装备 ${newItem.name}。${slotName} 栏位已满 (容量: ${capacity})。`);
                        ModalManager.closeEquipmentModal();
                        return;
                    }
                }
            }

            // 3. Equip the new item on the target character.
            console.log(`Equipping ${newItem.name} to ${toCharacter.name}`);
            // a. Update item state in local copy (equip_by status)
            gameState.updateLocalEquipment(itemKeyToEquip, { equip_by: newEquipperName });
            // b. Calculate and apply stat changes for the new owner
            const toCharStatUpdates = applyStatChange(toCharacter, newItem, 'add');
            if (Object.keys(toCharStatUpdates).length > 0) {
                gameState.updateLocalCharacterStats(toCharacter.name, toCharacter.isPlayer, toCharStatUpdates);
                await gameState.syncCharacterStatsToMVU(toCharacter.name, toCharacter.isPlayer, toCharStatUpdates);
            }
            // c. Sync equip status to MVU
            await gameState.syncEquipmentChangeToMVU(itemKeyToEquip, newEquipperName);

            // 4. Force UI update from the modified local copy
            UIManager.forceUpdateUI();
            
        } catch (error) {
            console.error('Error during equipItemFromModal:', error);
            // On error, reload data to ensure consistency
            await DataManager.loadData();
            UIManager.forceUpdateUI();
        } finally {
            ModalManager.closeEquipmentModal();
        }
    }

    async toggleEquip(itemKey, btn) {
        if (btn) btn.disabled = true;
        try {
            const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);
            if (!character) return;
            
            // Always get the latest item state from the local copy
            const item = gameState.localCopy.equipment?.[itemKey];
            if (!item) {
                console.error(`Item with key ${itemKey} not found in local copy.`);
                return;
            }

            const characterName = character.isPlayer ? '{{user}}' : character.name;

            if (item.equip_by === characterName) {
                // If item is equipped by the current character, unequip it.
                await this.unequipItem(itemKey);
            } else {
                // If item is not equipped by the current character, equip it.
                // This will also handle swapping from another character.
                let slotName = null;
                for (const [slot, info] of Object.entries(this.equipmentSlots)) {
                    if (info.types.includes(item.type)) {
                        slotName = slot;
                        break;
                    }
                }
                if (!slotName) {
                    console.error(`Could not find a slot for item type: ${item.type}`);
                    return;
                }
                await this.equipItemFromModal(itemKey, slotName);
            }
        } catch (e) {
            console.error('toggleEquip error', e);
        } finally {
            if (btn) btn.disabled = false;
        }
    }
}

const equipmentManager = new EquipmentManager();
