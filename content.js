// This script runs on your target website
document.addEventListener('DOMContentLoaded', function () {
  // Your website modification code here
});

// Store feature states
let featureStates = {};

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

    // Apply features with loaded states
    applyFeatures();
  });
}

// Message listener for feature toggle updates from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggleStates') {
    featureStates = message.states;
    applyFeatures();
  }
});

// Thumbnail selectors
const thumbnailSelectors = [
  'ytd-thumbnail', // Main thumbnail selector
  'ytd-rich-item-renderer ytd-thumbnail', // Home page thumbnails
  'ytd-video-renderer ytd-thumbnail', // Search results thumbnails
  'ytd-compact-video-renderer ytd-thumbnail', // Sidebar thumbnails
  'ytd-grid-video-renderer ytd-thumbnail', // Grid view thumbnails
];

// Thumbnail Controls Handler
function handleThumbnails() {
  if (!featureStates.mainEnabled) return;

  const thumbnails = document.querySelectorAll(thumbnailSelectors.join(', '));

  thumbnails.forEach((thumbnail) => {
    // Thumbnail blur
    if (featureStates.blurThumbnails) {
      thumbnail.classList.add('tractube-blurred-thumbnail');
    } else {
      thumbnail.classList.remove('tractube-blurred-thumbnail');
    }

    // Thumbnail hide
    if (featureStates.hideThumbnails) {
      thumbnail.classList.add('tractube-hidden-thumbnail');
      // Add placeholder only if it doesn't already exist
      if (
        !thumbnail.parentElement.querySelector(
          '.tractube-thumbnail-placeholder'
        )
      ) {
        const placeholder = document.createElement('div');
        placeholder.className = 'tractube-thumbnail-placeholder';
        placeholder.textContent = 'Thumbnail Hidden';
        // Add a data attribute to link the placeholder to this thumbnail
        placeholder.dataset.forThumbnail = true;
        thumbnail.parentElement.insertBefore(placeholder, thumbnail);
      }
    } else {
      thumbnail.classList.remove('tractube-hidden-thumbnail');
      // Remove placeholder
      const placeholder = thumbnail.parentElement.querySelector(
        '.tractube-thumbnail-placeholder'
      );
      if (placeholder) {
        placeholder.remove();
      }
    }
  });
}

// Main function to apply all features based on their states
function applyFeatures() {
  // Only apply features if main toggle is enabled
  if (!featureStates.mainEnabled) {
    removeAllFeatures();
    return;
  }

  // Feed Controls
  handleHomeFeed();
  handleTopTags();
  handleThumbnails();
}

// Function to remove all feature effects
function removeAllFeatures() {
  // Remove home feed placeholder
  const placeholder = document.querySelector('.tractube-placeholder');
  if (placeholder) placeholder.remove();

  // Remove any custom styles
  const style = document.getElementById('tractube-styles');
  if (style) style.remove();

  // Restore feed visibility if on home page
  if (window.location.pathname === '/') {
    const feed = document.querySelector('ytd-rich-grid-renderer');
    if (feed) feed.style.display = '';
  }

  // Restore chips container visibility
  const chipsContainer = document.querySelector(
    'ytd-feed-filter-chip-bar-renderer'
  );
  if (chipsContainer) chipsContainer.style.display = '';

  // Remove all thumbnail placeholders
  const thumbnailPlaceholders = document.querySelectorAll(
    '.tractube-thumbnail-placeholder'
  );
  thumbnailPlaceholders.forEach((placeholder) => placeholder.remove());

  // Remove thumbnail-related classes
  document.querySelectorAll('.tractube-blurred-thumbnail').forEach((el) => {
    el.classList.remove('tractube-blurred-thumbnail');
  });

  document.querySelectorAll('.tractube-hidden-thumbnail').forEach((el) => {
    el.classList.remove('tractube-hidden-thumbnail');
  });

  // Add more element restorations here as more features are implemented
}

// Home Feed Handler
function handleHomeFeed() {
  // Only proceed if we're on the home page
  if (window.location.pathname !== '/') return;

  // Get the main feed element
  const feed = document.querySelector('ytd-rich-grid-renderer');
  if (!feed) return;

  if (!featureStates.hideHomeFeed) {
    // If feature is disabled, remove placeholder and show feed
    const placeholder = document.querySelector('.tractube-placeholder');
    if (placeholder) placeholder.remove();

    // Restore feed visibility
    feed.style.display = '';
    return;
  }

  // Create placeholder if it doesn't exist
  let placeholder = document.querySelector('.tractube-placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.className = 'tractube-placeholder';
    placeholder.innerHTML = `
      <div style="
        padding: 2rem;
        text-align: center;
        background: var(--yt-spec-brand-background-primary);
        color: var(--yt-spec-text-primary);
        border-radius: 12px;
        margin: 1rem;
      ">
        <h2 style="margin-bottom: 1rem;">Home Feed Hidden</h2>
        <p>Home feed is hidden to help you stay focused.</p>
        <p>You can disable this feature in the TracTube extension.</p>
      </div>
    `;
    feed.parentElement.insertBefore(placeholder, feed);
  }

  // Hide the feed
  feed.style.display = 'none';
}

// Top Tags Handler
function handleTopTags() {
  // Target the chips container
  const chipsContainer = document.querySelector(
    'ytd-feed-filter-chip-bar-renderer'
  );
  if (!chipsContainer) return;

  if (!featureStates.hideTopTags) {
    // Restore chips container visibility
    chipsContainer.style.display = '';
    return;
  }

  // Hide the chips container
  chipsContainer.style.display = 'none';
}

// Initial setup
function initialize() {
  // Load saved states first
  loadSavedStates();

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
            node.tagName === 'YTD-GRID-VIDEO-RENDERER')
        );
      });
    });

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
