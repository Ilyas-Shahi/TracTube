// Create a namespace for shorts feature
window.TracTube = window.TracTube || {};
window.TracTube.Shorts = {};

// Shorts Handler
window.TracTube.Shorts.handleShorts = function (featureStates) {
  // Skip if main toggle is disabled or shorts feature is disabled
  if (!featureStates.mainEnabled || !featureStates.hideShorts) {
    // Restore shorts visibility
    window.TracTube.Shorts.restoreShortsVisibility();
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

  // Hide shorts in search results (check for SHORTS badge overlay)
  const searchShorts = document.querySelectorAll(
    'ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])'
  );
  searchShorts.forEach((short) => {
    short.style.display = 'none';
  });

  // Hide shorts shelf in search results
  const searchShortsShelves = document.querySelectorAll(
    'ytd-reel-shelf-renderer'
  );
  searchShortsShelves.forEach((shelf) => {
    shelf.style.display = 'none';
  });

  // working above but not below

  // Only run channel-specific hiding on channel pages
  if (
    window.location.pathname.startsWith('/c/') ||
    window.location.pathname.startsWith('/channel/') ||
    window.location.pathname.startsWith('/@')
  ) {
    // Hide shorts tab in channel
    const channelShortsTab = document.querySelector(
      'yt-tab-shape[tab-title="Shorts"]'
    );
    if (channelShortsTab) {
      channelShortsTab.style.display = 'none';
    }

    // Hide shorts shelves in channel
    const channelShortsShelves = document.querySelectorAll(
      'ytd-item-section-renderer:has(ytd-reel-shelf-renderer)'
    );
    channelShortsShelves.forEach((shelf) => {
      shelf.style.display = 'none';
    });
  }

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
};

// Helper function to restore shorts visibility
window.TracTube.Shorts.restoreShortsVisibility = function () {
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

  // Restore shorts in search results (matching the SHORTS badge overlay)
  const searchShorts = document.querySelectorAll(
    'ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])'
  );
  searchShorts.forEach((short) => {
    short.style.display = '';
  });

  // Restore shorts shelves in search results
  const searchShortsShelves = document.querySelectorAll(
    'ytd-reel-shelf-renderer'
  );
  searchShortsShelves.forEach((shelf) => {
    shelf.style.display = '';
  });

  // Restore shorts tab in channel
  const channelShortsTab = document.querySelector(
    'yt-tab-shape[tab-title="Shorts"]'
  );
  if (channelShortsTab) {
    channelShortsTab.style.display = '';
  }

  // Restore shorts in channel pages
  const channelShorts = document.querySelectorAll(
    'ytd-grid-video-renderer:has(a[href^="/shorts/"])'
  );
  channelShorts.forEach((short) => {
    short.style.display = '';
  });

  // Restore shorts shelves in channel pages
  const channelShortsShelves = document.querySelectorAll(
    'ytd-item-section-renderer:has(ytd-reel-shelf-renderer)'
  );
  channelShortsShelves.forEach((shelf) => {
    shelf.style.display = '';
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
};
