/**
 * Task 28.1 / 28.4: Background service worker.
 * Opens the app in a new tab when the user clicks the extension icon.
 */
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
})
