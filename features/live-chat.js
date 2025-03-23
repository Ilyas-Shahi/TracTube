// Create namespace for live chat feature
window.TracTube = window.TracTube || {};
window.TracTube.LiveChat = {};

// Live Chat Handler
window.TracTube.LiveChat.handleLiveChat = function (featureStates) {
  if (!featureStates.mainEnabled || !featureStates.removeLiveChat) {
    window.TracTube.LiveChat.restoreLiveChat();
    return;
  }

  // Target live chat elements
  const liveChatElements = document.querySelectorAll(
    'yt-live-chat-renderer, #chat-container, yt-live-chat-frame, .yt-live-chat-item-list-renderer, #panels-full-bleed-container'
  );

  liveChatElements.forEach((element) => {
    element.classList.add('tractube-hide-live-chat');
  });
};

// Restore live chat visibility
window.TracTube.LiveChat.restoreLiveChat = function () {
  document.querySelectorAll('.tractube-hide-live-chat').forEach((element) => {
    element.classList.remove('tractube-hide-live-chat');
  });
};
