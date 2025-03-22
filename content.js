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

// Shorts Handler
function handleShorts() {
  // Skip if main toggle is disabled or shorts feature is disabled
  if (!featureStates.mainEnabled || !featureStates.hideShorts) {
    // Restore shorts visibility
    restoreShortsVisibility();
    return;
  }

  // Hide shorts in sidebar navigation
  const sidebarShortsTab = document.querySelector(
    'ytd-guide-entry-renderer a[title="Shorts"]'
  );
  if (sidebarShortsTab) {
    const sidebarShortsItem = sidebarShortsTab.closest(
      'ytd-guide-entry-renderer'
    );
    if (sidebarShortsItem) {
      sidebarShortsItem.style.display = 'none';
    }
  }

  // Hide shorts in home feed
  const shortsShelfItems = document.querySelectorAll(
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])'
  );
  shortsShelfItems.forEach((item) => {
    item.style.display = 'none';
  });

  // Check if we're on the shorts page
  const isOnShortsPage = window.location.pathname.startsWith('/shorts');

  // Remove shorts placeholder if not on shorts page
  if (!isOnShortsPage) {
    const shortsPlaceholder = document.querySelector(
      '.tractube-shorts-placeholder'
    );
    if (shortsPlaceholder) {
      shortsPlaceholder.remove();
    }
    return;
  }

  // If on shorts page, show a placeholder and stop video playback
  if (isOnShortsPage) {
    // Create placeholder if it doesn't exist
    let shortsPlaceholder = document.querySelector(
      '.tractube-shorts-placeholder'
    );
    if (!shortsPlaceholder) {
      shortsPlaceholder = document.createElement('div');
      shortsPlaceholder.className = 'tractube-shorts-placeholder';

      const messageDiv = document.createElement('div');
      messageDiv.className = 'tractube-shorts-message';

      const heading = document.createElement('h2');
      heading.textContent = 'Shorts Hidden';

      const paragraph1 = document.createElement('p');
      paragraph1.textContent =
        'Shorts content is hidden to help you stay focused.';

      const paragraph2 = document.createElement('p');
      paragraph2.textContent =
        'You can disable this feature in the TracTube extension.';

      messageDiv.appendChild(heading);
      messageDiv.appendChild(paragraph1);
      messageDiv.appendChild(paragraph2);
      shortsPlaceholder.appendChild(messageDiv);

      document.body.appendChild(shortsPlaceholder);
    }

    // Handle the shorts player and content
    const shortsContent = document.querySelector('ytd-shorts');
    if (shortsContent) {
      // Hide the shorts content
      shortsContent.style.display = 'none';

      // Find and pause video elements
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
          // Remove the source to fully stop loading/buffering
          video.src = '';
          video.load();
        }
      });

      // Also target the player specifically
      const player = document.querySelector('#shorts-player');
      if (player) {
        player.style.display = 'none';
      }

      // Handle iframe players if present
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        // Remove src to stop any embedded players
        if (iframe.src) {
          iframe.src = '';
        }
      });
    }
  }
}

// Helper function to restore shorts visibility
function restoreShortsVisibility() {
  // Restore sidebar shorts tab
  const sidebarShortsTab = document.querySelector(
    'ytd-guide-entry-renderer a[title="Shorts"]'
  );
  if (sidebarShortsTab) {
    const sidebarShortsItem = sidebarShortsTab.closest(
      'ytd-guide-entry-renderer'
    );
    if (sidebarShortsItem) {
      sidebarShortsItem.style.display = '';
    }
  }

  // Restore shorts in home feed
  const shortsShelfItems = document.querySelectorAll(
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])'
  );
  shortsShelfItems.forEach((item) => {
    item.style.display = '';
  });

  // Remove shorts placeholder if on shorts page
  const shortsPlaceholder = document.querySelector(
    '.tractube-shorts-placeholder'
  );
  if (shortsPlaceholder) {
    shortsPlaceholder.remove();
  }

  // Restore shorts content visibility
  if (window.location.pathname.startsWith('/shorts')) {
    const shortsContent = document.querySelector('ytd-shorts');
    if (shortsContent) {
      shortsContent.style.display = '';

      // Restore player visibility
      const player = document.querySelector('#shorts-player');
      if (player) {
        player.style.display = '';
      }

      // Note: We don't restore video playback as that would be disruptive
      // The user can refresh the page if they want to view shorts again
    }
  }
}

// Hide Sidebar/Related Videos Handler
function handleSidebar() {
  // Skip if we're on the homepage
  if (window.location.pathname === '/') return;

  if (!featureStates.mainEnabled || !featureStates.hideSidebar) {
    restoreSidebar();
    return;
  }

  // Hide the sidebar and related videos
  const sidebar = document.querySelector('#secondary');
  if (sidebar) {
    // Store sidebar width before hiding
    const sidebarWidth = sidebar.offsetWidth;

    // Create placeholder with same width
    const placeholder = document.createElement('div');
    placeholder.id = 'tractube-sidebar-placeholder';
    placeholder.style.width = `${sidebarWidth}px`;
    placeholder.style.flexShrink = '0';

    // Insert placeholder and hide sidebar
    sidebar.parentNode.insertBefore(placeholder, sidebar);
    sidebar.style.display = 'none';
  }

  // Hide end screen recommendations
  const endScreen = document.querySelector(
    'ytd-watch-next-secondary-results-renderer'
  );
  if (endScreen) {
    endScreen.style.display = 'none';
  }
}

