// RingFuel Dashboard V2 - Asymmetric Layout
// Same logic as main.js but adapted for V2 DOM structure

document.addEventListener('DOMContentLoaded', function() {
    const reactorToggle = document.getElementById('reactorToggle');
    const modeLabel = document.getElementById('modeLabel');
    const modeTarget = document.getElementById('modeTarget');
    const callModal = document.getElementById('callModal');
    const acceptBtn = document.getElementById('acceptCall');

    function updateTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: true
            });
        }
    }
    updateTime();
    setInterval(updateTime, 1000);

    function updateModeUI() {
        const isDark = document.body.classList.contains('dark-mode');
        if (modeLabel) modeLabel.textContent = isDark ? 'Fueled' : 'Standby';
        if (modeTarget) modeTarget.textContent = isDark ? 'standby' : 'fueled';
    }

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

    if (reactorToggle) {
        reactorToggle.addEventListener('click', function() {
            document.body.classList.add('transitioning');
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            const goingOnline = document.body.classList.contains('dark-mode');
            updateModeUI();
            updateStatusIndicator(goingOnline);
            setTimeout(() => document.body.classList.remove('transitioning'), 800);
        });
    }
    updateModeUI();

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => callModal && callModal.classList.remove('active'));
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'c' || e.key === 'C') {
            if (callModal && !callModal.classList.contains('active')) callModal.classList.add('active');
        }
        if (e.key === 'd' || e.key === 'D') {
            if (reactorToggle) reactorToggle.click();
        }
        if (e.key === 'Escape') {
            if (callModal) callModal.classList.remove('active');
            const settingsPage = document.getElementById('settingsPage');
            if (settingsPage && settingsPage.style.display !== 'none') {
                settingsPage.style.display = 'none';
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
        });
    }

    if (backToDashboard && settingsPage) {
        backToDashboard.addEventListener('click', () => settingsPage.style.display = 'none');
    }

    // Settings tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.settings-tab-panel').forEach(p => p.style.display = 'none');
            const panel = document.getElementById(`panel-${this.dataset.tab}`);
            if (panel) panel.style.display = '';
        });
    });

    // Source toggle sync
    const sourceToggles = document.querySelectorAll('.source-grid .toggle-switch input');
    const sourceCards = document.querySelectorAll('.source-grid .source-card');
    const settingsToggles = document.querySelectorAll('.source-row .toggle-switch input');

    function syncSourceState(index, isOn) {
        if (sourceCards[index]) sourceCards[index].classList.toggle('online', isOn);
        if (sourceToggles[index]) sourceToggles[index].checked = isOn;
        if (settingsToggles[index]) settingsToggles[index].checked = isOn;
        const dots = document.querySelectorAll('.source-row-dot');
        if (dots[index]) dots[index].classList.toggle('online', isOn);
    }

    sourceToggles.forEach((t, i) => t.addEventListener('change', () => syncSourceState(i, t.checked)));
    settingsToggles.forEach((t, i) => t.addEventListener('change', () => syncSourceState(i, t.checked)));

    // State License Grid
    const stateGrid = document.getElementById('stateGrid');
    const stateSearch = document.getElementById('stateSearch');
    const stateCount = document.getElementById('stateCount');

    const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    let selectedStates = new Set(['CA','TX','FL','NY','IL']);

    function renderStates(filter = '') {
        if (!stateGrid) return;
        stateGrid.innerHTML = '';
        states.filter(s => s.toLowerCase().includes(filter.toLowerCase())).forEach(state => {
            const chip = document.createElement('div');
            chip.className = `state-chip${selectedStates.has(state) ? ' selected' : ''}`;
            chip.textContent = state;
            chip.addEventListener('click', () => {
                selectedStates.has(state) ? selectedStates.delete(state) : selectedStates.add(state);
                chip.classList.toggle('selected');
                if (stateCount) stateCount.textContent = selectedStates.size;
            });
            stateGrid.appendChild(chip);
        });
        if (stateCount) stateCount.textContent = selectedStates.size;
    }
    renderStates();

    if (stateSearch) stateSearch.addEventListener('input', e => renderStates(e.target.value));

    const selectAllBtn = document.getElementById('selectAllStates');
    const clearBtn = document.getElementById('clearStates');
    if (selectAllBtn) selectAllBtn.addEventListener('click', () => { selectedStates = new Set(states); renderStates(stateSearch ? stateSearch.value : ''); });
    if (clearBtn) clearBtn.addEventListener('click', () => { selectedStates.clear(); renderStates(stateSearch ? stateSearch.value : ''); });

    // Billing presets
    const payButton = document.querySelector('.billing-pay-button');
    document.querySelectorAll('.billing-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            document.querySelectorAll('.billing-preset').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            if (payButton) payButton.textContent = `Pay ${this.textContent}`;
        });
    });
});
