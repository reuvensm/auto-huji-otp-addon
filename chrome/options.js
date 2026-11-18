const extAPI = typeof browser !== "undefined" ? browser : chrome;

const form = document.getElementById("settings-form");
const enabledInput = document.getElementById("enabled");
const idInput = document.getElementById("idNumber");
const idBadge = document.getElementById("id-badge");
const idHint = document.getElementById("id-hint");
const prefixInput = document.getElementById("prefix");
const secretInput = document.getElementById("secret");
const secretHint = document.getElementById("secret-hint");
const qrUploadBtn = document.getElementById("qr-upload-btn");
const qrFileInput = document.getElementById("qr-file-input");
const qrDropzone = document.getElementById("qr-dropzone");
const pasteQrBtn = document.getElementById("paste-qr-btn");
const previewCode = document.getElementById("preview-code");
const previewTimer = document.getElementById("preview-timer");
const progressBar = document.getElementById("progress-bar");
const copyOtpBtn = document.getElementById("copy-otp-btn");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");
const statusMsg = document.getElementById("status-msg");

// Extract Base32 secret from raw key or otpauth:// URI
function extractSecretFromPayload(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();

  // Check for otpauth:// URI or any URL/query string containing secret=...
  const secretParamMatch = trimmed.match(/[?&]secret=([^&#\s]+)/i);
  if (secretParamMatch && secretParamMatch[1]) {
    try {
      return decodeURIComponent(secretParamMatch[1]).toUpperCase().replace(/\s+/g, "");
    } catch (_) {
      return secretParamMatch[1].toUpperCase().replace(/\s+/g, "");
    }
  }

  if (/^otpauth:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const sec = url.searchParams.get("secret") || url.searchParams.get("SECRET");
      if (sec) return sec.toUpperCase().replace(/\s+/g, "");
    } catch (_) {
      // Fall through
    }
  }

  return trimmed.toUpperCase().replace(/\s+/g, "");
}

// Decode Base32 secret string into a byte array
function base32ToBytes(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const extracted = extractSecretFromPayload(base32);
  const clean = extracted.replace(/=+$/, "");
  if (!clean) throw new Error("Empty Base32 secret");
  let bits = "";
  for (const char of clean) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error(`Invalid Base32 character: "${char}"`);
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

// Compute RFC 6238 TOTP using browser-native Web Crypto API
async function generateTOTP(secret) {
  const keyBytes = base32ToBytes(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / 30);

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

function updateIdValidation() {
  const val = idInput.value.trim();
  if (!val) {
    idBadge.textContent = "9 digits";
    idBadge.className = "badge-hint";
    idHint.textContent = "Auto-filled into the 9-digit ID field";
    idHint.classList.remove("error");
    return;
  }
  if (/^\d{9}$/.test(val)) {
    idBadge.textContent = "✓ 9 digits";
    idBadge.className = "badge-hint valid";
    idHint.textContent = "Auto-filled into the 9-digit ID field";
    idHint.classList.remove("error");
  } else {
    idBadge.textContent = `${val.length}/9 digits`;
    idBadge.className = "badge-hint warn";
    idHint.textContent = "ID number should be 9 numeric digits";
    idHint.classList.add("error");
  }
}

let currentOtp = "";

async function updateLivePreview() {
  const rawInput = secretInput.value.trim();
  if (!rawInput) {
    previewCode.textContent = "------";
    previewTimer.textContent = "--s";
    progressBar.style.width = "0%";
    progressBar.classList.remove("expiring");
    copyOtpBtn.disabled = true;
    copyBtn.disabled = true;
    currentOtp = "";
    secretHint.textContent = "Base32 key (A–Z, 2–7) or scan/paste QR code (otpauth://...)";
    secretHint.classList.remove("error");
    return;
  }

  // Auto-extract if user pasted an otpauth:// URL directly into the input field
  if (/otpauth:\/\/|[?&]secret=/i.test(rawInput)) {
    const extracted = extractSecretFromPayload(rawInput);
    if (extracted && extracted !== rawInput) {
      secretInput.value = extracted;
    }
  }

  const rawSecret = secretInput.value.trim();

  try {
    const otp = await generateTOTP(rawSecret);
    currentOtp = otp;
    const remaining = 30 - (Math.floor(Date.now() / 1000) % 30);
    const pct = (remaining / 30) * 100;
    previewCode.textContent = otp;
    previewTimer.textContent = `${remaining}s`;
    progressBar.style.width = `${pct}%`;
    progressBar.classList.toggle("expiring", remaining <= 5);
    copyOtpBtn.disabled = false;
    copyBtn.disabled = false;
    secretHint.textContent = "Base32 key (A–Z, 2–7) or scan/paste QR code (otpauth://...)";
    secretHint.classList.remove("error");
  } catch (err) {
    previewCode.textContent = "ERROR";
    previewTimer.textContent = "--s";
    progressBar.style.width = "0%";
    progressBar.classList.remove("expiring");
    copyOtpBtn.disabled = true;
    copyBtn.disabled = true;
    currentOtp = "";
    secretHint.textContent = err.message || "Invalid Base32 secret";
    secretHint.classList.add("error");
  }
}

// Decode a QR code from an ImageBlob / File using BarcodeDetector or bundled jsQR
async function decodeQrFromBlob(blob) {
  const bitmapUrl = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not load image"));
      image.src = bitmapUrl;
    });

    // 1. Try native BarcodeDetector first if supported
    if ("BarcodeDetector" in window) {
      try {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const results = await detector.detect(img);
        if (results && results.length > 0 && results[0].rawValue) {
          return results[0].rawValue;
        }
      } catch (_) {
        // Fall through to jsQR
      }
    }

    // 2. Use bundled jsQR with multiple canvas scales & quiet-zone padding
    if (typeof window.jsQR === "function") {
      const attempts = [
        { scale: 1, pad: 0 },
        { scale: 1, pad: 24 },
        { scale: 2, pad: 32 },
        { scale: 600 / Math.max(img.width || 1, img.height || 1), pad: 24 }
      ];

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      for (const { scale, pad } of attempts) {
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        canvas.width = w + pad * 2;
        canvas.height = h + pad * 2;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, pad, pad, w, h);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth"
        });
        if (code && code.data) {
          return code.data;
        }
      }
    }

    throw new Error("No QR code found in image");
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}

