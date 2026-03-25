// content.js - The "Eyes" of SafeNet

console.log("🛡️ SafeNet AI: Content Shield Active");

let nsfwEnabled = true;
let goreEnabled = true;

const isFilteringEnabled = () => nsfwEnabled || goreEnabled;

// 1. Function to apply the "Safe Shield" (Blur)
const applyShield = (element) => {
  if (element.getAttribute("data-safenet-blocked") === "true") {
    return;
  }

  element.style.filter = "blur(30px) grayscale(100%)";
  element.style.transition = "filter 0.5s ease";
  element.setAttribute("data-safenet-blocked", "true");
  chrome.runtime.sendMessage({ action: "incrementBlockCount" });
};

// 2. The Scanner: Finds all images on the page
const scanImages = () => {
  if (!isFilteringEnabled()) {
    return;
  }

  const imgs = document.querySelectorAll("img:not([data-safenet-scanned])");

  imgs.forEach((img) => {
    img.setAttribute("data-safenet-scanned", "true");

    // Temporarily hide/blur until AI confirms it's safe (Strict Mode)
    applyShield(img);

    // In Phase 2, we will send this to the AI model
    console.log("Analyzing image...", img.src);
  });
};

// 3. The Advanced Observer: Detects new images when scrolling
const observer = new MutationObserver(() => {
  scanImages();
});

const startScanner = () => {
  scanImages();

  if (!document.body) {
    return;
  }

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

chrome.storage.sync.get(["nsfw-enabled", "gore-enabled"], (result) => {
  if (result["nsfw-enabled"] !== undefined) {
    nsfwEnabled = result["nsfw-enabled"];
  }
  if (result["gore-enabled"] !== undefined) {
    goreEnabled = result["gore-enabled"];
  }
  startScanner();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") {
    return;
  }

  if (changes["nsfw-enabled"]) {
    nsfwEnabled = changes["nsfw-enabled"].newValue;
  }

  if (changes["gore-enabled"]) {
    goreEnabled = changes["gore-enabled"].newValue;
  }

  scanImages();
});
