// Create a namespace for products feature
window.TracTube = window.TracTube || {};
window.TracTube.Products = {};

// Product selectors
window.TracTube.Products.selectors = [
  // Product popups in video player
  '.ytp-paid-content-overlay',
  '.ytp-paid-product-overlay',
  'button.ytp-button.ytp-suggested-action-badge[aria-label="View products"]',

  // Product shelves below description
  'ytd-product-shelf-renderer',
  'ytd-merch-shelf-renderer',
];

// Handle products visibility
window.TracTube.Products.handleProducts = function (featureStates) {
  if (!featureStates.mainEnabled || !featureStates.hideProducts) {
    this.restoreProducts();
    return;
  }

  this.selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('tractube-hidden-product');
    });
  });
};

// Restore products visibility
window.TracTube.Products.restoreProducts = function () {
  this.selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.remove('tractube-hidden-product');
    });
  });
};
