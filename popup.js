// Popup logic
document.addEventListener('DOMContentLoaded', function () {
  // Get all sections and the main toggle
  const sections = document.querySelectorAll('.section');
  const mainToggle = document.getElementById('mainToggle');
  const allToggles = document.querySelectorAll('input[type="checkbox"]');
  const featureToggles = Array.from(allToggles).filter(
    (toggle) => toggle !== mainToggle
  );
  const themeToggle = document.getElementById('themeToggle');
  const timerSelect = document.getElementById('timerDuration');
  const timerAction = document.getElementById('timerAction');
  let timerInterval;

  // Theme handling
  function setTheme(isDark) {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
    chrome.storage.sync.set({ isDarkTheme: isDark });
  }

  // Load theme preference
  chrome.storage.sync.get('isDarkTheme', function (result) {
    const isDark = result.isDarkTheme ?? false;
    setTheme(isDark);
  });

  // Theme toggle click handler
  themeToggle.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme !== 'dark');
  });

  // Timer handling
  function startTimer(minutes, action) {
    clearInterval(timerInterval);
    if (minutes === 0) return;

    const endTime = Date.now() + minutes * 60 * 1000;

    timerInterval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      if (remaining === 0) {
        clearInterval(timerInterval);
        mainToggle.checked = action === 'enable';
        mainToggle.dispatchEvent(new Event('change'));
        timerSelect.value = '0';
      }
    }, 1000);

    chrome.storage.sync.set({
      timerEndTime: endTime,
      timerDuration: minutes,
      timerAction: action,
    });
  }

  // Load timer state
  chrome.storage.sync.get(
    ['timerEndTime', 'timerDuration', 'timerAction'],
    function (result) {
      if (result.timerEndTime) {
        const remaining = Math.max(0, result.timerEndTime - Date.now());
        if (remaining > 0) {
          timerSelect.value = result.timerDuration.toString();
          timerAction.value = result.timerAction || 'disable';
          startTimer(Math.ceil(remaining / 60000), result.timerAction);
        } else {
          timerSelect.value = '0';
        }
      }
    }
  );

  // Timer selection handler
  function handleTimerChange() {
    let duration = parseInt(timerSelect.value);
    const action = timerAction.value;

    if (timerSelect.value === 'custom') {
      const customMinutes = prompt('Enter number of minutes:');
      if (customMinutes === null) {
        timerSelect.value = '0';
        return;
      }
      duration = parseInt(customMinutes);
      if (isNaN(duration) || duration < 1) {
        timerSelect.value = '0';
        return;
      }
      // Add custom duration as an option
      const option = new Option(duration + ' minutes', duration);
      timerSelect.add(option, 1);
      timerSelect.value = duration.toString();
    }
    startTimer(duration, action);
  }

  timerSelect.addEventListener('change', handleTimerChange);
  timerAction.addEventListener('change', handleTimerChange);

  // Load saved states
  chrome.storage.sync.get(['mainEnabled', 'toggleStates'], function (result) {
    // Set main toggle state
    mainToggle.checked = result.mainEnabled ?? false;

    // Set individual toggle states
    if (result.toggleStates) {
      featureToggles.forEach((toggle) => {
        toggle.checked = result.toggleStates[toggle.id] ?? false;
        // If main is disabled, disable the toggle
        toggle.disabled = !mainToggle.checked;
      });
    }
  });

  // Handle section collapsing
  sections.forEach((section) => {
    const header = section.querySelector('.section-header');
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });
  });

  // Save toggle states
  function saveStates() {
    const toggleStates = {};
    featureToggles.forEach((toggle) => {
      toggleStates[toggle.id] = toggle.checked;
    });

    chrome.storage.sync.set({
      mainEnabled: mainToggle.checked,
      toggleStates: toggleStates,
    });
  }

  // Handle main toggle
  mainToggle.addEventListener('change', function () {
    const isEnabled = this.checked;

    // Enable/disable all toggles based on main switch
    featureToggles.forEach((toggle) => {
      toggle.disabled = !isEnabled;
    });

    saveStates();
  });

  // Handle individual toggles
  featureToggles.forEach((toggle) => {
    toggle.addEventListener('change', saveStates);
  });
});
