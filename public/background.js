let activeTabId = null;
let tabTimes = {};

chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
  if (!tabTimes[activeTabId]) {
    tabTimes[activeTabId] = 0;
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeTabId = null;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      activeTabId = tabs[0].id;
      if (!tabTimes[activeTabId]) {
        tabTimes[activeTabId] = 0;
      }
      const activetab = tabs[0];
      chrome.cookies.getAll({ url: activetab.url }, function(cookies){
        console.log("cookies for the current tab", cookies);
      })
    });
  }
});

setInterval(() => {
  if (activeTabId) {
    tabTimes[activeTabId]++;
  }
}, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "getTabTimes") {
    sendResponse(tabTimes);
  }
});
