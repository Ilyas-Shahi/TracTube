// Create a namespace for thumbnails feature
window.TracTube = window.TracTube || {};
window.TracTube.Thumbnails = {};

// Thumbnail selectors
window.TracTube.Thumbnails.thumbnailSelectors = [
  'ytd-thumbnail', // Main thumbnail selector
  'ytd-rich-item-renderer ytd-thumbnail', // Home page thumbnails
  'ytd-video-renderer ytd-thumbnail', // Search results thumbnails
  'ytd-compact-video-renderer ytd-thumbnail', // Sidebar thumbnails
  'ytd-grid-video-renderer ytd-thumbnail', // Grid view thumbnails
];

// Thumbnail Controls Handler
window.TracTube.Thumbnails.handleThumbnails = function (featureStates) {
  if (!featureStates.mainEnabled) return;

  const thumbnails = document.querySelectorAll(
    window.TracTube.Thumbnails.thumbnailSelectors.join(', ')
  );

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
};

// Helper function to restore thumbnails
window.TracTube.Thumbnails.restoreThumbnails = function () {
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
};
