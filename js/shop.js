// ==================== SHOP GENERATION HELPERS (from extension) ====================
const ShopGeneration = {
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rollDice(diceString) {
        const [numDice, numSides] = diceString.toLowerCase().split('d').map(Number);
        let total = 0;
        for (let i = 0; i < numDice; i++) {
            total += this.getRandomInt(1, numSides);
        }
        return total;
    },
    equipmentRules: {
        rarities: {
            '白': { name: '普通', color: '白色', multiplier: 1.0, traits: 0 }, '绿': { name: '罕见', color: '绿色', multiplier: 1.2, traits: 1 },
            '蓝': { name: '稀有', color: '蓝色', multiplier: 1.5, traits: 2 }, '紫': { name: '史诗', color: '紫色', multiplier: 2.0, traits: 3 },
            '橙': { name: '传说', color: '橙色', multiplier: 3.0, traits: 3 }, '神': { name: '神圣', color: '彩色', multiplier: 4.0, traits: 4 },
        },
        types: {
            1: { name: '胸甲', baseStat: 'hp' }, 2: { name: '头盔', baseStat: 'mp' }, 3: { name: '护手', baseStat: 'sd' },
            4: { name: '护腿', baseStat: 'hp' }, 5: { name: '战靴', baseStat: 'agl' }, 6: { name: '武器', baseStat: 'atk' },
            7: { name: '武器', baseStat: 'atk' }, 8: { name: '武器', baseStat: 'atk' },
        },
        nameParts: { '白': '朴素的', '绿': '精致的', '蓝': '附魔的', '紫': '大师的', '橙': '传说的', '神': '神圣的' },
        traits: [
            null, { id: 1, name: '生命祝福', effects: [{ stat: 'hp', value: 10 }] }, { id: 2, name: '坚韧', effects: [{ stat: 'hp', value: 5, isPercent: true }] },
            { id: 3, name: '精神源泉', effects: [{ stat: 'mp', value: 10 }] }, { id: 4, name: '奥术', effects: [{ stat: 'mp', value: 5, isPercent: true }] },
            { id: 5, name: '冥想', effects: [{ stat: 'mpre', value: 1 }] }, { id: 6, name: '宁静', effects: [{ stat: 'mpre', value: 2 }] },
            { id: 7, name: '轻盈', effects: [{ stat: 'sd', value: 1 }] }, { id: 8, name: '鬼魅', effects: [{ stat: 'sd', value: 2 }] },
            { id: 9, name: '守护', effects: [{ stat: 'hp', value: 5 }, { stat: 'mp', value: 5 }] }, { id: 10, name: '活力', effects: [{ stat: 'hp', value: 5 }, { stat: 'mpre', value: 1 }] },
            { id: 11, name: '巨人之力', effects: [{ stat: 'hp', value: 25 }] }, { id: 12, name: '贤者之思', effects: [{ stat: 'mp', value: 20 }] },
            { id: 13, name: '快速恢复', effects: [{ stat: 'mpre', value: 3 }] }, { id: 14, name: '幻影之舞', effects: [{ stat: 'sd', value: 3 }] },
            { id: 15, name: '巨龙之鳞', effects: [{ stat: 'hp', value: 10, isPercent: true }] }, { id: 16, name: '大法师之魂', effects: [{ stat: 'mp', value: 10, isPercent: true }] },
            { id: 17, name: '圣骑士之誓', effects: [{ stat: 'hp', value: 15 }, { stat: 'mp', value: 10 }] }, { id: 18, name: '刺客信条', effects: [{ stat: 'sd', value: 2 }, { stat: 'mpre', value: 1 }] },
            { id: 19, name: '元素亲和', effects: [{ stat: 'mp', value: 15 }, { stat: 'mpre', value: 2 }] }, { id: 20, name: '泰坦之躯', effects: [{ stat: 'hp', value: 20 }, { stat: 'sd', value: 1 }] },
            { id: 21, name: '神之庇护', effects: [{ stat: 'hp', value: 30 }, { stat: 'mp', value: 30 }] }, { id: 22, name: '世界树之心', effects: [{ stat: 'hp', value: 15, isPercent: true }, { stat: 'mpre', value: 2 }] },
            { id: 23, name: '神速', effects: [{ stat: 'agl', value: 10 }, { stat: 'sd', value: 5 }] }, { id: 24, name: '最终壁垒', effects: [{ stat: 'hp', value: 50 }, { stat: 'sd', value: -5 }] },
        ]
    },
    generateSingleEquipment(allVariables) {
        const equipmentNames = ["月光的", "太阳的", "龙王的", "帝王的", "古代的", "神圣的", "恶魔的", "精灵的", "矮人的", "巨龙的", "英勇的", "祝福的", "诅咒的", "冰霜的", "火焰的", "雷霆的", "自然的", "暗影的", "光明的", "星辰的"];
        const equipmentDescriptions = ["商店中常见的制式装备，坚固耐用。", "由一位不知名的工匠精心打造，上面还留有他的印记。", "在一次小型遭遇战中缴获的战利品，品质尚可。", "为新手冒险者准备的入门级装备，提供了基础的防护。", "虽然看起来有些陈旧，但这件装备依然能够胜任战斗。", "来自艾恩葛朗特市场的热销商品。", "一件朴实无华的装备，胜在价格便宜。", "经过简单附魔的装备，能提供微弱的属性加成。", "冒险者公会为新注册的成员提供的标准配备。", "你可以在任何一个城镇的铁匠铺找到类似的装备。"];
        
        const floor = allVariables.stat_data?.calendar?.攻略层数 || 1;
        const playerLevel = allVariables.stat_data?.user?.info?.level || floor;
        let level, rarityKey;
        const roll = this.getRandomInt(1, 20);
        level = playerLevel + this.getRandomInt(-1, 1);
        if (roll <= 10) { rarityKey = '白'; } else if (roll <= 16) { rarityKey = '绿'; } else if (roll <= 19) { rarityKey = '蓝'; } else { rarityKey = '紫'; }
        const rarity = this.equipmentRules.rarities[rarityKey];
        const numTraits = rarity.traits;
        const typeRoll = this.getRandomInt(1, 8);
        const type = { ...this.equipmentRules.types[typeRoll] };
        let finalTypeName = type.name;
        if (type.name === '武器') {
            const specificWeaponTypes = ['剑', '刀', '斧', '锤', '矛', '弓', '拳套', '匕首'];
            finalTypeName = specificWeaponTypes[this.getRandomInt(0, specificWeaponTypes.length - 1)];
        }
        const randomName = equipmentNames[this.getRandomInt(0, equipmentNames.length - 1)];
        const randomDesc = equipmentDescriptions[this.getRandomInt(0, equipmentDescriptions.length - 1)];
        const name = `${this.equipmentRules.nameParts[rarityKey]}${randomName}${finalTypeName}`;
        let baseStatValue = 0;
        if (level <= 10) baseStatValue = this.rollDice('1d6') + 5; else if (level <= 20) baseStatValue = this.rollDice('1d8') + 10; else if (level <= 30) baseStatValue = this.rollDice('2d6') + 15; else if (level <= 40) baseStatValue = this.rollDice('2d8') + 20; else baseStatValue = this.rollDice('3d6') + 25;
        const finalBaseStatValue = Math.round(baseStatValue * rarity.multiplier);
        const baseStats = { [type.baseStat]: finalBaseStatValue };
        const selectedTraits = [];
        const finalTraitsForStorage = [];
        const usedTraitIds = new Set();
        for (let i = 0; i < numTraits; i++) {
            let traitRoll = this.getRandomInt(1, 24);
            while (usedTraitIds.has(traitRoll)) { traitRoll = this.getRandomInt(1, 24); }
            usedTraitIds.add(traitRoll);
            const trait = this.equipmentRules.traits[traitRoll];
            selectedTraits.push(trait);
            finalTraitsForStorage.push({ name: trait.name, rarity: rarity.name, effects: trait.effects });
        }
        const finalStats = { ...baseStats };
        for (const trait of selectedTraits) {
            for (const effect of trait.effects) {
                if (effect.isPercent) {
                    const baseValue = baseStats[effect.stat] || 0;
                    const bonus = Math.ceil(baseValue * (effect.value / 100));
                    finalStats[effect.stat] = (finalStats[effect.stat] || 0) + bonus;
                } else {
                    finalStats[effect.stat] = (finalStats[effect.stat] || 0) + effect.value;
                }
            }
        }
        const value = (Number(finalBaseStatValue) * 10) + (Number(numTraits) * 50) + (Number(level) * 5);
        return {
            owner: '{{user}}', equip_by: null, name: name, type: type.name, level: Math.max(1, level),
            rarity: rarity.color, traits: finalTraitsForStorage, stats: finalStats, equipped: false,
            description: randomDesc, value: value,
        };
    }
};

