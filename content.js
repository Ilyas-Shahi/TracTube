// This script runs on your target website
document.addEventListener('DOMContentLoaded', function () {
  // Your website modification code here
});

// Store feature states
let featureStates = {};

// Expose featureStates globally for event listeners
window.featureStates = featureStates;

// Load saved feature states from storage
function loadSavedStates() {
  chrome.storage.sync.get(['mainEnabled', 'toggleStates'], function (result) {
    // Set main toggle state with default to false using nullish coalescing
    const mainEnabled = result.mainEnabled ?? false;

    // Create states object
    featureStates = {
      mainEnabled: mainEnabled,
    };

    // Add individual toggle states if they exist
    if (result.toggleStates) {
      Object.keys(result.toggleStates).forEach((key) => {
        featureStates[key] = result.toggleStates[key] ?? false;
      });
    }

    // Update global reference
    window.featureStates = featureStates;

    // Apply features with loaded states
    applyFeatures();
  });
}

// Message listener for feature toggle updates from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggleStates') {
    featureStates = message.states;
    // Update global reference
    window.featureStates = featureStates;
    applyFeatures();
  }
});

// Main function to apply all features based on their states
function applyFeatures() {
  // Only apply features if main toggle is enabled
  if (!featureStates.mainEnabled) {
    removeAllFeatures();
    return;
  }

  // Feed Controls
  window.TracTube.HomeFeed.handleHomeFeed(featureStates);
  window.TracTube.TopTags.handleTopTags(featureStates);
  // Thumbnails Control
  window.TracTube.Thumbnails.handleThumbnails(featureStates);
  // Shorts Controls
  window.TracTube.Shorts.handleShorts(featureStates);
  // Video Controls
  window.TracTube.Sidebar.handleSidebar(featureStates);
  // Center Video Controls
  window.TracTube.CenterVideo.handleCenterVideo(featureStates);
  // Comment Controls
  window.TracTube.HideComments.handleComments(featureStates);
}

// Function to remove all feature effects
function removeAllFeatures() {
  // Remove any custom styles
  const style = document.getElementById('tractube-styles');
  if (style) style.remove();

  // Call restore functions from each feature module
  window.TracTube.HomeFeed.restoreHomeFeed();
  window.TracTube.TopTags.restoreTopTags();
  window.TracTube.Thumbnails.restoreThumbnails();
  window.TracTube.Shorts.restoreShortsVisibility();
  window.TracTube.Sidebar.restoreSidebar();
  window.TracTube.CenterVideo.restoreCenterVideo();
  window.TracTube.HideComments.restoreComments();
}

// Track current URL to detect navigation
let currentUrl = window.location.href;

// Initial setup
function initialize() {
  // Load saved states first
  loadSavedStates();

  // Set up event listeners for center video feature
  window.TracTube.CenterVideo.setupCenterVideoEventListeners();

  // Add mutation observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    // Only reapply features if relevant DOM changes occur
    const shouldReapply = mutations.some((mutation) => {
      return Array.from(mutation.addedNodes).some((node) => {
        return (
          node.nodeType === 1 &&
          (node.tagName === 'YTD-RICH-GRID-RENDERER' ||
            node.tagName === 'YTD-FEED-FILTER-CHIP-BAR-RENDERER' ||
            node.tagName === 'YTD-THUMBNAIL' ||
            node.tagName === 'YTD-RICH-ITEM-RENDERER' ||
            node.tagName === 'YTD-VIDEO-RENDERER' ||
            node.tagName === 'YTD-COMPACT-VIDEO-RENDERER' ||
            node.tagName === 'YTD-GRID-VIDEO-RENDERER' ||
            node.tagName === 'YTD-GUIDE-ENTRY-RENDERER' ||
            node.tagName === 'YTD-RICH-SECTION-RENDERER' ||
            node.tagName === 'YTD-SHORTS' ||
            node.tagName === 'YTD-COMMENTS' ||
            node.tagName === 'YTD-COMMENTS-HEADER-RENDERER' ||
            node.tagName === 'YTD-COMMENT-THREAD-RENDERER')
        );
      });
    });

    // Check if URL has changed (navigation occurred)
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;

      // Reapply features on navigation with a slight delay to ensure DOM is ready
      setTimeout(() => {
        applyFeatures();
      }, 100);
    }

    if (shouldReapply) {
      applyFeatures();
    }
  });

  // Start observing with appropriate config
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
