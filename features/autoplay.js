// Create namespace for autoplay feature
window.TracTube = window.TracTube || {};
window.TracTube.Autoplay = {};

window.TracTube.Autoplay.handleAutoplay = function (featureStates) {
  // If main or feature is disabled return early
  if (!featureStates.mainEnabled && !featureStates.disableAutoplay) {
    return;
  }
  // Only proceed if we're on a video page
  if (!window.location.pathname.startsWith('/watch')) return;
  // Get the autoplay button container
  const autoplayButton = document.querySelector(
    'button[data-tooltip-target-id="ytp-autonav-toggle-button"]'
  );
  if (!autoplayButton) return;

  if (!featureStates.disableAutoplay) {
    // If feature is disabled, restore autoplay
    window.TracTube.Autoplay.restoreAutoplay();
    return;
  }

  // Store original state if not already stored
  // if (!window.TracTube.Autoplay.originalAutoplayState) {
  window.TracTube.Autoplay.originalAutoplayState =
    autoplayButton
      .querySelector('.ytp-autonav-toggle-button')
      .getAttribute('aria-checked') === 'true';
  // }

  // Disable autoplay if enabled
  if (window.TracTube.Autoplay.originalAutoplayState) {
    autoplayButton.click();
  }
};

window.TracTube.Autoplay.restoreAutoplay = function () {
  // Only proceed if we're on a video page
  if (!window.location.pathname.startsWith('/watch')) return;

  const autoplayButton = document.querySelector(
    'button[data-tooltip-target-id="ytp-autonav-toggle-button"]'
  );
  if (!autoplayButton) return;

  const toggleButton = autoplayButton.querySelector(
    '.ytp-autonav-toggle-button'
  );
  if (!toggleButton) return;

  // Only restore if we have a stored state and current state doesn't match
  if (window.TracTube.Autoplay.originalAutoplayState) {
    const currentState = toggleButton.getAttribute('aria-checked') === 'true';
    if (currentState !== window.TracTube.Autoplay.originalAutoplayState) {
      autoplayButton.click();
    }
    window.TracTube.Autoplay.originalAutoplayState = null;
  }
};
