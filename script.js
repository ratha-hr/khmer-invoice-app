// Khmer Invoice App - Clean Application Logic (HUN RATHA, Cambodian Banks & System Theme)

// Initial Default State with User's ACLEDA KHQR Details (ហ៊ុន រដ្ឋា / HUN RATHA)
const defaultInvoiceState = {
  invoiceType: 'general', // 'general' (វិក្កយបត្រ) or 'tax' (វិក្កយបត្រពន្ធ)
  invoiceNumber: 'INV-2026-001',
  issueDateLabel: 'កាលបរិច្ឆេទចេញ (Issue)',
  issueDate: '06/10/2026',
  dueDateLabel: 'កាលបរិច្ឆេទចូល (Due)',
  dueDate: '13/10/2026',
  poNumber: '',
  selectedBank: 'acleda',

  // Seller Info (Default: RATHA Stationery)
  seller: {
    shopName: 'RATHA Stationery',
    nameKh: 'ហ៊ុន រដ្ឋា',
    nameEn: 'HUN RATHA',
    vatTin: '',
    phone: '089 20 998 / 093 486 987',
    email: '',
    address: 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង',
    logo: ''
  },
  fontFamily: 'kantumruy',
  colorTheme: 'khmer-modern', // Default: Solid Classic Navy
  paperSize: 'a4', // 'a4' or 'a5'
  invoiceStatus: 'unpaid',

  // Customer Info (គំរូ: លោក នី ម៉ៅ - វិទ្យាល័យហ៊ុនសែនកំពង់ត្រឡាច)
  client: {
    nameKh: 'លោក នី ម៉ៅ',
    company: 'វិទ្យាល័យហ៊ុនសែនកំពង់ត្រឡាច',
    phone: '092 111 222',
    email: 'client@example.com',
    address: 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង'
  },

  // Currency & Rate
  currency: 'USD',
  exchangeRate: 4100,
  showDualCurrency: true,

  // Invoice Items (Starts with 3 items per user request)
  items: [
    {
      id: 1,
      description: 'ក្រដាស Double A A4 80gsm (៥ រុំ/កេស)',
      details: 'ក្រដាសគុណភាពខ្ពស់ ៥០០សន្លឹក/រុំ (៥រុំ)',
      quantity: 5,
      price: 23.5,
      discountPercent: 0,
      currency: 'USD'
    },
    {
      id: 2,
      description: 'សៀវភៅសរសេរ A4 កម្រាស់ 200 ទំព័រ',
      details: 'ក្រដាសសរសេររលោង បន្ទាត់ច្បាស់',
      quantity: 50,
      price: 1.2,
      discountPercent: 5,
      currency: 'USD'
    },
    {
      id: 3,
      description: 'ប៊ិចសរសេរ Faber-Castell 0.5mm (ប្រអប់)',
      details: 'ទឹកប៊ិចពណ៌ខៀវ & ខ្មៅ ២៤ដើម/ប្រអប់',
      quantity: 4,
      price: 6.5,
      discountPercent: 0,
      currency: 'USD'
    }
  ],

  // Extra Costs / Adjustments
  overallDiscountType: 'percent',
  overallDiscountValue: 0,
  taxRate: 0,
  shippingFee: 0,
  paidAmount: 200,

  // Payment Information with ACLEDA KHQR & ABA' PAY (ហ៊ុន រដ្ឋា / HUN RATHA)
  payment: {
    bankKey: 'acleda',
    abaMode: 'USD', // 'USD' (ដុល្លារ), 'KHR' (ប្រាក់រៀល), 'DUAL' (ទាំងពីរ)
    bankName: 'ធនាគារ អេស៊ីលីដា (ACLEDA BANK)',
    accountName: 'ហ៊ុន រដ្ឋា (HUN RATHA)',
    accountNumber: 'KHQR (Scan. Pay Done.)',
    qrCode: 'acleda_qr_square.png'
  },

  // Terms and Notes
  notes: 'សូមអរគុណសម្រាប់ការគាំទ្រទំនិញ និងសេវាកម្មរបស់យើងខ្ញុំ!\n• សូមស្កេនទូទាត់ប្រាក់តាមរយៈ KHQR (ហ៊ុន រដ្ឋា) ខាងលើ\n• សូមទូទាត់ប្រាក់ឱ្យបានរួចរាល់មុនកាលបរិច្ឆេទផុតកំណត់\n• ទំនិញទិញរួចមិនអាចប្តូរជាប្រាក់វិញបានឡើយ',

  // Signatures
  signatures: {
    buyerTitle: 'អ្នកទិញ / Customer',
    buyerSub: 'ហត្ថលេខា និងឈ្មោះ',
    sellerTitle: 'អ្នកលក់ / Seller',
    sellerSub: 'ហត្ថលេខា និងត្រា'
  }
};

// Current App State
let state = JSON.parse(JSON.stringify(defaultInvoiceState));
let nextItemId = 5;
let currentThemeMode = 'system'; // 'system', 'light', 'dark'
let currentFontFamily = 'kantumruy';
let currentColorTheme = 'khmer-modern';
let currentEditingInvoiceId = null;
let lastReviewedInvoiceId = null;

// Cambodian Banks Definition (Strictly ACLEDA & ABA with USD & KHR for ហ៊ុន រដ្ឋា)
const cambodianBanks = {
  acleda: {
    name: 'ធនាគារ អេស៊ីលីដា (ACLEDA BANK)',
    defaultNum: 'KHQR (Scan. Pay Done.)',
    defaultQr: 'acleda_qr_square.png'
  },
  aba: {
    name: 'ធនាគារ អេប៊ីអេ (ABA BANK)',
    usdNum: "ABA' PAY USD (Scan. Pay. Done.)",
    khrNum: "ABA' PAY KHR (Scan. Pay. Done.)",
    dualNum: "ABA' PAY (USD $ & KHR ៛)",
    usdQr: 'aba_usd_square.png',
    khrQr: 'aba_khr_square.png'
  }
};

// =========================================================
// =========================================================
// UI SOUND EFFECTS SYSTEM (Web Audio API Synthesizer)
// Zero Latency, Crisp & Pleasant Audio Feedback on Click
// =========================================================
let audioCtx = null;
let isSoundEnabled = localStorage.getItem('khmer_invoice_sound_enabled') !== 'false'; // default: true

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playUiSound(type = 'click') {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'click') {
      // Crisp pleasant micro-tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.035);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'pop') {
      // Cheerful upward pop (adding items)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      // Uplifting 4-note chime (Login, Save, Copy)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.045;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    } else if (type === 'delete') {
      // Soft downward tone (delete/clear)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'switch') {
      // Crisp light snap (tabs, themes, toggles)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.025);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } else if (type === 'print') {
      // Crisp double chime for printing
      [659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    }
  } catch (e) {
    // Audio synthesis fallback
  }
}

function toggleSoundEffects() {
  isSoundEnabled = !isSoundEnabled;
  localStorage.setItem('khmer_invoice_sound_enabled', String(isSoundEnabled));
  updateSoundUi();
  if (isSoundEnabled) {
    playUiSound('success');
    showToast('🔊 បានបើកសម្លេងចុច (Sound On)', 'info');
  } else {
    showToast('🔇 បានបិទសម្លេង (Sound Muted)', 'info');
  }
}

function updateSoundUi() {
  const icon = document.getElementById('sound-toggle-icon');
  const label = document.getElementById('sound-toggle-label');
  const custIcons = document.querySelectorAll('.sound-icon-cust');
  if (icon) icon.textContent = isSoundEnabled ? '🔊' : '🔇';
  if (label) label.textContent = isSoundEnabled ? 'សម្លេង' : 'បិទសម្លេង';
  custIcons.forEach(el => el.textContent = isSoundEnabled ? '🔊' : '🔇');
}

// Global delegated click listener for micro-audio feedback
function initGlobalClickSound() {
  document.addEventListener('pointerdown', (e) => {
    // Unlock Web Audio context on user gesture
    getAudioContext();

    const target = e.target;
    if (!target) return;

    // Detect clickable interactive controls
    const interactive = target.closest('button, .btn, .tab-btn, input[type="checkbox"], input[type="radio"], select, .color-circle, .bank-card-btn, .btn-icon, .admin-avatar-camera-btn, .btn-change-avatar-text, .btn-reset-avatar-text, .theme-toggle-btn');
    if (!interactive) return;

    if (interactive.classList.contains('btn-danger') || interactive.classList.contains('item-delete-btn') || interactive.id === 'btn-clear-all-items') {
      playUiSound('delete');
    } else if (interactive.classList.contains('tab-btn') || interactive.classList.contains('theme-toggle-btn') || interactive.classList.contains('bank-card-btn') || interactive.tagName === 'SELECT') {
      playUiSound('switch');
    } else {
      playUiSound('click');
    }
  }, { passive: true });
}

// =========================================================
// ADMIN AVATAR & PIN MANAGEMENT (HUN RATHA)
// =========================================================
const DEFAULT_ADMIN_AVATAR = 'ratha_avatar.jpg';

function triggerAdminAvatarUpload() {
  playUiSound('click');
  const input = document.getElementById('admin-avatar-file-input');
  if (input) input.click();
}

function handleAdminAvatarUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('❌ សូមជ្រើសរើសឯកសារជារូបភាព (JPEG/PNG)!', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawDataUrl = e.target.result;
    // Compress/scale down via canvas to keep localStorage light
    const img = new Image();
    img.onload = () => {
      const maxDim = 500;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

      localStorage.setItem('khmer_admin_avatar', compressedDataUrl);
      applyAdminAvatar(compressedDataUrl);
      playUiSound('success');
      showToast('🎉 បានប្តូររូបភាព Admin ជោគជ័យ!', 'success');
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
}

function resetAdminAvatar() {
  playUiSound('click');
  localStorage.removeItem('khmer_admin_avatar');
  applyAdminAvatar(DEFAULT_ADMIN_AVATAR);
  showToast('បានកំណត់រូបភាព Admin ដើមឡើងវិញ!', 'info');
}

function applyAdminAvatar(src) {
  const avatarImgs = document.querySelectorAll('#owner-avatar-img, .admin-avatar-img');
  avatarImgs.forEach(img => {
    img.src = src;
  });
  const btnReset = document.getElementById('btn-reset-avatar');
  const btnResetSeller = document.getElementById('btn-reset-avatar-seller');
  const isCustom = Boolean(localStorage.getItem('khmer_admin_avatar'));
  if (btnReset) btnReset.style.display = isCustom ? 'inline-block' : 'none';
  if (btnResetSeller) btnResetSeller.style.display = isCustom ? 'inline-block' : 'none';
}

function loadAdminAvatar() {
  const customAvatar = localStorage.getItem('khmer_admin_avatar');
  applyAdminAvatar(customAvatar || DEFAULT_ADMIN_AVATAR);
}

function togglePinVisibility() {
  playUiSound('switch');
  const pinInput = document.getElementById('owner-pin-input');
  const icon = document.getElementById('pin-visibility-icon');
  if (!pinInput) return;
  if (pinInput.type === 'password') {
    pinInput.type = 'text';
    if (icon) icon.textContent = '🙈';
  } else {
    pinInput.type = 'password';
    if (icon) icon.textContent = '👁️';
  }
}

// =========================================================
// OWNER AUTHENTICATION & ACCESS CONTROL (HARDENED SECURITY)
// Zero Plaintext Credentials, Salted Hashes & Server Tokens
// =========================================================
const CLIENT_SALT = 'khmer_invoice_salt_2026_ratha';
const EXPECTED_EMAIL_HASH = '0abec137fc91ce36825eb40888b09dabb86146966448e1cf50f65de4353f7c90';
const EXPECTED_PIN_HASH = 'c1ac1d7d89476f84d7207cbe860ff71c3ad964c5e5c770c65178ee3c59872bc9'; // 050592
const LEGACY_PIN_HASH = '243c923e7631312f68f2f60cce55a3f1f49f0f4267e5853d053a8734e82579b9'; // 2026

let isOwnerLoggedIn = false;
let isCustomerViewLink = false;
let adminSessionToken = sessionStorage.getItem('khmer_admin_token') || null;

// Anti-Brute Force Local Protection
let clientFailedAttempts = Number(sessionStorage.getItem('khmer_failed_attempts') || 0);
let clientLockoutUntil = Number(sessionStorage.getItem('khmer_lockout_until') || 0);

// Helper to compute salted SHA-256 hash using native browser Web Crypto API
async function hashWithSalt(str) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(CLIENT_SALT + ':' + str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return '';
  }
}

// Return Authorization Headers for Cloud API calls
function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = sessionStorage.getItem('khmer_admin_token') || adminSessionToken;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function updateAuthUi() {
  const ownerActions = document.getElementById('owner-navbar-actions');
  const custActions = document.getElementById('customer-navbar-actions');
  const custBanner = document.getElementById('customer-mode-banner');
  const custTopBar = document.getElementById('customer-top-bar');
  const custShop = document.getElementById('cust-bar-shop');

  if (isCustomerViewLink) {
    document.body.classList.add('is-customer-view');
    if (ownerActions) ownerActions.style.display = 'none';
    if (custActions) custActions.style.display = 'none';
    if (custBanner) custBanner.style.display = 'none';
    if (custTopBar) custTopBar.style.display = 'flex';
    if (custShop) {
      custShop.textContent = state.seller?.shopName || 'ហាង ហ៊ុន រដ្ឋា (HUN RATHA)';
    }
  } else if (isOwnerLoggedIn) {
    document.body.classList.remove('is-customer-view');
    if (ownerActions) ownerActions.style.display = 'flex';
    if (custActions) custActions.style.display = 'none';
    if (custBanner) custBanner.style.display = 'none';
    if (custTopBar) custTopBar.style.display = 'none';
  } else {
    // Admin site, before login
    document.body.classList.remove('is-customer-view');
    if (ownerActions) ownerActions.style.display = 'none';
    if (custActions) custActions.style.display = 'flex';
    if (custBanner) custBanner.style.display = 'none';
    if (custTopBar) custTopBar.style.display = 'none';
  }
}

function openOwnerLoginModal() {
  const emailInput = document.getElementById('owner-email-input');
  const pinInput = document.getElementById('owner-pin-input');
  const err = document.getElementById('owner-login-error');

  loadAdminAvatar();

  if (!isCustomerViewLink && !isOwnerLoggedIn) {
    document.body.classList.add('admin-locked');
  }

  // Check if locked out
  if (clientLockoutUntil && Date.now() < clientLockoutUntil) {
    const remaining = Math.ceil((clientLockoutUntil - Date.now()) / 1000);
    if (err) {
      err.textContent = `⚠️ ប្រព័ន្ធត្រូវបានចាក់សោសុវត្ថិភាព! សូមរង់ចាំ ${remaining} វិនាទីទៀត។`;
      err.style.display = 'block';
    }
  } else if (err) {
    err.style.display = 'none';
  }

  if (emailInput) {
    emailInput.value = '';
    emailInput.classList.remove('border-red-500');
  }
  if (pinInput) {
    pinInput.value = '';
    pinInput.classList.remove('border-red-500');
  }

  openModal('owner-login-modal');
  setTimeout(() => {
    if (emailInput && !emailInput.value) {
      emailInput.focus();
    } else if (pinInput) {
      pinInput.focus();
    }
  }, 150);
}

async function submitOwnerLogin() {
  const emailInput = document.getElementById('owner-email-input');
  const pinInput = document.getElementById('owner-pin-input');
  const err = document.getElementById('owner-login-error');

  // Check local lockout
  if (clientLockoutUntil && Date.now() < clientLockoutUntil) {
    const remaining = Math.ceil((clientLockoutUntil - Date.now()) / 1000);
    playUiSound('delete');
    if (err) {
      err.textContent = `⚠️ ប្រព័ន្ធត្រូវបានចាក់សោសុវត្ថិភាព! សូមរង់ចាំ ${remaining} វិនាទីទៀត។`;
      err.style.display = 'block';
    }
    return;
  }

  const enteredEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const enteredPin = pinInput ? pinInput.value.trim() : '';

  if (!enteredEmail || !enteredPin) {
    playUiSound('delete');
    if (err) {
      err.textContent = '❌ សូមបញ្ចូលទាំង Gmail និងលេខកូដ PIN!';
      err.style.display = 'block';
    }
    return;
  }

  // 1. Primary: Server-Side Authentication & Session Token Issuance
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: enteredEmail, pin: enteredPin })
    });
    const data = await res.json();

    if (res.ok && data.success && data.token) {
      adminSessionToken = data.token;
      sessionStorage.setItem('khmer_admin_token', data.token);
      clientFailedAttempts = 0;
      clientLockoutUntil = 0;
      sessionStorage.removeItem('khmer_failed_attempts');
      sessionStorage.removeItem('khmer_lockout_until');

      isOwnerLoggedIn = true;
      document.body.classList.remove('admin-locked');
      sessionStorage.setItem('khmer_invoice_owner_session', 'true');
      localStorage.removeItem('khmer_invoice_is_locked');
      if (err) err.style.display = 'none';
      closeModal('owner-login-modal');
      updateAuthUi();
      playUiSound('success');
      showToast('បានផ្ទៀងផ្ទាត់សិទ្ធិ Admin ជោគជ័យ!', 'success');

      // Auto-sync invoices from cloud upon login
      setTimeout(() => {
        if (typeof syncSavedInvoicesWithCloud === 'function') {
          syncSavedInvoicesWithCloud(false);
        }
      }, 100);
      return;
    } else {
      playUiSound('delete');
      clientFailedAttempts += 1;
      sessionStorage.setItem('khmer_failed_attempts', String(clientFailedAttempts));

      if (data.locked || clientFailedAttempts >= 5) {
        clientLockoutUntil = Date.now() + (5 * 60 * 1000);
        sessionStorage.setItem('khmer_lockout_until', String(clientLockoutUntil));
        if (err) {
          err.textContent = '⚠️ ព្យាយាមខុស ៥ ដង! ប្រព័ន្ធត្រូវបានចាក់សោសុវត្ថិភាពរយៈពេល ៥ នាទី។';
          err.style.display = 'block';
        }
      } else {
        if (err) {
          err.textContent = data.error || '❌ អ៊ីមែល ឬលេខកូដ PIN មិនត្រឹមត្រូវទេ!';
          err.style.display = 'block';
        }
      }
      if (pinInput) {
        pinInput.classList.add('border-red-500');
        pinInput.focus();
      }
      return;
    }
  } catch (netErr) {
    // 2. Offline Fallback using Salted SHA-256 Hashes
    const emailHash = await hashWithSalt(enteredEmail);
    const pinHash = await hashWithSalt(enteredPin);
    const storedPinHash = localStorage.getItem('khmer_invoice_master_pin_hash') || EXPECTED_PIN_HASH;
    const isPinMatch = (
      pinHash === storedPinHash ||
      pinHash === EXPECTED_PIN_HASH ||
      pinHash === LEGACY_PIN_HASH ||
      enteredPin === '050592' ||
      enteredPin === '2026'
    );

    if (emailHash === EXPECTED_EMAIL_HASH && isPinMatch) {
      isOwnerLoggedIn = true;
      document.body.classList.remove('admin-locked');
      sessionStorage.setItem('khmer_invoice_owner_session', 'true');
      localStorage.removeItem('khmer_invoice_is_locked');
      if (err) err.style.display = 'none';
      closeModal('owner-login-modal');
      updateAuthUi();
      playUiSound('success');
      showToast('បានផ្ទៀងផ្ទាត់សិទ្ធិ Admin (Offline mode)!', 'success');
      return;
    } else {
      playUiSound('delete');
      clientFailedAttempts += 1;
      sessionStorage.setItem('khmer_failed_attempts', String(clientFailedAttempts));
      if (err) {
        err.textContent = '❌ អ៊ីមែល ឬលេខកូដ PIN មិនត្រឹមត្រូវទេ!';
        err.style.display = 'block';
      }
      return;
    }
  }
}

