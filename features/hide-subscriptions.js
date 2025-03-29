// Create a namespace for subscriptions feature
window.TracTube = window.TracTube || {};
window.TracTube.HideSubscriptions = {};

// Handles showing/hiding the subscriptions tab based on feature state
window.TracTube.HideSubscriptions.handleSubscriptions = function (
  featureStates
) {
  // Only proceed if feature is enabled
  if (!featureStates.mainEnabled || !featureStates.hideSubscriptions) {
    this.restoreSubscriptions();
    return;
  }

  // Get subscriptions tab element
  const subsTab = document.querySelector(
    '#guide #items ytd-guide-entry-renderer:has([title="Subscriptions"])'
  );

  if (!subsTab) {
    // If not found, try again after short delay
    // setTimeout(() => {
    //   this.handleSubscriptions(featureStates);
    // }, 200);
    return;
  }

  // Hide the subscriptions tab
  subsTab.style.display = 'none';

  // Navigate to home if currently on subscriptions page
  if (window.location.pathname.startsWith('/feed/subscriptions')) {
    window.location.href = '/';
  }
};

// Restores the subscriptions tab visibility
window.TracTube.HideSubscriptions.restoreSubscriptions = function () {
  const subsTab = document.querySelector(
    '#guide #items ytd-guide-entry-renderer:has([title="Subscriptions"])'
  );
  if (subsTab) {
    subsTab.style.display = '';
  }
};
