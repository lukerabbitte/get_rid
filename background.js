chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const firstTab = tabs[0];
        chrome.storage.local.set({ savedTab: { url: firstTab.url, title: firstTab.title } });
      }
    });
  });
  