async function handleQrImageBlob(blob) {
  try {
    showStatus("Scanning QR...");
    const qrText = await decodeQrFromBlob(blob);
    const extractedSecret = extractSecretFromPayload(qrText);
    if (!extractedSecret) {
      showStatus("QR code has no secret", true);
      return;
    }

    // Validate Base32
    base32ToBytes(extractedSecret);

    secretInput.value = extractedSecret;
    await updateLivePreview();

    // Auto-save secret immediately into storage.local
    extAPI.storage.local.set({ secret: extractedSecret }, () => {
      showStatus("✓ Secret loaded from QR!");
    });
  } catch (err) {
    showStatus(err.message || "Could not read QR code", true);
  }
}

// Listen for Ctrl+V / Paste anywhere in the page
document.addEventListener("paste", (e) => {
  const items = e.clipboardData && e.clipboardData.items;
  if (!items) return;

  for (const item of items) {
    if (item.type && item.type.startsWith("image/")) {
      e.preventDefault();
      const blob = item.getAsFile();
      if (blob) handleQrImageBlob(blob);
      return;
    }
  }

  // Also check if an otpauth:// string was pasted while not focused in id/prefix input
  const pastedText = e.clipboardData.getData("text/plain");
  if (pastedText && /^otpauth:\/\//i.test(pastedText.trim())) {
    e.preventDefault();
    const extracted = extractSecretFromPayload(pastedText);
    try {
      base32ToBytes(extracted);
      secretInput.value = extracted;
      updateLivePreview();
      extAPI.storage.local.set({ secret: extracted }, () => {
        showStatus("✓ Secret loaded from URI!");
      });
    } catch (err) {
      showStatus("Invalid secret in URI", true);
    }
  }
});

// "Paste Image" button reads image from clipboard API
pasteQrBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (!navigator.clipboard || !navigator.clipboard.read) {
    showStatus("Press Ctrl+V to paste QR", false);
    qrDropzone.focus();
    return;
  }
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      const imageType = item.types.find((t) => t.startsWith("image/"));
      if (imageType) {
        const blob = await item.getType(imageType);
        await handleQrImageBlob(blob);
        return;
      }
      if (item.types.includes("text/plain")) {
        const textBlob = await item.getType("text/plain");
        const text = await textBlob.text();
        if (/otpauth:\/\/|[?&]secret=/i.test(text)) {
          const extracted = extractSecretFromPayload(text);
          base32ToBytes(extracted);
          secretInput.value = extracted;
          await updateLivePreview();
          extAPI.storage.local.set({ secret: extracted }, () => {
            showStatus("✓ Secret loaded from clipboard!");
          });
          return;
        }
      }
    }
    showStatus("No QR image in clipboard", true);
  } catch (_) {
    qrDropzone.focus();
    showStatus("Press Ctrl+V to paste QR", false);
  }
});