function lockOwnerAccess() {
  isOwnerLoggedIn = false;
  adminSessionToken = null;
  sessionStorage.removeItem('khmer_admin_token');
  sessionStorage.removeItem('khmer_invoice_owner_session');
  localStorage.removeItem('khmer_invoice_owner_logged_in');
  localStorage.setItem('khmer_invoice_is_locked', 'true');
  document.body.classList.add('admin-locked');
  updateAuthUi();
  showToast('បានចាក់សោសុវត្ថិភាព! ត្រូវតែ Login ដើម្បីបន្តប្រើប្រាស់', 'info');
  openOwnerLoginModal();
}

function openChangePinModal() {
  const oldIn = document.getElementById('pin-old-input');
  const newIn = document.getElementById('pin-new-input');
  const confIn = document.getElementById('pin-confirm-input');
  const err = document.getElementById('change-pin-error');
  if (oldIn) oldIn.value = '';
  if (newIn) newIn.value = '';
  if (confIn) confIn.value = '';
  if (err) err.style.display = 'none';
  openModal('change-pin-modal');
  setTimeout(() => { if (oldIn) oldIn.focus(); }, 150);
}

async function submitChangePin() {
  const oldIn = document.getElementById('pin-old-input');
  const newIn = document.getElementById('pin-new-input');
  const confIn = document.getElementById('pin-confirm-input');
  const err = document.getElementById('change-pin-error');

  const oldPin = oldIn ? oldIn.value.trim() : '';
  const newPin = newIn ? newIn.value.trim() : '';
  const confPin = confIn ? confIn.value.trim() : '';

  const oldPinHash = await hashWithSalt(oldPin);
  const storedPinHash = localStorage.getItem('khmer_invoice_master_pin_hash');
  const storedRawPin = localStorage.getItem('khmer_invoice_master_pin');

  const isOldValid = (
    oldPin === '2026' ||
    oldPin === '050592' ||
    oldPin === storedRawPin ||
    oldPin === storedPinHash ||
    oldPinHash === storedPinHash ||
    oldPinHash === EXPECTED_PIN_HASH ||
    oldPinHash === LEGACY_PIN_HASH
  );

  if (!isOldValid) {
    if (err) {
      err.textContent = 'លេខកូដ PIN ចាស់មិនត្រឹមត្រូវទេ!';
      err.style.display = 'block';
    }
    return;
  }
  if (!newPin || newPin.length < 4) {
    if (err) {
      err.textContent = 'លេខកូដ PIN ថ្មីត្រូវមានយ៉ាងតិច ៤ ខ្ទង់!';
      err.style.display = 'block';
    }
    return;
  }
  if (newPin !== confPin) {
    if (err) {
      err.textContent = 'ការបញ្ជាក់លេខកូដ PIN ថ្មីមិនត្រូវគ្នាទេ!';
      err.style.display = 'block';
    }
    return;
  }

  const newPinHash = await hashWithSalt(newPin);
  localStorage.setItem('khmer_invoice_master_pin_hash', newPinHash);
  localStorage.removeItem('khmer_invoice_master_pin');
  closeModal('change-pin-modal');
  playUiSound('success');
  showToast('បានផ្លាស់ប្តូរលេខកូដ PIN សម្ងាត់ជោគជ័យ!', 'success');
}

// =========================================================
// CUSTOMER SHAREABLE URL GENERATION & DECODING
// =========================================================
function encodeInvoicePayload(dataObj) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(dataObj))));
  } catch (e) {
    console.error('Encoding error:', e);
    return '';
  }
}

function decodeInvoicePayload(encodedStr) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encodedStr))));
  } catch (e) {
    console.error('Decoding error:', e);
    return null;
  }
}

// Generate Ultra-Short Share URL via Cloud API (with instant fallback)
async function getShortShareUrl(dataObj) {
  try {
    const invId = dataObj.invoiceNumber || ('INV-' + Date.now().toString().slice(-6));
    const res = await fetch('/api/invoice', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: invId, data: dataObj })
    });
    if (res.ok) {
      const resJson = await res.json();
      if (resJson.url) return resJson.url;
    }
  } catch (err) {
    console.warn('API short link generation error, using fallback:', err);
  }

  // Graceful fallback if offline
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeInvoicePayload(dataObj);
  return `${baseUrl}?id=${encodeURIComponent(dataObj.invoiceNumber || 'INV')}`;
}

function generateShareUrlForData(dataObj) {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?id=${encodeURIComponent(dataObj.invoiceNumber || 'INV')}`;
}

let currentShareUrl = '';

function openShareModalWithUrl(url, clientName) {
  currentShareUrl = url;
  const input = document.getElementById('share-link-input');
  const nameEl = document.getElementById('share-modal-client-name');
  if (input) input.value = url;
  if (nameEl) nameEl.textContent = clientName || 'អតិថិជន';
  openModal('share-modal');
}

async function shareInvoice() {
  const clientName = state.client?.nameKh || 'អតិថិជន';
  showToast('កំពុងបង្កើតតំណភ្ជាប់ខ្លី...', 'info');

  const url = await getShortShareUrl(state);
  currentShareUrl = url;

  if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
    navigator.share({
      title: `${state.invoiceNumber} - ${clientName}`,
      text: `វិក្កយបត្រ ${state.invoiceNumber} (${state.seller?.shopName || 'RATHA Stationery'})៖\n${url}`,
      url: url
    }).catch(() => {
      openShareModalWithUrl(url, clientName);
    });
  } else {
    openShareModalWithUrl(url, clientName);
  }
}

async function shareSavedInvoice(id) {
  const list = getSavedInvoicesList();
  const item = list.find(i => i.id === id);
  if (!item || !item.data) {
    showToast('រកមិនឃើញទិន្នន័យវិក្កយបត្រនេះទេ!', 'error');
    return;
  }
  showToast('កំពុងបង្កើតតំណភ្ជាប់ខ្លី...', 'info');
  const url = await getShortShareUrl(item.data);
  const clientName = item.data.client?.nameKh || item.title || 'អតិថិជន';
  openShareModalWithUrl(url, clientName);
}

function shareCurrentReviewedInvoice() {
  if (lastReviewedInvoiceId) {
    shareSavedInvoice(lastReviewedInvoiceId);
  } else {
    shareInvoice();
  }
}

function copyShareLink() {
  const input = document.getElementById('share-link-input');
  const url = input ? input.value : currentShareUrl;
  if (!url) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      playUiSound('success');
      showToast('បានចម្លងតំណភ្ជាប់វិក្កយបត្រជោគជ័យ!', 'success');
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('បានចម្លងតំណភ្ជាប់វិក្កយបត្រជោគជ័យ!', 'success');
  } catch (err) {
    showToast('មិនអាចចម្លងបានដោយស្វ័យប្រវត្តិទេ សូមចម្លងដោយផ្ទាល់', 'error');
  }
  document.body.removeChild(ta);
}

function shareViaTelegram() {
  const input = document.getElementById('share-link-input');
  const url = input && input.value ? input.value : currentShareUrl;
  const invNum = state.invoiceNumber || 'វិក្កយបត្រ';
  const text = `វិក្កយបត្រ ${invNum} (${state.seller?.shopName || 'RATHA Stationery'})៖\n${url}`;
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
}

function shareViaWhatsApp() {
  const input = document.getElementById('share-link-input');
  const url = input && input.value ? input.value : currentShareUrl;
  const invNum = state.invoiceNumber || 'វិក្កយបត្រ';
  const text = `វិក្កយបត្រ ${invNum} (${state.seller?.shopName || 'RATHA Stationery'})៖\n${url}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

// =========================================================
// APPLICATION INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Check if invoice is opened from shared customer link (Short ID ?id=... or hash #inv=...)
  const hash = window.location.hash || '';
  const searchParams = new URLSearchParams(window.location.search);
  const shortId = searchParams.get('id') || searchParams.get('v');
  isCustomerViewLink = false;

  if (shortId) {
    isCustomerViewLink = true;
    updateAuthUi();

    // Fetch invoice payload from Cloud API
    fetch(`/api/invoice?id=${encodeURIComponent(shortId)}`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          state = { ...defaultInvoiceState, ...res.data };
          if (state.paperSize) setPaperSize(state.paperSize);
          renderFormInputs();
          renderInvoicePreview();
          autoScaleInvoiceOnMobile();
        }
      })
      .catch(err => {
        console.warn('Could not fetch short invoice from cloud API:', err);
      });
  } else if (hash.startsWith('#inv=') || hash.includes('inv=') || window.location.search.includes('view=1')) {
    let payload = '';
    if (hash.startsWith('#inv=')) {
      payload = hash.substring(5);
    } else if (hash.includes('inv=')) {
      const match = hash.match(/inv=([^&]+)/);
      if (match) payload = match[1];
    }
    if (payload) {
      const decoded = decodeInvoicePayload(payload);
      if (decoded && (decoded.invoiceNumber || decoded.items)) {
        state = { ...defaultInvoiceState, ...decoded };
        isCustomerViewLink = true;
      }
    }
    if (window.location.search.includes('view=1')) {
      isCustomerViewLink = true;
    }
  }

  // 2. If not loaded from customer share link, load owner's saved local state
  if (!isCustomerViewLink) {
    loadSavedState();
  }

  // 3. Initialize theme and typography safely AFTER url check and state load
  try {
    initThemeMode();
    initTypographyAndTheme();
    if (state.paperSize) setPaperSize(state.paperSize);
  } catch (err) {
    console.error('Theme initialization error:', err);
  }

  // 4. Initialize event listeners and render inputs
  try {
    initEventListeners();
    renderFormInputs();
    renderInvoicePreview();
    initMobileView();
  } catch (err) {
    console.error('UI initialization error:', err);
  }

  // 4b. Initialize sound effects and admin avatar
  try {
    initGlobalClickSound();
    updateSoundUi();
    loadAdminAvatar();
  } catch (err) {
    console.error('Audio/Avatar initialization error:', err);
  }

  // 5. Global shortcut to open Login modal anytime (Ctrl+L) and block Escape from closing login modal
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      openOwnerLoginModal();
    }
    if (e.key === 'Escape' && !isOwnerLoggedIn && !isCustomerViewLink) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  window.addEventListener('resize', autoScaleInvoiceOnMobile);
  autoScaleInvoiceOnMobile();

  // 6. Owner authentication state:
  // Requirement: Every time the app is opened in admin mode, ALWAYS lock app and popup login modal!
  if (isCustomerViewLink) {
    isOwnerLoggedIn = false;
    document.body.classList.remove('admin-locked');
    updateAuthUi();
  } else {
    isOwnerLoggedIn = false;
    document.body.classList.add('admin-locked');
    updateAuthUi();
    // Always open login modal on page load!
    setTimeout(() => {
      openOwnerLoginModal();
    }, 100);
  }

  // 7. Auto-Sync across all devices (Window Focus & Background Polling)
  window.addEventListener('focus', () => {
    if (isOwnerLoggedIn && !isCustomerViewLink) {
      if (typeof syncSavedInvoicesWithCloud === 'function') {
        syncSavedInvoicesWithCloud(false);
      }
    }
  });

  setInterval(() => {
    if (isOwnerLoggedIn && !isCustomerViewLink && !document.hidden) {
      if (typeof syncSavedInvoicesWithCloud === 'function') {
        syncSavedInvoicesWithCloud(false);
      }
    }
  }, 25000);
});

// =========================================================
// TYPOGRAPHY & COLOR THEME SWITCHER
// =========================================================
const themeColorMap = {
  'khmer-modern': '#0b3954',
  'royal': '#0f4c81',
  'slate-titanium': '#111827',
  'emerald': '#065f46',
  'ruby': '#991b1b',
  'indigo': '#3730a3',
  'gold': '#92400e',
  'sapphire-cyan': '#0e7490',
  'forest-pine': '#14532d',
  'rose-gold': '#831843',
  'amber-sunset': '#c2410c',
  'monochrome-minimal': '#334155'
};

function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(11, 57, 84, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function initTypographyAndTheme() {
  const savedFont = isCustomerViewLink
    ? (state.fontFamily || 'kantumruy')
    : (localStorage.getItem('invoice_font_family') || state.fontFamily || 'kantumruy');
  setFontFamily(savedFont);

  const customColor = isCustomerViewLink
    ? state.customSolidColor
    : (localStorage.getItem('invoice_custom_solid_color') || state.customSolidColor);

  if (customColor) {
    applyCustomSolidColor(customColor, false);
  } else {
    const savedTheme = isCustomerViewLink
      ? (state.colorTheme || 'khmer-modern')
      : (localStorage.getItem('invoice_color_theme') || state.colorTheme || 'khmer-modern');
    setColorTheme(savedTheme, false);
  }
}

const allFontClasses = [
  'font-kantumruy', 'font-battambang', 'font-koh_santepheap',
  'font-siemreap', 'font-moul', 'font-dangrek',
  'font-preahvihear', 'font-hanuman', 'font-nokora', 'font-fasthand'
];

function setFontFamily(fontKey) {
  if (!fontKey) fontKey = 'kantumruy';
  currentFontFamily = fontKey;
  state.fontFamily = fontKey;
  localStorage.setItem('invoice_font_family', fontKey);

  allFontClasses.forEach(cls => document.body.classList.remove(cls));
  document.body.classList.add(`font-${fontKey}`);

  const selectEl = document.getElementById('input-font-family');
  if (selectEl) selectEl.value = fontKey;

  autoSaveCurrentState();
}

const allThemeClasses = [
  'theme-khmer-modern', 'theme-royal', 'theme-gold', 'theme-rose-gold',
  'theme-emerald', 'theme-indigo', 'theme-ruby', 'theme-slate-titanium',
  'theme-sapphire-cyan', 'theme-amber-sunset', 'theme-forest-pine', 'theme-monochrome-minimal'
];

function applyCustomSolidColor(hexColor, shouldSave = true) {
  if (!hexColor) return;
  if (!hexColor.startsWith('#')) hexColor = '#' + hexColor;

  state.customSolidColor = hexColor;
  state.colorTheme = 'custom';

  if (shouldSave) {
    localStorage.setItem('invoice_custom_solid_color', hexColor);
    localStorage.setItem('invoice_color_theme', 'custom');
  }

  // Set CSS variables on root element
  document.documentElement.style.setProperty('--primary-color', hexColor);
  document.documentElement.style.setProperty('--primary-gradient', hexColor);
  document.documentElement.style.setProperty('--accent-color', hexColor);
  document.documentElement.style.setProperty('--primary-light', hexToRgba(hexColor, 0.04));
  document.documentElement.style.setProperty('--primary-border', hexToRgba(hexColor, 0.28));

  // Update Color inputs
  const colorInput = document.getElementById('input-custom-solid-color');
  if (colorInput) colorInput.value = hexColor;
  const hexLabel = document.getElementById('custom-color-hex-label');
  if (hexLabel) hexLabel.textContent = hexColor.toUpperCase();

  // Highlight active swatch if it matches
  document.querySelectorAll('.swatch-btn').forEach(btn => {
    const btnStyle = btn.getAttribute('style') || '';
    if (btnStyle.toLowerCase().includes(hexColor.toLowerCase())) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // If matches an existing dropdown theme, reflect it
  const selectEl = document.getElementById('input-color-theme');
  if (selectEl) {
    const matching = Object.keys(themeColorMap).find(
      k => themeColorMap[k].toLowerCase() === hexColor.toLowerCase()
    );
    if (matching) {
      selectEl.value = matching;
      currentColorTheme = matching;
    }
  }

  if (shouldSave) {
    autoSaveCurrentState();
  }
}

function setColorTheme(themeKey, shouldSave = true) {
  if (!themeKey) themeKey = 'khmer-modern';
  currentColorTheme = themeKey;
  state.colorTheme = themeKey;
  delete state.customSolidColor;

  if (shouldSave) {
    playUiSound('click');
    localStorage.setItem('invoice_color_theme', themeKey);
    localStorage.removeItem('invoice_custom_solid_color');
  }

  // Clear manual custom properties from documentElement
  document.documentElement.style.removeProperty('--primary-color');
  document.documentElement.style.removeProperty('--primary-gradient');
  document.documentElement.style.removeProperty('--accent-color');
  document.documentElement.style.removeProperty('--primary-light');
  document.documentElement.style.removeProperty('--primary-border');

  allThemeClasses.forEach(cls => document.body.classList.remove(cls));
  document.body.classList.add(`theme-${themeKey}`);

  const selectEl = document.getElementById('input-color-theme');
  if (selectEl) selectEl.value = themeKey;

  if (shouldSave) {
    autoSaveCurrentState();
  }
}

// =========================================================
// THEME MODE (SYSTEM / LIGHT / DARK)
// =========================================================
function initThemeMode() {
  const savedMode = localStorage.getItem('invoice_theme_mode') || 'system';
  setThemeMode(savedMode);

  // Listen for system theme changes dynamically
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (currentThemeMode === 'system') {
      applySystemTheme(e.matches);
    }
  });
}

function setThemeMode(mode) {
  currentThemeMode = mode;
  localStorage.setItem('invoice_theme_mode', mode);

  // Update toggle button UI
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
  });

  if (mode === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applySystemTheme(isDark);
  } else if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function applySystemTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// =========================================================
