// ==================== GLOBAL STATE ====================
class GameState {
    constructor() {
        this.characterData = {};
        this.fullGameData = {};
        this.localCopy = {}; // 本地数据副本，用于快速读取
        this.currentMessageId = 0;
        this.currentSwipeId = 0;
        this.lastDataHash = '';
        this.detailsStates = {};
        this.selectedCharacterName = '主角';
        this.activeEquipmentTabKey = null;
    }

    updateData(newData) {
        this.fullGameData = newData;
        this.characterData = newData.stat_data || newData;
        // 更新本地副本，深拷贝确保数据独立
        this.localCopy = JSON.parse(JSON.stringify(newData.stat_data || newData));
    }

    // 同步本地副本的装备状态到MVU变量
    async syncEquipmentChangeToMVU(itemKey, equippedBy) { // equippedBy can be character name or null
        try {
            const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
            if (!updateVariablesWith) return;

            const updater = variables => {
                const _ = window._ || window.parent._;
                const equipped = !!equippedBy;
                // Also update the old 'equipped' property for compatibility, if it exists.
                if (_.has(variables, `stat_data.equipment.${itemKey}.equipped`)) {
                    _.update(variables, `stat_data.equipment.${itemKey}.equipped`, () => equipped);
                }
                _.update(variables, `stat_data.equipment.${itemKey}.equip_by`, () => equippedBy);
                return variables;
            };
            await updateVariablesWith(updater, { type: 'chat' });
            await updateVariablesWith(updater, { type: 'message', message_id: gameState.currentMessageId });
        } catch (error) {
            console.error('Failed to sync equipment to MVU:', error);
        }
    }

    // 同步本地副本的角色属性到MVU变量
    async syncCharacterStatsToMVU(characterName, isPlayer, statUpdates) {
        try {
            const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
            if (!updateVariablesWith) return;

            const updater = variables => {
                const _ = window._ || window.parent._;
                const charStatsPath = isPlayer ? 'stat_data.user.stats' : `stat_data.npcs.${characterName}.stats`;
                
                Object.entries(statUpdates).forEach(([statKey, newValue]) => {
                    _.update(variables, `${charStatsPath}.${statKey}`, () => newValue);
                });
                
                return variables;
            };
            await updateVariablesWith(updater, { type: 'chat' });
            await updateVariablesWith(updater, { type: 'message', message_id: gameState.currentMessageId });
        } catch (error) {
            console.error('Failed to sync character stats to MVU:', error);
        }
    }

    // 在本地副本中更新装备状态
    updateLocalEquipment(itemKey, updates) {
        if (!this.localCopy.equipment) this.localCopy.equipment = {};
        if (!this.localCopy.equipment[itemKey]) return;

        // Ensure equip_by and equipped are in sync
        if (updates.hasOwnProperty('equip_by')) {
            updates.equipped = !!updates.equip_by;
        } else if (updates.hasOwnProperty('equipped')) {
            // This case is less ideal as we don't know who equipped it.
            // This path should only be used for unequipping.
            if (updates.equipped === false) {
                updates.equip_by = null;
            }
        }
        
        Object.assign(this.localCopy.equipment[itemKey], updates);
    }

    // 在本地副本中更新角色属性
    updateLocalCharacterStats(characterName, isPlayer, statUpdates) {
        let statsPath;
        if (isPlayer) {
            if (!this.localCopy.user) this.localCopy.user = {};
            if (!this.localCopy.user.stats) this.localCopy.user.stats = {};
            statsPath = this.localCopy.user.stats;
        } else {
            if (!this.localCopy.npcs) this.localCopy.npcs = {};
            if (!this.localCopy.npcs[characterName]) this.localCopy.npcs[characterName] = {};
            if (!this.localCopy.npcs[characterName].stats) this.localCopy.npcs[characterName].stats = {};
            statsPath = this.localCopy.npcs[characterName].stats;
        }
        
        Object.assign(statsPath, statUpdates);
    }

    getCharacterPath(character) {
        if (!character) return null;
        if (character.isPlayer) return 'user';
        if (this.fullGameData.stat_data?.npcs?.[character.name]) return `npcs.${character.name}`;
        if (this.fullGameData.stat_data?.角色?.[character.name]) return `角色.${character.name}`;
        return `npcs.${character.name}`;
    }
}

const gameState = new GameState();
