# 🚀 IrfanLLM Manga Controller — Release History & Changelog

All notable improvements and architectural upgrades to the IrfanLLM Touchless AI Manga Controller are documented in this file.

---

## [v1.4.0] — 2026-09-04
### ⚡ Native Browser Update Engine & Direct Cloud Live-Sync
* **Native Chromium `update_url` Engine**: Configured `updates.xml` pointing to `https://irfanfahmi.com`, enabling the native **"Update"** button in `chrome://extensions` (on both Lemur Browser and Google Chrome) to automatically fetch latest releases without manual reinstallation.
* **In-Popup 1-Tap Cloud Sync**: Added a dedicated `🔄 Check & Sync Code from Main` button directly inside the extension popup (`popup.html`). Tapping this immediately fetches fresh JavaScript code from `https://irfanfahmi.com/controller.js` and hot-reloads running reading tabs on the fly.
* **Background Service Worker**: Manifest V3 background service worker (`background.js`) continuously checks and synchronizes `controller.js` on browser startup and extension install.
* **Direct Dynamic Cloud Injection**: `content.js` and `popup.js` inject cache-busted `<script src="https://irfanfahmi.com/controller.js?v=Date.now()">` directly, completely avoiding CSP string injection restrictions and guaranteeing 100% fresh code from GitHub on every chapter change or activation.
* **Offline Fallback Resilience**: Seamless fallback to bundled local code if network connectivity is unavailable.

---

## [v1.3.0] — 2026-09-04
### 🔄 Continuous Reading Session & Chapter Persistence
* **Automatic Chapter Persistence**: Solved the browser page-unload teardown issue when advancing to new chapters. The reading session flag now persists in `sessionStorage` across chapter navigations.
* **Smart Content Script Auto-Resume**: Registered a dormant `document_idle` listener in `content.js` that checks for active reading sessions. When you navigate to the next/previous chapter on DemonicScans or any manga website, IrfanLLM automatically re-launches the controller and camera with zero manual clicks required.
* **Clean Session Teardown**: Clicking `✕ Stop` on the floating banner or `🔴 Disable` in the popup completely clears the reading session to prevent unwanted auto-starts on unrelated pages.

---

## [v1.2.0] — 2026-09-04
### 🌐 Universal Website Access & Cloud Auto-Sync
* **Universal Multi-Site Support**: Expanded `host_permissions` to `<all_urls>` allowing IrfanLLM to run on DemonicScans, AsuraScans, MangaDex, Webtoons, ReaperScans, FlameComics, or any web page.
* **On-Demand Enable / Disable Control**: Redesigned the extension popup (`popup.html` / `popup.js`) with active tab detection and clear `🟢 Enable Controller (Turn ON)` and `🔴 Disable Controller (Turn OFF)` buttons.
* **Cloud Live-Sync Architecture**: The extension dynamically queries `https://irfanfahmi.com/controller.js` on activation, enabling instant silent code updates from GitHub without requiring users to manually download, extract, or reinstall `.zip` files.
* **Touchable On-Screen Navigation**: Added `pointer-events: auto; cursor: pointer;` to `< PREV` and `NEXT >` buttons for direct mobile touchscreen taps with responsive visual feedback.
* **Universal Chapter Link Detection**: Implemented intelligent pattern matching (`findChapterLink`) supporting plain-text labels, URL numbering (`chapter=X+1`), and all scanlation reader layouts.

---

## [v1.1.0] — 2026-09-04
### 🧈 Smartphone Touch-Fluid Kinetic Scrolling
* **Display-Synchronized Physics Loop**: Decoupled page scrolling from the 300ms AI inference interval and moved to an independent 60Hz / 90Hz / 120Hz display refresh loop (`requestAnimationFrame`).
* **Kinetic Momentum Inertia**: Implemented exponential friction damping (`FRICTION = 0.935`), allowing the page to smoothly glide to a halt when the hand is released or relaxed, mimicking physical smartphone touchscreen flicks.
* **Air Swipe Flick Gesture**: Added vertical wrist velocity tracking (`dy / dt > 1.25` screens/sec) that imparts an instant swipe momentum boost (~400px glide).
* **Dynamic Speed Presets**: Added a floating on-screen pill button to toggle between 0.7x (Gentle), 1.0x (Normal), and 1.4x (Fast) reading speeds on the fly.
* **CSS Scroll Smoothing Conflict Fix**: Overrode interfering CSS `scroll-behavior: smooth` properties on reader containers to guarantee 100% direct compositor frame rendering with zero micro-stutter.

---

## [v1.0.0] — 2026-09-04
### 📦 Official Chrome Extension Release (Manifest V3)
* **Full Extension Packaging**: Transitioned from legacy bookmarklets and userscripts into a modern, compliant Manifest V3 Chrome Extension.
* **Edge AI Pipeline**: Integrated MediaPipe Hands JS (21 3D landmarks, 71 geometric features) with an embedded Random Forest posture classifier running at <0.1ms per frame.
* **Dual-Hand Gestures**:
  - **Right Hand** (Curled fist, chest level): Page Down / Scroll Down.
  - **Left Hand** (Under chin tilt, ~118° angle): Page Up / Scroll Up.
  - **No Hand / Neutral**: Completely stationary reading mode with zero return-stroke recoil.
* **Floating Head-Up Display**: Added a non-intrusive status banner, on-screen camera picture-in-picture (PiP) with minimize/close buttons, and virtual air navigation buttons.
* **Cross-Browser Verification**: Official tested & verified platforms on **Google Chrome** (Desktop PC/Laptop) and **Lemur Browser** (Android Mobile), with full compatibility for Microsoft Edge, Brave, and Kiwi Browser.
