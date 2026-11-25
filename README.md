<div align="center">

<img src="chrome/icons/icon128.png" alt="Auto Prefix OTP Logo" width="84" height="84" />

# Auto Prefix OTP

**Instant, 100% local TOTP auto-fill for the HUJI SimpleSAML login page.**

Available for **Google Chrome** (Brave, Edge, Opera, Arc), **Mozilla Firefox**, and **Apple Safari** (macOS & iOS).

<p>
  <a href="https://chromewebstore.google.com/detail/auto-prefix-otp/pbngfaapjncifaggphdehcebhnnfchmd">
    <img src="https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Install from Chrome Web Store" />
  </a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/huji-auto-otp/">
    <img src="https://img.shields.io/badge/Firefox%20Add--ons-Install-FF7139?style=for-the-badge&logo=firefox&logoColor=white" alt="Install from Firefox Add-ons" />
  </a>
  <a href="#safari-macos--ios">
    <img src="https://img.shields.io/badge/Safari-macOS%20%26%20iOS-006CFF?style=for-the-badge&logo=safari&logoColor=white" alt="Build for Safari" />
  </a>
</p>

<p>
  <a href="PRIVACY.md">
    <img src="https://img.shields.io/badge/Privacy-100%25%20Local-16a34a?style=flat-square" alt="100% Local Privacy" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
  </a>
  <a href="https://ko-fi.com/reuvensm">
    <img src="https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white" alt="Support on Ko-fi" />
  </a>
</p>

</div>

---

## Overview

**Auto Prefix OTP** is an open-source, lightweight browser extension that computes RFC 6238 TOTP codes completely offline using your browser's native Web Crypto API (`crypto.subtle`) and automatically fills your **9-digit ID Number** and **PIN Prefix + 6-digit OTP** on the Hebrew University of Jerusalem (HUJI) login page.

---

## Installation

### Official Extension Stores (Recommended)