// File upload picker & drag-and-drop support
qrUploadBtn.addEventListener("click", () => qrFileInput.click());
qrDropzone.addEventListener("click", (e) => {
  if (e.target === pasteQrBtn) return;
  qrDropzone.focus();
});

qrFileInput.addEventListener("change", () => {
  const file = qrFileInput.files && qrFileInput.files[0];
  if (file) {
    handleQrImageBlob(file);
    qrFileInput.value = "";
  }
});

qrDropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  qrDropzone.classList.add("dragover");
});

qrDropzone.addEventListener("dragleave", () => {
  qrDropzone.classList.remove("dragover");
});

qrDropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  qrDropzone.classList.remove("dragover");
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleQrImageBlob(file);
  } else {
    showStatus("Please drop an image file", true);
  }
});

// Load saved configuration
function loadSettings() {
  extAPI.storage.local.get(
    { enabled: true, idNumber: "", prefix: "", secret: "" },
    (items) => {
      if (items) {
        enabledInput.checked = items.enabled !== false;
        idInput.value = items.idNumber || "";
        prefixInput.value = items.prefix || "";
        secretInput.value = items.secret || "";
      }
      updateIdValidation();
      updateLivePreview();
    }
  );
}

// Show status message briefly
let statusTimeout;
function showStatus(text, isError = false) {
  statusMsg.textContent = text;
  statusMsg.classList.toggle("error", isError);
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    statusMsg.textContent = "";
  }, 3500);
}

// Save enabled toggle immediately
enabledInput.addEventListener("change", () => {
  const enabled = enabledInput.checked;
  extAPI.storage.local.set({ enabled }, () => {
    showStatus(enabled ? "Auto-fill enabled" : "Auto-fill paused");
  });
});

// Save configuration
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const enabled = enabledInput.checked;
  const idNumber = idInput.value.trim();
  const prefix = prefixInput.value;
  const secret = extractSecretFromPayload(secretInput.value);

  if (secret) {
    try {
      base32ToBytes(secret);
    } catch (err) {
      showStatus("Invalid Base32 secret", true);
      return;
    }
  }

  extAPI.storage.local.set({ enabled, idNumber, prefix, secret }, () => {
    secretInput.value = secret;
    updateIdValidation();
    updateLivePreview();
    showStatus("Settings saved!");
  });
});

// Clear credentials
clearBtn.addEventListener("click", () => {
  extAPI.storage.local.set({ idNumber: "", prefix: "", secret: "" }, () => {
    idInput.value = "";
    prefixInput.value = "";
    secretInput.value = "";
    updateIdValidation();
    updateLivePreview();
    showStatus("Cleared!");
  });
});

// Toggle Show/Hide for password inputs
document.querySelectorAll(".toggle-vis").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "Hide" : "Show";
  });
});

// Copy 6-digit OTP only
copyOtpBtn.addEventListener("click", async () => {
  if (!currentOtp) return;
  try {
    await navigator.clipboard.writeText(currentOtp);
    const prev = copyOtpBtn.textContent;
    copyOtpBtn.textContent = "Copied!";
    setTimeout(() => {
      copyOtpBtn.textContent = prev;
    }, 1500);
  } catch (err) {
    showStatus("Failed to copy", true);
  }
});

// Copy full (prefix + OTP) button
copyBtn.addEventListener("click", async () => {
  if (!currentOtp) return;
  const fullValue = (prefixInput.value || "") + currentOtp;
  try {
    await navigator.clipboard.writeText(fullValue);
    const prev = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = prev;
    }, 1500);
  } catch (err) {
    showStatus("Failed to copy", true);
  }
});

idInput.addEventListener("input", updateIdValidation);
secretInput.addEventListener("input", updateLivePreview);

loadSettings();
setInterval(updateLivePreview, 1000);
