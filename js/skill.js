// ==================== SKILL MANAGEMENT ====================
class SkillManager {
    async forgetSkill(skillKey) {
        const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
        const getVariables = window.getVariables || (window.parent && window.parent.getVariables);
        const _ = window._ || window.parent._;

        if (!updateVariablesWith || !getVariables || !_) {
            console.error("SillyTavern helpers not found.");
            alert('核心功能缺失，无法执行操作。');
            return;
        }
        const currentVars = await getVariables({ type: 'message' });
        const skillToForget = _.get(currentVars, `stat_data.skills.${skillKey}`);
        if (!skillToForget) {
            alert('错误：找不到要遗忘的技能。');
            return;
        }

        const updater = (variables) => {
            _.set(variables, `stat_data.forgotten_skills.${skillKey}`, skillToForget);
            _.unset(variables, `stat_data.skills.${skillKey}`);
            return variables;
        };

        await updateVariablesWith(updater, { type: 'chat' });
        await updateVariablesWith(updater, { type: 'message', message_id: 'latest' });

        const newVars = updater(JSON.parse(JSON.stringify(currentVars)));
        gameState.updateData({ stat_data: newVars.stat_data });
        UIManager.forceUpdateUI();
    }

    async relearnSkill(skillKey) {
        const updateVariablesWith = window.updateVariablesWith || (window.parent && window.parent.updateVariablesWith);
        const getVariables = window.getVariables || (window.parent && window.parent.getVariables);
        const _ = window._ || window.parent._;

        if (!updateVariablesWith || !getVariables || !_) {
            console.error("SillyTavern helpers not found.");
            alert('核心功能缺失，无法执行操作。');
            return;
        }

        const currentVars = await getVariables({ type: 'message' });
        const skillToRelearn = _.get(currentVars, `stat_data.forgotten_skills.${skillKey}`);
        if (!skillToRelearn) {
            alert('错误：找不到要重新学习的技能。');
            return;
        }

        const updater = (variables) => {
            _.set(variables, `stat_data.skills.${skillKey}`, skillToRelearn);
            _.unset(variables, `stat_data.forgotten_skills.${skillKey}`);
            return variables;
        };

        await updateVariablesWith(updater, { type: 'chat' });
        await updateVariablesWith(updater, { type: 'message', message_id: 'latest' });
        
        const newVars = updater(JSON.parse(JSON.stringify(currentVars)));
        gameState.updateData({ stat_data: newVars.stat_data });
        UIManager.forceUpdateUI();
    }
}
const skillManager = new SkillManager();