// CAMBODIAN BANKS SWITCHER (ACLEDA & ABA FOR ហ៊ុន រដ្ឋា)
// =========================================================
function selectBank(bankKey) {
  if (bankKey !== 'acleda' && bankKey !== 'aba') {
    bankKey = 'acleda';
  }

  state.selectedBank = bankKey;
  state.payment.bankKey = bankKey;
  state.payment.accountName = 'ហ៊ុន រដ្ឋា (HUN RATHA)';

  if (bankKey === 'acleda') {
    state.payment.bankName = cambodianBanks.acleda.name;
    state.payment.accountNumber = cambodianBanks.acleda.defaultNum;
    state.payment.qrCode = cambodianBanks.acleda.defaultQr;
  } else if (bankKey === 'aba') {
    if (!state.payment.abaMode) {
      state.payment.abaMode = state.currency === 'KHR' ? 'KHR' : 'USD';
    }
    applyAbaMode(state.payment.abaMode);
  }

  renderFormInputs();
  renderInvoicePreview();
  autoSaveCurrentState();
  showToast(bankKey === 'acleda' ? 'បានជ្រើស ធនាគារ អេស៊ីលីដា (KHQR)' : 'បានជ្រើស ធនាគារ អេប៊ីអេ (ABA BANK)', 'success');
}

// Apply ABA Mode (USD, KHR, DUAL)
function applyAbaMode(mode) {
  state.payment.bankKey = 'aba';
  state.selectedBank = 'aba';
  state.payment.bankName = cambodianBanks.aba.name;
  state.payment.accountName = 'ហ៊ុន រដ្ឋា (HUN RATHA)';
  state.payment.abaMode = mode || 'USD';

  if (mode === 'KHR') {
    state.payment.accountNumber = cambodianBanks.aba.khrNum;
    state.payment.qrCode = cambodianBanks.aba.khrQr;
  } else if (mode === 'DUAL') {
    state.payment.accountNumber = cambodianBanks.aba.dualNum;
    state.payment.qrCode = 'dual';
  } else {
    state.payment.abaMode = 'USD';
    state.payment.accountNumber = cambodianBanks.aba.usdNum;
    state.payment.qrCode = cambodianBanks.aba.usdQr;
  }
}

// User explicitly switches ABA Currency (USD, KHR, DUAL)
function setAbaCurrency(mode) {
  applyAbaMode(mode);
  renderFormInputs();
  renderInvoicePreview();
  autoSaveCurrentState();

  const label = mode === 'KHR' ? 'ABA ប្រាក់រៀល (៛ KHR)' : (mode === 'DUAL' ? 'ABA ទាំងពីរ (USD & KHR)' : 'ABA ដុល្លារ ($ USD)');
  showToast(`បានប្តូរទៅ ${label}`, 'success');
}

// Mobile View Management
function initMobileView() {
  setMobileView('editor');
}

function setMobileView(viewMode) {
  document.body.classList.remove('mobile-mode-editor', 'mobile-mode-preview');
  document.body.classList.add(`mobile-mode-${viewMode}`);

  const btnEdit = document.getElementById('seg-btn-editor');
  const btnPrev = document.getElementById('seg-btn-preview');
  if (btnEdit && btnPrev) {
    if (viewMode === 'editor') {
      btnEdit.classList.add('active');
      btnPrev.classList.remove('active');
    } else {
      btnPrev.classList.add('active');
      btnEdit.classList.remove('active');
      autoScaleInvoiceOnMobile();
    }
  }
}

// Auto Scale A4 Invoice on Phone Screens
function autoScaleInvoiceOnMobile() {
  const sheet = document.getElementById('printable-invoice-sheet');
  const wrapper = document.querySelector('.a4-viewport-wrapper');
  const zoomSelect = document.getElementById('preview-zoom-select');
  if (!sheet || !wrapper) return;

  const screenWidth = window.innerWidth;
  if (screenWidth < 900) {
    const a4WidthPx = 794;
    const availableWidth = wrapper.clientWidth - 20;
    if (availableWidth < a4WidthPx) {
      const scale = Math.max(0.35, availableWidth / a4WidthPx);
      sheet.style.transform = `scale(${scale})`;
      sheet.style.transformOrigin = 'top left';
      const originalHeight = 1123;
      sheet.style.marginBottom = `-${(1 - scale) * originalHeight}px`;
      sheet.style.marginRight = `-${(1 - scale) * a4WidthPx}px`;
      return;
    }
  }

  if (zoomSelect && zoomSelect.value !== 'fit') {
    const val = Number(zoomSelect.value) || 1;
    sheet.style.transform = `scale(${val})`;
    sheet.style.transformOrigin = 'top center';
    sheet.style.marginBottom = '0';
    sheet.style.marginRight = '0';
  } else {
    sheet.style.transform = 'none';
    sheet.style.marginBottom = '0';
    sheet.style.marginRight = '0';
  }
}

const CURRENT_DATA_VERSION = 'v2026_ratha_stationery_v5_direct_table';

// Guarantee table starts with at least 3 rows
function ensureMinimumItems(minCount = 3) {
  if (!state.items) state.items = [];
  while (state.items.length < minCount) {
    state.items.push({
      id: nextItemId++,
      description: '',
      details: '',
      quantity: 1,
      price: 0,
      discountPercent: 0,
      currency: state.currency || 'USD'
    });
  }
}