// ==================== SHOP MANAGEMENT ====================
class ShopManager {
    constructor() {
        this.activeTab = 'buy';
    }

    initialize() {
        const tabs = document.querySelector('.shop-tabs');
        if (tabs) {
            tabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-btn')) {
                    this.activeTab = e.target.dataset.tab;
                    UIManager.renderShop();
                }
            });
        }

        const shopContent = document.getElementById('shop-content');
        if (shopContent) {
            shopContent.addEventListener('click', (e) => {
                const button = e.target.closest('.action-btn');
                if (!button || button.disabled) return;

                // If the button has a specific onclick handler, let it run and stop the generic listener.
                if (button.hasAttribute('onclick')) {
                    return;
                }

                const itemKey = button.dataset.itemKey;
                const itemType = button.dataset.itemType;

                if (button.classList.contains('buy-btn')) {
                    this.buyItem(itemKey);
                } else if (button.classList.contains('sell-btn')) {
                    if (itemType === 'potion') {
                        this.sellPotion(itemKey);
                    } else {
                        this.sellItem(itemKey);
                    }
                } else if (button.classList.contains('buyback-btn')) {
                    this.buybackItem(itemKey);
                }
            });
        }
    }

    render() {
        const shopContent = document.getElementById('shop-content');
        const playerNameEl = document.getElementById('player-name');
        const playerGoldEl = document.getElementById('player-gold');
        const tabs = document.querySelectorAll('.shop-tabs .tab-btn');

        if (!shopContent || !playerNameEl || !playerGoldEl) return;

        // Update player info
        const user = gameState.localCopy.user;
        playerNameEl.textContent = user?.info?.name || '{{user}}';
        playerGoldEl.textContent = user?.背包?.珂尔 || 0;

        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === this.activeTab);
        });

        shopContent.innerHTML = ''; // Clear previous content
        const grid = document.createElement('div');
        grid.className = 'shop-grid';

        if (this.activeTab === 'buy') {
            const storeItems = gameState.localCopy.store || {};
            if (Object.keys(storeItems).length > 0) {
                Object.entries(storeItems).forEach(([key, item]) => {
                    grid.appendChild(this.createItemCard(key, item, 'buy'));
                });
            } else {
                shopContent.innerHTML = '<p style="text-align:center;">商店今日无货。</p>';
                return;
            }
        } else if (this.activeTab === 'sell') {
            const allEquipment = gameState.localCopy.equipment || {};
            const characters = CharacterManager.getCharacterList();

            if (Object.keys(allEquipment).length > 0) {
                const equipmentByOwner = {};
                // Group equipment by owner
                Object.entries(allEquipment).forEach(([key, item]) => {
                    if (!item.owner) return; // Skip items without an owner
                    const ownerName = item.owner === '{{user}}' ? '主角' : item.owner;
                    if (!equipmentByOwner[ownerName]) {
                        equipmentByOwner[ownerName] = [];
                    }
                    equipmentByOwner[ownerName].push([key, item]);
                });

                shopContent.innerHTML = ''; // Clear placeholder

                // Render items for each owner
                Object.entries(equipmentByOwner).forEach(([ownerName, items]) => {
                    const ownerHeader = document.createElement('h3');
                    ownerHeader.textContent = `${ownerName}的物品`;
                    ownerHeader.style.color = 'var(--accent-cyan)';
                    ownerHeader.style.marginTop = '10px';
                    ownerHeader.style.paddingLeft = '5px';
                    shopContent.appendChild(ownerHeader);

                    const ownerGrid = document.createElement('div');
                    ownerGrid.className = 'shop-grid';
                    
                    const character = CharacterManager.getCharacterByName(ownerName);
                    const canSell = character && (character.isPlayer || character.isTeammate);

                    items.forEach(([key, item]) => {
                        ownerGrid.appendChild(this.createItemCard(key, item, 'sell', canSell));
                    });
                    shopContent.appendChild(ownerGrid);
                });

                if (shopContent.innerHTML === '') {
                     shopContent.innerHTML = '<p style="text-align:center;">你的背包是空的。</p>';
                }
                
                // Render potions for selling
                const userPotions = gameState.localCopy.user?.背包?.道具;
                if (userPotions && Object.keys(userPotions).length > 0) {
                    const potionHeader = document.createElement('h3');
                    potionHeader.textContent = `药剂`;
                    potionHeader.style.color = 'var(--accent-cyan)';
                    potionHeader.style.marginTop = '20px';
                    potionHeader.style.paddingLeft = '5px';
                    shopContent.appendChild(potionHeader);

                    const potionGrid = document.createElement('div');
                    potionGrid.className = 'shop-grid';
                    Object.entries(userPotions).forEach(([potionName, potionData]) => {
                        potionGrid.appendChild(this.createPotionCard(potionName, potionData));
                    });
                    shopContent.appendChild(potionGrid);
                }


            } else {
                shopContent.innerHTML = '<p style="text-align:center;">你的背包是空的。</p>';
            }
            return; // Prevent default grid append
        } else if (this.activeTab === 'buyback') {
            const disposedItems = gameState.localCopy.disposed_equipments || {};
            if (Object.keys(disposedItems).length > 0) {
                Object.entries(disposedItems).forEach(([key, item]) => {
                    grid.appendChild(this.createItemCard(key, item, 'buyback'));
                });
            } else {
                shopContent.innerHTML = '<p style="text-align:center;">没有可回购的物品。</p>';
                return;
            }
        } else if (this.activeTab === 'skill-recall') {
            const forgottenSkills = gameState.localCopy.forgotten_skills || {};
            if (Object.keys(forgottenSkills).length > 0) {
                Object.entries(forgottenSkills).forEach(([key, skill]) => {
                    grid.appendChild(this.createSkillCard(key, skill, 'relearn'));
                });
            } else {
                shopContent.innerHTML = '<p style="text-align:center;">没有可回忆的技能。</p>';
                return;
            }
        }
        
        shopContent.appendChild(grid);
    }

    createItemCard(itemKey, item, type, canSell = false) {
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        const rarityColor = equipmentManager.getRarityColor(item.rarity);

        const statsHtml = UIManager.getStatsDetailHTML(item);

        const traitsHtml = item.traits && item.traits.length > 0 ?
            item.traits.map(t => `<span style="color: ${equipmentManager.getRarityColor(t.rarity)}">${t.name}</span>`).join(', ') : '无';

        const isPurchased = type === 'buy' && item.purchased === true;
        let price, buttonText, buttonClass, disabled;

        switch (type) {
            case 'buy':
                price = Math.round((item.value || 0) * 1.1);
                buttonText = isPurchased ? '已购买' : '购买';
                buttonClass = 'buy-btn';
                disabled = isPurchased ? 'disabled' : '';
                break;
            case 'sell':
                const baseValue = this.calculateItemValue(item);
                price = Math.round(baseValue * 0.9);
                buttonText = '出售';
                buttonClass = 'sell-btn';
                disabled = !canSell ? 'disabled' : '';
                break;
            case 'buyback':
                price = Math.round(this.calculateItemValue(item) * 0.9); // Buyback at same price as sell
                buttonText = '回购';
                buttonClass = 'buyback-btn';
                disabled = '';
                break;
        }

        card.innerHTML = `
            <div class="item-header">
                <span class="item-name" style="color: ${rarityColor}">${item.name}</span>
                <span class="item-level">Lv. ${item.level}</span>
            </div>
            <div class="item-body">
                <p>${item.description || item.描述}</p>
                <div class="item-stats"><strong>属性:</strong><br>${statsHtml}</div>
                <div class="item-traits"><strong>词条:</strong> ${traitsHtml}</div>
            </div>
            <div class="item-footer">
                <span class="item-price">${price} 珂尔</span>
                <button class="action-btn ${buttonClass}" data-item-key="${itemKey}" data-item-type="equipment" ${disabled}>${buttonText}</button>
            </div>
        `;
        return card;
    }

    createPotionCard(potionName, potionData) {
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        // Potions have a fixed sell price for now, e.g., 5. This can be adjusted.
        const sellPrice = 5; 

        card.innerHTML = `
            <div class="item-header">
                <span class="item-name" style="color: var(--success-green)">${potionName} (x${potionData.数量})</span>
            </div>
            <div class="item-body">
                <p>等级: ${potionData.等级}</p>
                <p>${potionData.效果}</p>
            </div>
            <div class="item-footer">
                <span class="item-price">${sellPrice} 珂尔</span>
                <button class="action-btn sell-btn" data-item-key="${potionName}" data-item-type="potion">出售 1 个</button>
            </div>
        `;
        return card;
    }

    createSkillCard(skillKey, skill, type) {
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        const rarityColor = equipmentManager.getRarityColor(skill.rarity);
        const recallCost = 0; // Free to recall

        card.innerHTML = `
            <div class="item-header">
                <span class="item-name" style="color: ${rarityColor}">${skill.name}</span>
                <span class="item-level">Lv. ${skill.level}</span>
            </div>
            <div class="item-body">
                <p>${skill.description || '暂无描述'}</p>
            </div>
            <div class="item-footer">
                <span class="item-price">免费</span>
                <button class="action-btn buyback-btn" onclick="skillManager.relearnSkill('${skillKey}')">回忆</button>
            </div>
        `;
        return card;
    }

    async buyItem(itemKey) {
        const button = document.querySelector(`.buy-btn[data-item-key="${itemKey}"]`);
        if (button) button.disabled = true;

        try {
            const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
            const getVariables = window.getVariables || (window.parent && window.parent.getVariables);
            const _ = window._ || window.parent._;

            if (!updateVariablesWith || !getVariables || !_) {
                console.error("SillyTavern helpers not found.");
                alert('核心功能缺失，无法执行操作。');
                return;
            }

            const currentVars = await getVariables({ type: 'message' });
            const itemToBuy = _.get(currentVars, `stat_data.store.${itemKey}`);
            const currentUserGold = _.get(currentVars, 'stat_data.user.背包.珂尔', 0);

            if (!itemToBuy) {
                alert('错误：商店中已不存在该物品。');
                return;
            }

            const price = Math.round((itemToBuy.value || 0) * 1.1);
            if (currentUserGold < price) {
                alert('珂尔不足，无法购买！');
                return;
            }

            const updater = (variables) => {
                const _ = window._ || window.parent._;
                const item = _.get(variables, `stat_data.store.${itemKey}`);
                if (!item) return variables;

                // Generate a unique key for the equipment list to avoid conflicts
                const newItemKey = `${item.name.replace(/\s/g, '_')}_${Date.now()}`;
                _.set(variables, `stat_data.equipment.${newItemKey}`, item);
                _.unset(variables, `stat_data.store.${itemKey}`);

                const userGoldPath = 'stat_data.user.背包.珂尔';
                _.update(variables, userGoldPath, (gold = 0) => gold - price);
                
                return variables;
            };

            await updateVariablesWith(updater, { type: 'chat' });
            await updateVariablesWith(updater, { type: 'message', message_id: 'latest' });

            const newVars = updater(JSON.parse(JSON.stringify(currentVars)));
            gameState.updateData({ stat_data: newVars.stat_data });
            
            UIManager.forceUpdateUI();
            alert(`成功购买 ${itemToBuy.name}！`);

        } catch (error) {
            console.error('Failed to buy item:', error);
            alert('购买物品失败！');
        } finally {
            // The button might not exist anymore after re-render, so check again.
            const finalButton = document.querySelector(`.buy-btn[data-item-key="${itemKey}"]`);
            if (finalButton) finalButton.disabled = false;
        }
    }

    async sellItem(itemKey) {
        const button = document.querySelector(`.sell-btn[data-item-key="${itemKey}"]`);
        if (button) button.disabled = true;

        try {
            const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
            const getVariables = window.getVariables || (window.parent && window.parent.getVariables);
            const _ = window._ || window.parent._;

            if (!updateVariablesWith || !getVariables || !_) {
                console.error("SillyTavern helpers not found.");
                alert('核心功能缺失，无法执行操作。');
                return;
            }

            const currentVars = await getVariables({ type: 'message' });
            const itemToSell = _.get(currentVars, `stat_data.equipment.${itemKey}`);

            if (!itemToSell) {
                alert('错误：在数据库中找不到要出售的物品。');
                return;
            }

            if (itemToSell.equip_by) {
                alert(`无法出售【${itemToSell.name}】，因为它正在被装备中。`);
                return;
            }

            const sellPrice = Math.round((itemToSell.value || 0) * 0.9);

            const updater = (variables) => {
                const _ = window._ || window.parent._;
                const item = _.get(variables, `stat_data.equipment.${itemKey}`);
                if (!item) return variables;

                _.set(variables, `stat_data.disposed_equipments.${itemKey}`, item);
                _.unset(variables, `stat_data.equipment.${itemKey}`);
                
                const userGoldPath = 'stat_data.user.背包.珂尔';
                _.update(variables, userGoldPath, (gold = 0) => gold + sellPrice);
                
                return variables;
            };

            await updateVariablesWith(updater, { type: 'chat' });
            await updateVariablesWith(updater, { type: 'message', message_id: 'latest' });

            const newVars = updater(JSON.parse(JSON.stringify(currentVars)));
            gameState.updateData({ stat_data: newVars.stat_data });

            this.activeTab = 'buyback';
            UIManager.forceUpdateUI();

        } catch (error) {
            console.error('Failed to sell item:', error);
            alert('出售物品失败！');
        } finally {
            if (button) button.disabled = false;
        }
    }

    async buybackItem(itemKey) {
        const button = document.querySelector(`.buyback-btn[data-item-key="${itemKey}"]`);
        if (button) button.disabled = true;

        try {
            const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
            const getVariables = window.getVariables || (window.parent && window.parent.getVariables);
            const _ = window._ || window.parent._;

            if (!updateVariablesWith || !getVariables || !_) {
                console.error("SillyTavern helpers not found.");
                alert('核心功能缺失，无法执行操作。');
                return;
            }

            const currentVars = await getVariables({ type: 'message' });
            const itemToBuyback = _.get(currentVars, `stat_data.disposed_equipments.${itemKey}`);
            const currentUserGold = _.get(currentVars, 'stat_data.user.背包.珂尔', 0);

            if (!itemToBuyback) {
                alert('错误：在回购列表中找不到该物品。');
                return;
            }

            const buybackPrice = Math.round(this.calculateItemValue(itemToBuyback) * 0.9);

            if (currentUserGold < buybackPrice) {
                alert('珂尔不足，无法回购！');
                return;
            }

            const updater = (variables) => {
                const _ = window._ || window.parent._;
                const item = _.get(variables, `stat_data.disposed_equipments.${itemKey}`);
                if (!item) return variables;

                _.set(variables, `stat_data.equipment.${itemKey}`, item);
                _.unset(variables, `stat_data.disposed_equipments.${itemKey}`);

                const userGoldPath = 'stat_data.user.背包.珂尔';
                _.update(variables, userGoldPath, (gold = 0) => gold - buybackPrice);
                
                return variables;
            };

            await updateVariablesWith(updater, { type: 'chat' });
            await updateVariablesWith(updater, { type: 'message', message_id: 'latest' });

            const newVars = updater(JSON.parse(JSON.stringify(currentVars)));
            gameState.updateData({ stat_data: newVars.stat_data });

            this.activeTab = 'buyback';
            UIManager.forceUpdateUI();

        } catch (error) {
            console.error('Failed to buyback item:', error);
            alert('回购物品失败！');
        } finally {
            if (button) button.disabled = false;
        }
    }

    calculateItemValue(item) {
        if (item.value !== undefined && item.value !== null) {
            return item.value;
        }

        const level = item.level || 1;
        const numTraits = item.traits?.length || 0;
        const rarityMap = { '白色': '白', '绿色': '绿', '蓝色': '蓝', '紫色': '紫', '橙色': '橙', '彩色': '神' };
        const rarityKey = rarityMap[item.rarity] || '白';
        const rarity = ShopGeneration.equipmentRules.rarities[rarityKey];
        
        let baseStatValue = 0;
        if (level <= 10) baseStatValue = ShopGeneration.rollDice('1d6') + 5;
        else if (level <= 20) baseStatValue = ShopGeneration.rollDice('1d8') + 10;
        else if (level <= 30) baseStatValue = ShopGeneration.rollDice('2d6') + 15;
        else if (level <= 40) baseStatValue = ShopGeneration.rollDice('2d8') + 20;
        else baseStatValue = ShopGeneration.rollDice('3d6') + 25;

        const finalBaseStatValue = Math.round(baseStatValue * (rarity?.multiplier || 1.0));
        
        const value = (Number(finalBaseStatValue) * 10) + (Number(numTraits) * 50) + (Number(level) * 5);
        return value;
    }

    async sellPotion(potionName) {
        const button = document.querySelector(`.sell-btn[data-item-key="${potionName}"]`);
        if (button) button.disabled = true;

        try {
            const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
            const getVariables = window.getVariables || (window.parent && window.parent.getVariables);
            const _ = window._ || window.parent._;

            if (!updateVariablesWith || !getVariables || !_) {
                console.error("SillyTavern helpers not found.");
                alert('核心功能缺失，无法执行操作。');
                return;
            }

            const currentVars = await getVariables({ type: 'message' });
            const potionPath = `stat_data.user.背包.道具.${potionName}`;
            const potion = _.get(currentVars, potionPath);

            if (!potion || (potion.数量 || 0) < 1) {
                alert('错误：找不到该药剂或数量不足。');
                return;
            }

            const sellPrice = 5; // Fixed price for now

            const updater = (variables) => {
                const _ = window._ || window.parent._;
                const currentAmount = _.get(variables, `${potionPath}.数量`, 0);

                if (currentAmount > 1) {
                    _.update(variables, `${potionPath}.数量`, n => n - 1);
                } else {
                    _.unset(variables, potionPath);
                }
                
                const userGoldPath = 'stat_data.user.背包.珂尔';
                _.update(variables, userGoldPath, (gold = 0) => gold + sellPrice);
                
                return variables;
            };

            await updateVariablesWith(updater, { type: 'chat' });
            await updateVariablesWith(updater, { type: 'message', message_id: 'latest' });

            const newVars = updater(JSON.parse(JSON.stringify(currentVars)));
            gameState.updateData({ stat_data: newVars.stat_data });
            
            UIManager.forceUpdateUI();

        } catch (error) {
            console.error('Failed to sell potion:', error);
            alert('出售药剂失败！');
        } finally {
            const finalButton = document.querySelector(`.sell-btn[data-item-key="${potionName}"]`);
            if (finalButton) finalButton.disabled = false;
        }
    }
}
const shopManager = new ShopManager();
