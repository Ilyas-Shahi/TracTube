// Create a namespace for search results feature
window.TracTube = window.TracTube || {};
window.TracTube.SearchResults = {};

// Search result selectors
window.TracTube.SearchResults.selectors = [
  // Irrelevant search results sections
  'ytd-shelf-renderer div#dismissible',
  'ytd-promoted-video-renderer',
];

// Handle search results visibility
window.TracTube.SearchResults.handleSearchResults = function (featureStates) {
  if (
    !featureStates.mainEnabled ||
    !featureStates.hideIrrelevantSearch ||
    !window.location.pathname.startsWith('/results')
  ) {
    this.restoreSearchResults();
    return;
  }

  this.selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.display = 'none';
    });
  });
};

// Restore search results visibility
window.TracTube.SearchResults.restoreSearchResults = function () {
  this.selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.display = '';
    });
  });
};