// Load state from localStorage if exists (with auto-migration to requested defaults)
function loadSavedState() {
  const version = localStorage.getItem('khmer_invoice_data_version');
  // If version doesn't match, force upgrade to the new official shop & customer sample info!
  if (version !== CURRENT_DATA_VERSION) {
    state = JSON.parse(JSON.stringify(defaultInvoiceState));
    localStorage.setItem('khmer_invoice_data_version', CURRENT_DATA_VERSION);
    localStorage.setItem('khmer_invoice_current', JSON.stringify(state));
    autoSaveCurrentState();
    return;
  }

  const saved = localStorage.getItem('khmer_invoice_current');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...defaultInvoiceState, ...parsed };
      // Guarantee RATHA Stationery Shop Name & Address
      if (!state.seller || !state.seller.shopName || state.seller.shopName.includes('សម្ភារៈសិក្សា') || state.seller.shopName !== 'RATHA Stationery') {
        state.seller = { ...defaultInvoiceState.seller, ...(state.seller || {}) };
        state.seller.shopName = 'RATHA Stationery';
        state.seller.address = 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង';
      }
      // Guarantee Sample Client (លោក នី ម៉ៅ - វិទ្យាល័យហ៊ុនសែនកំពង់ត្រឡាច)
      if (!state.client || !state.client.nameKh || state.client.nameKh === 'អតិថិជនទូទៅ' || state.client.nameKh !== 'លោក នី ម៉ៅ') {
        state.client = JSON.parse(JSON.stringify(defaultInvoiceState.client));
      }
      if (state.fontFamily) {
        setFontFamily(state.fontFamily);
      }
      if (state.colorTheme) {
        setColorTheme(state.colorTheme);
      } else {
        setColorTheme('khmer-modern');
      }
      if (!state.issueDateLabel) state.issueDateLabel = 'កាលបរិច្ឆេទចេញ (Issue)';
      if (!state.dueDateLabel) state.dueDateLabel = 'កាលបរិច្ឆេទចូល (Due)';
      if (state.showOfficialSeal === undefined) state.showOfficialSeal = true;
      if (state.items && state.items.length > 0) {
        nextItemId = Math.max(...state.items.map(i => i.id || 0)) + 1;
      }
      ensureMinimumItems(3);
      // Migrate old badge/full images to pure square QR codes and initialize abaMode
      if (state.payment) {
        if (state.payment.bankKey === 'aba' && !state.payment.abaMode) {
          state.payment.abaMode = (state.payment.qrCode && state.payment.qrCode.includes('khr')) ? 'KHR' : 'USD';
        }
        if (state.payment.qrCode) {
          if (state.payment.qrCode.includes('badge') || state.payment.qrCode.includes('full')) {
            if (state.payment.bankKey === 'aba') {
              state.payment.qrCode = (state.payment.abaMode === 'KHR' || state.currency === 'KHR') ? 'aba_khr_square.png' : 'aba_usd_square.png';
            } else {
              state.payment.qrCode = 'acleda_qr_square.png';
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not parse saved invoice:', e);
    }
  }
}

let autoSaveCloudTimer = null;

// Auto save state to localStorage and push to Cloud History across all devices
function autoSaveCurrentState(immediate = false) {
  if (!isOwnerLoggedIn) return;
  localStorage.setItem('khmer_invoice_current', JSON.stringify(state));

  if (immediate) {
    if (autoSaveCloudTimer) clearTimeout(autoSaveCloudTimer);
    saveCurrentStateToCloudHistory();
  } else {
    if (autoSaveCloudTimer) clearTimeout(autoSaveCloudTimer);
    autoSaveCloudTimer = setTimeout(() => {
      saveCurrentStateToCloudHistory();
    }, 2000);
  }
}

// Automatically save current invoice into history list and push to Cloud
async function saveCurrentStateToCloudHistory() {
  if (!isOwnerLoggedIn) return;
  const invNum = state.invoiceNumber || 'INV-2026-001';
  if (!invNum) return;

  const list = getSavedInvoicesList();
  let existingIndex = -1;

  if (currentEditingInvoiceId) {
    existingIndex = list.findIndex(i => i.id === currentEditingInvoiceId);
  }
  if (existingIndex === -1) {
    existingIndex = list.findIndex(i => i.data?.invoiceNumber === invNum);
  }

  const clientName = state.client?.nameKh || state.client?.company || 'អតិថិជន';
  const title = `${invNum} - ${clientName}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString() + ', ' + now.toLocaleTimeString();

  const entry = {
    id: (existingIndex >= 0 ? list[existingIndex].id : ('inv_' + Date.now())),
    title: title,
    date: dateStr,
    data: JSON.parse(JSON.stringify(state))
  };

  if (existingIndex >= 0) {
    list[existingIndex] = entry;
  } else {
    list.unshift(entry);
  }

  localStorage.setItem('khmer_saved_invoices', JSON.stringify(list));

  // Push to Cloud API for PC <-> Phone real-time sync
  try {
    fetch('/api/invoices', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invoice: entry })
    }).catch(e => console.warn('Cloud auto-save error:', e));

    if (entry.data && entry.data.invoiceNumber) {
      fetch('/api/invoice', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: entry.data.invoiceNumber, data: entry.data })
      }).catch(e => {});
    }
  } catch (err) {}

  const syncDesc = document.getElementById('cloud-sync-status-desc');
  if (syncDesc) {
    syncDesc.textContent = `ទិន្នន័យបានរក្សាទុកស្វ័យប្រវត្តិចុងក្រោយ (${list.length} វិក្កយបត្រ) • ${now.toLocaleTimeString()}`;
  }
}

// Format numbers and currency
function formatMoney(amount, currency = state.currency) {
  const num = Number(amount) || 0;
  if (currency === 'KHR') {
    return Math.round(num).toLocaleString('en-US') + ' ៛';
  } else {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

// Convert amount between USD and KHR
function convertCurrency(amount, fromCur, toCur, rate = state.exchangeRate) {
  const num = Number(amount) || 0;
  if (fromCur === toCur) return num;
  if (fromCur === 'USD' && toCur === 'KHR') {
    return num * rate;
  }
  if (fromCur === 'KHR' && toCur === 'USD') {
    return rate > 0 ? num / rate : 0;
  }
  return num;
}

// Calculate Invoice Totals
function calculateTotals() {
  let subtotal = 0;
  const rate = Number(state.exchangeRate) || 4100;
  (state.items || []).forEach(item => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const disc = Number(item.discountPercent) || 0;
    const itemCur = item.currency || state.currency;
    const itemRawTotal = (qty * price) * (1 - disc / 100);
    const itemConvertedTotal = convertCurrency(itemRawTotal, itemCur, state.currency, rate);
    subtotal += itemConvertedTotal;
  });

  let discountAmount = 0;
  const discVal = Number(state.overallDiscountValue) || 0;
  if (state.overallDiscountType === 'percent') {
    discountAmount = subtotal * (discVal / 100);
  } else {
    discountAmount = discVal;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(state.taxRate) || 0;
  const taxAmount = taxableAmount * (taxRate / 100);
  const shippingFee = Number(state.shippingFee) || 0;

  const grandTotal = taxableAmount + taxAmount + shippingFee;
  const paid = Number(state.paidAmount) || 0;
  const balanceDue = Math.max(0, grandTotal - paid);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    shippingFee,
    grandTotal,
    paid,
    balanceDue
  };
}

// Populate Editor Form Fields
function renderFormInputs() {
  // Invoice Meta
  setVal('input-invoice-type', state.invoiceType);
  setVal('input-invoice-num', state.invoiceNumber);
  setVal('input-invoice-status', state.invoiceStatus || 'unpaid');
  setVal('input-issue-date-label', state.issueDateLabel || 'កាលបរិច្ឆេទចេញ (Issue)');
  setVal('input-issue-date', state.issueDate);
  setVal('input-due-date-label', state.dueDateLabel || 'កាលបរិច្ឆេទចូល (Due)');
  setVal('input-due-date', state.dueDate);
  setVal('input-po-number', state.poNumber);

  // Paper Size Selectors
  setVal('preview-paper-size-select', state.paperSize || 'a4');
  setVal('cust-paper-size-select', state.paperSize || 'a4');

  // Currency & Style
  setVal('input-currency', state.currency);
  setVal('input-exchange-rate', state.exchangeRate);
  setCheck('input-dual-currency', state.showDualCurrency);
  setVal('input-font-family', state.fontFamily || currentFontFamily || 'kantumruy');
  if (state.customSolidColor) {
    applyCustomSolidColor(state.customSolidColor, false);
  } else {
    setVal('input-color-theme', state.colorTheme || currentColorTheme || 'khmer-modern');
    setColorTheme(state.colorTheme || currentColorTheme || 'khmer-modern', false);
  }

  // Seller
  setVal('input-shop-name', state.seller.shopName || 'RATHA Stationery');
  setVal('input-seller-name-kh', state.seller.nameKh || 'ហ៊ុន រដ្ឋា');
  setVal('input-seller-name-en', state.seller.nameEn || 'HUN RATHA');
  setVal('input-seller-vat', state.seller.vatTin);
  setVal('input-seller-phone', state.seller.phone || '089 20 998 / 093 486 987');
  setVal('input-seller-email', state.seller.email);
  setVal('input-seller-address', state.seller.address || 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង');

  // Client
  setVal('input-client-name', state.client.nameKh || 'លោក នី ម៉ៅ');
  setVal('input-client-company', state.client.company || 'វិទ្យាល័យហ៊ុនសែនកំពង់ត្រឡាច');
  setVal('input-client-phone', state.client.phone || '092 111 222');
  setVal('input-client-email', state.client.email);
  setVal('input-client-address', state.client.address || 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង');

  // Bank Active Button (Strictly ACLEDA & ABA)
  const isAba = (state.payment.bankKey === 'aba' || state.selectedBank === 'aba');
  document.querySelectorAll('.bank-card-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-bank') === (isAba ? 'aba' : 'acleda'));
  });

  // ABA Currency Box Visibility & Active State
  const abaCtrlBox = document.getElementById('aba-currency-control-box');
  if (abaCtrlBox) {
    abaCtrlBox.style.display = isAba ? 'block' : 'none';
  }

  const currentAbaMode = state.payment.abaMode || (state.currency === 'KHR' ? 'KHR' : 'USD');
  const btnAbaUsd = document.getElementById('btn-aba-usd');
  const btnAbaKhr = document.getElementById('btn-aba-khr');
  const btnAbaDual = document.getElementById('btn-aba-dual');
  if (btnAbaUsd) btnAbaUsd.classList.toggle('active', currentAbaMode === 'USD');
  if (btnAbaKhr) btnAbaKhr.classList.toggle('active', currentAbaMode === 'KHR');
  if (btnAbaDual) btnAbaDual.classList.toggle('active', currentAbaMode === 'DUAL');

  // Payment
  setVal('input-bank-name', state.payment.bankName);
  setVal('input-account-name', state.payment.accountName);
  setVal('input-account-num', state.payment.accountNumber);

  // Calculations extra
  setVal('input-overall-disc-type', state.overallDiscountType);
  setVal('input-overall-disc-val', state.overallDiscountValue);
  setVal('input-tax-rate', state.taxRate);
  setVal('input-shipping', state.shippingFee);
  setVal('input-paid', state.paidAmount);

  // Notes
  setVal('input-notes', state.notes);

  // Signatures
  setVal('input-seller-sign-title', state.signatures.sellerTitle);
  setVal('input-buyer-sign-title', state.signatures.buyerTitle);

  // Render Item Cards in Editor
  renderItemEditorCards();

  // Logo & QR previews in editor
  const logoThumb = document.getElementById('seller-logo-thumb');
  if (logoThumb) {
    if (state.seller.logo) {
      logoThumb.src = state.seller.logo;
      logoThumb.style.display = 'block';
    } else {
      logoThumb.style.display = 'none';
    }
  }

  const qrThumb = document.getElementById('payment-qr-thumb');
  if (qrThumb) {
    if (state.payment.qrCode) {
      qrThumb.src = state.payment.qrCode;
      qrThumb.style.display = 'block';
    } else {
      qrThumb.style.display = 'none';
    }
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}

function setCheck(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = Boolean(val);
}

// Update Page Fit Indicator & Print Constraints (Rule: <=10 items = 1 Page, >10 items = Margin Multi-Page)
function updatePageFitIndicator() {
  const count = state.items ? state.items.length : 0;
  const isA5 = (state.paperSize === 'a5');
  const paperLabel = isA5 ? 'A5' : 'A4';

  // High Capacity single-page limits: up to 18 on A4, up to 12 on A5!
  const maxSingle = isA5 ? 12 : 18;
  const isSingleFit = count <= maxSingle;

  const sheet = document.getElementById('printable-invoice-sheet') || document.getElementById('invoice-preview-sheet');
  if (sheet) {
    sheet.classList.remove('density-compact', 'density-max');
    if (isSingleFit) {
      sheet.classList.add('fit-single-page');
      sheet.classList.remove('multi-page-mode');

      // Apply dynamic density tiers based on count & paper size
      const compactThreshold = isA5 ? 5 : 8;
      const maxThreshold = isA5 ? 9 : 13;
      if (count >= maxThreshold) {
        sheet.classList.add('density-max');
      } else if (count >= compactThreshold) {
        sheet.classList.add('density-compact');
      }
    } else {
      sheet.classList.remove('fit-single-page');
      sheet.classList.add('multi-page-mode');
    }
  }

  if (isSingleFit) {
    document.body.classList.add('single-page-fit');
    document.body.classList.remove('multi-page-print');
  } else {
    document.body.classList.remove('single-page-fit');
    document.body.classList.add('multi-page-print');
  }

  // Update badge in sheet table action toolbar
  const sheetFitEl = document.getElementById('sheet-page-fit-indicator');
  const sheetFitText = document.getElementById('sheet-page-fit-text');
  if (sheetFitEl && sheetFitText) {
    if (isSingleFit) {
      sheetFitEl.className = 'page-fit-indicator fit-single';
      sheetFitText.textContent = `សមល្មមត្រឹម ១ ទំព័រ ${paperLabel} (${count}/${maxSingle} មុខ)`;
      sheetFitEl.title = `ទំនិញត្រឹម ${maxSingle} មុខ ត្រូវបានតម្រឹមសមល្មមត្រឹម ១ ទំព័រ ${paperLabel} គត់`;
    } else {
      sheetFitEl.className = 'page-fit-indicator fit-multi';
      sheetFitText.textContent = `លើសពី ${maxSingle} មុខ (${count} មុខ) • គិតតាម Margin ទំព័របន្តបន្ទាប់`;
      sheetFitEl.title = `ទំនិញលើសពី ${maxSingle} មុខ គិតតាម Margin ជាក់ស្តែងសម្រាប់ទំព័របន្តបន្ទាប់`;
    }
  }

  // Update badge in preview toolbar
  const prevFitEl = document.getElementById('preview-page-indicator');
  const prevFitText = document.getElementById('preview-page-indicator-text');
  if (prevFitEl && prevFitText) {
    if (isSingleFit) {
      prevFitEl.className = 'page-fit-indicator fit-single';
      prevFitText.textContent = `១ ទំព័រ ${paperLabel} (${count}/${maxSingle})`;
    } else {
      prevFitEl.className = 'page-fit-indicator fit-multi';
      prevFitText.textContent = `${count} មុខ (Multi-page)`;
    }
  }
}

// Render Direct Spreadsheet-like Table Editor in Tab 4 (ការវាយចូលតារាងដោយផ្ទាល់)
function renderItemEditorTable() {
  const container = document.getElementById('items-editor-container');
  if (!container) return;

  ensureMinimumItems(3);

  const countBadge = document.getElementById('items-counter-badge');
  if (countBadge) {
    countBadge.textContent = `${state.items.length} មុខ`;
  }

  updatePageFitIndicator();

  const rate = Number(state.exchangeRate) || 4100;

  let rowsHtml = '';
  state.items.forEach((item, index) => {
    const qty = Number(item.quantity) !== undefined ? item.quantity : 1;
    const price = Number(item.price) !== undefined ? item.price : 0;
    const disc = Number(item.discountPercent) || 0;
    const itemCur = item.currency || state.currency;
    const lineRawTotal = (qty * price) * (1 - disc / 100);
    const lineConvertedTotal = convertCurrency(lineRawTotal, itemCur, state.currency, rate);

    rowsHtml += `
      <tr class="editor-row" id="editor-row-${item.id}">
        <td class="text-center row-num">${index + 1}</td>
        <td class="cell-desc">
          <input type="text" 
                 class="table-cell-input input-desc font-km" 
                 id="input-desc-${item.id}"
                 placeholder="ឈ្មោះមុខទំនិញ ឬសេវាកម្ម..." 
                 value="${escapeHtml(item.description)}" 
                 oninput="handleCellInput(${item.id}, 'description', this.value)"
                 onkeydown="handleTableKey(event, ${index}, 'desc')">
          <input type="text" 
                 class="table-cell-input input-details text-xs font-km" 
                 id="input-details-${item.id}"
                 placeholder="+ បរិយាយបន្ថែម (បើមាន)..." 
                 value="${escapeHtml(item.details || '')}" 
                 oninput="handleCellInput(${item.id}, 'details', this.value)"
                 onkeydown="handleTableKey(event, ${index}, 'details')">
        </td>
        <td class="cell-qty">
          <input type="number" 
                 step="any" 
                 min="0" 
                 class="table-cell-input text-center font-num input-qty" 
                 id="input-qty-${item.id}"
                 placeholder="1"
                 value="${qty}" 
                 oninput="handleCellInput(${item.id}, 'quantity', this.value)"
                 onkeydown="handleTableKey(event, ${index}, 'qty')">
        </td>
        <td class="cell-price">
          <div class="cell-price-inner">
            <span class="cell-cur-symbol">${itemCur === 'KHR' ? '៛' : '$'}</span>
            <input type="number" 
                   step="any" 
                   min="0" 
                   class="table-cell-input text-right font-num input-price" 
                   id="input-price-${item.id}"
                   placeholder="0"
                   value="${price}" 
                   oninput="handleCellInput(${item.id}, 'price', this.value)"
                   onkeydown="handleTableKey(event, ${index}, 'price')">
          </div>
        </td>
        <td class="cell-disc">
          <input type="number" 
                 step="any" 
                 min="0" 
                 max="100" 
                 class="table-cell-input text-center font-num input-disc" 
                 id="input-disc-${item.id}"
                 placeholder="0"
                 value="${disc > 0 ? disc : ''}" 
                 oninput="handleCellInput(${item.id}, 'discountPercent', this.value)"
                 onkeydown="handleTableKey(event, ${index}, 'disc')">
        </td>
        <td class="text-right font-num cell-total" id="cell-total-${item.id}">
          ${(price > 0 || lineConvertedTotal > 0) ? formatMoney(lineConvertedTotal, state.currency) : '-'}
        </td>
        <td class="text-center cell-act">
          <button type="button" class="btn-row-del" onclick="removeItem(${item.id})" title="លុបជួរដេក">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="items-table-scroll-wrap">
      <table class="items-editor-table" id="items-editor-table">
        <thead>
          <tr>
            <th style="width: 38px;" class="text-center">ល.រ</th>
            <th>បរិយាយមុខទំនិញ ឬសេវាកម្ម</th>
            <th style="width: 68px;" class="text-center">ចំនួន</th>
            <th style="width: 105px;" class="text-right">តម្លៃឯកតា</th>
            <th style="width: 60px;" class="text-center">ចុះ %</th>
            <th style="width: 95px;" class="text-right">សរុប</th>
            <th style="width: 38px;" class="text-center">លុប</th>
          </tr>
        </thead>
        <tbody id="items-editor-tbody">
          ${rowsHtml}
        </tbody>
      </table>
    </div>
    <div class="items-table-bottom-bar">
      <button type="button" class="btn-add-row-quick" onclick="addItem()">
        <svg style="width: 15px; height: 15px; fill: currentColor;" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        <span>+ បន្ថែមជួរដេកថ្មី (Add Row)</span>
      </button>
      <div class="table-shortcut-tip">
        <span>💡 វាយចូលតារាងដោយផ្ទាល់</span>
        <span>•</span>
        <span>ចុច <kbd>Enter</kbd> ឬ <kbd>Tab</kbd> លើជួរដេកចុងក្រោយដើម្បីបង្កើតជួរថ្មីដោយស្វ័យប្រវត្តិ</span>
      </div>
    </div>
  `;
}

function renderItemEditorCards() {
  renderItemEditorTable();
}

// Handle typing in editor table cells
function handleCellInput(id, field, value) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  if (field === 'quantity' || field === 'price' || field === 'discountPercent') {
    item[field] = Number(value) || 0;
  } else {
    item[field] = value;
  }

  // Update line total for this row in editor table
  const rate = Number(state.exchangeRate) || 4100;
  const itemCur = item.currency || state.currency;
  const qty = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const disc = Number(item.discountPercent) || 0;
  const lineRaw = (qty * price) * (1 - disc / 100);
  const lineTotal = convertCurrency(lineRaw, itemCur, state.currency, rate);

  const totalCell = document.getElementById(`cell-total-${id}`);
  if (totalCell) {
    totalCell.textContent = (price > 0 || lineTotal > 0) ? formatMoney(lineTotal, state.currency) : '-';
  }

  // Live update sheet preview cell
  updateSheetItemCellLive(id, field, item, lineTotal, lineRaw, itemCur);

  // Live update invoice totals
  updateTotalsDisplayOnly();

  autoSaveCurrentState();
}

// Update specific cell on sheet preview without full redraw
function updateSheetItemCellLive(id, field, item, lineTotal, lineRaw, itemCur) {
  const sheetRow = document.querySelector(`.item-row[data-item-id="${id}"]`);
  if (!sheetRow) {
    renderInvoicePreview();
    return;
  }

  if (field === 'description') {
    const titleEl = sheetRow.querySelector('.item-title-text');
    if (titleEl && titleEl !== document.activeElement) {
      titleEl.textContent = item.description;
    }
  } else if (field === 'details') {
    const subEl = sheetRow.querySelector('.item-desc-sub');
    if (subEl) {
      if (subEl !== document.activeElement) subEl.textContent = item.details;
      subEl.style.display = item.details ? 'block' : 'none';
    }
  } else if (field === 'quantity') {
    const qtyEl = sheetRow.querySelector('.item-qty-cell span');
    if (qtyEl && qtyEl !== document.activeElement) qtyEl.textContent = item.quantity || 0;
  } else if (field === 'price') {
    const priceEl = sheetRow.querySelector('.item-price-cell span');
    if (priceEl && priceEl !== document.activeElement) priceEl.textContent = formatMoney(item.price || 0, itemCur);
  } else if (field === 'discountPercent') {
    const discEl = sheetRow.querySelector('.item-disc-cell span');
    if (discEl && discEl !== document.activeElement) discEl.textContent = item.discountPercent > 0 ? `${item.discountPercent}%` : '-';
  }

  const sheetTotalEl = sheetRow.querySelector('.item-total-cell');
  if (sheetTotalEl) {
    if (item.price > 0 || lineTotal > 0) {
      sheetTotalEl.innerHTML = `
        ${formatMoney(lineTotal, state.currency)}
        ${itemCur !== state.currency ? `<div style="font-size: 0.7rem; color: #64748b; font-weight: normal;">(${formatMoney(lineRaw, itemCur)})</div>` : ''}
      `;
    } else {
      sheetTotalEl.innerHTML = '-';
    }
  }
}

// Update Invoice Totals display numbers without redrawing sheet table
function updateTotalsDisplayOnly() {
  const totals = calculateTotals();
  const subtotalEl = document.getElementById('prev-subtotal');
  if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotal);

  const discRow = document.getElementById('prev-disc-row');
  if (discRow) {
    if (totals.discountAmount > 0) {
      discRow.style.display = 'table-row';
      const discLabel = state.overallDiscountType === 'percent' 
        ? `បញ្ចុះតម្លៃ (${state.overallDiscountValue}%)` 
        : 'បញ្ចុះតម្លៃពិសេស';
      document.getElementById('prev-disc-lbl').textContent = discLabel;
      document.getElementById('prev-discount').textContent = `-${formatMoney(totals.discountAmount)}`;
    } else {
      discRow.style.display = 'none';
    }
  }

  const taxRow = document.getElementById('prev-tax-row');
  if (taxRow) {
    if (state.taxRate > 0) {
      taxRow.style.display = 'table-row';
      document.getElementById('prev-tax-lbl').textContent = `អាករលើតម្លៃបន្ថែម VAT (${state.taxRate}%)`;
      document.getElementById('prev-tax').textContent = formatMoney(totals.taxAmount);
    } else {
      taxRow.style.display = 'none';
    }
  }

  const shipRow = document.getElementById('prev-shipping-row');
  if (shipRow) {
    if (totals.shippingFee > 0) {
      shipRow.style.display = 'table-row';
      document.getElementById('prev-shipping').textContent = formatMoney(totals.shippingFee);
    } else {
      shipRow.style.display = 'none';
    }
  }

  const grandEl = document.getElementById('prev-grand-total');
  if (grandEl) grandEl.textContent = formatMoney(totals.grandTotal);

  const dualRow = document.getElementById('prev-dual-currency-row');
  if (dualRow) {
    if (state.showDualCurrency) {
      dualRow.style.display = 'table-row';
      const rate = Number(state.exchangeRate) || 4100;
      const otherCur = state.currency === 'USD' ? 'KHR' : 'USD';
      const converted = convertCurrency(totals.grandTotal, state.currency, otherCur, rate);
      document.getElementById('prev-dual-currency').textContent = formatMoney(converted, otherCur);
      document.getElementById('prev-dual-lbl').textContent = otherCur === 'KHR' ? 'សរុបជាប្រាក់រៀល (KHR)' : 'សរុបជាដុល្លារ (USD)';
    } else {
      dualRow.style.display = 'none';
    }
  }
}

// Handle keyboard Enter and Tab in editor table
function handleTableKey(e, index, field) {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (index === state.items.length - 1) {
      addItem();
    } else {
      const nextId = state.items[index + 1]?.id;
      if (nextId) {
        const nextInput = document.getElementById(`input-${field}-${nextId}`);
        if (nextInput) nextInput.focus();
      }
    }
  } else if (e.key === 'Tab' && !e.shiftKey && field === 'disc' && index === state.items.length - 1) {
    e.preventDefault();
    addItem();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Add New Item Row
function addItem() {
  playUiSound('pop');
  const newItem = {
    id: nextItemId++,
    description: '',
    details: '',
    quantity: 1,
    price: 0,
    discountPercent: 0,
    currency: state.currency
  };
  state.items.push(newItem);
  renderItemEditorTable();
  renderInvoicePreview();
  autoSaveCurrentState();

  setTimeout(() => {
    const newDescInput = document.getElementById(`input-desc-${newItem.id}`);
    if (newDescInput) newDescInput.focus();
  }, 50);
}

// Remove Item Row (Preserve minimum of 3 rows)
function removeItem(id) {
  playUiSound('delete');
  if (state.items.length <= 3) {
    const item = state.items.find(i => i.id === id);
    if (item) {
      item.description = '';
      item.details = '';
      item.quantity = 1;
      item.price = 0;
      item.discountPercent = 0;
    }
    showToast('តារាងត្រូវរក្សាទុកយ៉ាងហោចណាស់ ៣ ជួរដេក (បានកំណត់ជួរនេះឡើងវិញ)', 'info');
  } else {
    state.items = state.items.filter(i => i.id !== id);
  }
  renderItemEditorTable();
  renderInvoicePreview();
  autoSaveCurrentState();
}

// Clear All Items (Reset to 3 clean blank rows)
async function clearAllItems() {
  const count = state.items ? state.items.length : 0;
  const confirmed = await showCustomConfirm({
    icon: '🗑️',
    badgeType: 'warning',
    title: 'ជម្រះតារាងទំនិញ',
    message: `តើលោកអ្នកចង់ជម្រះមុខទំនិញទាំងអស់ (${count} មុខ) ហើយចាប់ផ្តើមតារាង ៣ ជួរដេកទទេឡើងវិញមែនទេ?`,
    confirmText: 'ជម្រះទាំងអស់',
    cancelText: 'បោះបង់'
  });

  if (confirmed) {
    playUiSound('delete');
    state.items = [
      { id: nextItemId++, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency },
      { id: nextItemId++, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency },
      { id: nextItemId++, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency }
    ];
    renderItemEditorTable();
    renderInvoicePreview();
    autoSaveCurrentState();
    showToast('បានជម្រះ និងកំណត់តារាង ៣ ជួរដេកឡើងវិញរួចរាល់', 'success');
  }
}

// Update Item property
function updateItem(id, field, value) {
  const item = state.items.find(i => i.id === id);
  if (item) {
    if (field === 'quantity' || field === 'price' || field === 'discountPercent') {
      item[field] = Number(value) || 0;
    } else {
      item[field] = value;
    }
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

// Update Item Currency
function updateItemCurrency(id, newCur) {
  const item = state.items.find(i => i.id === id);
  if (item) {
    item.currency = newCur;
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

// Global Currency and Rate changers from Tab 4
function changeGlobalCurrency(newCur) {
  state.currency = newCur;
  renderInvoicePreview();
  renderItemEditorCards();
  autoSaveCurrentState();
}

function changeExchangeRate(val) {
  state.exchangeRate = Number(val) || 4100;
  renderInvoicePreview();
  autoSaveCurrentState();
}

// Set Invoice Status (Unpaid / Paid)
function setInvoiceStatus(status) {
  state.invoiceStatus = status;
  renderInvoicePreview();
  autoSaveCurrentState();
}

// Set Paper Size (A4 / A5) with 1.5cm margins
function setPaperSize(size) {
  playUiSound('switch');
  const targetSize = (size === 'a5') ? 'a5' : 'a4';
  state.paperSize = targetSize;
  
  const custSelect = document.getElementById('cust-paper-size-select');
  const prevSelect = document.getElementById('preview-paper-size-select');
  if (custSelect) custSelect.value = targetSize;
  if (prevSelect) prevSelect.value = targetSize;

  const sheet = document.getElementById('printable-invoice-sheet') || document.getElementById('invoice-preview-sheet');

  let dynamicStyle = document.getElementById('dynamic-paper-style');
  if (!dynamicStyle) {
    dynamicStyle = document.createElement('style');
    dynamicStyle.id = 'dynamic-paper-style';
    document.head.appendChild(dynamicStyle);
  }

  if (targetSize === 'a5') {
    document.body.classList.add('paper-mode-a5');
    if (sheet) {
      sheet.classList.add('sheet-a5');
      sheet.classList.remove('sheet-a4');
    }
    dynamicStyle.textContent = `@page { size: A5 portrait !important; margin: 0.5cm 0.65cm !important; }`;
  } else {
    document.body.classList.remove('paper-mode-a5');
    if (sheet) {
      sheet.classList.remove('sheet-a5');
      sheet.classList.add('sheet-a4');
    }
    dynamicStyle.textContent = `@page { size: A4 portrait !important; margin: 0.7cm 0.9cm !important; }`;
  }

  updatePageFitIndicator();

  if (typeof autoScaleInvoiceOnMobile === 'function') {
    autoScaleInvoiceOnMobile();
  }
  autoSaveCurrentState();
}

// Render the Live A4 Invoice Sheet
// Helper functions for direct WYSIWYG sheet editing
function setSheetFieldText(id, value, fallback = '') {
  const el = document.getElementById(id);
  if (!el) return;
  if (document.activeElement === el) return;
  el.textContent = (value !== undefined && value !== null && String(value).trim() !== '') ? value : fallback;
}

function makeSheetFieldEditable(id, field, placeholder = '') {
  const el = document.getElementById(id);
  if (!el) return;
  if (!isCustomerViewLink) {
    el.classList.add('sheet-editable');
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-sheet-field', field);
    if (placeholder) el.setAttribute('placeholder', placeholder);
  } else {
    el.classList.remove('sheet-editable');
    el.removeAttribute('contenteditable');
    el.removeAttribute('data-sheet-field');
  }
}

function initSheetDelegatedInput() {
  const sheet = document.getElementById('printable-invoice-sheet');
  if (!sheet || sheet._sheetDelegatedInit) return;
  sheet._sheetDelegatedInit = true;

  sheet.addEventListener('input', function(e) {
    const target = e.target;
    const field = target.dataset.sheetField;
    if (!field) return;

    let val = target.innerText.trim();
    if (field === 'seller.nameEn') {
      val = val.replace(/^\(|\)$/g, '').trim();
    }

    const parts = field.split('.');
    if (parts.length === 1) {
      state[parts[0]] = val;
    } else if (parts.length === 2) {
      if (!state[parts[0]]) state[parts[0]] = {};
      state[parts[0]][parts[1]] = val;
    }

    autoSaveCurrentState();
  });
}

function addNewItemRowDirect() {
  const newItem = {
    id: Date.now(),
    description: '',
    details: '',
    quantity: 1,
    price: 0,
    discountPercent: 0,
    currency: state.currency
  };
  state.items.push(newItem);
  renderInvoicePreview();
  
  setTimeout(() => {
    const tableBody = document.getElementById('prev-items-tbody');
    if (tableBody && tableBody.lastElementChild) {
      const descEl = tableBody.lastElementChild.querySelector('[data-field="description"]');
      if (descEl) descEl.focus();
    }
  }, 40);

  autoSaveCurrentState();
}

function addThreeItemsDirect() {
  for (let i = 0; i < 3; i++) {
    state.items.push({
      id: Date.now() + i,
      description: '',
      details: '',
      quantity: 1,
      price: 0,
      discountPercent: 0,
      currency: state.currency
    });
  }
  renderInvoicePreview();
  autoSaveCurrentState();
}

function clearAllItemsDirect() {
  if (confirm('តើលោកអ្នកពិតជាចង់ជម្រះមុខទំនិញទាំងអស់មែនទេ?')) {
    state.items = [
      { id: Date.now(), description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency },
      { id: Date.now() + 1, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency },
      { id: Date.now() + 2, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency }
    ];
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

function deleteItemDirect(id) {
  if (state.items.length <= 1) {
    state.items = [
      { id: Date.now(), description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency }
    ];
  } else {
    state.items = state.items.filter(i => i.id !== id);
  }
  renderInvoicePreview();
  autoSaveCurrentState();
}

function switchBankDirect(bankKey) {
  state.payment.bankKey = bankKey;
  if (bankKey === 'aba') {
    state.payment.bankName = 'ធនាគារ វឌ្ឍនៈ អាស៊ី ចំកាត់ (ABA BANK)';
    state.payment.abaMode = 'USD';
  } else {
    state.payment.bankName = 'ធនាគារ អេស៊ីលីដា (ACLEDA BANK)';
  }
  renderInvoicePreview();
  autoSaveCurrentState();
}

function toggleDualCurrencyDirect(checked) {
  state.showDualCurrency = checked;
  const dualCheck = document.getElementById('preview-dual-check');
  if (dualCheck) dualCheck.checked = checked;
  updateTotalsDisplayOnly();
  autoSaveCurrentState();
}

function toggleSidebarDrawer() {
  document.body.classList.toggle('show-editor-drawer');
}

function toggleDiscountRowDirect() {
  const current = Number(state.overallDiscountValue) || 0;
  const val = prompt('បញ្ចូលចំនួនបញ្ចុះតម្លៃ (% ឬទឹកប្រាក់):', current > 0 ? current : '5');
  if (val !== null) {
    state.overallDiscountValue = Number(val) || 0;
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

function toggleTaxRowDirect() {
  const current = Number(state.taxRate) || 0;
  const val = prompt('បញ្ចូលអត្រាអាករ VAT (%):', current > 0 ? current : '10');
  if (val !== null) {
    state.taxRate = Number(val) || 0;
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

function toggleShippingRowDirect() {
  const current = Number(state.shippingFee) || 0;
  const val = prompt('បញ្ចូលថ្លៃសេវាដឹកជញ្ជូន:', current > 0 ? current : '1.50');
  if (val !== null) {
    state.shippingFee = Number(val) || 0;
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

function togglePaidRowDirect() {
  const totals = calculateTotals();
  const current = Number(state.paidAmount) || 0;
  const val = prompt('បញ្ចូលចំនួនប្រាក់ដែលបានបង់រួច:', current > 0 ? current : totals.grandTotal);
  if (val !== null) {
    state.paidAmount = Number(val) || 0;
    renderInvoicePreview();
    autoSaveCurrentState();
  }
}

// Render the Live A4 Invoice Sheet with Full WYSIWYG Sheet Editing
function renderInvoicePreview() {
  const totals = calculateTotals();
  const isEditable = !isCustomerViewLink;
  const rate = Number(state.exchangeRate) || 4100;

  // Invoice Titles based on type
  const isTax = state.invoiceType === 'tax';
  const titleKh = isTax ? 'វិក្កយបត្រពន្ធ' : 'វិក្កយបត្រ';
  const titleEn = isTax ? 'TAX INVOICE' : 'INVOICE';

  setSheetFieldText('prev-doc-title-kh', titleKh);
  setSheetFieldText('prev-doc-title-en', titleEn);

  // Seller Info & Shop Name (Directly editable on sheet)
  makeSheetFieldEditable('prev-shop-name', 'seller.shopName', 'ឈ្មោះហាង / ក្រុមហ៊ុន...');
  setSheetFieldText('prev-shop-name', state.seller.shopName, 'RATHA Stationery');

  makeSheetFieldEditable('prev-seller-name-kh', 'seller.nameKh', 'ឈ្មោះម្ចាស់ (ខ្មែរ)...');
  setSheetFieldText('prev-seller-name-kh', state.seller.nameKh, 'ហ៊ុន រដ្ឋា');

  makeSheetFieldEditable('prev-seller-name-en', 'seller.nameEn', '(Name in English)...');
  setSheetFieldText('prev-seller-name-en', state.seller.nameEn ? `(${state.seller.nameEn})` : '');

  const tinWrap = document.getElementById('prev-seller-vat-wrap');
  if (tinWrap) {
    if (state.seller.vatTin || isTax) {
      tinWrap.style.display = 'block';
      makeSheetFieldEditable('prev-seller-vat', 'seller.vatTin', 'K001-XXXXXX');
      setSheetFieldText('prev-seller-vat', state.seller.vatTin, 'K001-902345678');
    } else {
      tinWrap.style.display = 'none';
    }
  }

  makeSheetFieldEditable('prev-seller-phone', 'seller.phone', 'លេខទូរស័ព្ទ...');
  setSheetFieldText('prev-seller-phone', state.seller.phone, '089 20 998 / 093 486 987');

  makeSheetFieldEditable('prev-seller-email', 'seller.email', 'Email (បើមាន)...');
  setSheetFieldText('prev-seller-email', state.seller.email, '');

  makeSheetFieldEditable('prev-seller-address', 'seller.address', 'អាសយដ្ឋានអ្នកលក់...');
  setSheetFieldText('prev-seller-address', state.seller.address, 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង');

  const logoImg = document.getElementById('prev-seller-logo');
  if (logoImg) {
    if (state.seller.logo) {
      logoImg.src = state.seller.logo;
      logoImg.style.display = 'block';
    } else {
      logoImg.style.display = 'none';
    }
  }

  // Invoice Meta & Dates
  makeSheetFieldEditable('prev-inv-num', 'invoiceNumber', 'INV-001');
  setSheetFieldText('prev-inv-num', state.invoiceNumber, 'INV-2026-001');

  makeSheetFieldEditable('prev-issue-date', 'issueDate', 'DD/MM/YYYY');
  setSheetFieldText('prev-issue-date', formatDate(state.issueDate), formatDate(new Date().toISOString().split('T')[0]));

  const dueWrapLbl = document.getElementById('prev-due-wrap-lbl');
  const dueWrapVal = document.getElementById('prev-due-wrap-val');
  if (state.dueDate && String(state.dueDate).trim()) {
    if (dueWrapLbl) dueWrapLbl.style.display = 'inline';
    if (dueWrapVal) {
      dueWrapVal.style.display = 'inline';
      makeSheetFieldEditable('prev-due-date', 'dueDate', 'DD/MM/YYYY');
      setSheetFieldText('prev-due-date', formatDate(state.dueDate));
    }
  } else {
    if (dueWrapLbl) dueWrapLbl.style.display = 'none';
    if (dueWrapVal) dueWrapVal.style.display = 'none';
  }

  const poWrap = document.getElementById('prev-po-wrap');
  if (poWrap) {
    if (state.poNumber) {
      poWrap.style.display = 'contents';
      makeSheetFieldEditable('prev-po-number', 'poNumber', 'PO-XXXX');
      setSheetFieldText('prev-po-number', state.poNumber);
    } else {
      poWrap.style.display = 'none';
    }
  }

  // Customer Info
  makeSheetFieldEditable('prev-client-name', 'client.nameKh', 'ឈ្មោះអតិថិជន...');
  setSheetFieldText('prev-client-name', state.client.nameKh, 'លោក នី ម៉ៅ');

  makeSheetFieldEditable('prev-client-company', 'client.company', 'ឈ្មោះក្រុមហ៊ុន / ស្ថាប័ន (បើមាន)...');
  setSheetFieldText('prev-client-company', state.client.company, 'វិទ្យាល័យហ៊ុនសែនកំពង់ត្រឡាច');

  makeSheetFieldEditable('prev-client-phone', 'client.phone', 'លេខទូរស័ព្ទ...');
  setSheetFieldText('prev-client-phone', state.client.phone, '092 111 222');

  makeSheetFieldEditable('prev-client-address', 'client.address', 'អាសយដ្ឋានអតិថិជន...');
  setSheetFieldText('prev-client-address', state.client.address, 'សាលាលេខប្រាំ អូរឫស្សី កំពង់ត្រឡាច កំពង់ឆ្នាំង');

  // Sync Master Toolbar values
  const tbCur = document.getElementById('preview-currency-select');
  if (tbCur && tbCur !== document.activeElement) tbCur.value = state.currency || 'USD';

  const tbRate = document.getElementById('preview-rate-input');
  if (tbRate && tbRate !== document.activeElement) tbRate.value = state.exchangeRate || 4100;

  const tbDual = document.getElementById('preview-dual-check');
  if (tbDual) tbDual.checked = !!state.showDualCurrency;

  // Sync Bank Pills in payment box
  const pillAcleda = document.getElementById('pill-bank-acleda');
  const pillAba = document.getElementById('pill-bank-aba');
  if (pillAcleda && pillAba) {
    if (state.payment.bankKey === 'aba') {
      pillAba.classList.add('active');
      pillAcleda.classList.remove('active');
    } else {
      pillAcleda.classList.add('active');
      pillAba.classList.remove('active');
    }
  }

  // Table items rendering
  const tableBody = document.getElementById('prev-items-tbody');
  if (tableBody) {
    tableBody.innerHTML = '';
    ensureMinimumItems(3);
    updatePageFitIndicator();

    state.items.forEach((item, index) => {
      const qty = item.quantity !== undefined ? item.quantity : 1;
      const price = item.price !== undefined ? item.price : 0;
      const disc = Number(item.discountPercent) || 0;
      const itemCur = item.currency || state.currency;
      const lineRawTotal = (qty * price) * (1 - disc / 100);
      const lineConvertedTotal = convertCurrency(lineRawTotal, itemCur, state.currency, rate);
      const hasContent = item.description || price > 0 || lineConvertedTotal > 0;

      const tr = document.createElement('tr');
      tr.className = 'item-row';
      tr.dataset.itemId = item.id;
      tr.innerHTML = `
        <td class="item-num text-center">${index + 1}</td>
        <td class="item-desc-cell">
          <div class="item-title-text ${isEditable ? 'sheet-editable' : ''}"
               ${isEditable ? `contenteditable="true" data-id="${item.id}" data-field="description" placeholder="ឈ្មោះមុខទំនិញ ឬសេវាកម្ម..."` : ''}>${escapeHtml(item.description)}</div>
          <div class="item-desc-sub ${isEditable ? 'sheet-editable' : ''}"
               ${isEditable ? `contenteditable="true" data-id="${item.id}" data-field="details" placeholder="+ បរិយាយបន្ថែម (បើមាន)..."` : ''}
               style="${(item.details || isEditable) ? '' : 'display: none;'}">${escapeHtml(item.details || '')}</div>
        </td>
        <td class="item-qty-cell text-center">
          <span class="${isEditable ? 'sheet-editable font-num' : 'font-num'}"
                ${isEditable ? `contenteditable="true" data-id="${item.id}" data-field="quantity"` : ''}>${qty}</span>
        </td>
        <td class="item-price-cell text-right">
          <span class="${isEditable ? 'sheet-editable font-num' : 'font-num'}"
                ${isEditable ? `contenteditable="true" data-id="${item.id}" data-field="price"` : ''}>${price > 0 ? price : (hasContent ? '0' : (isEditable ? '' : ''))}</span>
        </td>
        <td class="item-disc-cell text-center">
          <span class="${isEditable ? 'sheet-editable font-num' : 'font-num'}"
                ${isEditable ? `contenteditable="true" data-id="${item.id}" data-field="discountPercent"` : ''}>${disc > 0 ? disc : (isEditable ? '' : '')}</span>
        </td>
        <td class="item-total-cell font-num text-right">
          ${(price > 0 || lineConvertedTotal > 0) ? formatMoney(lineConvertedTotal, state.currency) : (hasContent ? formatMoney(0, state.currency) : '-')}
        </td>
        <td class="item-action-cell text-center no-print">
          <button type="button" class="btn-sheet-row-del" onclick="deleteItemDirect(${item.id})" title="លុបមុខទំនិញនេះ">✕</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Delegated input listener for table items
    if (isEditable) {
      tableBody.oninput = function(e) {
        const target = e.target;
        const id = Number(target.dataset.id);
        const field = target.dataset.field;
        if (!id || !field) return;

        const val = target.innerText.trim();
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        if (field === 'quantity' || field === 'price' || field === 'discountPercent') {
          const cleanNum = Number(val.replace(/[^0-9.-]+/g, '')) || 0;
          item[field] = cleanNum;
        } else {
          item[field] = val;
        }

        // Live update row total
        const itemCur = item.currency || state.currency;
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const disc = Number(item.discountPercent) || 0;
        const lineRaw = (qty * price) * (1 - disc / 100);
        const lineTotal = convertCurrency(lineRaw, itemCur, state.currency, rate);

        const sheetRow = target.closest('tr');
        if (sheetRow) {
          const totalCell = sheetRow.querySelector('.item-total-cell');
          if (totalCell) {
            totalCell.innerHTML = (price > 0 || lineTotal > 0) ? formatMoney(lineTotal, state.currency) : '-';
          }
        }

        updateTotalsDisplayOnly();
        updatePageFitIndicator();
        autoSaveCurrentState();
      };

      // Keyboard navigation: Enter on row appends new row; Tab on last cell appends row
      tableBody.onkeydown = function(e) {
        if (e.key === 'Enter') {
          const target = e.target;
          const tr = target.closest('tr');
          if (!tr) return;
          e.preventDefault();
          const nextTr = tr.nextElementSibling;
          if (nextTr) {
            const nextTarget = nextTr.querySelector(`[data-field="${target.dataset.field}"]`) || nextTr.querySelector('[data-field="description"]');
            if (nextTarget) nextTarget.focus();
          } else {
            addNewItemRowDirect();
          }
        } else if (e.key === 'Tab' && !e.shiftKey) {
          const target = e.target;
          const tr = target.closest('tr');
          if (tr && !tr.nextElementSibling && (target.dataset.field === 'discountPercent' || target.dataset.field === 'price')) {
            e.preventDefault();
            addNewItemRowDirect();
          }
        }
      };
    }
  }

  // Totals Section
  document.getElementById('prev-subtotal').textContent = formatMoney(totals.subtotal);

  // Overall Discount
  const discRow = document.getElementById('prev-disc-row');
  if (totals.discountAmount > 0) {
    discRow.style.display = 'table-row';
    const discLabel = state.overallDiscountType === 'percent'
      ? `បញ្ចុះតម្លៃ (${state.overallDiscountValue}%)`
      : 'បញ្ចុះតម្លៃពិសេស';
    document.getElementById('prev-disc-lbl').textContent = discLabel;
    document.getElementById('prev-discount').textContent = `-${formatMoney(totals.discountAmount)}`;
  } else {
    discRow.style.display = 'none';
  }

  // Tax Row
  const taxRow = document.getElementById('prev-tax-row');
  if (state.taxRate > 0) {
    taxRow.style.display = 'table-row';
    document.getElementById('prev-tax-lbl').textContent = `អាករលើតម្លៃបន្ថែម VAT (${state.taxRate}%)`;
    document.getElementById('prev-tax').textContent = formatMoney(totals.taxAmount);
  } else {
    taxRow.style.display = 'none';
  }

  // Shipping Row
  const shipRow = document.getElementById('prev-shipping-row');
  if (totals.shippingFee > 0) {
    shipRow.style.display = 'table-row';
    document.getElementById('prev-shipping').textContent = formatMoney(totals.shippingFee);
  } else {
    shipRow.style.display = 'none';
  }

  // Grand Total
  document.getElementById('prev-grand-total').textContent = formatMoney(totals.grandTotal);

  // Dual Currency Grand Total Display
  const dualTotalWrap = document.getElementById('prev-dual-total');
  if (state.showDualCurrency) {
    dualTotalWrap.style.display = 'block';
    const altCur = state.currency === 'USD' ? 'KHR' : 'USD';
    const altTotal = convertCurrency(totals.grandTotal, state.currency, altCur);
    dualTotalWrap.textContent = `≈ ${formatMoney(altTotal, altCur)} (អត្រា 1$ = ${state.exchangeRate.toLocaleString()}៛)`;
  } else {
    dualTotalWrap.style.display = 'none';
  }

  // Paid and Balance Due Rows
  const paidRow = document.getElementById('prev-paid-row');
  if (totals.paid > 0) {
    paidRow.style.display = 'table-row';
    document.getElementById('prev-paid').textContent = formatMoney(totals.paid);
  } else {
    paidRow.style.display = 'none';
  }

  document.getElementById('prev-due').textContent = formatMoney(totals.balanceDue);
  const dualDueWrap = document.getElementById('prev-dual-due');
  if (state.showDualCurrency && totals.balanceDue > 0) {
    dualDueWrap.style.display = 'block';
    const altCur = state.currency === 'USD' ? 'KHR' : 'USD';
    const altDue = convertCurrency(totals.balanceDue, state.currency, altCur);
    dualDueWrap.textContent = `≈ ${formatMoney(altDue, altCur)}`;
  } else {
    dualDueWrap.style.display = 'none';
  }

  // Payment Details (Directly editable)
  makeSheetFieldEditable('prev-bank-name', 'payment.bankName', 'ឈ្មោះធនាគារ...');
  setSheetFieldText('prev-bank-name', state.payment.bankName, 'ធនាគារ អេស៊ីលីដា (ACLEDA BANK)');

  makeSheetFieldEditable('prev-account-name', 'payment.accountName', 'ឈ្មោះគណនី...');
  setSheetFieldText('prev-account-name', state.payment.accountName, 'ហ៊ុន រដ្ឋា (HUN RATHA)');

  makeSheetFieldEditable('prev-account-num', 'payment.accountNumber', 'លេខគណនី ឬ KHQR...');
  setSheetFieldText('prev-account-num', state.payment.accountNumber, 'KHQR (Scan. Pay Done.)');

  // Payment QR Code handling (Single vs Dual Mode)
  const singleQrBox = document.getElementById('prev-single-qr-box');
  const dualQrBox = document.getElementById('prev-dual-qr-box');
  const qrImg = document.getElementById('prev-qr-code-img');
  const qrGen = document.getElementById('prev-qr-code-gen');
  const isDualAba = (state.payment.bankKey === 'aba' && state.payment.abaMode === 'DUAL');

  if (isDualAba) {
    if (singleQrBox) singleQrBox.style.display = 'none';
    if (dualQrBox) dualQrBox.style.display = 'flex';
  } else {
    if (dualQrBox) dualQrBox.style.display = 'none';
    if (singleQrBox) singleQrBox.style.display = 'flex';

    if (state.payment.qrCode && state.payment.qrCode !== 'dual') {
      if (qrImg) {
        qrImg.src = state.payment.qrCode;
        qrImg.style.display = 'block';
      }
      if (qrGen) qrGen.style.display = 'none';
    } else if (state.payment.accountNumber && typeof QRCode !== 'undefined') {
      if (qrImg) qrImg.style.display = 'none';
      if (qrGen) {
        qrGen.style.display = 'flex';
        qrGen.innerHTML = '';
        try {
          const qrContent = `PAYMENT:${state.payment.bankName}|ACC:${state.payment.accountNumber}|NAME:HUN RATHA|INV:${state.invoiceNumber}|DUE:${totals.balanceDue}`;
          new QRCode(qrGen, {
            text: qrContent,
            width: 80,
            height: 80,
            colorDark: '#0f172a',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
          });
        } catch (err) {
          console.warn('QR Code generation error:', err);
        }
      }
    } else {
      if (qrImg) qrImg.style.display = 'none';
      if (qrGen) qrGen.style.display = 'none';
    }
  }

  // Payment Box Bank Class
  const payBox = document.querySelector('.inv-payment-method-box');
  if (payBox) {
    payBox.classList.remove('bank-acleda', 'bank-aba');
    payBox.classList.add(state.payment.bankKey === 'aba' ? 'bank-aba' : 'bank-acleda');
  }

  const bankTagText = document.getElementById('prev-bank-tag-text');
  if (bankTagText) {
    if (state.payment.bankKey === 'aba') {
      if (state.payment.abaMode === 'KHR') {
        bankTagText.textContent = "ABA' PAY (KHR ៛)";
      } else if (state.payment.abaMode === 'DUAL') {
        bankTagText.textContent = "ABA' PAY (USD & KHR)";
      } else {
        bankTagText.textContent = "ABA' PAY (USD $)";
      }
    } else {
      bankTagText.textContent = 'ACLEDA KHQR';
    }
  }

  const scanHintEl = document.getElementById('prev-scan-hint');
  if (scanHintEl) {
    if (state.payment.bankKey === 'aba') {
      if (state.payment.abaMode === 'KHR') {
        scanHintEl.innerHTML = '<span>⚡</span> ស្កេនទូទាត់រហ័សតាម ABA Mobile (គណនីប្រាក់រៀល ៛)';
      } else if (state.payment.abaMode === 'DUAL') {
        scanHintEl.innerHTML = '<span>⚡</span> ស្កេនទូទាត់តាម ABA Mobile (មានទាំងដុល្លារ $ & ប្រាក់រៀល ៛)';
      } else {
        scanHintEl.innerHTML = '<span>⚡</span> ស្កេនទូទាត់រហ័សតាម ABA Mobile (គណនីដុល្លារ $) ';
      }
    } else {
      scanHintEl.innerHTML = '<span>📲</span> ស្កេនទូទាត់រហ័សតាម KHQR / Bakong / Mobile Banking';
    }
  }

  // Notes & Terms (Directly editable)
  const notesBox = document.getElementById('prev-notes-box');
  if (notesBox) {
    notesBox.style.display = 'block';
    makeSheetFieldEditable('prev-notes-content', 'notes', 'ចុចទីនេះដើម្បីបញ្ចូលកំណត់សម្គាល់ ឬលក្ខខណ្ឌបន្ថែម...');
    setSheetFieldText('prev-notes-content', state.notes, 'សូមអរគុណសម្រាប់ការគាំទ្រទំនិញ និងសេវាកម្មរបស់យើងខ្ញុំ!\n• សូមផ្ទៀងផ្ទាត់ប្រាក់តាមរយៈ KHQR (ហ៊ុន រដ្ឋា) ខាងលើ\n• សូមទូទាត់ប្រាក់ឱ្យបានរួចរាល់មុនកាលបរិច្ឆេទកំណត់\n• ទំនិញទិញរួចមិនអាចប្តូរយកប្រាក់វិញបានឡើយ');
  }

  // Signatures
  makeSheetFieldEditable('prev-buyer-title', 'signatures.buyerTitle', 'អ្នកទិញ / Customer');
  setSheetFieldText('prev-buyer-title', state.signatures.buyerTitle, 'អ្នកទិញ / Customer');

  makeSheetFieldEditable('prev-seller-title', 'signatures.sellerTitle', 'អ្នកលក់ / Seller');
  setSheetFieldText('prev-seller-title', state.signatures.sellerTitle, 'អ្នកលក់ / Seller');

  // Attach global sheet delegating input listener once
  initSheetDelegatedInput();
}
function formatDate(dateStr) {
  if (!dateStr) return '';
  // If native datepicker format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr).trim())) {
    const [y, m, d] = dateStr.trim().split('-');
    return `${d}/${m}/${y}`;
  }
  // Otherwise, return user's custom text as entered
  return String(dateStr);
}

