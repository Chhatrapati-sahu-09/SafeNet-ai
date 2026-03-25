const DEFAULT_SETTINGS = {
  "nsfw-enabled": true,
  "gore-enabled": true,
  "blocked-count": 0,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS), (stored) => {
    const updates = {};

    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
      if (stored[key] === undefined) {
        updates[key] = value;
      }
    });

    if (Object.keys(updates).length > 0) {
      chrome.storage.sync.set(updates);
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateNsfwFilter") {
    chrome.storage.sync.set({ "nsfw-enabled": Boolean(request.enabled) });
    sendResponse({ ok: true });
    return;
  }

  if (request.action === "updateGoreFilter") {
    chrome.storage.sync.set({ "gore-enabled": Boolean(request.enabled) });
    sendResponse({ ok: true });
    return;
  }

  if (request.action === "resetBlockCount") {
    chrome.storage.sync.set({ "blocked-count": 0 });
    sendResponse({ ok: true });
    return;
  }

  if (request.action === "incrementBlockCount") {
    chrome.storage.sync.get(["blocked-count"], (result) => {
      const nextCount = Number(result["blocked-count"] || 0) + 1;
      chrome.storage.sync.set({ "blocked-count": nextCount }, () => {
        chrome.runtime.sendMessage({
          action: "updateBlockCount",
          count: nextCount,
        });
        sendResponse({ ok: true, count: nextCount });
      });
    });
    return true;
  }

  sendResponse({ ok: false, message: "Unknown action" });
});
