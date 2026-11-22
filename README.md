# 🦊 Auto Prefix OTP (Chrome, Firefox & Safari Extension)

An unofficial, lightweight browser extension for **Google Chrome / Brave / Edge** (Manifest V3), **Mozilla Firefox** (Manifest V2), and **Apple Safari** (Manifest V3, macOS & iOS) that calculates RFC 6238 TOTP codes 100% locally in your browser and automatically fills your **ID Number** and **PIN Prefix + OTP** on the HUJI login page.

---

## ✨ Features

- **Automatic Form Fill:** Instantly fills your 9-digit ID (`#hujicc-otp-username`) and `Prefix + 6-digit OTP` (`#hujicc-otp-password`) on the HUJI SimpleSAML login page.
- **QR Code Paste & Upload (`Ctrl+V` / `⌘V`):** Paste a screenshot of your HUJI OTP QR code (`Win + Shift + S` / `⌘ + Shift + 4` $\rightarrow$ `Ctrl + V` / `⌘ + V`), drag-and-drop a QR image, or paste an `otpauth://...` link directly to load your secret automatically.
- **Live 30-Second OTP Preview:** View your current 6-digit OTP with a real-time countdown bar and one-click **Copy OTP** / **Copy Full** buttons right from the toolbar popup.
- **Auto-Refresh on Expiry:** If the login tab remains open for more than 30 seconds, the extension automatically updates the OTP field when the 30-second window rotates.
- **Built-in Setup Help:** Includes a direct link to the HUJI OTP tutorial and hover `?` visual guides showing where to find your PIN prefix and QR code.
- **100% Local & Private:** Uses native Web Crypto (`crypto.subtle`) and `storage.local`. Zero network requests, zero analytics, and your credentials never leave your device.

---

## 🚀 Installation for Google Chrome / Brave / Edge (Free)

1. Download **`chrome-extension.zip`** from the [Releases](../../releases) page (or from this repository) and **extract (unzip)** it to a folder on your computer (or clone this repo and use the `chrome/` folder).
2. Open Chrome and navigate to:
   ```text
   chrome://extensions/
   ```
3. Turn ON **Developer mode** (toggle switch in the top-right corner).
4. Click **Load unpacked** (top-left button) and select the unzipped folder (or the `chrome/` folder).
5. Pin the 🦊 **Auto Prefix OTP** icon to your toolbar and click it to configure your **ID Number**, **PIN Prefix**, and **TOTP Secret / QR Code**.

---

## 🦊 Installation for Mozilla Firefox

- Install directly from the **Mozilla Firefox Add-ons Store (AMO)**, or:
- For manual/temporary installation: open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on...**, and select `firefox/manifest.json` (or `firefox-extension.zip`).

---

## 🧭 Installation for Apple Safari (macOS & iOS)

Safari requires Web Extensions to be wrapped in a native Xcode app container (requires a Mac with Xcode installed):

1. Download **`safari-extension.zip`** and extract it (or clone this repo and use the `safari/` folder).
2. Open **Terminal** on your Mac and convert the `safari/` folder into an Xcode project:
   ```bash
   xcrun safari-web-extension-converter safari/ --app-name "Auto Prefix OTP" --bundle-identifier "com.reuvensm.auto-prefix-otp"
   ```
   *(Add `--macos-only` if you only want the macOS extension, or leave it off to build for both macOS and iOS/iPadOS.)*
3. In the Xcode window that opens, select your target (**Auto Prefix OTP (macOS)** or **iOS**) and click **Run (`▶`)**.
4. In **Safari** on macOS:
   - If running without a paid Apple Developer certificate, open **Safari → Settings → Advanced**, check **Show features for web developers**, then enable **Develop → Allow Unsigned Extensions**.
   - Open **Safari → Settings → Extensions**, enable **Auto Prefix OTP**, and grant access for `idp.cc.huji.ac.il`.
5. Click the 🦊 **Auto Prefix OTP** icon in the Safari toolbar to configure your credentials.

---

## 🛠️ How to Configure

1. Click the 🦊 **Auto Prefix OTP** icon in your browser toolbar.
2. Enter your **9-digit ID Number**.
3. Enter your **4-digit PIN Prefix** (hover over or tap the `?` icon to see where this appears during setup).
4. Load your **TOTP Secret**:
   - Take a screenshot of your HUJI OTP QR code and press **`Ctrl + V`** (or **`⌘ + V`** on macOS) inside the popup, **or**
   - Click **Upload QR Image** to select a saved image of the QR code, **or**
   - Type/paste your Base32 secret key directly.
5. Click **Save Settings**.

---

## 🔒 Privacy & Disclaimer

- **Privacy Policy:** See [PRIVACY.md](PRIVACY.md). All data is stored strictly in local browser storage (`storage.local`) and is never transmitted anywhere.
- **Disclaimer:** This is an independent, unofficial community tool and is not affiliated with, endorsed by, or maintained by The Hebrew University of Jerusalem (HUJI).

---

## ☕ Support

If this extension saves you time, you can support its development on Ko-fi:

[![Support me on Ko-fi](https://img.shields.io/badge/Support%20me%20on-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/reuvensm)