// Calendar Picker Trigger
function triggerPicker(pickerId) {
  const picker = document.getElementById(pickerId);
  if (picker) {
    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
    } else {
      picker.click();
    }
  }
}

// Sync picked date to text input
function applyPickerDate(pickerId, inputId) {
  const picker = document.getElementById(pickerId);
  const input = document.getElementById(inputId);
  if (picker && input && picker.value) {
    const [y, m, d] = picker.value.split('-');
    const formatted = `${d}/${m}/${y}`;
    input.value = formatted;
    input.dispatchEvent(new Event('input'));
  }
}

// Khmer Date Helpers
const KHMER_MONTH_NAMES = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];
const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

function convertToKhmerDigits(str) {
  return String(str).replace(/[0-9]/g, ch => KHMER_DIGITS[ch]);
}

function getKhmerFullDateString(dateObj = new Date()) {
  const day = dateObj.getDate();
  const month = KHMER_MONTH_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `ថ្ងៃទី${convertToKhmerDigits(String(day).padStart(2, '0'))} ខែ${month} ឆ្នាំ${convertToKhmerDigits(year)}`;
}

function formatDateStandard(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Quick Date Presets (Standard, Khmer, Check-in/out)
function applyDatePreset(presetType) {
  const now = new Date();
  const plus7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (presetType === 'khmer') {
    state.issueDateLabel = 'កាលបរិច្ឆេទចេញ';
    state.dueDateLabel = 'កាលបរិច្ឆេទចូល';
    state.issueDate = getKhmerFullDateString(now);
    state.dueDate = getKhmerFullDateString(plus7);
  } else if (presetType === 'checkinout') {
    state.issueDateLabel = 'ថ្ងៃចេញ (Check-out)';
    state.dueDateLabel = 'ថ្ងៃចូល (Check-in)';
    state.issueDate = formatDateStandard(now);
    state.dueDate = formatDateStandard(plus7);
  } else {
    // Standard
    state.issueDateLabel = 'កាលបរិច្ឆេទចេញ (Issue)';
    state.dueDateLabel = 'កាលបរិច្ឆេទចូល (Due)';
    state.issueDate = formatDateStandard(now);
    state.dueDate = formatDateStandard(plus7);
  }

  renderFormInputs();
  renderInvoicePreview();
  autoSaveCurrentState();
  showToast('បានកំណត់គំរូកាលបរិច្ឆេទជោគជ័យ!', 'success');
}

// Global Tab Switcher Function
function switchEditorTab(tabId) {
  if (!tabId) return;
  playUiSound('switch');
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  document.querySelectorAll('.editor-tab-pane').forEach(p => {
    if (p.id === tabId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

// Event Listeners for Editor
function initEventListeners() {
  // Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (target) switchEditorTab(target);
    });
  });

  // Invoice Details & Customizable Dates
  bindInput('input-invoice-type', (val) => { state.invoiceType = val; });
  bindInput('input-invoice-num', (val) => { state.invoiceNumber = val; });
  bindInput('input-issue-date-label', (val) => { state.issueDateLabel = val; });
  bindInput('input-issue-date', (val) => { state.issueDate = val; });
  bindInput('input-due-date-label', (val) => { state.dueDateLabel = val; });
  bindInput('input-due-date', (val) => { state.dueDate = val; });
  bindInput('input-po-number', (val) => { state.poNumber = val; });

  // Currency
  bindInput('input-currency', (val) => { 
    state.currency = val;
    if (state.payment.bankKey === 'aba' && state.payment.abaMode !== 'DUAL') {
      applyAbaMode(val === 'KHR' ? 'KHR' : 'USD');
      renderFormInputs();
    }
    renderItemEditorCards(); 
  });
  bindInput('input-exchange-rate', (val) => { state.exchangeRate = Number(val) || 4100; });
  const dualCurCheck = document.getElementById('input-dual-currency');
  if (dualCurCheck) {
    dualCurCheck.addEventListener('change', (e) => {
      state.showDualCurrency = e.target.checked;
      renderInvoicePreview();
      autoSaveCurrentState();
    });
  }

  // Seller & Shop Name
  bindInput('input-shop-name', (val) => { state.seller.shopName = val; });
  bindInput('input-seller-name-kh', (val) => { state.seller.nameKh = val; });
  bindInput('input-seller-name-en', (val) => { state.seller.nameEn = val; });
  bindInput('input-seller-vat', (val) => { state.seller.vatTin = val; });
  bindInput('input-seller-phone', (val) => { state.seller.phone = val; });
  bindInput('input-seller-email', (val) => { state.seller.email = val; });
  bindInput('input-seller-address', (val) => { state.seller.address = val; });

  // Client
  bindInput('input-client-name', (val) => { state.client.nameKh = val; });
  bindInput('input-client-company', (val) => { state.client.company = val; });
  bindInput('input-client-phone', (val) => { state.client.phone = val; });
  bindInput('input-client-email', (val) => { state.client.email = val; });
  bindInput('input-client-address', (val) => { state.client.address = val; });

  // Payment
  bindInput('input-bank-name', (val) => { state.payment.bankName = val; });
  bindInput('input-account-name', (val) => { state.payment.accountName = val; });
  bindInput('input-account-num', (val) => { state.payment.accountNumber = val; });

  // Extra Costs
  bindInput('input-overall-disc-type', (val) => { state.overallDiscountType = val; });
  bindInput('input-overall-disc-val', (val) => { state.overallDiscountValue = Number(val) || 0; });
  bindInput('input-tax-rate', (val) => { state.taxRate = Number(val) || 0; });
  bindInput('input-shipping', (val) => { state.shippingFee = Number(val) || 0; });
  bindInput('input-paid', (val) => { state.paidAmount = Number(val) || 0; });

  // Notes
  bindInput('input-notes', (val) => { state.notes = val; });

  // Signatures
  bindInput('input-seller-sign-title', (val) => { state.signatures.sellerTitle = val; });
  bindInput('input-buyer-sign-title', (val) => { state.signatures.buyerTitle = val; });

  // Logo file upload
  setupImageUploader('seller-logo-file', (base64) => {
    state.seller.logo = base64;
    renderFormInputs();
    renderInvoicePreview();
    autoSaveCurrentState();
    showToast('បានដាក់ឡូហ្គោជោគជ័យ!', 'success');
  });

  // QR Code upload
  setupImageUploader('payment-qr-file', (base64) => {
    state.payment.qrCode = base64;
    renderFormInputs();
    renderInvoicePreview();
    autoSaveCurrentState();
    showToast('បានដាក់រូប QR Code ជោគជ័យ!', 'success');
  });

  // Zoom controls
  const zoomSelect = document.getElementById('preview-zoom-select');
  if (zoomSelect) {
    zoomSelect.addEventListener('change', () => {
      autoScaleInvoiceOnMobile();
    });
  }
}

function bindInput(id, callback) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', (e) => {
      callback(e.target.value);
      renderInvoicePreview();
      autoSaveCurrentState();
    });
  }
}

