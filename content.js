// content.js - The "Eyes" of SafeNet

console.log("🛡️ SafeNet AI: Content Shield Active");

// 1. Function to apply the "Safe Shield" (Blur)
const applyShield = (element) => {
  element.style.filter = "blur(30px) grayscale(100%)";
  element.style.transition = "filter 0.5s ease";
  element.setAttribute("data-safenet-blocked", "true");
};

// 2. The Scanner: Finds all images on the page
const scanImages = () => {
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
const observer = new MutationObserver((mutations) => {
  scanImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial scan
scanImages();
