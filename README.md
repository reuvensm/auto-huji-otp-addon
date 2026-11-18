# 🦊 Auto Prefix OTP (Chrome & Firefox Extension)

An unofficial, lightweight browser extension for **Google Chrome / Brave / Edge** (Manifest V3) and **Mozilla Firefox** (Manifest V2) that calculates RFC 6238 TOTP codes 100% locally in your browser and automatically fills your **ID Number** and **PIN Prefix + OTP** on the HUJI login page.

---

## ✨ Features

- **Automatic Form Fill:** Instantly fills your 9-digit ID (`#hujicc-otp-username`) and `Prefix + 6-digit OTP` (`#hujicc-otp-password`) on the HUJI SimpleSAML login page.
- **QR Code Paste & Upload (`Ctrl+V`):** Paste a screenshot of your HUJI OTP QR code (`Win + Shift + S` $\rightarrow$ `Ctrl + V`), drag-and-drop a QR image, or paste an `otpauth://...` link directly to load your secret automatically.
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

## 🛠️ How to Configure

1. Click the 🦊 **Auto Prefix OTP** icon in your browser toolbar.
2. Enter your **9-digit ID Number**.
3. Enter your **4-digit PIN Prefix** (hover over the `?` icon to see where this appears during setup).
4. Load your **TOTP Secret**:
   - Take a screenshot of your HUJI OTP QR code and press **`Ctrl + V`** inside the popup, **or**
   - Click **Upload QR Image** to select a saved image of the QR code, **or**
   - Type/paste your Base32 secret key directly.
5. Click **Save Settings**.

---

## 🔒 Privacy & Disclaimer

- **Privacy Policy:** See [PRIVACY.md](PRIVACY.md). All data is stored strictly in local browser storage (`storage.local`) and is never transmitted anywhere.
- **Disclaimer:** This is an independent, unofficial community tool and is not affiliated with, endorsed by, or maintained by The Hebrew University of Jerusalem (HUJI).
