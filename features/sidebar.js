// Create a namespace for sidebar feature
window.TracTube = window.TracTube || {};
window.TracTube.Sidebar = {};

// Hide Sidebar/Related Videos Handler
window.TracTube.Sidebar.handleSidebar = function (featureStates) {
  // Skip if, main toggle or feature toggle disabled or not on video watch page
  if (
    !featureStates.mainEnabled ||
    !featureStates.hideSidebar ||
    !window.location.pathname.startsWith('/watch')
  ) {
    window.TracTube.Sidebar.restoreSidebar();
    return;
  }

  // Hide the sidebar and related videos
  const sidebar = document.querySelector('#related');

  // Check if sidebar is already hidden with a placeholder
  const existingPlaceholder = document.querySelector(
    '#tractube-sidebar-placeholder'
  );
  if (existingPlaceholder || sidebar.style.display === 'none') {
    return; // Already processed
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
};

// Helper function to restore sidebar/related videos visibility
window.TracTube.Sidebar.restoreSidebar = function () {
  // Restore sidebar visibility
  const sidebar = document.querySelector('#related');
  const placeholder = document.querySelector('#tractube-sidebar-placeholder');

  if (sidebar) {
    sidebar.style.display = '';
  }

  if (placeholder) {
    placeholder.remove();
  }
};
