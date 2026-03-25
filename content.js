// content.js - The "Eyes" of SafeNet

console.log("🛡️ SafeNet AI: Content Shield Active");

let nsfwEnabled = true;
let goreEnabled = true;
let mode = "strict";
let blockedCount = 0;
let model;
let modelInitPromise;

const isFilteringEnabled = () => mode !== "off" && (nsfwEnabled || goreEnabled);

const NSFW_KEYWORDS = ["nsfw", "adult", "nude", "porn", "explicit", "sex"];
const GORE_KEYWORDS = ["gore", "blood", "kill", "violent", "weapon", "fight"];

const inferScore = (text, keywords) => {
  const lowerText = text.toLowerCase();
  const hits = keywords.filter((keyword) => lowerText.includes(keyword)).length;
  return Math.min(hits / 2, 1);
};

const loadModel = async () => {
  // Placeholder until external model integration is added.
  return {
    predict(img) {
      const signalText = `${img.src || ""} ${img.alt || ""} ${img.title || ""}`;
      const nsfwScore = inferScore(signalText, NSFW_KEYWORDS);
      const goreScore = inferScore(signalText, GORE_KEYWORDS);
      return { nsfwScore, goreScore };
    },
  };
};

async function init() {
  if (model) {
    return model;
  }

  if (!modelInitPromise) {
    modelInitPromise = loadModel().then((loadedModel) => {
      model = loadedModel;
      return model;
    });
  }

  return modelInitPromise;
}

const getImageScores = async (img) => {
  const activeModel = await init();
  const { nsfwScore, goreScore } = activeModel.predict(img);
  const risk = (nsfwScore * 0.7 + goreScore * 0.3) * 100;

  return { nsfwScore, goreScore, risk };
};

function addLabel(img, text) {
  if (!img.parentElement || img.parentElement.querySelector(".safenet-label")) {
    return;
  }

  const label = document.createElement("div");
  label.className = "safenet-label";
  label.innerText = text;

  label.style.position = "absolute";
  label.style.top = "6px";
  label.style.left = "6px";
  label.style.zIndex = "9999";
  label.style.background = "red";
  label.style.color = "white";
  label.style.fontSize = "12px";
  label.style.fontWeight = "700";
  label.style.padding = "4px 6px";
  label.style.borderRadius = "4px";

  img.parentElement.style.position = "relative";
  img.parentElement.appendChild(label);
}

// 1. Function to apply the "Safe Shield" (Blur)
const shouldBlockInMode = (risk) => {
  if (mode === "strict") {
    return risk > 40;
  }

  if (mode === "balanced") {
    return risk > 70;
  }

  return false;
};

const applyShield = (element, nsfwScore, goreScore, risk) => {
  if (
    element.getAttribute("data-safenet-blocked") === "true" ||
    !shouldBlockInMode(risk)
  ) {
    return;
  }

  element.style.filter = "blur(30px) grayscale(100%)";
  element.style.transition = "filter 0.5s ease";
  element.setAttribute("data-safenet-blocked", "true");
  element.title = `Blocked: NSFW ${Math.round(nsfwScore * 100)}% | Gore ${Math.round(goreScore * 100)}%`;
  addLabel(element, `Blocked (${Math.round(risk)}%)`);

  element.onclick = () => {
    element.style.filter = "none";
    element.removeAttribute("data-safenet-blocked");
    if (element.parentElement) {
      const badge = element.parentElement.querySelector(".safenet-label");
      if (badge) {
        badge.remove();
      }
    }
  };

  blockedCount += 1;
  chrome.storage.local.set({ blocked: blockedCount });
  chrome.runtime.sendMessage({ action: "updateBlockCount", count: blockedCount });
};

// 2. The Scanner: Finds all images on the page
const scanImages = async () => {
  if (!isFilteringEnabled()) {
    return;
  }

  const imgs = document.querySelectorAll("img:not([data-safenet-scanned])");

  for (const img of imgs) {
    img.setAttribute("data-safenet-scanned", "true");

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    if (imgWidth > 0 && imgHeight > 0 && (imgWidth < 100 || imgHeight < 100)) {
      continue;
    }

    const { nsfwScore, goreScore, risk } = await getImageScores(img);

    // Temporarily hide/blur until AI confirms it's safe.
    applyShield(img, nsfwScore, goreScore, risk);

    console.log("Analyzing image...", img.src, "Risk:", Math.round(risk));
  }
};

// 3. The Advanced Observer: Detects new images when scrolling
const observer = new MutationObserver(() => {
  void scanImages();
});

const startScanner = () => {
  void scanImages();

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
});

chrome.storage.local.get(["mode"], (result) => {
  if (["strict", "balanced", "off"].includes(result.mode)) {
    mode = result.mode;
  }
  startScanner();
});

chrome.storage.local.get(["blocked"], (result) => {
  blockedCount = Number(result.blocked || 0);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") {
    if (area === "local" && changes.mode) {
      mode = changes.mode.newValue;
      void scanImages();
    }
    return;
  }

  if (changes["nsfw-enabled"]) {
    nsfwEnabled = changes["nsfw-enabled"].newValue;
  }

  if (changes["gore-enabled"]) {
    goreEnabled = changes["gore-enabled"].newValue;
  }

  void scanImages();
});
