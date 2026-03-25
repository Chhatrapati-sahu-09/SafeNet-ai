// Load saved settings on popup open
document.addEventListener("DOMContentLoaded", () => {
  const nsfwToggle = document.getElementById("nsfw-toggle");
  const goreToggle = document.getElementById("gore-toggle");
  const blockCount = document.getElementById("block-count");
  const resetBtn = document.getElementById("reset-btn");
  const settingsBtn = document.getElementById("settings-btn");

  // Load saved toggle states
  chrome.storage.sync.get(
    ["nsfw-enabled", "gore-enabled", "blocked-count"],
    (result) => {
      if (result["nsfw-enabled"] !== undefined) {
        nsfwToggle.checked = result["nsfw-enabled"];
      }
      if (result["gore-enabled"] !== undefined) {
        goreToggle.checked = result["gore-enabled"];
      }
      if (result["blocked-count"]) {
        blockCount.textContent = result["blocked-count"];
      }
    },
  );

  // NSFW Toggle listener
  nsfwToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ "nsfw-enabled": nsfwToggle.checked });
    chrome.runtime.sendMessage({
      action: "updateNsfwFilter",
      enabled: nsfwToggle.checked,
    });
  });

  // Gore Toggle listener
  goreToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ "gore-enabled": goreToggle.checked });
    chrome.runtime.sendMessage({
      action: "updateGoreFilter",
      enabled: goreToggle.checked,
    });
  });

  // Reset Stats button
  resetBtn.addEventListener("click", () => {
    chrome.storage.sync.set({ "blocked-count": 0 });
    blockCount.textContent = "0";
  });

  // Settings button
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});

// Listen for updates from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateBlockCount") {
    document.getElementById("block-count").textContent = request.count;
  }
});
