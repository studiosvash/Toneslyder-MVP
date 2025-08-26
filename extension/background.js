// Background service worker for ToneSlyder Chrome extension
// Currently minimal; handles lifecycle events.

chrome.runtime.onInstalled.addListener(() => {
  // Perform any setup if needed in future
  console.log('ToneSlyder extension installed');
});
