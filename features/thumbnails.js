// Create a namespace for thumbnails feature
window.TracTube = window.TracTube || {};
window.TracTube.Thumbnails = {};

// Thumbnail selectors
window.TracTube.Thumbnails.thumbnailSelectors = [
  // Home page containers
  '#contents ytd-thumbnail',
  '#contents ytd-rich-item-renderer ytd-thumbnail',

  // Video page sidebar
  '#related ytd-thumbnail',
  '#secondary ytd-compact-video-renderer ytd-thumbnail',

  // Home page shorts shelf
  // '#contents ytd-rich-shelf-renderer[is-shorts] ytd-thumbnail',
  'ytm-shorts-lockup-view-model .shortsLockupViewModelHostThumbnailContainer',
];

// Thumbnail Controls Handler
window.TracTube.Thumbnails.handleThumbnails = function (featureStates) {
  if (!featureStates.mainEnabled) return;

  // Only apply to home page or video page
  const isHomePage = window.location.pathname === '/';
  const isVideoPage = window.location.pathname.startsWith('/watch');
  if (!(isHomePage || isVideoPage)) return;

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