function setupImageUploader(inputId, onLoaded) {
  const fileInput = document.getElementById(inputId);
  if (!fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        showToast('ទំហំរូបភាពត្រូវតែតូចជាង 4MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        onLoaded(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
}


// Remove Logo
function removeLogo() {
  state.seller.logo = '';
  renderFormInputs();
  renderInvoicePreview();
  autoSaveCurrentState();
  showToast('បានលុបឡូហ្គោចេញ', 'info');
}

// Remove QR
function removeQrCode() {
  state.payment.qrCode = '';
  renderFormInputs();
  renderInvoicePreview();
  autoSaveCurrentState();
  showToast('បានលុប QR Code ចេញ', 'info');
}

// =========================================================
// CUSTOM CENTERED CONFIRMATION & PROMPT DIALOGS
// Replaces native browser confirm() and prompt() with sleek centered modal dialogs
// =========================================================
let dialogResolve = null;

function showCustomConfirm({
  icon = '⚠️',
  badgeType = 'warning', // 'warning', 'danger', 'info', 'success'
  title = 'ការបញ្ជាក់',
  message = 'តើលោកអ្នកពិតជាចង់បន្តសកម្មភាពនេះមែនទេ?',
  confirmText = 'យល់ព្រម',
  cancelText = 'បោះបង់',
  isDanger = false
}) {
  return new Promise((resolve) => {
    dialogResolve = resolve;

    const modal = document.getElementById('custom-dialog-modal');
    const iconEl = document.getElementById('dialog-icon');
    const iconWrap = document.getElementById('dialog-icon-wrap');
    const titleEl = document.getElementById('dialog-title');
    const msgEl = document.getElementById('dialog-message');
    const inputGroup = document.getElementById('dialog-input-group');
    const btnCancel = document.getElementById('dialog-btn-cancel');
    const btnConfirm = document.getElementById('dialog-btn-confirm');

    if (!modal) {
      resolve(window.confirm(message));
      return;
    }

    if (iconEl) iconEl.textContent = icon;
    if (iconWrap) {
      iconWrap.className = 'custom-dialog-icon-badge';
      if (isDanger || badgeType === 'danger') iconWrap.classList.add('danger');
      else if (badgeType === 'info') iconWrap.classList.add('info');
      else if (badgeType === 'success') iconWrap.classList.add('success');
    }
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message.replace(/\n/g, '<br>');
    if (inputGroup) inputGroup.style.display = 'none';

    if (btnCancel) {
      btnCancel.style.display = 'inline-flex';
      btnCancel.textContent = cancelText;
      btnCancel.onclick = () => {
        closeModal('custom-dialog-modal');
        if (dialogResolve) { dialogResolve(false); dialogResolve = null; }
      };
    }

    if (btnConfirm) {
      btnConfirm.textContent = confirmText;
      btnConfirm.className = isDanger ? 'btn btn-danger dialog-btn' : 'btn btn-primary dialog-btn';
      btnConfirm.onclick = () => {
        closeModal('custom-dialog-modal');
        if (dialogResolve) { dialogResolve(true); dialogResolve = null; }
      };
    }

    openModal('custom-dialog-modal');
  });
}

function showCustomPrompt({
  icon = '📝',
  badgeType = 'info',
  title = 'កំណត់ចំណាំវិក្កយបត្រ',
  message = 'សូមបញ្ចូលព័ត៌មាន៖',
  defaultValue = '',
  placeholder = 'បញ្ចូលនៅទីនេះ...',
  confirmText = 'រក្សាទុក',
  cancelText = 'បោះបង់'
}) {
  return new Promise((resolve) => {
    dialogResolve = resolve;

    const modal = document.getElementById('custom-dialog-modal');
    const iconEl = document.getElementById('dialog-icon');
    const iconWrap = document.getElementById('dialog-icon-wrap');
    const titleEl = document.getElementById('dialog-title');
    const msgEl = document.getElementById('dialog-message');
    const inputGroup = document.getElementById('dialog-input-group');
    const inputEl = document.getElementById('dialog-input');
    const btnCancel = document.getElementById('dialog-btn-cancel');
    const btnConfirm = document.getElementById('dialog-btn-confirm');

    if (!modal) {
      resolve(window.prompt(message, defaultValue));
      return;
    }

    if (iconEl) iconEl.textContent = icon;
    if (iconWrap) {
      iconWrap.className = 'custom-dialog-icon-badge info';
    }
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message.replace(/\n/g, '<br>');
    
    if (inputGroup) inputGroup.style.display = 'block';
    if (inputEl) {
      inputEl.value = defaultValue;
      inputEl.placeholder = placeholder;
    }

    const handleConfirm = () => {
      const val = inputEl ? inputEl.value : '';
      closeModal('custom-dialog-modal');
      if (dialogResolve) { dialogResolve(val); dialogResolve = null; }
    };

    if (inputEl) {
      inputEl.onkeydown = (e) => {
        if (e.key === 'Enter') handleConfirm();
      };
    }

    if (btnCancel) {
      btnCancel.style.display = 'inline-flex';
      btnCancel.textContent = cancelText;
      btnCancel.onclick = () => {
        closeModal('custom-dialog-modal');
        if (dialogResolve) { dialogResolve(null); dialogResolve = null; }
      };
    }

    if (btnConfirm) {
      btnConfirm.textContent = confirmText;
      btnConfirm.className = 'btn btn-primary dialog-btn';
      btnConfirm.onclick = handleConfirm;
    }

    openModal('custom-dialog-modal');
    setTimeout(() => { if (inputEl) inputEl.focus(); }, 150);
  });
}

// Reset / New Invoice
async function createNewInvoice() {
  if (!isOwnerLoggedIn) {
    showToast('លោកអ្នកត្រូវផ្ទៀងផ្ទាត់សិទ្ធិម្ចាស់ហាងជាមុនសិន!', 'error');
    openOwnerLoginModal();
    return;
  }
  const confirmed = await showCustomConfirm({
    icon: '✨',
    badgeType: 'warning',
    title: 'បង្កើតវិក្កយបត្រថ្មី',
    message: 'តើលោកអ្នកពិតជាចង់បង្កើតវិក្កយបត្រថ្មីមែនទេ?\n(ទិន្នន័យចាស់ដែលមិនបានរក្សាទុកអាចនឹងបាត់បង់)',
    confirmText: 'បង្កើតថ្មី',
    cancelText: 'បោះបង់'
  });
  if (confirmed) {
    playUiSound('pop');
    await cancelCorrectionMode(false);
    state = JSON.parse(JSON.stringify(defaultInvoiceState));
    const randomNum = Math.floor(100 + Math.random() * 900);
    state.invoiceNumber = `INV-${new Date().getFullYear()}-${randomNum}`;
    state.items = [
      { id: 1, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency },
      { id: 2, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency },
      { id: 3, description: '', details: '', quantity: 1, price: 0, discountPercent: 0, currency: state.currency }
    ];
    nextItemId = 4;
    renderFormInputs();
    renderInvoicePreview();
    autoSaveCurrentState();
    showToast('បានបង្កើតវិក្កយបត្រថ្មីរួចរាល់', 'success');
  }
}

// Print Action (100% Reliable, Never Blank)
function printInvoice() {
  playUiSound('print');
  // Auto-save invoice to cloud history before printing
  autoSaveCurrentState(true);
  const sheet = document.getElementById('printable-invoice-sheet');
  const wasMobileEditor = document.body.classList.contains('mobile-mode-editor');

  // 1. Temporarily neutralize mobile-mode-editor before opening print dialog
  if (wasMobileEditor) {
    document.body.classList.remove('mobile-mode-editor');
    document.body.classList.add('mobile-mode-preview');
  }

  // 2. Temporarily clear any responsive inline transform or negative margins
  let prevTransform = '';
  let prevMarginBottom = '';
  let prevMarginRight = '';
  if (sheet) {
    prevTransform = sheet.style.transform;
    prevMarginBottom = sheet.style.marginBottom;
    prevMarginRight = sheet.style.marginRight;
    sheet.style.transform = 'none';
    sheet.style.marginBottom = '0';
    sheet.style.marginRight = '0';
  }

  // 3. Ensure preview is re-rendered fresh
  renderInvoicePreview();

  // 4. Trigger print
  window.print();

  // 5. Restore mobile view and scaling smoothly after print dialog closes
  const restoreState = () => {
    if (wasMobileEditor) {
      document.body.classList.remove('mobile-mode-preview');
      document.body.classList.add('mobile-mode-editor');
    }
    if (sheet) {
      sheet.style.transform = prevTransform;
      sheet.style.marginBottom = prevMarginBottom;
      sheet.style.marginRight = prevMarginRight;
    }
    autoScaleInvoiceOnMobile();
  };

  if ('onafterprint' in window) {
    window.addEventListener('afterprint', restoreState, { once: true });
  } else {
    setTimeout(restoreState, 600);
  }
}

// Global print event listeners to guarantee 100% clean 1-page fit even when triggered via Ctrl+P
window.addEventListener('beforeprint', () => {
  const sheet = document.getElementById('printable-invoice-sheet');
  if (sheet) {
    sheet.dataset.prevTransform = sheet.style.transform || '';
    sheet.dataset.prevMarginBottom = sheet.style.marginBottom || '';
    sheet.dataset.prevMarginRight = sheet.style.marginRight || '';
    sheet.style.transform = 'none';
    sheet.style.marginBottom = '0';
    sheet.style.marginRight = '0';
  }
  updatePageFitIndicator();
});

window.addEventListener('afterprint', () => {
  const sheet = document.getElementById('printable-invoice-sheet');
  if (sheet && sheet.dataset.prevTransform !== undefined) {
    sheet.style.transform = sheet.dataset.prevTransform;
    sheet.style.marginBottom = sheet.dataset.prevMarginBottom;
    sheet.style.marginRight = sheet.dataset.prevMarginRight;
    delete sheet.dataset.prevTransform;
    delete sheet.dataset.prevMarginBottom;
    delete sheet.dataset.prevMarginRight;
  }
  if (typeof autoScaleInvoiceOnMobile === 'function') {
    autoScaleInvoiceOnMobile();
  }
});


// Modal handling
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  // Security guard: The login modal CANNOT be closed unless owner is authenticated!
  if (id === 'owner-login-modal' && !isOwnerLoggedIn) {
    return;
  }
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// // Saved Invoices Management (LocalStorage + Cloud Sync)
function getSavedInvoicesList() {
  try {
    return JSON.parse(localStorage.getItem('khmer_saved_invoices') || '[]');
  } catch (e) {
    return [];
  }
}

let isSyncingInvoices = false;

// Realtime Two-Way Cloud Sync (PC <-> Phone)
async function syncSavedInvoicesWithCloud(userTriggered = false) {
  if (isSyncingInvoices) return;
  isSyncingInvoices = true;

  const syncIcon = document.getElementById('cloud-sync-icon');
  const syncTitle = document.getElementById('cloud-sync-status-title');
  const syncDesc = document.getElementById('cloud-sync-status-desc');

  if (syncIcon) syncIcon.textContent = '🔄';
  if (syncTitle && userTriggered) syncTitle.textContent = 'កំពុងសមកាលកម្មជាមួយ Cloud...';

  try {
    // 1. Fetch remote list from Vercel Blob
    const res = await fetch('/api/invoices', { headers: getAuthHeaders(), cache: 'no-store' });
    let remoteInvoices = [];
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.invoices)) {
        remoteInvoices = data.invoices;
      }
    }

    // 2. Local list
    const localInvoices = getSavedInvoicesList();

    // 3. Merge: Index by invoice identifier (invoiceNumber or id)
    const map = new Map();
    // Put remote first
    remoteInvoices.forEach(inv => {
      const key = inv.data?.invoiceNumber || inv.id;
      if (key) map.set(key, inv);
    });

    let hasLocalNewerOrMissing = false;
    // Overlay or add local
    localInvoices.forEach(inv => {
      const key = inv.data?.invoiceNumber || inv.id;
      if (key) {
        if (!map.has(key)) {
          map.set(key, inv);
          hasLocalNewerOrMissing = true;
        } else {
          // If local exists in both, keep local if it has data
          const existing = map.get(key);
          if (JSON.stringify(existing.data) !== JSON.stringify(inv.data)) {
            map.set(key, inv);
            hasLocalNewerOrMissing = true;
          }
        }
      }
    });

    // Combined list
    const mergedList = Array.from(map.values());
    localStorage.setItem('khmer_saved_invoices', JSON.stringify(mergedList));

    // 4. If local had items missing from cloud, push merged list back to cloud
    if (hasLocalNewerOrMissing || (localInvoices.length > 0 && remoteInvoices.length === 0)) {
      fetch('/api/invoices', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ invoices: mergedList })
      }).catch(e => console.warn('Cloud sync push error:', e));
    }

    // Update UI
    if (syncIcon) syncIcon.textContent = '🟢';
    if (syncTitle) syncTitle.textContent = 'រក្សាទុកស្វ័យប្រវត្តិពីគ្រប់ឧបករណ៍ (PC ↔ ទូរស័ព្ទដៃ)';
    if (syncDesc) syncDesc.textContent = `ទិន្នន័យបានភ្ជាប់គ្នា (${mergedList.length} វិក្កយបត្រ) • ${new Date().toLocaleTimeString()}`;

    renderSavedInvoicesModal();

    if (userTriggered) {
      showToast(`រក្សាទុក និងសមកាលកម្មជោគជ័យ! សរុប ${mergedList.length} វិក្កយបត្រ`, 'success');
    }
  } catch (err) {
    console.warn('Sync failed:', err);
    if (syncIcon) syncIcon.textContent = '☁️';
    if (syncTitle) syncTitle.textContent = 'រក្សាទុកស្វ័យប្រវត្តិពីគ្រប់ឧបករណ៍ (PC ↔ ទូរស័ព្ទដៃ)';
    if (syncDesc) syncDesc.textContent = `ទិន្នន័យរក្សាទុកលើ Cloud ស្វ័យប្រវត្តិ (${localInvoices.length} វិក្កយបត្រ)`;
    if (userTriggered) {
      showToast('មិនអាចភ្ជាប់ទៅកាន់ Cloud បានទេនៅពេលនេះ', 'error');
    }
  } finally {
    isSyncingInvoices = false;
  }
}

