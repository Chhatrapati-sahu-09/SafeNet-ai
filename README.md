# SafeNet AI

SafeNet AI is a Chrome extension prototype for real-time protection against sensitive visual content.

Current goal: detect and block NSFW and gore-related images on websites.

## Current Status

This repository is an early implementation.

Implemented now:

- Popup UI with toggles for NSFW and gore filters.
- Local settings persistence using Chrome storage.
- Content script that scans images and applies a blur shield immediately.
- MutationObserver support to scan newly added images during page updates.

Not fully implemented yet:

- Real AI image classification (the content script currently blurs first, then logs analysis placeholders).
- Background workflow logic (background.js is present but currently empty).
- Options page (popup includes a settings action, but no options page is defined in manifest).

## Features

- Real-time image scanning on all URLs.
- Strict default behavior (images are blurred on discovery).
- Separate controls for:
  - Adult/NSFW filtering
  - Gore/violence filtering
- Blocked content counter in popup.
- Reset stats button.

## Project Structure

- manifest.json: Extension configuration (MV3), permissions, scripts, and popup.
- content.js: DOM image scanner and shielding logic.
- popup.html: Popup layout.
- popup.js: Popup behavior, storage reads/writes, runtime messaging.
- style.css: Popup styling.
- background.js: Service worker placeholder.
- icons/: Extension icons.

## Installation (Developer Mode)

1. Open Chrome and go to chrome://extensions.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this project folder.
5. Pin SafeNet AI and open the popup to test toggles.

## How It Works (Current)

1. The content script runs at document_start on all pages.
2. It scans image elements not yet marked as scanned.
3. Each discovered image gets a blur + grayscale shield.
4. A mutation observer re-runs scanning when DOM changes.
5. Popup settings are saved to chrome.storage.sync.

## Permissions Used

- storage: Save user toggle preferences and stats.
- scripting: Reserved for future scripted actions.
- host_permissions <all_urls>: Required to inspect and process images across websites.

## Development Notes

- Manifest version: 3
- Extension name: SafeNet AI
- Version: 1.0

## Next Roadmap

- Connect image classification model/API for real NSFW and gore detection.
- Implement background service worker message handling.
- Add and register options page in manifest.
- Track blocked count from content/background events.
- Add domain allowlist and temporary pause mode.

## Disclaimer

SafeNet AI is a prototype and should not be treated as a complete safety solution yet. False positives and false negatives are expected until classifier integration is complete.