| Browser | Platform | Install |
| :--- | :--- | :--- |
| **Google Chrome / Brave / Edge** | Manifest V3 | [**Chrome Web Store ↗**](https://chromewebstore.google.com/detail/auto-prefix-otp/pbngfaapjncifaggphdehcebhnnfchmd) |
| **Mozilla Firefox** | Manifest V2 (Desktop & Android) | [**Firefox Add-ons (AMO) ↗**](https://addons.mozilla.org/en-US/firefox/addon/huji-auto-otp/) |
| **Apple Safari** | Manifest V3 (macOS & iOS) | [Build with Xcode](#safari-macos--ios) |

### Manual / Developer Installation

<details>
<summary><strong>Chrome / Brave / Edge (Load Unpacked)</strong></summary>

1. Download **`chrome-extension.zip`** from this repository (or the [Releases](../../releases) page) and unzip it — or clone this repo and use the [`chrome/`](chrome/) directory.
2. Open `chrome://extensions/` in your browser.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the extracted folder (or `chrome/`).
5. Pin **Auto Prefix OTP** to your toolbar and click its icon to configure.

</details>

<details>
<summary><strong>Mozilla Firefox (Temporary Add-on)</strong></summary>

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on…**.
3. Select [`firefox/manifest.json`](firefox/manifest.json) (or `firefox-extension.zip`).

</details>

### Safari (macOS & iOS)

<details>
<summary><strong>Build &amp; Install with Xcode</strong></summary>

Safari requires Web Extensions to be wrapped in a native Xcode app container (requires a Mac with Xcode installed):

1. Download and extract **`safari-extension.zip`** (or clone this repo and use the [`safari/`](safari/) folder).
2. Open **Terminal** and convert the extension into an Xcode project:
   ```bash
   xcrun safari-web-extension-converter safari/ --app-name "Auto Prefix OTP" --bundle-identifier "com.reuvensm.auto-prefix-otp"
   ```
   *(Pass `--macos-only` to build exclusively for macOS, or omit it for macOS + iOS/iPadOS.)*
3. In Xcode, choose your target (**Auto Prefix OTP (macOS)** or **iOS**) and click **Run (`▶`)**.
4. In **Safari** on macOS:
   - If building without a paid Apple Developer certificate, open **Safari → Settings → Advanced**, check **Show features for web developers**, and enable **Develop → Allow Unsigned Extensions**.
   - Open **Safari → Settings → Extensions**, enable **Auto Prefix OTP**, and grant access for `idp.cc.huji.ac.il`.
5. Click the **Auto Prefix OTP** icon in the Safari toolbar to configure your credentials.

</details>

---

## Features

- **Automatic Form Fill** — Populates your 9-digit ID (`#hujicc-otp-username`) and `PIN Prefix + 6-digit OTP` (`#hujicc-otp-password`) the moment the HUJI SimpleSAML login page loads.
- **QR Code Paste, Drop & Upload** — Screenshot your HUJI OTP QR code (`Win + Shift + S` / `⌘ + Shift + 4`) and press **`Ctrl + V`** / **`⌘ + V`** directly in the popup, drag-and-drop a QR image, upload a file, or paste an `otpauth://` URI.
- **Live 30-Second OTP Preview** — Displays your current 6-digit code with a real-time countdown bar and one-click **OTP** and **Copy Full** (`Prefix + OTP`) buttons.
- **Auto-Refresh on Expiry** — Automatically updates the password field if the login tab stays open across a 30-second TOTP window boundary.
- **Built-in Setup Guidance** — Includes a direct link to the official HUJI Authenticator tutorial and interactive `?` visual guides showing where to locate your PIN prefix and QR code.
- **Pause Toggle** — Quickly enable or disable auto-fill at any time from the popup header without clearing your saved settings.
- **Light & Dark Mode** — Adapts automatically to your system color scheme.

---

## How to Configure

> First time setting up HUJI OTP? Follow the [official HUJI Google Authenticator setup guide ↗](https://ca.huji.ac.il/%D7%94%D7%96%D7%93%D7%94%D7%95%D7%AA-%D7%91%D7%90%D7%9E%D7%A6%D7%A2%D7%95%D7%AA-google-authenticator) to choose your PIN prefix and obtain your QR code / Base32 secret.

1. Click the **Auto Prefix OTP** icon in your browser toolbar.
2. Enter your **9-digit ID Number**.
3. Enter your **4-digit PIN Prefix** *(hover over or tap `?` for a visual hint)*.
4. Load your **TOTP Secret** using any of the following:
   - Screenshot your QR code and press **`Ctrl + V`** (or **`⌘ + V`** on macOS) inside the popup.
   - Click **Upload QR Image** (or drag and drop the image into the dropzone).
   - Paste your Base32 secret key or `otpauth://...` URI directly.
5. Click **Save Settings**.

---

## Privacy & Security

- **100% Local Execution** — TOTP codes are calculated locally using the browser's built-in Web Crypto API (`crypto.subtle`) and saved only in local browser storage (`storage.local`).
- **Zero Network Activity** — No external API calls, no analytics, no telemetry, and no tracking.
- **Minimal Permissions** — Requests only `storage` and runs exclusively on `https://idp.cc.huji.ac.il/simplesaml/module.php/hujicc/*`.
- **Easy Data Removal** — Clear all stored credentials at any time via the **Clear** button in the popup or by uninstalling the extension.

Read the full policy in [PRIVACY.md](PRIVACY.md).

---

## Project Structure

```text
.
├── chrome/                 # Manifest V3 source (Chrome / Brave / Edge)
├── firefox/                # Manifest V2 source (Firefox Desktop & Android)
├── safari/                 # Manifest V3 source (Safari macOS & iOS)
├── chrome-extension.zip    # Pre-packaged Chrome archive
├── firefox-extension.zip   # Pre-packaged Firefox archive
├── safari-extension.zip    # Pre-packaged Safari archive
├── PRIVACY.md              # Privacy policy
└── LICENSE                 # MIT license
```

---

## Support

If **Auto Prefix OTP** saves you time, consider supporting its development:

[![Support me on Ko-fi](https://img.shields.io/badge/Support%20me%20on-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/reuvensm)

---

## Disclaimer & License

- **Disclaimer:** This is an independent, unofficial community tool and is not affiliated with, endorsed by, or maintained by The Hebrew University of Jerusalem (HUJI).
- **License:** Released under the [MIT License](LICENSE).