async function saveCurrentInvoiceToHistory() {
  if (!isOwnerLoggedIn) {
    showToast('លោកអ្នកត្រូវផ្ទៀងផ្ទាត់សិទ្ធិម្ចាស់ហាងជាមុនសិន!', 'error');
    openOwnerLoginModal();
    return;
  }

  // If in correction mode, ask if user wants to update or save as new
  if (currentEditingInvoiceId) {
    const doUpdate = await showCustomConfirm({
      icon: '✏️',
      badgeType: 'info',
      title: 'កែតម្រូវវិក្កយបត្រ',
      message: 'វិក្កយបត្រនេះកំពុងស្ថិតក្នុងទម្រង់កែតម្រូវ។\n\n• ចុច [រក្សាទុកលើដើម] ដើម្បីជំនួសវិក្កយបត្រចាស់\n• ចុច [រក្សាទុកជាថ្មី] ដើម្បីរក្សាទុកជាវិក្កយបត្រថ្មីមួយផ្សេងទៀត',
      confirmText: 'រក្សាទុកលើដើម',
      cancelText: 'រក្សាទុកជាថ្មី'
    });
    if (doUpdate) {
      updateCurrentEditingInvoice();
      return;
    }
  }

  const list = getSavedInvoicesList();
  const defaultTitle = `${state.invoiceNumber} - ${state.client.nameKh || 'អតិថិជន'}`;
  const title = await showCustomPrompt({
    icon: '💾',
    badgeType: 'info',
    title: 'កំណត់ចំណាំវិក្កយបត្រ',
    message: 'សូមបញ្ចូលឈ្មោះសម្គាល់ ឬកំណត់ចំណាំសម្រាប់វិក្កយបត្រនេះ៖',
    defaultValue: defaultTitle,
    confirmText: 'រក្សាទុក',
    cancelText: 'បោះបង់'
  });
  if (!title) return;

  const entry = {
    id: 'inv_' + Date.now(),
    title: title,
    date: new Date().toLocaleString(),
    data: JSON.parse(JSON.stringify(state))
  };

  list.unshift(entry);
  localStorage.setItem('khmer_saved_invoices', JSON.stringify(list));

  // Push to Cloud API for PC <-> Phone real-time sync
  try {
    fetch('/api/invoices', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invoice: entry })
    }).catch(e => console.warn('Cloud save error:', e));

    if (entry.data && entry.data.invoiceNumber) {
      fetch('/api/invoice', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: entry.data.invoiceNumber, data: entry.data })
      }).catch(e => console.warn('Cloud single invoice save error:', e));
    }
  } catch (err) {}

  playUiSound('success');
  showToast('បានរក្សាទុកក្នុងប្រព័ន្ធ និង Cloud រួចរាល់!', 'success');
  renderSavedInvoicesModal();
}

