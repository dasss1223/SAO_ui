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

    // Function to load scripts dynamically and in order
    async function loadScripts() {
        const scripts = [
            'js/state.js',
            'js/equipment.js',
            'js/skill.js',
            'js/shop.js',
            'js/managers.js',
            'js/ui.js'
        ];

        for (const script of scripts) {
            try {
                await new Promise((resolve, reject) => {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = `${extensionFolderPath}${script}`;
                    scriptElement.onload = resolve;
                    scriptElement.onerror = reject;
                    document.head.appendChild(scriptElement);
                });
            } catch (error) {
                console.error(`SAO Dashboard: Failed to load script ${script}`, error);
                return false; // Stop if any script fails
            }
        }
        return true; // All scripts loaded successfully
    }

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
            console.log('SAO Dashboard: Initializing components...');
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
    SillyTavern.getContext().eventSource.on(SillyTavern.getContext().event_types.CHARACTER_MESSAGE_RENDERED, async (messageId) => {
        const messageElement = document.querySelector(`.mes[mesid="${messageId}"] .mes_text`);
        if (messageElement && triggerRegex.test(messageElement.innerHTML)) {
            console.log(`SAO Dashboard: Trigger found in message ${messageId}.`);
            
            // Load all scripts first, then initialize the dashboard
            const scriptsLoaded = await loadScripts();
            if (scriptsLoaded) {
                initDashboard(messageElement);
            } else {
                console.error("SAO Dashboard: Halting initialization due to script loading errors.");
            }
        }
    });

    console.log("SAO Dashboard Extension loaded and listening for triggers.");

})();
