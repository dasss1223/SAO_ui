// SillyTavern Extension Entry Point

(async function () {
    // Wait for SillyTavern's API to be available
    await new Promise(resolve => {
        if (window.SillyTavern) {
            return resolve();
        }
        const observer = new MutationObserver(() => {
            if (window.SillyTavern) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });

    const extensionName = "SAO_Dashboard";
    const extensionFolderPath = `/extensions/${extensionName}/`;
    const triggerRegex = /\$1/g;

    async function initDashboard(targetElement) {
        try {
            // Fetch the HTML template for the dashboard
            const response = await fetch(`${extensionFolderPath}index.html`);
            if (!response.ok) {
                console.error("Failed to fetch dashboard template.");
                return;
            }
            const templateHtml = await response.text();

            // Replace the trigger text with the dashboard HTML
            targetElement.innerHTML = targetElement.innerHTML.replace(triggerRegex, templateHtml);

            // Now that the HTML is in the DOM, initialize all the managers and UI components
            console.log('SAO Dashboard: Initializing...');
            DataManager.loadData();
            shopManager.initialize();

            // Modal setup
            const modalCloseButton = document.getElementById('modal-close');
            const modalOverlay = document.getElementById('equipment-modal');
            if(modalCloseButton) modalCloseButton.onclick = ModalManager.closeEquipmentModal;
            if(modalOverlay) {
                window.onclick = (event) => {
                    if (event.target == modalOverlay) {
                        ModalManager.closeEquipmentModal();
                    }
                };
            }
            
            console.log('SAO Dashboard: Initialized successfully.');

        } catch (error) {
            console.error("SAO Dashboard: Failed to initialize.", error);
        }
    }

    // Listen for new messages being rendered
    SillyTavern.getContext().eventSource.on(SillyTavern.getContext().event_types.CHARACTER_MESSAGE_RENDERED, (messageId) => {
        const messageElement = document.querySelector(`.mes[mesid="${messageId}"] .mes_text`);
        if (messageElement && triggerRegex.test(messageElement.innerHTML)) {
            console.log(`SAO Dashboard: Trigger found in message ${messageId}.`);
            initDashboard(messageElement);
        }
    });

    console.log("SAO Dashboard Extension loaded and listening for triggers.");

})();

// ==================== GLOBAL EXPORTS ====================
// These are still needed for the inline onclick attributes in the HTML
window.UIManager = UIManager;
window.CharacterManager = CharacterManager;
window.equipmentManager = equipmentManager;
window.skillManager = skillManager;
window.ModalManager = ModalManager;
window.DataManager = DataManager;
