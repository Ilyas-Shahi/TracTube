// Popup logic
document.addEventListener('DOMContentLoaded', function () {
  // Get all sections and the main toggle
  const sections = document.querySelectorAll('.section');
  const mainToggle = document.getElementById('mainToggle');

  // Filter out mainToggle from all checkboxes to get feature-specific toggles
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

  // Load theme preference with default to dark theme using nullish coalescing
  chrome.storage.sync.get('isDarkTheme', function (result) {
    const isDark = result.isDarkTheme ?? true;
    setTheme(isDark);
  });

  // Theme toggle click handler
  themeToggle.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme !== 'dark');
  });

  // Timer handling: Manages countdown and state persistence
  /**
   * Starts a countdown timer with the specified duration and action.
   * @param {number} minutes - The duration of the timer in minutes.
   * @param {string} action - The action to perform when the timer ends ('enable' or 'disable').
   */
  function startTimer(minutes, action) {
    clearInterval(timerInterval);
    if (minutes === 0) return;
    if (typeof minutes !== 'number' || minutes < 0) {
      throw new Error('Invalid timer duration');
    }

    // Calculate absolute end time to maintain accuracy across popup reopens
    const endTime = Date.now() + minutes * 60 * 1000;

    timerInterval = setInterval(() => {
      // Ensure remaining time never goes negative
      const remaining = Math.max(0, endTime - Date.now());
      if (remaining === 0) {
        clearInterval(timerInterval);
        // Apply the scheduled action (enable/disable) to main toggle
        mainToggle.checked = action === 'enable';
        // Trigger change event to update UI and save state
        mainToggle.dispatchEvent(new Event('change'));
        timerSelect.value = '0';
      }
    }, 1000);

    // Persist timer state for restoration on popup reopen
    chrome.storage.sync.set({
      timerEndTime: endTime,
      timerDuration: minutes,
      timerAction: action,
    });
  }

  // Restore timer state on popup open
  chrome.storage.sync.get(
    ['timerEndTime', 'timerDuration', 'timerAction'],
    function (result) {
      if (result.timerEndTime) {
        // Calculate remaining time based on saved end time
        const remaining = Math.max(0, result.timerEndTime - Date.now());
        if (remaining > 0) {
          // Restore UI state and restart timer with remaining time
          timerSelect.value = result.timerDuration.toString();
          timerAction.value = result.timerAction || 'disable';
          startTimer(Math.ceil(remaining / 60000), result.timerAction);
        } else {
          timerSelect.value = '0';
        }
      }
    }
  );

  // Handles timer duration changes and custom input
  /**
   * Handles changes to the timer duration and action.
   * Validates the duration and starts the timer.
   */
  function handleTimerChange() {
    const action = timerAction.value;

    // Handle custom timer input
    if (timerSelect.value === 'custom') {
      const customMinutes = prompt('Enter number of minutes:');

      // Handle cancel button
      if (customMinutes === null) {
        timerSelect.value = '0';
        return;
      }

      // Trim whitespace and handle empty input
      const trimmedInput = customMinutes.trim();
      if (trimmedInput === '') {
        alert('Please enter a valid number of minutes.');
        timerSelect.value = '0';
        return;
      }

      // Try to parse as a float first to handle decimal inputs
      const parsedDuration = parseFloat(trimmedInput);

      // Validate the input is a positive number
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        alert('Please enter a positive number of minutes.');
        timerSelect.value = '0';
        return;
      }

      // Round to nearest integer for simplicity
      const duration = Math.round(parsedDuration);

      // Dynamically add custom duration as a new option in the dropdown
      const option = new Option(duration + ' minutes', duration);
      timerSelect.add(option, 1);
      timerSelect.value = duration.toString();

      // Start the timer with the custom duration
      startTimer(duration, action);
      return;
    }

    // For non-custom options, parse the selected value
    const duration = parseInt(timerSelect.value);

    // Validate duration for non-custom options
    if (isNaN(duration) || duration < 0) {
      alert('Please enter a valid duration.');
      timerSelect.value = '0';
      return;
    }

    // Start the timer with the selected duration
    startTimer(duration, action);
  }

  timerSelect.addEventListener('change', handleTimerChange);
  timerAction.addEventListener('change', handleTimerChange);

  // Load and restore all toggle states with defaults
  chrome.storage.sync.get(['mainEnabled', 'toggleStates'], function (result) {
    // Set main toggle state with default to false using nullish coalescing
    mainToggle.checked = result.mainEnabled ?? false;

    // Restore individual toggle states if they exist
    if (result.toggleStates) {
      featureToggles.forEach((toggle) => {
        // Set each toggle state with default to false
        toggle.checked = result.toggleStates[toggle.id] ?? false;
        // Disable toggle if main toggle is off
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

  // Persist toggle states to chrome.storage and send to content script
  function saveStates() {
    // Create object mapping toggle IDs to their checked state
    const toggleStates = {};
    featureToggles.forEach((toggle) => {
      toggleStates[toggle.id] = toggle.checked;
    });

    const states = {
      mainEnabled: mainToggle.checked,
      ...toggleStates,
    };

    // Save to storage
    chrome.storage.sync.set({
      mainEnabled: states.mainEnabled,
      toggleStates: toggleStates,
    });

    // Send to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.url?.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'toggleStates',
          states: states,
        });
      }
    });
  }

  // Main toggle handler: enables/disables all feature toggles
  mainToggle.addEventListener('change', function () {
    const isEnabled = this.checked;

    // Update disabled state of all feature toggles
    featureToggles.forEach((toggle) => {
      toggle.disabled = !isEnabled;
    });

    saveStates();
  });

  // Add change listeners to all feature toggles for state persistence
  featureToggles.forEach((toggle) => {
    toggle.addEventListener('change', saveStates);
  });
});
