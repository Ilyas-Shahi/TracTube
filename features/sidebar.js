// Create a namespace for sidebar feature
window.TracTube = window.TracTube || {};
window.TracTube.Sidebar = {};

// Hide Sidebar/Related Videos Handler
window.TracTube.Sidebar.handleSidebar = function (featureStates) {
  // Skip if we're on the homepage
  if (window.location.pathname === '/') return;

  if (!featureStates.mainEnabled || !featureStates.hideSidebar) {
    window.TracTube.Sidebar.restoreSidebar();
    return;
  }

  // Hide the sidebar and related videos
  const sidebar = document.querySelector('#secondary');
  if (!sidebar) {
    // If sidebar isn't available yet, try again after a short delay
    setTimeout(() => {
      window.TracTube.Sidebar.handleSidebar(featureStates);
    }, 200);
    return;
  }

  // Check if sidebar is already hidden with a placeholder
  const existingPlaceholder = document.querySelector(
    '#tractube-sidebar-placeholder'
  );
  if (existingPlaceholder && sidebar.style.display === 'none') {
    // Already set up correctly, no need to do anything
    return;
  }

  // Clean up any existing placeholders to prevent duplicates
  if (existingPlaceholder) {
    existingPlaceholder.remove();
  }

  // Store sidebar width before hiding
  const sidebarWidth = sidebar.offsetWidth || 400; // Fallback width if offsetWidth is 0

  // Create placeholder with same width
  const placeholder = document.createElement('div');
  placeholder.id = 'tractube-sidebar-placeholder';
  placeholder.style.width = `${sidebarWidth}px`;
  placeholder.style.flexShrink = '0';

  // Insert placeholder and hide sidebar
  sidebar.parentNode.insertBefore(placeholder, sidebar);
  sidebar.style.display = 'none';

  // Hide end screen recommendations
  const endScreen = document.querySelector(
    'ytd-watch-next-secondary-results-renderer'
  );
  if (endScreen) {
    endScreen.style.display = 'none';
  }
};

// Helper function to restore sidebar/related videos visibility
window.TracTube.Sidebar.restoreSidebar = function () {
  // Restore sidebar visibility
  const sidebar = document.querySelector('#secondary');
  const placeholder = document.querySelector('#tractube-sidebar-placeholder');

  if (sidebar) {
    sidebar.style.display = '';
  }

  if (placeholder) {
    placeholder.remove();
  }

  // Restore end screen recommendations
  const endScreen = document.querySelector(
    'ytd-watch-next-secondary-results-renderer'
  );
  if (endScreen) {
    endScreen.style.display = '';
  }
};
