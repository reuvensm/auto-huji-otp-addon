# Privacy Policy — Auto Prefix OTP

**Effective Date:** November 17, 2026

## 1. Data Collection & Storage
**Auto Prefix OTP** does **not** collect, transmit, store, or share any personal information, browsing history, or authentication credentials on any external server.

All configuration data you enter into the extension — including your **ID Number**, **Password/PIN Prefix**, and **TOTP Secret (Base32)** — is stored exclusively on your local device using your browser's built-in `storage.local` API.

## 2. How Your Data Is Used
- **Local TOTP Calculation:** Your Base32 secret is used strictly inside your browser via the standard Web Crypto API (`crypto.subtle`) to compute RFC 6238 Time-Based One-Time Passwords (TOTP).
- **Form Auto-Fill:** When you visit the matching login page (`https://idp.cc.huji.ac.il/simplesaml/module.php/hujicc/*`), the extension fills the configured ID and generated `Prefix + OTP` into the login input fields.

## 3. Third-Party Sharing & Analytics
- No analytics, telemetry, tracking scripts, or third-party libraries are included in this extension.
- Zero network requests are made by this extension.

## 4. Data Deletion
You can delete your stored credentials at any time by clicking the **Clear** button in the extension's settings popup/options page or by uninstalling the extension.
