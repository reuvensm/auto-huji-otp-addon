const extAPI = typeof browser !== "undefined" ? browser : chrome;

// Decode Base32 secret string into a byte array
function base32ToBytes(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  if (!clean) throw new Error("Empty Base32 secret");
  let bits = "";
  for (const char of clean) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error("Invalid Base32 character");
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

// Compute RFC 6238 TOTP using browser-native Web Crypto API
async function generateTOTP(secret, counter) {
  const keyBytes = base32ToBytes(secret);

  const counterBuffer = new ArrayBuffer(8);
  const view = new DataView(counterBuffer);
  view.setUint32(4, counter, false);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    1000000;

  return code.toString().padStart(6, "0");
}

// Helper to set input value and notify page validation scripts
function setInputValue(element, value) {
  if (!element) return;
  element.value = value;
  element.dataset.autoFilled = "true";
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function getSettings() {
  return new Promise((resolve) => {
    extAPI.storage.local.get(
      { enabled: true, idNumber: "", prefix: "", secret: "" },
      (items) => resolve(items || { enabled: true, idNumber: "", prefix: "", secret: "" })
    );
  });
}

// Find both ID and OTP fields by their exact IDs and fill them
async function fillFields(forceRefresh = false) {
  const idInput = document.getElementById("hujicc-otp-username");
  const passInput = document.getElementById("hujicc-otp-password");

  if (!idInput && !passInput) return;

  const { enabled, idNumber, prefix, secret } = await getSettings();
  if (enabled === false) return;

  if (idInput && (forceRefresh || !idInput.dataset.autoFilled) && idNumber) {
    setInputValue(idInput, idNumber);
  }

  const currentWindow = Math.floor(Date.now() / 30000);
  if (
    passInput &&
    secret &&
    (forceRefresh ||
      !passInput.dataset.autoFilled ||
      passInput.dataset.otpWindow !== String(currentWindow))
  ) {
    try {
      const otp = await generateTOTP(secret, currentWindow);
      passInput.dataset.otpWindow = String(currentWindow);
      setInputValue(passInput, (prefix || "") + otp);
    } catch (err) {
      console.error("[Auto Prefix OTP] Failed to generate TOTP:", err);
    }
  }
}

// Run immediately and watch for dynamically loaded login forms
fillFields();
if (document.body) {
  const observer = new MutationObserver(() => fillFields());
  observer.observe(document.body, { childList: true, subtree: true });
}

// Refresh OTP automatically when the 30-second TOTP window rotates
let lastCheckedWindow = Math.floor(Date.now() / 30000);
setInterval(() => {
  const nowWindow = Math.floor(Date.now() / 30000);
  if (nowWindow !== lastCheckedWindow) {
    lastCheckedWindow = nowWindow;
    fillFields();
  }
}, 1000);

// Re-fill if user saves settings while login page is already open
extAPI.storage.onChanged.addListener(() => {
  fillFields(true);
});
