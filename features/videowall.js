// Create a namespace for videowall feature
window.TracTube = window.TracTube || {};
window.TracTube.Videowall = {};

// Handle videowall visibility
window.TracTube.Videowall.handleVideowall = function (featureStates) {
  if (!featureStates.mainEnabled || !featureStates.hideVideowall) {
    this.restoreVideowall();
    return;
  }

  const videoWall = document.querySelector(
    '.html5-endscreen.ytp-player-content.videowall-endscreen'
  );

  if (videoWall) videoWall.classList.add('tractube-hide-videowall');
};

// Restore videowall visibility
window.TracTube.Videowall.restoreVideowall = function () {
  const videoWall = document.querySelector(
    '.html5-endscreen.ytp-player-content.videowall-endscreen'
  );

  if (videoWall) videoWall.classList.remove('tractube-hide-videowall');
};
