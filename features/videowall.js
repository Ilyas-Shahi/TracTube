// Create a namespace for videowall feature
window.TracTube = window.TracTube || {};
window.TracTube.Videowall = {};

// Videowall selectors
window.TracTube.Videowall.selectors = [
  // End screen video wall elements
  '.html5-endscreen.ytp-player-content.videowall-endscreen',
  '.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles',
  '.ytp-videowall-still',
  '.ytp-videowall-still-image',
  'ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer',
];

// Handle videowall visibility
window.TracTube.Videowall.handleVideowall = function (featureStates) {
  if (!featureStates.mainEnabled || !featureStates.hideVideowall) {
    this.restoreVideowall();
    return;
  }

  // Set up video end listener if not already done
  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('ended', () => {
      this.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.display = 'none';
        });
      });
    });
  }
};

// Restore videowall visibility
window.TracTube.Videowall.restoreVideowall = function () {
  this.selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.display = '';
    });
  });
};
