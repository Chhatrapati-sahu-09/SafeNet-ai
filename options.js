document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");

  chrome.storage.sync.get(["nsfw-enabled", "gore-enabled"], (result) => {
    const nsfw = result["nsfw-enabled"] !== false ? "ON" : "OFF";
    const gore = result["gore-enabled"] !== false ? "ON" : "OFF";
    status.textContent = `Current filter state: NSFW ${nsfw}, Gore ${gore}.`;
  });
});
