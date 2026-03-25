# SafeNet AI

SafeNet AI is a Chrome extension prototype for real-time protection against sensitive visual content.

Current goal: detect and block NSFW and gore-related images on websites.

## Current Status

This repository is an early implementation.

### Current Situation

SafeNet AI is in prototype stage. Core extension flows are working (image scan, blur shield, popup controls, mode selection, click-to-reveal, and basic stats), but the project is not production-ready yet.

What is working now:

- Extension loads and runs on websites.
- Risk-based blocking flow with Strict/Balanced/Off modes.
- Popup controls and settings persistence.
- Trusted-site bypass and small-image skip logic.

What is still pending:

- Real AI model integration for accurate NSFW/gore classification.
- Advanced options (editable trusted sites, custom thresholds, per-site controls).
- Full testing and performance hardening for production use.

Implemented now:

- Popup UI with toggles for NSFW and gore filters.
- Local settings persistence using Chrome storage.
- Content script that scans images and applies a blur shield immediately.
- MutationObserver support to scan newly added images during page updates.

Not fully implemented yet:

- Real AI image classification (the content script currently blurs first, then logs analysis placeholders).
- Domain-level controls (allowlist, temporary pause, per-site policies).

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

## Error Fixes Included In This Update

The project had some functional errors that are now fixed:

- Error: Settings button opened options flow without a registered options page.
  - Fix: Added options page support in manifest and created options UI files.
  - Updated files: manifest.json, options.html, options.js

- Error: Background service worker had no message listeners, while popup/content scripts were sending runtime messages.
  - Fix: Implemented runtime message handling in background script for filter updates, counter reset, and counter increment.
  - Updated files: background.js

- Error: Content script tried to observe document.body at document_start, which can be unavailable on some pages and may cause startup issues.
  - Fix: Added safe startup flow that reads settings first and only starts observer when body exists.
  - Updated files: content.js

- Error: Block count restore in popup skipped value 0 because of a truthy check.
  - Fix: Changed to an explicit undefined check and synced reset action with background script.
  - Updated files: popup.js

## Next Roadmap

- Connect image classification model/API for real NSFW and gore detection.
- Track blocked count from content/background events.
- Add domain allowlist and temporary pause mode.

## Disclaimer

SafeNet AI is a prototype and should not be treated as a complete safety solution yet. False positives and false negatives are expected until classifier integration is complete.

## Need Help?

If you need help with setup, bugs, or feature requests, please open an issue in this repository.

## Help Wanted

I want help to complete this project. If you would like to contribute, please open an issue or submit a pull request.
