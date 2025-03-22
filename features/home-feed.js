// Create a namespace for home feed feature
window.TracTube = window.TracTube || {};
window.TracTube.HomeFeed = {};

// Home Feed Handler
window.TracTube.HomeFeed.handleHomeFeed = function (featureStates) {
  // Only proceed if we're on the home page
  if (window.location.pathname !== '/') return;

  // Get the main feed element
  const feed = document.querySelector('ytd-rich-grid-renderer');
  if (!feed) return;

  if (!featureStates.hideHomeFeed) {
    // If feature is disabled, restore home feed
    window.TracTube.HomeFeed.restoreHomeFeed();
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
};

// Helper function to restore home feed visibility
window.TracTube.HomeFeed.restoreHomeFeed = function () {
  // Only proceed if we're on the home page
  if (window.location.pathname !== '/') return;

  // Remove placeholder
  const placeholder = document.querySelector('.tractube-placeholder');
  if (placeholder) placeholder.remove();

  // Restore feed visibility
  const feed = document.querySelector('ytd-rich-grid-renderer');
  if (feed) feed.style.display = '';
};
