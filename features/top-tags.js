// Create a namespace for top tags feature
window.TracTube = window.TracTube || {};
window.TracTube.TopTags = {};

// Top Tags Handler
window.TracTube.TopTags.handleTopTags = function (featureStates) {
  // Only hide tags on homepage
  if (window.location.pathname !== '/') return;

  // Target the chips container
  const chipsContainer = document.querySelector(
    'ytd-feed-filter-chip-bar-renderer'
  );
  if (!chipsContainer) return;

  if (!featureStates.hideTopTags) {
    // Restore chips container visibility
    window.TracTube.TopTags.restoreTopTags();
    return;
  }

  // Hide the chips container
  chipsContainer.style.display = 'none';
};

// Helper function to restore top tags visibility
window.TracTube.TopTags.restoreTopTags = function () {
  // Restore chips container visibility
  const chipsContainer = document.querySelector(
    'ytd-feed-filter-chip-bar-renderer'
  );
  if (chipsContainer) chipsContainer.style.display = '';
};
