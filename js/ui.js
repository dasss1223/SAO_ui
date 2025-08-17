// ==================== UI MANAGEMENT ====================
class UIManager {
    static saveDetailsStates() {
        const details = document.querySelectorAll('details');
        details.forEach((detail, index) => {
            const id = detail.id || `detail-${index}`;
            gameState.detailsStates[id] = detail.open;
        });
    }

    static restoreDetailsStates() {
        const details = document.querySelectorAll('details');
        details.forEach((detail, index) => {
            const id = detail.id || `detail-${index}`;
            if (gameState.detailsStates[id] !== undefined) {
                detail.open = gameState.detailsStates[id];
            }
        });
    }

    static getTraitColors(traits) {
        if (!traits || !Array.isArray(traits)) return [];
        const rarityLevelColors = ['#CCCCCC', '#FFFFFF', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336', '#FFD700'];
        
        return traits.map(traitData => {
            if (Array.isArray(traitData) && traitData.length >= 2) {
                const [traitName, rarityLevel] = traitData;
                const color = rarityLevelColors[Math.max(0, Math.min(7, (rarityLevel || 1) - 1))];
                return { trait: traitName, color, rarity: rarityLevel };
            }
            const traitName = typeof traitData === 'string' ? traitData : String(traitData);
            return { trait: traitName, color: rarityLevelColors[0], rarity: 1 };
        });
    }

    static formatTraitsWithColors(traits) {
        if (!traits || !Array.isArray(traits)) return '无';
        const rarityLevelColors = ['#CCCCCC', '#FFFFFF', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336', '#FFD700', '#FF6B6B']; // Added one more for level 8
        const formatted = traits.map(trait => {
            // Equipment trait format: { name: "坚韧", rarity: "普通" }
            if (typeof trait === 'object' && trait !== null && trait.name && trait.rarity) {
                const rarityColor = equipmentManager.getRarityColor(trait.rarity);
                return `<span style="color: ${rarityColor}; font-weight: bold; margin: 0 2px;" title="稀有度: ${trait.rarity}">${trait.name}</span>`;
            }
            // Skill trait format: [ "大法师节能", 6 ]
            if (Array.isArray(trait) && trait.length >= 2 && typeof trait[1] === 'number') {
                const [traitName, rarityLevel] = trait;
                const color = rarityLevelColors[Math.max(0, Math.min(rarityLevelColors.length - 1, (rarityLevel || 1) - 1))];
                return `<span style="color: ${color}; font-weight: bold; margin: 0 2px;" title="稀有度等级: ${rarityLevel}">${traitName}</span>`;
            }
            // Fallback for older formats
            if (Array.isArray(trait) && trait.length > 0) {
                return `<span style="color: #CCCCCC; font-weight: bold; margin: 0 2px;">${trait[0]}</span>`;
            }
            return '';
        }).filter(Boolean).join(' | ');
        return formatted || '无';
    }

    static renderEquipment() {
        this.saveDetailsStates();
        const equipmentBody = document.getElementById('equipment-body');
        equipmentBody.innerHTML = '';
        
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);

        if (!character) {
            equipmentBody.innerHTML = `<div style="text-align:center; color: #888; padding: 20px;">未选择角色</div>`;
            return;
        }
        
        const charEquipment = gameState.localCopy.equipment || {};
        if (Object.keys(charEquipment).length === 0) {
            equipmentBody.innerHTML = `<div style="text-align:center; color: #888; padding: 20px;">没有装备信息</div>`;
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'equipment-layout';
        const grid = document.createElement('div');
        grid.className = 'equipment-grid';

        const expectedOwner = character.isPlayer ? '{{user}}' : character.name;
        
        // Special handling for weapons to assign them to specific slots
        const allEquippedWeapons = Object.entries(charEquipment)
            .filter(([key, item]) => {
                if (!item) return false;
                const weaponTypes = equipmentManager.equipmentSlots['武器'].types;
                return item.equip_by === expectedOwner && weaponTypes.includes(item.type);
            });
        let weaponIndex = 0;

        Object.entries(equipmentManager.equipmentSlots).forEach(([slotName, slotInfo]) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = `equipment-slot ${slotName}`;

            let equippedItems;
            const isWeaponSlot = slotName === '武器' || slotName === '副武器';

            if (isWeaponSlot) {
                const weaponTuple = allEquippedWeapons[weaponIndex];
                equippedItems = weaponTuple ? [weaponTuple] : [];
                weaponIndex++;
            } else {
                equippedItems = Object.entries(charEquipment)
                    .filter(([key, item]) => {
                        if (!item) return false;
                        return item.equip_by === expectedOwner && slotInfo.types.includes(item.type);
                    });
            }

            if (equippedItems.length > 0) {
                const [firstItemKey, firstItem] = equippedItems[0];
                const rarityColor = equipmentManager.getRarityColor(firstItem.rarity);
                slotDiv.style.borderColor = rarityColor;
                slotDiv.style.boxShadow = `0 0 6px ${rarityColor}66`;
                
                let displayName = firstItem.name;
                // This logic is now only relevant for multi-capacity slots like饰品
                if (equippedItems.length > 1 && !isWeaponSlot) {
                    displayName += ` (+${equippedItems.length - 1})`;
                }

                slotDiv.innerHTML = `
                    ${slotInfo.svg}
                    <div class="slot-item-name" style="background-color: ${rarityColor}; color: #111;">${displayName}</div>
                `;
                
                slotDiv.onclick = () => ModalManager.openManageEquippedModal(slotName);
                slotDiv.title = `点击管理已装备的: ${slotName}`;
                slotDiv.style.cursor = 'pointer';
            } else {
                slotDiv.innerHTML = `
                    ${slotInfo.svg}
                    <div class="slot-placeholder">${slotName}</div>
                `;
                
                slotDiv.onclick = () => ModalManager.openEquipmentModal(slotName);
                slotDiv.title = `点击装备: ${slotName}`;
                slotDiv.style.cursor = 'pointer';
            }
            grid.appendChild(slotDiv);
        });
        
        wrapper.appendChild(grid);

        // Equipment list with tabs
        const allItems = Object.entries(charEquipment).filter(([key, itm]) => {
            if (!itm) return false;
            // Show item if it's unequipped or equipped by the current character
            return !itm.equip_by || itm.equip_by === expectedOwner;
        });
        
        if (allItems.length > 0) {
            const eqWrapper = document.createElement('div');
            eqWrapper.className = 'stardew-text-wrapper';
            const eqTabs = document.createElement('div');
            eqTabs.className = 'skill-tabs';
            const eqContent = document.createElement('div');
            eqContent.className = 'skill-content-area';

            // Set initial content based on active tab key
            if (gameState.activeEquipmentTabKey && charEquipment[gameState.activeEquipmentTabKey]) {
                eqContent.innerHTML = this.getEquipmentDetailHTML(gameState.activeEquipmentTabKey, charEquipment[gameState.activeEquipmentTabKey]);
            } else {
                eqContent.innerHTML = `<div style="text-align:center; padding: 20px; color: #888;">点击上方装备查看详情</div>`;
            }

            allItems.forEach(([key, itm]) => {
                const tab = document.createElement('div');
                tab.className = 'skill-tab';
                tab.textContent = itm.name || key;
                tab.dataset.eqKey = key;
                if (key === gameState.activeEquipmentTabKey) {
                    tab.classList.add('active');
                }
                eqTabs.appendChild(tab);
            });

            eqTabs.addEventListener('click', (e) => {
                const t = e.target.closest('.skill-tab');
                if (!t) return;
                
                const eqKey = t.dataset.eqKey;
                // If the clicked tab is already active, deactivate it. Otherwise, activate it.
                if (t.classList.contains('active')) {
                    t.classList.remove('active');
                    gameState.activeEquipmentTabKey = null;
                    eqContent.innerHTML = `<div style="text-align:center; padding: 20px; color: #888;">点击上方装备查看详情</div>`;
                } else {
                    eqTabs.querySelector('.active')?.classList.remove('active');
                    t.classList.add('active');
                    gameState.activeEquipmentTabKey = eqKey;
                    const itm = charEquipment[eqKey];
                    eqContent.innerHTML = this.getEquipmentDetailHTML(eqKey, itm);
                }
            });

            eqWrapper.appendChild(eqTabs);
            eqWrapper.appendChild(eqContent);
            wrapper.appendChild(eqWrapper);
        }

        equipmentBody.appendChild(wrapper);
        setTimeout(() => this.restoreDetailsStates(), 10);
    }

    static getEquipmentDetailHTML(itemKey, item) {
        if (!item) return '';
        
        // 从本地副本获取最新的装备状态
        const latestItem = gameState.localCopy.equipment?.[itemKey] || item;
        const selectedCharName = gameState.selectedCharacterName === '主角' ? '{{user}}' : gameState.selectedCharacterName;
        const isEquippedByMe = latestItem.equip_by === selectedCharName;
        const isEquipped = !!latestItem.equip_by;
        
        const rarityColor = equipmentManager.getRarityColor(item.rarity);
        const formattedTraits = this.formatTraitsWithColors(item.traits || []);
        return `
            <div class="equipment-detail">
                <div style="text-align:center;border-bottom:1px solid #666;padding-bottom:4px;margin-bottom:8px;">========== 【装备详情】 ==========</div>
                <span class="equipment-name">📛名称：${item.name}</span><br>
                <span class="equipment-type">🛡️类型：${item.type}</span><br>
                <span class="equipment-rarity" style="color: ${rarityColor};">💎稀有度：${item.rarity}</span><br>
                ⭐装备等级：${item.level}<br>
                📜词条：${formattedTraits}<br>
                <div style="margin:8px 0;"><strong>【属性加成】：</strong></div>
                <span class="equipment-stats">${this.getStatsDetailHTML(item)}</span><br>
                <div style="margin-top:8px;">
                    ${isEquippedByMe ? '✅已装备' : (isEquipped ? `🟡装备于: ${latestItem.equip_by === '{{user}}' ? '主角' : latestItem.equip_by}` : '❌未装备')}
                    <button class="btn" onclick="equipmentManager.toggleEquip('${itemKey}', this)" style="margin-left:10px;">
                        ${isEquippedByMe ? '卸下' : '装备'}
                    </button>
                </div>
            </div>
        `;
    }

    static renderSkills() {
        this.saveDetailsStates();
        const skillBody = document.getElementById('skill-body');
        skillBody.innerHTML = '';
        
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);

        if (!character) {
            skillBody.innerHTML = `<div style="text-align:center; color: #888; padding: 20px;">未选择角色</div>`;
            return;
        }
        
        if (!character.skills || Object.keys(character.skills).length === 0) {
            skillBody.innerHTML = `<div style="text-align:center; color: #888; padding: 20px;">没有技能信息</div>`;
            return;
        }

        const allSkills = Object.entries(character.skills)
            .filter(([key, sk]) => key !== '$meta' && sk);

        if (allSkills.length === 0) {
            skillBody.innerHTML = `<div style="text-align:center; color: #888; padding: 20px;">没有技能</div>`;
            return;
        }

        const skillWrapper = document.createElement('div');
        skillWrapper.className = 'stardew-text-wrapper';
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'skill-tabs';
        const contentContainer = document.createElement('div');
        contentContainer.className = 'skill-content-area';

        allSkills.forEach(([key, sk], index) => {
            const tab = document.createElement('div');
            tab.className = 'skill-tab';
            tab.textContent = sk.name || key;
            tab.dataset.skillKey = key;
            tabsContainer.appendChild(tab);
            if (index === 0) {
                tab.classList.add('active');
                contentContainer.innerHTML = this.getSkillDetailHTML(sk, key);
            }
        });

        tabsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.skill-tab');
            if (target) {
                tabsContainer.querySelector('.active')?.classList.remove('active');
                target.classList.add('active');
                const skillKey = target.dataset.skillKey;
                const skill = character.skills[skillKey];
                contentContainer.innerHTML = this.getSkillDetailHTML(skill, skillKey);
            }
        });

        skillWrapper.appendChild(tabsContainer);
        skillWrapper.appendChild(contentContainer);
        skillBody.appendChild(skillWrapper);
        setTimeout(() => this.restoreDetailsStates(), 10);
    }

    static getStatsDetailHTML(item) {
        if (!item || !item.stats) return '无';
        const statMapping = {
            hp: '❤️ 生命值 (HP)',
            mp: '💧 法力值 (MP)',
            mpre: '🔄 每回合MP恢复',
            agl: '💨 基础闪避率',
            sd: '⚡ 速度'
        };
        return Object.entries(item.stats)
            .map(([key, value]) => `${statMapping[key] || key}: +${value}`)
            .join('<br>');
    }

    static getSkillDetailHTML(sk, skillKey) {
        if (!sk) return '';
        const rarityColor = equipmentManager.getRarityColor(sk.rarity);
        const formattedTraits = this.formatTraitsWithColors(sk.traits || []);
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);
        const canForget = character && (character.isPlayer || character.isTeammate);

        let forgetButtonHtml = '';
        if (canForget && skillKey) {
            forgetButtonHtml = `<button class="btn sell-btn" onclick="skillManager.forgetSkill('${skillKey}')" style="margin-top: 10px;">遗忘技能</button>`;
        }

        return `
            <div class="skill-detail">
                <div style="text-align:center;border-bottom:1px solid #666;padding-bottom:4px;margin-bottom:8px;">========== 【剑技详情】 ==========</div>
                <span class="skill-name">📛名称：${sk.name}</span><br>
                <span class="skill-type">✨种类：${sk.tow}</span><br>
                ⭐剑技等级：${sk.level}<br>
                <span class="skill-rarity" style="color: ${rarityColor};">💎核心稀有度：${sk.rarity}</span><br>
                📜词条：${formattedTraits}<br>
                <div style="margin:8px 0;"><strong>【技能属性】：</strong></div>
                <span class="skill-stats">⚔️攻击力：${sk.atk}<br>
                🎯命中率：${sk.hit}%<br>
                💥暴击率：${sk.crit}%<br>
                💀暴击伤害：+${sk.critdmg}%<br>
                🔄攻击次数：${sk.apt} 次/轮<br>
                👥目标数量：${sk.tpa} 个<br>
                💧法力消耗：${sk.mpcost} MP</span><br>
                <span class="skill-effect">✨特殊效果：${sk.effect}</span><br>
                📟效果代码：${sk.code}
                ${forgetButtonHtml}
            </div>
        `;
    }

    static renderUserStatus() {
        const userStatusBody = document.getElementById('user-status-body');
        if (!userStatusBody) return;
        
        userStatusBody.innerHTML = '';
        const character = CharacterManager.getCharacterByName(gameState.selectedCharacterName);

        if (!character) {
            userStatusBody.innerHTML = `<div style="text-align:center; color: #888; padding: 20px;">未选择角色</div>`;
            return;
        }

        const translationMap = {
            info: "基本信息", name: "名称", level: "等级", exp: "经验值", type: "类型", job: "职业",
            stats: "核心属性", hp: "生命值", mp: "法力值", mpre: "法力恢复", agl: "闪避率", sd: "速度",
            relation: "关系", status: "状态", affection: "好感度", trust: "信赖度", combat: "战斗状态",
            interactions: "互动选项", traits: "特性",
            背包: "背包", 道具: "道具", 珂尔: "珂尔",
            任务日志: "任务日志"
        };

        const renderSection = (title, data) => {
            if (!data || Object.keys(data).length === 0) return '';
            let content = `<div class="status-section"><div class="status-section-title">${title}</div>`;
            for (let [key, value] of Object.entries(data)) {
                if (key === '$meta') continue;
                let translatedKey = translationMap[key] || key;
                let displayValue;

                if (key === 'is_teammate') {
                    translatedKey = '队友';
                    displayValue = (value === true || value === 'true') ? '是' : '否';
                } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    displayValue = Object.entries(value).map(([itemKey, itemVal]) => {
                        if (typeof itemVal === 'object' && itemVal !== null) {
                            return `${itemKey}: ${itemVal.数量 || ''} (效果: ${itemVal.效果 || ''})`;
                        }
                        return `${itemKey}: ${itemVal}`;
                    }).join(', ');
                } else {
                    displayValue = Array.isArray(value) ? value.join(', ') : value;
                }
                content += `<div class="status-item"><span class="status-item-key">${translatedKey}:</span> <span class="status-item-value">${displayValue}</span></div>`;
            }
            content += `</div>`;
            return content;
        };

        let finalHtml = '';
        
        // 从本地副本获取最新的角色属性数据
        let latestCharStats;
        if (character.isPlayer) {
            latestCharStats = gameState.localCopy.user || character.stats || {};
        } else {
            latestCharStats = gameState.localCopy.npcs?.[character.name] || 
                                    gameState.localCopy.角色?.[character.name] || 
                                    character.stats || {};
        }
        
        if (character.isPlayer) {
            finalHtml += renderSection(translationMap.info, latestCharStats.info);
            finalHtml += renderSection(translationMap.stats, latestCharStats.stats);
            finalHtml += renderSection(translationMap.背包, latestCharStats.背包);
            finalHtml += renderSection(translationMap.任务日志, latestCharStats.任务日志);
        } else {
            finalHtml += renderSection(translationMap.info, latestCharStats.info);
            finalHtml += renderSection(translationMap.stats, latestCharStats.stats);
            finalHtml += renderSection(translationMap.relation, latestCharStats.relation);
            // finalHtml += renderSection(translationMap.interactions, { '选项': latestCharStats.interactions }); // Removed as requested
            finalHtml += renderSection(translationMap.traits, { '特性': latestCharStats.traits });
        }

        let statusTitle = character.name;
        if (character.isPlayer) {
            statusTitle += ' (玩家)';
        } else if (character.isTeammate) {
            statusTitle += ' (队友 - 可操作装备)';
        } else {
            statusTitle += ' (NPC - 可操作装备)'; // 所有NPC都可以操作装备
        }

        userStatusBody.innerHTML = `
            <div class="character-status-wrapper">
                <details class="details-character-status" open>
                    <summary>${statusTitle}</summary>
                    <div>${finalHtml || '<div style="padding: 10px; text-align: center;">暂无数据</div>'}</div>
                </details>
            </div>
        `;
    }

    static renderCharacterSelector() {
        const selectorBody = document.getElementById('character-selector-body');
        const selectorTitle = document.getElementById('character-selector-title');
        if (!selectorBody) return;

        if (selectorTitle) {
            selectorTitle.textContent = `角色选择 (${gameState.selectedCharacterName})`;
        }
        
        selectorBody.innerHTML = '';
        const chars = CharacterManager.getCharacterList();

        chars.forEach(char => {
            const icon = document.createElement('div');
            icon.className = 'char-selector-icon';
            if (char.name === gameState.selectedCharacterName) {
                icon.classList.add('selected');
            }
            
            if (char.isPlayer) {
                icon.style.borderColor = '#4caf50';
                icon.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            } else if (char.isTeammate) {
                icon.style.borderColor = '#2196f3';
                icon.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
            } else {
                icon.style.borderColor = '#9e9e9e';
                icon.style.backgroundColor = 'rgba(158, 158, 158, 0.1)';
                icon.style.opacity = '0.7';
            }
            
            icon.textContent = char.name.charAt(0);
            icon.onclick = () => CharacterManager.selectCharacter(char.name);

            const nameLabel = document.createElement('span');
            nameLabel.className = 'char-name';
            let nameText = char.name;
            if (char.isPlayer) {
                nameText += ' (玩家)';
            } else if (char.isTeammate) {
                nameText += ' (队友)';
            } else {
                nameText += ' (NPC)';
            }
            nameLabel.textContent = nameText;
            icon.appendChild(nameLabel);

            selectorBody.appendChild(icon);
        });
    }

    static updateCalendar() {
        // 从本地副本获取日历数据
        const calendarData = gameState.localCopy.calendar || {};
        const year = calendarData.当前年份 || new Date().getFullYear();
        const month = calendarData.当前月份 || new Date().getMonth() + 1;
        const currentDay = calendarData.当前日期 || new Date().getDate();
        const events = calendarData.事件记录 || {};
        const progress = calendarData.攻略层数 !== undefined ? calendarData.攻略层数 : 'N/A';

        const progressDiv = document.getElementById('game-progress');
        if (progressDiv) {
            progressDiv.textContent = `当前攻略层数: ${progress}`;
        }

        const calendarGrid = document.querySelector('.calendar-grid');
        const calendarTitle = document.querySelector('.calendar-title');
        const calendarInfo = document.querySelector('.calendar-info');
        const summary = document.querySelector('.details-calendar-button > summary');

        if (!calendarGrid || !calendarTitle || !calendarInfo || !summary) return;

        summary.innerHTML = `${year}年 ${month}月 日历`;
        calendarTitle.textContent = `${month}月`;
        calendarInfo.textContent = `年份 ${year}`;

        calendarGrid.querySelectorAll('.day, .empty').forEach(cell => cell.remove());

        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day empty';
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            if (day === currentDay) {
                dayElement.classList.add('current-day');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);

            const dateString = `${year}.${month}.${day}`;
            if (events[dateString]) {
                const dayContent = document.createElement('div');
                dayContent.className = 'day-content';
                const eventText = events[dateString].描述 || events[dateString].description || '事件';
                const textElement = document.createElement('div');
                textElement.className = 'normal-text';
                textElement.textContent = eventText;
                dayContent.appendChild(textElement);
                dayElement.appendChild(dayContent);
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    static highlightMarkdown(text) {
        if (!text) return '';
        text = text.replace(/"([^"]*?)"/g, (match, group1) => `<span class="highlight-double-quote">"${group1}"</span>`);
        text = text.replace(/“([^”]*?)”/g, (match, group1) => `<span class="highlight-double-quote">“${group1}"</span>`);

        text = text.replace(/'([^']*?)'/g, (match, group1) => `<span class="highlight-quote">'${group1}'</span>`);
        text = text.replace(/‘([^’]*?)’/g, (match, group1) => `<span class="highlight-quote">'${group1}'</span>`);

        text = text.replace(/（([^（）]*)）/g, (match, group1) => `<span class="highlight-parentheses">（${group1}）</span>`);
        text = text.replace(/\(([^()]*)\)/g, (match, group1) => `<span class="highlight-parentheses">(${group1})</span>`);
        text = text.replace(/\[([^\[\]]*)\]/g, (match, group1) => `<span class="highlight-brackets">[${group1}]</span>`);
        text = text.replace(/《([^《》]*)》/g, (match, group1) => `<span class="highlight-book-title">《${group1}》</span>`);
        return text;
    }

    static updateStoryContent() {
        const el = document.getElementById('story-content');
        if (!el) return;
        if (!el.dataset.raw) {
            el.dataset.raw = el.textContent;
        }
        const processed = this.highlightMarkdown(el.dataset.raw);
        if (el.innerHTML !== processed) {
            el.innerHTML = processed;
        }

    }

    static renderShop() {
        shopManager.render();
    }

    static updateUI() {
        // 基于本地副本的数据哈希来决定是否更新UI，提供更快的比较
        const currentHash = DataManager.hashData(gameState.localCopy);
        if (currentHash !== gameState.lastDataHash) {
            this.renderCharacterSelector();
            this.renderEquipment();
            this.renderSkills();
            this.renderUserStatus();
            this.updateCalendar();
            this.renderShop();
            gameState.lastDataHash = currentHash;
        }
        this.updateStoryContent();
    }

    static forceUpdateUI() {
        // 强制更新UI，无论哈希是否改变 - 在本地副本更新后使用
        this.renderCharacterSelector();
        this.renderEquipment();
        this.renderSkills();
        this.renderUserStatus();
        this.updateCalendar();
        this.renderShop();
        this.updateStoryContent();
        // 注释掉此行以防止状态回弹。哈希值现在只在从服务器成功加载数据后在 updateUI 中更新。
        // gameState.lastDataHash = DataManager.hashData(gameState.localCopy);
    }
}
