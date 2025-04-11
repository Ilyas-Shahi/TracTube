// Create a namespace for center video feature
window.TracTube = window.TracTube || {};
window.TracTube.CenterVideo = {};

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
};

window.TracTube.CenterVideo.scrollVideoIntoViewport = function (featureStates) {
  if (document.fullscreenElement !== null) return;

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
  const video = document.querySelector('#full-bleed-container video');

  if (video) {
    video.addEventListener('play', () =>
      window.TracTube.CenterVideo.scrollVideoIntoViewport(window.featureStates)
    );
  }

  document.addEventListener('fullscreenchange', () =>
    window.TracTube.CenterVideo.scrollVideoIntoViewport(window.featureStates)
  );
};