// Center Video Feature
function handleCenterVideo() {
  // Skip if we're on the homepage
  if (window.location.pathname === '/') return;

  // Restore center video styles if main or the feature is disabled
  if (!featureStates.mainEnabled || !featureStates.centerVideo) {
    restoreCenterVideo();
    return;
  }

  const videoContainer = document.querySelector('#full-bleed-container');
  const header = document.querySelector('#masthead-container');
  const playerContainer = document.querySelector('ytd-watch-flexy');
  const theatreButton = document.querySelector('button[aria-keyshortcuts="t"]');
  const videoElement = document.querySelector(
    '#movie_player > div.html5-video-container > video'
  );

  // Early return on full screen or unavailable elements
  if (
    document.fullscreenElement ||
    !playerContainer ||
    !header ||
    !videoContainer ||
    !theatreButton ||
    !videoElement
  ) {
    console.log('early return');
    return;
  }

  if (!playerContainer.hasAttribute('theater')) {
    theatreButton.click();
  }

  // increase video container size to cover viewport
  videoContainer.style.maxHeight = '100vh';

  setTimeout(() => {
    // Make header absolute and scroll page
    header.style.position = 'absolute';
    window.scrollTo(0, header.offsetHeight);
  }, 200);
}

function restoreCenterVideo() {
  const playerContainer = document.querySelector('ytd-watch-flexy');
  const videoContainer = document.querySelector('#full-bleed-container');
  const header = document.querySelector('#masthead-container');

  // Check if elements exist before modifying
  if (!header) return;

  header.style.position = 'fixed';

  // Reset theater mode if needed
  if (playerContainer && videoContainer) {
    const theaterButton = document.querySelector(
      'button[aria-keyshortcuts="t"]'
    );

    if (theaterButton && playerContainer.hasAttribute('theater')) {
      theaterButton.click();
      videoContainer.style.maxHeight = 'calc(100vh - 169px)';
    }
  }
}

function scrollVideoIntoViewport() {
  if (document.fullscreenElement !== null) return;

  const header = document.querySelector('#masthead-container');

  if (featureStates.centerVideo) {
    window.scrollTo(0, header.offsetHeight);
  }
  console.log('scrollVideoIntoViewport');
}

document
  .querySelector('#full-bleed-container')
  .addEventListener('click', scrollVideoIntoViewport);

document.addEventListener('fullscreenchange', scrollVideoIntoViewport);

// Helper function to restore sidebar/related videos visibility
function restoreSidebar() {
  // Restore sidebar visibility
  const sidebar = document.querySelector('#secondary');
  const placeholder = document.querySelector('#tractube-sidebar-placeholder');

  if (sidebar && placeholder) {
    // Remove placeholder and show sidebar
    placeholder.remove();
    sidebar.style.display = '';
  } else if (sidebar) {
    // Just show sidebar if no placeholder exists
    sidebar.style.display = '';
  }

  // Restore end screen recommendations
  const endScreen = document.querySelector(
    'ytd-watch-next-secondary-results-renderer'
  );
  if (endScreen) {
    endScreen.style.display = '';
  }
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
  // Thumbnails Control
  handleThumbnails();
  // Shorts Controls
  handleShorts();
  // Video Controls
  handleSidebar();

  // Center Video Controls
  handleCenterVideo();
}

// Function to remove all feature effects
function removeAllFeatures() {
  // Remove home feed placeholder
  const placeholder = document.querySelector('.tractube-placeholder');
  if (placeholder) placeholder.remove();

  // Remove shorts placeholder
  const shortsPlaceholder = document.querySelector(
    '.tractube-shorts-placeholder'
  );
  if (shortsPlaceholder) shortsPlaceholder.remove();

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

  // Restore shorts visibility
  restoreShortsVisibility();

  // Restore sidebar/related videos visibility
  restoreSidebar();

  restoreCenterVideo();
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

    const messageDiv = document.createElement('div');
    messageDiv.className = 'tractube-home-message';

    const heading = document.createElement('h2');
    heading.textContent = 'Home Feed Hidden';

    const paragraph1 = document.createElement('p');
    paragraph1.textContent = 'Home feed is hidden to help you stay focused.';

    const paragraph2 = document.createElement('p');
    paragraph2.textContent =
      'You can disable this feature in the TracTube extension.';

    messageDiv.appendChild(heading);
    messageDiv.appendChild(paragraph1);
    messageDiv.appendChild(paragraph2);
    placeholder.appendChild(messageDiv);

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

// Track current URL to detect navigation
let currentUrl = window.location.href;

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
            node.tagName === 'YTD-GRID-VIDEO-RENDERER' ||
            node.tagName === 'YTD-GUIDE-ENTRY-RENDERER' ||
            node.tagName === 'YTD-RICH-SECTION-RENDERER' ||
            node.tagName === 'YTD-SHORTS')
        );
      });
    });

    // Check if URL has changed (navigation occurred)
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      // Reapply features on navigation
      applyFeatures();
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