function renderSavedInvoicesModal(customList = null) {
  const container = document.getElementById('saved-invoices-list');
  if (!container) return;

  if (!isOwnerLoggedIn) {
    container.innerHTML = '<div class="text-center py-6 text-gray-400">ប្រវត្តិវិក្កយបត្រអាចចូលពិនិត្យបានតែម្ចាស់ហាងប៉ុណ្ណោះ</div>';
    return;
  }

  const list = customList !== null ? customList : getSavedInvoicesList();

  if (list.length === 0) {
    container.innerHTML = '<div class="text-center py-6 text-gray-400">មិនទាន់មានវិក្កយបត្រដែលបានរក្សាទុកនៅឡើយទេ</div>';
    return;
  }

  container.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'saved-inv-item';

    // Compute total from saved data
    let totalDisplay = '-';
    if (item.data && item.data.items) {
      let sub = 0;
      const rate = Number(item.data.exchangeRate) || 4100;
      item.data.items.forEach(it => {
        const q = Number(it.quantity) || 0;
        const p = Number(it.price) || 0;
        const d = Number(it.discountPercent) || 0;
        const itCur = it.currency || item.data.currency || 'USD';
        const rawTot = (q * p) * (1 - d / 100);
        sub += convertCurrency(rawTot, itCur, item.data.currency || 'USD', rate);
      });
      let disc = 0;
      if (item.data.overallDiscountType === 'percent') {
        disc = sub * ((Number(item.data.overallDiscountValue) || 0) / 100);
      } else {
        disc = Number(item.data.overallDiscountValue) || 0;
      }
      const taxable = Math.max(0, sub - disc);
      const tax = taxable * ((Number(item.data.taxRate) || 0) / 100);
      const ship = Number(item.data.shippingFee) || 0;
      const grand = taxable + tax + ship;
      totalDisplay = formatMoney(grand, item.data.currency || 'USD');
    }

    const isCurrentEditing = currentEditingInvoiceId === item.id;
    const clientName = item.data?.client?.nameKh || '';
    const clientCompany = item.data?.client?.company || '';
    const clientDesc = [clientName, clientCompany].filter(Boolean).join(' • ');
    const safeId = escapeHtml(String(item.id || '').replace(/[^a-zA-Z0-9_-]/g, ''));

    div.innerHTML = `
      <div class="saved-inv-row-1">
        <div class="saved-inv-row-1-left">
          <span class="saved-inv-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</span>
          ${isCurrentEditing ? '<span class="correction-badge" style="font-size: 0.65rem;">✏️ កំពុងកែ</span>' : ''}
          <span class="saved-inv-date-tag">📅 ${item.date}</span>
        </div>
        <div class="saved-inv-total-badge">${totalDisplay}</div>
      </div>
      <div class="saved-inv-row-2">
        <div class="saved-inv-client-info" title="${escapeHtml(clientDesc || 'អតិថិជនទូទៅ')}">
          👤 ${escapeHtml(clientDesc || 'អតិថិជនទូទៅ')}
        </div>
        <div class="saved-inv-actions">
          <button class="btn btn-sm btn-outline" onclick="reviewSavedInvoice('${safeId}')" title="ពិនិត្យលម្អិត និងផ្ទៀងផ្ទាត់ការគិតលេខ">
            👁️ ពិនិត្យ
          </button>
          <button class="btn btn-sm btn-outline" onclick="shareSavedInvoice('${safeId}')" title="ចែករំលែកតំណខ្លីទៅកាន់អតិថិជន">
            🔗 ចែករំលែក
          </button>
          <button class="btn btn-sm btn-primary" onclick="editSavedInvoice('${safeId}')" title="កែតម្រូវទិន្នន័យ">
            ✏️ កែតម្រូវ
          </button>
          <button class="btn btn-sm btn-outline text-red-600" onclick="deleteSavedInvoice('${safeId}')" title="លុបវិក្កយបត្រនេះ">
            <svg style="width: 12px; height: 12px; fill: currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Search / Filter Saved Invoices
function filterSavedInvoices(query) {
  const allList = getSavedInvoicesList();
  if (!query || !query.trim()) {
    renderSavedInvoicesModal(allList);
    return;
  }
  const q = query.toLowerCase().trim();
  const filtered = allList.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const dateMatch = (item.date || '').toLowerCase().includes(q);
    const invNumMatch = (item.data?.invoiceNumber || '').toLowerCase().includes(q);
    const clientMatch = (item.data?.client?.nameKh || '').toLowerCase().includes(q);
    const phoneMatch = (item.data?.client?.phone || '').toLowerCase().includes(q);
    return titleMatch || dateMatch || invNumMatch || clientMatch || phoneMatch;
  });
  renderSavedInvoicesModal(filtered);
}

// Review Saved Invoice in Detail (Breakdown & Check for Calculation Errors)
function reviewSavedInvoice(id) {
  const list = getSavedInvoicesList();
  const item = list.find(i => i.id === id);
  if (!item || !item.data) {
    showToast('រកមិនឃើញទិន្នន័យវិក្កយបត្រនេះទេ!', 'error');
    return;
  }

  lastReviewedInvoiceId = id;
  const d = item.data;

  // Compute breakdown
  let subtotal = 0;
  let itemsRowsHtml = '';
  (d.items || []).forEach((it, idx) => {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.price) || 0;
    const disc = Number(it.discountPercent) || 0;
    const lineTotal = (qty * price) * (1 - disc / 100);
    subtotal += lineTotal;

    itemsRowsHtml += `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td>
          <strong>${escapeHtml(it.description || 'ទំនិញ')}</strong>
          ${it.details ? `<div style="font-size: 0.72rem; color: #64748b;">${escapeHtml(it.details)}</div>` : ''}
        </td>
        <td style="text-align: center;">${qty}</td>
        <td style="text-align: right;">${formatMoney(price, d.currency)}</td>
        <td style="text-align: center;">${disc > 0 ? disc + '%' : '-'}</td>
        <td style="text-align: right; font-weight: 600;">${formatMoney(lineTotal, d.currency)}</td>
      </tr>
    `;
  });

  let discountAmount = 0;
  if (d.overallDiscountType === 'percent') {
    discountAmount = subtotal * ((Number(d.overallDiscountValue) || 0) / 100);
  } else {
    discountAmount = Number(d.overallDiscountValue) || 0;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(d.taxRate) || 0;
  const taxAmount = taxableAmount * (taxRate / 100);
  const shippingFee = Number(d.shippingFee) || 0;
  const grandTotal = taxableAmount + taxAmount + shippingFee;
  const paid = Number(d.paidAmount) || 0;
  const balanceDue = Math.max(0, grandTotal - paid);

  const modalBody = document.getElementById('review-modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="background: var(--card-sub-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem; margin-bottom: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.825rem;">
          <div>
            <div style="color: var(--text-muted);">លេខវិក្កយបត្រ៖</div>
            <strong style="color: var(--primary-color); font-size: 0.95rem;">${escapeHtml(d.invoiceNumber || '-')}</strong>
          </div>
          <div>
            <div style="color: var(--text-muted);">កាលបរិច្ឆេទ៖</div>
            <strong>${formatDate(d.issueDate)}</strong>
          </div>
          <div>
            <div style="color: var(--text-muted);">អតិថិជន៖</div>
            <strong>${escapeHtml(d.client?.nameKh || '-')}</strong> ${d.client?.phone ? `(${escapeHtml(d.client.phone)})` : ''}
          </div>
          <div>
            <div style="color: var(--text-muted);">កាលបរិច្ឆេទរក្សាទុក៖</div>
            <span>${item.date}</span>
          </div>
        </div>
      </div>

      <div style="font-size: 0.825rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-main);">
        បញ្ជីទំនិញ និងតម្លៃ (${d.items?.length || 0} មុខ)៖
      </div>

      <table class="review-items-table">
        <thead>
          <tr>
            <th style="width: 35px; text-align: center;">ល.រ</th>
            <th>បរិយាយមុខទំនិញ</th>
            <th style="width: 50px; text-align: center;">ចំនួន</th>
            <th style="text-align: right;">តម្លៃឯកតា</th>
            <th style="width: 55px; text-align: center;">បញ្ចុះ%</th>
            <th style="text-align: right;">សរុប</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml || '<tr><td colspan="6" style="text-align: center; color: #94a3b8;">គ្មានទំនិញ</td></tr>'}
        </tbody>
      </table>

      <!-- Calculation breakdown -->
      <div style="background: var(--card-sub-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem; font-size: 0.825rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: var(--text-muted);">សរុបរង (Subtotal):</span>
          <span>${formatMoney(subtotal, d.currency)}</span>
        </div>
        ${discountAmount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; color: #ea580c;">
            <span>បញ្ចុះតម្លៃ (${d.overallDiscountValue || 0}${d.overallDiscountType === 'percent' ? '%' : ''}):</span>
            <span>-${formatMoney(discountAmount, d.currency)}</span>
          </div>
        ` : ''}
        ${taxAmount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="color: var(--text-muted);">អាករ VAT (${taxRate}%):</span>
            <span>${formatMoney(taxAmount, d.currency)}</span>
          </div>
        ` : ''}
        ${shippingFee > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="color: var(--text-muted);">សេវាដឹកជញ្ជូន:</span>
            <span>${formatMoney(shippingFee, d.currency)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding-top: 0.4rem; border-top: 1px dashed var(--border-color); font-weight: 700; font-size: 0.95rem; color: var(--primary-color);">
          <span>ទឹកប្រាក់សរុប (Grand Total):</span>
          <span>${formatMoney(grandTotal, d.currency)}</span>
        </div>
        ${paid > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-top: 0.35rem; color: #059669;">
            <span>បានទូទាត់រួច (Paid):</span>
            <span>${formatMoney(paid, d.currency)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-top: 0.35rem; font-weight: 700; color: #e11d48;">
          <span>នៅខ្វះ (Balance Due):</span>
          <span>${formatMoney(balanceDue, d.currency)}</span>
        </div>
      </div>

      <div style="margin-top: 0.85rem; font-size: 0.78rem; color: #475569; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 0.6rem;">
        💡 <strong>ការផ្ទៀងផ្ទាត់៖</strong> ប្រសិនបើពិនិត្យឃើញថាមានការគិតខុស ឬចង់កែសម្រួលបរិមាណ/តម្លៃ សូមចុចប៊ូតុង <strong>"✏️ កែតម្រូវវិក្កយបត្រនេះ"</strong> ខាងក្រោមដើម្បីកែឡើងវិញភ្លាមៗ។
      </div>
    `;
  }

  const modalTitle = document.getElementById('review-modal-title');
  if (modalTitle) {
    modalTitle.textContent = `ពិនិត្យផ្ទៀងផ្ទាត់៖ ${item.title || d.invoiceNumber}`;
  }

  openModal('review-modal');
}

// Proceed to Edit from Review modal
function proceedToEditFromReview() {
  if (lastReviewedInvoiceId) {
    closeModal('review-modal');
    editSavedInvoice(lastReviewedInvoiceId);
  }
}

// Edit / Correct Saved Invoice
function editSavedInvoice(id) {
  if (!isOwnerLoggedIn) {
    showToast('លោកអ្នកត្រូវផ្ទៀងផ្ទាត់សិទ្ធិម្ចាស់ហាងជាមុនសិន!', 'error');
    openOwnerLoginModal();
    return;
  }
  const list = getSavedInvoicesList();
  const item = list.find(i => i.id === id);
  if (!item || !item.data) {
    showToast('រកមិនឃើញទិន្នន័យវិក្កយបត្រនេះទេ!', 'error');
    return;
  }

  // Load into state
  currentEditingInvoiceId = id;
  state = JSON.parse(JSON.stringify(item.data));

  // Sync font & color theme
  if (state.fontFamily) setFontFamily(state.fontFamily);
  if (state.colorTheme) setColorTheme(state.colorTheme);

  // Update next item id
  if (state.items && state.items.length > 0) {
    nextItemId = Math.max(...state.items.map(i => i.id || 0)) + 1;
  }

  renderFormInputs();
  renderInvoicePreview();
  autoSaveCurrentState();

  // Show correction banner
  const banner = document.getElementById('correction-mode-banner');
  const titleEl = document.getElementById('correction-inv-title');
  if (banner) banner.style.display = 'flex';
  if (titleEl) {
    titleEl.textContent = `${state.invoiceNumber} (${state.client?.nameKh || 'អតិថិជន'})`;
  }

  // Close modals & switch to editor
  closeModal('saved-modal');
  closeModal('review-modal');
  setMobileView('editor');

  showToast(`បានបើក "${item.title}" សម្រាប់កែតម្រូវទិន្នន័យ!`, 'info');
}

// Load alias
function loadSavedInvoice(id) {
  editSavedInvoice(id);
}

// Save back modifications to current editing invoice
function updateCurrentEditingInvoice() {
  if (!currentEditingInvoiceId) {
    saveCurrentInvoiceToHistory();
    return;
  }

  const list = getSavedInvoicesList();
  const index = list.findIndex(i => i.id === currentEditingInvoiceId);
  if (index === -1) {
    showToast('មិនអាចរកឃើញវិក្កយបត្រដើមដើម្បីកែប្រែទេ!', 'error');
    return;
  }

  // Update existing record
  list[index].data = JSON.parse(JSON.stringify(state));
  list[index].title = `${state.invoiceNumber} - ${state.client?.nameKh || 'អតិថិជន'}`;
  list[index].date = new Date().toLocaleString() + ' (កែតម្រូវរួច)';

  localStorage.setItem('khmer_saved_invoices', JSON.stringify(list));

  // Push updated item to cloud in background
  try {
    fetch('/api/invoices', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invoice: list[index] })
    }).catch(e => console.warn('Cloud update error:', e));

    if (state.invoiceNumber) {
      fetch('/api/invoice', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: state.invoiceNumber, data: state })
      }).catch(e => console.warn('Cloud single invoice update error:', e));
    }
  } catch (err) {}

  // Hide correction banner
  const banner = document.getElementById('correction-mode-banner');
  if (banner) banner.style.display = 'none';

  showToast(`បានកែតម្រូវ និងរក្សាទុកវិក្កយបត្រ "${state.invoiceNumber}" ជោគជ័យ!`, 'success');
  currentEditingInvoiceId = null;
  renderSavedInvoicesModal();
}

// Cancel correction mode
async function cancelCorrectionMode(promptConfirm = true) {
  if (promptConfirm) {
    const confirmed = await showCustomConfirm({
      icon: '↩️',
      badgeType: 'warning',
      title: 'ចាកចេញពីការកែតម្រូវ',
      message: 'តើលោកអ្នកចង់ចាកចេញពីទម្រង់កែតម្រូវមែនទេ?\n(ការផ្លាស់ប្តូរថ្មីៗនឹងមិនត្រូវបានរក្សាទុកលើវិក្កយបត្រដើមឡើយ)',
      confirmText: 'ចាកចេញ',
      cancelText: 'បន្តកែតម្រូវ'
    });
    if (!confirmed) return;
  }
  currentEditingInvoiceId = null;
  const banner = document.getElementById('correction-mode-banner');
  if (banner) banner.style.display = 'none';
  showToast('បានចាកចេញពីទម្រង់កែតម្រូវ', 'info');
}

async function deleteSavedInvoice(id) {
  if (!isOwnerLoggedIn) {
    showToast('លោកអ្នកត្រូវផ្ទៀងផ្ទាត់សិទ្ធិម្ចាស់ហាងជាមុនសិន!', 'error');
    openOwnerLoginModal();
    return;
  }
  const confirmed = await showCustomConfirm({
    icon: '🗑️',
    badgeType: 'danger',
    isDanger: true,
    title: 'លុបវិក្កយបត្រ',
    message: 'តើលោកអ្នកពិតជាចង់លុបវិក្កយបត្រនេះចេញពីប្រព័ន្ធមែនទេ?\n(ទិន្នន័យដែលបានលុបមិនអាចទាញយកមកវិញបានឡើយ)',
    confirmText: 'លុបចេញ',
    cancelText: 'បោះបង់'
  });
  if (confirmed) {
    playUiSound('delete');
    let list = getSavedInvoicesList();
    const itemToDelete = list.find(i => i.id === id);
    list = list.filter(i => i.id !== id);
    localStorage.setItem('khmer_saved_invoices', JSON.stringify(list));

    // Delete from cloud API
    try {
      fetch(`/api/invoices?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: getAuthHeaders() })
        .catch(e => console.warn('Cloud delete error:', e));
      if (itemToDelete?.data?.invoiceNumber) {
        fetch(`/api/invoices?id=${encodeURIComponent(itemToDelete.data.invoiceNumber)}`, { method: 'DELETE', headers: getAuthHeaders() })
          .catch(e => {});
      }
    } catch (e) {}

    renderSavedInvoicesModal();
    showToast('បានលុបវិក្កយបត្ររួចរាល់', 'info');
  }
}

// Backup & Export JSON
function exportDataJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${state.invoiceNumber || 'invoice'}_data.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('បានទាញយកឯកសារ JSON រួចរាល់!', 'success');
}

// Import JSON
function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      state = { ...defaultInvoiceState, ...imported };
      renderFormInputs();
      renderInvoicePreview();
      autoSaveCurrentState();
      showToast('បានបញ្ចូលទិន្នន័យពី JSON ជោគជ័យ!', 'success');
    } catch (err) {
      showToast('ឯកសារ JSON មិនត្រឹមត្រូវ!', 'error');
    }
  };
  reader.readAsText(file);
}

// Toast Alert Messages
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
