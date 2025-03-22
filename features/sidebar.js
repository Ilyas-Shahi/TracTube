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
  if (sidebar) {
    // Store sidebar width before hiding
    const sidebarWidth = sidebar.offsetWidth;

    // Create placeholder with same width
    const placeholder = document.createElement('div');
    placeholder.id = 'tractube-sidebar-placeholder';
    placeholder.style.width = `${sidebarWidth}px`;
    placeholder.style.flexShrink = '0';

    // Insert placeholder and hide sidebar
    sidebar.parentNode.insertBefore(placeholder, sidebar);
    sidebar.style.display = 'none';
  }

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

  if (sidebar && placeholder) {
    // Remove placeholder and show sidebar
    placeholder.remove();
    sidebar.style.display = '';
  } else if (sidebar) {
    // Just show sidebar if no placeholder exists
    sidebar.style.display = '';
  }

  // Restore end screen recommendations
  const endScreen = document.querySelector(
    'ytd-watch-next-secondary-results-renderer'
  );
  if (endScreen) {
    endScreen.style.display = '';
  }
};
