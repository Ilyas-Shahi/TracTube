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
  window.TracTube.HideSubscriptions.handleSubscriptions(featureStates);
  // Thumbnails Control
  window.TracTube.Thumbnails.handleThumbnails(featureStates);
  // Shorts Controls
  window.TracTube.Shorts.handleShorts(featureStates);
  // Video Controls
  window.TracTube.Sidebar.handleSidebar(featureStates);
  // Live Chat Controls
  window.TracTube.LiveChat.handleLiveChat(featureStates);
  // Center Video Controls
  window.TracTube.CenterVideo.handleCenterVideo(featureStates);
  // Comment Controls
  window.TracTube.HideComments.handleComments(featureStates);
  // Autoplay Controls
  window.TracTube.Autoplay.handleAutoplay(featureStates);
  // Endscreen Controls
  window.TracTube.Endscreen.handleEndscreen(featureStates);
  // Products Controls
  window.TracTube.Products.handleProducts(featureStates);
  // Videowall Controls
  window.TracTube.Videowall.handleVideowall(featureStates);
  // Search Results Controls
  window.TracTube.SearchResults.handleSearchResults(featureStates);
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
  window.TracTube.LiveChat.restoreLiveChat();
  window.TracTube.CenterVideo.restoreCenterVideo();
  window.TracTube.HideComments.restoreComments();
  window.TracTube.Autoplay.restoreAutoplay();
  window.TracTube.Endscreen.restoreEndscreen();
  window.TracTube.Products.restoreProducts();
  window.TracTube.Videowall.restoreVideowall();
  window.TracTube.SearchResults.restoreSearchResults();
  window.TracTube.HideSubscriptions.restoreSubscriptions();
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
      // Check for added nodes
      return Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType !== 1) return false;

        const tagName = node.tagName;
        const classList = node.classList;

        return (
          // Feed and content elements
          tagName === 'YTD-RICH-GRID-RENDERER' ||
          tagName === 'YTD-RICH-ITEM-RENDERER' ||
          tagName === 'YTD-RICH-SECTION-RENDERER' ||
          tagName === 'YTD-SHELF-RENDERER' ||
          // Thumbnails and video elements
          tagName === 'YTD-THUMBNAIL' ||
          tagName === 'YTD-VIDEO-RENDERER' ||
          tagName === 'YTD-GRID-VIDEO-RENDERER' ||
          tagName === 'YTD-COMPACT-VIDEO-RENDERER' ||
          tagName === 'YTD-PLAYLIST-RENDERER' ||
          // Shorts elements
          tagName === 'YTD-SHORTS' ||
          tagName === 'YTD-REEL-SHELF-RENDERER' ||
          tagName === 'YTD-SHORTS-SHELF-RENDERER' ||
          // Navigation and filter elements
          tagName === 'YTD-FEED-FILTER-CHIP-BAR-RENDERER' ||
          tagName === 'YTD-GUIDE-ENTRY-RENDERER' ||
          // Comments elements
          tagName === 'YTD-COMMENTS' ||
          tagName === 'YTD-COMMENTS-HEADER-RENDERER' ||
          tagName === 'YTD-COMMENT-THREAD-RENDERER' ||
          // Live chat elements
          tagName === 'YTD-LIVE-CHAT-FRAME' ||
          tagName === 'YTD-LIVE-CHAT-RENDERER' ||
          tagName === 'YT-LIVE-CHAT-ITEM-LIST-RENDERER' ||
          // Endscreen and product elements
          tagName === 'YTD-ENDSCREEN-RENDERER' ||
          tagName === 'YTD-ENDSCREEN' ||
          tagName === 'YTD-PRODUCT-RENDERER' ||
          tagName === 'YTD-PRODUCT-SHELF-RENDERER' ||
          tagName === 'YTD-MERCH-RENDERER' ||
          tagName === 'YTD-MERCH-SHELF-RENDERER' ||
          // Class-based checks
          (classList &&
            (classList.contains('ytd-shorts') ||
              classList.contains('shorts-shelf') ||
              classList.contains('ytd-thumbnail-container') ||
              classList.contains('html5-endscreen') ||
              classList.contains('ytp-endscreen') ||
              classList.contains('ytp-ce-element') ||
              classList.contains('ytp-paid-content-overlay') ||
              classList.contains('ytp-paid-product-overlay') ||
              classList.contains('ytd-merch-shelf') ||
              classList.contains('ytd-product-shelf') ||
              classList.contains('ytp-autoplay-button'))) ||
          // Special cases
          (tagName === 'BUTTON' && node.dataset.testId === 'autoplay-button')
        );
      });
    });

    if (shouldReapply) {
      applyFeatures();
    }

    // Check if URL has changed (navigation occurred)
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;

      // Watch for YouTube's loading bar progress to detect when navigation is complete
      const waitForNavigation = () => {
        const loadingBar = document.querySelector(
          'yt-page-navigation-progress'
        );
        if (loadingBar && loadingBar.getAttribute('aria-valuenow') === '100') {
          // Loading finished, apply features
          applyFeatures();
        } else {
          // Loading still in progress, check again
          requestAnimationFrame(waitForNavigation);
        }
      };
      waitForNavigation();
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
