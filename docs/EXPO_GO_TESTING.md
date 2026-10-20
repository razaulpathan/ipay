# iPay — Expo Go Testing Guide

This guide describes how to run and test the **iPay** mobile application on a physical smartphone (Android or iOS) using the **Expo Go** client without requiring native Android Studio or Xcode builds.

---

## 1. Prerequisites

1. **Install Expo Go on your smartphone**:
   - **Android**: Download [Expo Go on Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
   - **iOS**: Download [Expo Go on Apple App Store](https://apps.apple.com/app/expo-go/id982107779).
2. **Wi-Fi Network**: Ensure your computer and smartphone are connected to the same local Wi-Fi network, OR use tunnel mode (see below).

---

## 2. Configuring the Backend API Endpoint

Because `localhost` on a physical smartphone refers to the smartphone itself (not your development computer), you must configure the backend API address:

### Option A: Local Network IP (Fastest)
1. Find your development machine's local IP address:
   - **Windows**: Run `ipconfig` in PowerShell (look for IPv4 address, e.g., `192.168.1.105`).
   - **macOS / Linux**: Run `ifconfig` or `ip a`.
2. Update `apps/mobile/.env`:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.1.105:3000
   ```

### Option B: Cloud / Vercel Production URL (Recommended for Remote Testing)
Point your mobile app directly to the deployed Vercel instance:
```bash
EXPO_PUBLIC_API_URL=https://your-ipay-deployment.vercel.app
```

---

## 3. Starting the Expo Development Server

From the repository root:

```bash
# Standard local network mode
npm run dev:mobile

# OR using Expo Tunnel (bypasses router firewall and AP isolation)
npx expo start --prefix apps/mobile --tunnel
```

---

## 4. Connecting Your Phone

1. **Android**: Open the **Expo Go** app and tap **"Scan QR code"**. Point your camera at the QR code displayed in your terminal.
2. **iOS**: Open the native **Camera** app, scan the QR code displayed in the terminal, and tap the prompt to open in Expo Go.
3. The JavaScript bundle will download and the iPay application will start immediately.

---

## 5. QA Verification Checklist on Physical Device

Follow this step-by-step checklist matching the authentic reference recording:

- [ ] **1. Splash Screen & Brand Identity**:
  - Emerald green splash screen displays with authentic iPay branding and lightning emblem.
- [ ] **2. Sign-In Modal Flow**:
  - Modal prompts for Phone and Password.
  - Enter test credentials (`Phone: 9794678059`, `Password: King2141`).
  - Account loads with User ID `113429` and balance `₹10.00`.
- [ ] **3. Home Screen & Announcements**:
  - Live marquee news ticker scrolls across the top.
  - Visual banners rotate: Invite Reward (`100+50`), Payment Rewards, and Important Compliance Notice.
  - Floating WhatsApp support button (FAB) is draggable or pinned at bottom-right.
- [ ] **4. Quota Packages**:
  - Tap through quota cards (₹500 to ₹10,000).
  - Verify live daily income calculations (e.g., ₹500 package yielding 8.00% daily).
- [ ] **5. Secondary Password Verification (`2621`)**:
  - Trigger a restricted action (e.g., USDT deposit or wallet withdrawal).
  - Authentic 4-digit custom PIN pad appears.
  - Enter `2621` -> Success toast and access granted.
  - Test wrong PIN -> Error banner shows remaining attempts (lockout after 3 failures).
- [ ] **6. USDT Deposit Flow**:
  - Navigate to **Deposit** -> Select **USDT (TRC20)**.
  - Exchange rate displays `1 USDT = 109 INR`.
  - Enter `10 USDT` -> Automatically computes `1,090 INR`.
  - Tap **Copy Address** -> TRC20 address copied to clipboard.
  - Tap **Upload Voucher** -> Pick screenshot from phone gallery.
  - Tap **Submit Order** -> Displays green smiling 🙂 status popup and records order.
- [ ] **7. Tools & Wallet Binding**:
  - Navigate to **Tools** tab.
  - Select **PhonePe**, **BharatPe OTP**, or **Paytm**.
  - In BharatPe OTP, entering OTP `3133` immediately triggers authentic KYC verification error dialog matching recording.
- [ ] **8. Teams & Referral Dashboard**:
  - View referral link and invite code `9794678059`.
  - Switch between Tier 1, Tier 2, and Tier 3 subline trees.
- [ ] **9. Assets & Billing Records**:
  - Navigate to **Assets** tab.
  - View ledger transactions (deposits, quota yields, team commissions).
- [ ] **10. 24/7 Customer Service Chat**:
  - Navigate to **Customer Service** tab.
  - Send message -> Instant auto-responder responds with agent status.
- [ ] **11. Language Toggle**:
  - Tap Language switcher in top header.
  - Toggle between English (EN) and Hindi (हिन्दी) — entire interface translates dynamically.
