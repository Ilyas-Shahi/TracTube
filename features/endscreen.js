// Create a namespace for endscreen feature
window.TracTube = window.TracTube || {};
window.TracTube.Endscreen = {};

// Endscreen Handler
window.TracTube.Endscreen.handleEndscreen = function (featureStates) {
  if (!featureStates.mainEnabled || !featureStates.hideEndscreen) {
    window.TracTube.Endscreen.restoreEndscreen();
    return;
  }

  // Get endscreen elements
  const endscreens = document.querySelectorAll(
    '.ytp-ce-element.ytp-ce-video, .ytp-ce-element.ytp-ce-playlist, .ytp-ce-element.ytp-ce-channel'
  );
  if (!endscreens.length) {
    return;
  }

  endscreens.forEach((endscreen) => {
    endscreen.style.display = 'none';
  });
};

// Helper function to restore endscreen visibility
window.TracTube.Endscreen.restoreEndscreen = function () {
  const endscreens = document.querySelectorAll(
    '.ytp-ce-element.ytp-ce-video, .ytp-ce-element.ytp-ce-playlist, .ytp-ce-element.ytp-ce-channel'
  );
  endscreens.forEach((endscreen) => {
    endscreen.style.display = '';
  });
};
