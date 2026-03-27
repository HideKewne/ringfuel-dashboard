// RingFuel Dashboard - Futuristic Reactor Core Toggle

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const reactorToggle = document.getElementById('reactorToggle');
    const modeLabel = document.getElementById('modeLabel');
    const modeTarget = document.getElementById('modeTarget');
    const callModal = document.getElementById('callModal');
    const acceptBtn = document.getElementById('acceptCall');

    // Update time display
    function updateTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // Update mode indicator text
    const reactorModeLabel = document.getElementById('reactorModeLabel');

    function updateModeUI() {
        const isDark = document.body.classList.contains('dark-mode');
        if (modeLabel) modeLabel.textContent = isDark ? 'Fueled' : 'Standby';
        if (modeTarget) modeTarget.textContent = isDark ? 'standby' : 'fueled';
        if (reactorModeLabel) reactorModeLabel.textContent = isDark ? 'ON / FUELED' : 'OFF / STANDBY';
    }

    // Update status indicator with delay for smooth transition
    function updateStatusIndicator(goingOnline) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');

        setTimeout(() => {
            if (goingOnline) {
                if (statusIndicator) statusIndicator.classList.add('online');
                if (statusText) statusText.textContent = 'ONLINE';
            } else {
                if (statusIndicator) statusIndicator.classList.remove('online');
                if (statusText) statusText.textContent = 'OFFLINE';
            }
        }, 300);
    }

    // Reactor Toggle - Light/Dark Mode Switch
    if (reactorToggle) {
        reactorToggle.addEventListener('click', function() {
            document.body.classList.add('transitioning');
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');

            const goingOnline = document.body.classList.contains('dark-mode');
            updateModeUI();
            updateStatusIndicator(goingOnline);

            setTimeout(() => {
                document.body.classList.remove('transitioning');
            }, 800);

            const mode = document.body.classList.contains('dark-mode') ? 'Fueled' : 'Standby';
            console.log(`Switched to ${mode} Mode`);
        });
    }

    updateModeUI();

    // Call Modal handlers
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            if (callModal) callModal.classList.remove('active');
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'c' || e.key === 'C') {
            if (callModal && !callModal.classList.contains('active')) {
                callModal.classList.add('active');
            }
        }
        if (e.key === 'd' || e.key === 'D') {
            if (reactorToggle) reactorToggle.click();
        }
        if (e.key === 'Escape') {
            if (callModal) callModal.classList.remove('active');
            // Close settings if open
            const settingsPage = document.getElementById('settingsPage');
            if (settingsPage && settingsPage.style.display !== 'none') {
                settingsPage.style.display = 'none';
                document.querySelector('.reactor-center').style.display = '';
                document.querySelector('.floating-stats').style.display = '';
            }
        }
    });

    // Settings navigation
    const settingsNavLink = document.getElementById('settingsNavLink');
    const settingsPage = document.getElementById('settingsPage');
    const backToDashboard = document.getElementById('backToDashboard');

    if (settingsNavLink && settingsPage) {
        settingsNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            settingsPage.style.display = '';
            document.querySelector('.reactor-center').style.display = 'none';
            document.querySelector('.floating-stats').style.display = 'none';
        });
    }

    if (backToDashboard && settingsPage) {
        backToDashboard.addEventListener('click', function() {
            settingsPage.style.display = 'none';
            document.querySelector('.reactor-center').style.display = '';
            document.querySelector('.floating-stats').style.display = '';
        });
    }

    // Settings tabs
    const settingsTabs = document.querySelectorAll('.settings-tab');
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.settings-tab-panel').forEach(panel => {
                panel.style.display = 'none';
            });
            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) targetPanel.style.display = '';
        });
    });

    // Source toggle sync between dashboard cards and settings
    const dashboardToggles = document.querySelectorAll('.floating-stats .toggle-switch input');
    const settingsToggles = document.querySelectorAll('.source-row .toggle-switch input');
    const sourceCards = document.querySelectorAll('.source-card');

    function syncSourceState(index, isOn) {
        if (sourceCards[index]) {
            sourceCards[index].classList.toggle('online', isOn);
        }
        if (dashboardToggles[index]) dashboardToggles[index].checked = isOn;
        if (settingsToggles[index]) settingsToggles[index].checked = isOn;

        // Sync settings dot
        const settingsDots = document.querySelectorAll('.source-row-dot');
        if (settingsDots[index]) {
            settingsDots[index].classList.toggle('online', isOn);
        }
    }

    dashboardToggles.forEach((toggle, i) => {
        toggle.addEventListener('change', () => syncSourceState(i, toggle.checked));
    });

    settingsToggles.forEach((toggle, i) => {
        toggle.addEventListener('change', () => syncSourceState(i, toggle.checked));
    });

    // State License Grid
    const stateGrid = document.getElementById('stateGrid');
    const stateSearch = document.getElementById('stateSearch');
    const stateCount = document.getElementById('stateCount');
    const selectAllBtn = document.getElementById('selectAllStates');
    const clearBtn = document.getElementById('clearStates');

    const states = [
        'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
        'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
        'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
        'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
        'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
    ];

    const defaultSelected = ['CA', 'TX', 'FL', 'NY', 'IL'];
    let selectedStates = new Set(defaultSelected);

    function renderStates(filter = '') {
        if (!stateGrid) return;
        stateGrid.innerHTML = '';
        states.filter(s => s.toLowerCase().includes(filter.toLowerCase())).forEach(state => {
            const chip = document.createElement('div');
            chip.className = `state-chip${selectedStates.has(state) ? ' selected' : ''}`;
            chip.textContent = state;
            chip.addEventListener('click', () => {
                if (selectedStates.has(state)) {
                    selectedStates.delete(state);
                } else {
                    selectedStates.add(state);
                }
                chip.classList.toggle('selected');
                if (stateCount) stateCount.textContent = selectedStates.size;
            });
            stateGrid.appendChild(chip);
        });
        if (stateCount) stateCount.textContent = selectedStates.size;
    }

    renderStates();

    if (stateSearch) {
        stateSearch.addEventListener('input', (e) => renderStates(e.target.value));
    }

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            selectedStates = new Set(states);
            renderStates(stateSearch ? stateSearch.value : '');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            selectedStates.clear();
            renderStates(stateSearch ? stateSearch.value : '');
        });
    }

    // Billing presets
    const billingPresets = document.querySelectorAll('.billing-preset');
    const payButton = document.querySelector('.billing-pay-button');

    billingPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            billingPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            if (payButton) {
                payButton.textContent = `Pay ${this.textContent}`;
            }
        });
    });
});
