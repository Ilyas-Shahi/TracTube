// Create a namespace for comments feature
window.TracTube = window.TracTube || {};
window.TracTube.HideComments = {};

// Comments Handler
window.TracTube.HideComments.handleComments = function (featureStates) {
  // Get comments section first
  const comments = document.querySelector('#comments');
  if (!comments) return;

  // Skip if main toggle is disabled or comments feature is disabled
  if (!featureStates.mainEnabled || !featureStates.hideComments) {
    // Restore comments visibility
    window.TracTube.HideComments.restoreComments();
    return;
  }

  // Hide comments section and related elements
  document
    .querySelectorAll(
      '#comments, ytd-comments-header-renderer, ytd-comment-thread-renderer'
    )
    .forEach((comment) => {
      comment.classList.add('tractube-hide-comments');
    });
};

// Helper function to restore comments visibility
window.TracTube.HideComments.restoreComments = function () {
  document.querySelectorAll('.tractube-hide-comments').forEach((el) => {
    el.classList.remove('tractube-hide-comments');
  });
};
