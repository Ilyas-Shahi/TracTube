// Create a namespace for center video feature
window.TracTube = window.TracTube || {};
window.TracTube.CenterVideo = {};

// Track if our feature enabled theater mode
window.TracTube.CenterVideo.centerVideoActive = false;

// Center Video Feature
window.TracTube.CenterVideo.handleCenterVideo = function (featureStates) {
  const header = document.querySelector('#masthead-container');

  // Skip if we're on any page other than watch video page
  if (!window.location.pathname.startsWith('/watch')) {
    header.style.position = 'fixed';
    return;
  }

  // Restore center video styles if main or the feature is disabled
  if (!featureStates.mainEnabled || !featureStates.centerVideo) {
    window.TracTube.CenterVideo.restoreCenterVideo();
    return;
  }

  const videoContainer = document.querySelector('#full-bleed-container');
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
    return;
  }

  // Return if feature already applied
  if (
    playerContainer.hasAttribute('theater') &&
    videoContainer.style.maxHeight === '100vh' &&
    header.style.position === 'absolute'
  ) {
    return;
  }

  if (!playerContainer.hasAttribute('theater')) {
    theatreButton.click();
    window.TracTube.CenterVideo.centerVideoActive = true;
    chrome.storage.sync.set({ centerVideoActive: true });
  }

  // increase video container size to cover viewport
  videoContainer.style.maxHeight = '100vh';

  // Make header absolute and scroll page
  header.style.position = 'absolute';
  window.scrollTo(0, header.offsetHeight);

  // Trigger a window resize event to make YouTube recalculate video size
  window.dispatchEvent(new Event('resize'));
};

window.TracTube.CenterVideo.restoreCenterVideo = function () {
  const playerContainer = document.querySelector('ytd-watch-flexy');
  const videoContainer = document.querySelector('#full-bleed-container');
  const header = document.querySelector('#masthead-container');
  const theaterButton = document.querySelector('button[aria-keyshortcuts="t"]');

  // Check if elements exist before modifying
  if (!header) return;

  // Always reset header position immediately
  header.style.position = 'fixed';

  // Reset video container size based on current theater mode state
  if (videoContainer) {
    if (
      playerContainer &&
      playerContainer.hasAttribute('theater') &&
      videoContainer.style.maxHeight !== 'calc(100vh - 169px)'
    ) {
      // If in theater mode, use theater mode size
      videoContainer.style.maxHeight = 'calc(100vh - 169px)';
      window.dispatchEvent(new Event('resize'));
    } else {
      // If not in theater mode, remove maxHeight restriction
      videoContainer.style.maxHeight = '';
    }
  }

  // Reset theater mode only if our feature enabled it
  if (
    playerContainer &&
    theaterButton &&
    playerContainer.hasAttribute('theater')
  ) {
    const shouldReset = window.TracTube.CenterVideo.centerVideoActive;
    window.TracTube.CenterVideo.centerVideoActive = false;
    chrome.storage.sync.get(['centerVideoActive'], (result) => {
      if (shouldReset || result.centerVideoActive) {
        theaterButton.click();
      }
      chrome.storage.sync.remove('centerVideoActive');
    });
  }
};

window.TracTube.CenterVideo.scrollVideoIntoViewport = function (featureStates) {
  if (document.fullscreenElement !== null) return;

  console.log('scrollVideoIntoViewport');

  const header = document.querySelector('#masthead-container');
  if (
    header &&
    header.offsetHeight > 0 &&
    featureStates &&
    featureStates.centerVideo
  ) {
    window.scrollTo({
      top: header.offsetHeight,
      behavior: 'smooth',
    });
  }
};

// Add event listeners for the center video feature
window.TracTube.CenterVideo.setupCenterVideoEventListeners = function () {
  if (!window.location.pathname.startsWith('/watch')) return;

  // Setup fullscreen change listener
  document.addEventListener('fullscreenchange', () =>
    window.TracTube.CenterVideo.scrollVideoIntoViewport(window.featureStates)
  );

  // Create observer to watch for video element
  const observer = new MutationObserver((mutations, obs) => {
    const video = document.querySelector('#full-bleed-container video');
    console.log(video);
    if (video) {
      video.addEventListener('play', () =>
        window.TracTube.CenterVideo.scrollVideoIntoViewport(
          window.featureStates
        )
      );
      obs.disconnect(); // Stop observing once we find the video
    }
  });

  // Start observing with a timeout
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Set timeout to stop observing after 10 seconds
  setTimeout(() => {
    observer.disconnect();
  }, 10000);
};
