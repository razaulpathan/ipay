# iPay — Comprehensive Feature & Screen Verification Matrix

This matrix documents the complete alignment between the reference screen recording (`video6249126949814280694.mp4`), the implemented mobile application (`apps/mobile/`), the backend API and database layer (`apps/web/app/api/v1/`), the Master Admin portal (`apps/web/app/t20/`), the Web Landing portal (`apps/web/app/page.tsx`), and automated verification tests.

---

## 1. Complete Screen & Component Matrix

| ID | Feature / Screen | Reference Flow | Mobile Implementation | Backend / Data Handler | Verification Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **S01** | **Splash Screen** | 3D emerald iPay branding with stylized lightning emblem | `apps/mobile/assets/splash_screen.jpg` | Static asset / Expo splash config | Verified |
| **S02** | **Sign-In Modal** | Mobile number & login password authentication | `src/components/modals/SignInModal.tsx` | `POST /api/v1/auth/login` | Verified |
| **S03** | **Home Screen Header** | Marquee ticker, language selector, WhatsApp support | `src/screens/HomeScreen.tsx` | `GET /api/v1/config/app` | Verified |
| **S04** | **Balance & Profile Card** | Balance `₹10.00`, UID `113429`, Quota status | `src/screens/HomeScreen.tsx` | `GET /api/v1/auth/me` | Verified |
| **S05** | **Promotional Banners** | 3D "100+50 Reward", Payment Rewards, Warning Notice | `src/screens/HomeScreen.tsx` | Local high-res assets & config | Verified |
| **S06** | **Quota Packages Grid** | ₹500 to ₹10,000 packages with dynamic daily yields | `src/screens/HomeScreen.tsx` | `GET /api/v1/quota/packages` | Verified |
| **S07** | **Secondary Password PIN Pad** | 4-digit PIN `2621`, custom keypad, 3-attempt lockout | `src/components/modals/VerifySecondaryModal.tsx` | `POST /api/v1/auth/secondary/verify` | Verified (Test T3) |
| **S08** | **USDT TRC20 Deposit** | `1 USDT = 109 INR`, address copy, screenshot upload | `src/screens/DepositUSDTScreen.tsx` | `POST /api/v1/deposit/usdt/submit` | Verified (Test T4) |
| **S09** | **Success Smiling 🙂 Popup** | Authentic green smiling face SVG modal | `src/components/StatusPopup.tsx` | Integrated into context | Verified |
| **S10** | **Error Sad ☹️ Popup** | Authentic red sad face SVG modal | `src/components/StatusPopup.tsx` | Integrated into context | Verified |
| **S11** | **Tools Screen** | Grid of wallet providers (PhonePe, BharatPe, Paytm) | `src/screens/ToolsScreen.tsx` | `GET /api/v1/wallets/available` | Verified |
| **S12** | **Wallet Binding Screen** | Account details input, OTP verification | `src/screens/WalletBindingScreen.tsx` | `POST /api/v1/wallets/bind` | Verified (Test T6) |
| **S13** | **BharatPe OTP KYC Error** | Entering OTP `3133` triggers KYC error dialog | `src/screens/WalletBindingScreen.tsx` | `POST /api/v1/wallets/bind` | Verified (Test T7) |
| **S14** | **Abnormal Order Warning** | Warning modal when withdrawing without bound wallet | `src/components/modals/WarningModal.tsx` | `POST /api/v1/withdrawals/submit` | Verified (Test T8) |
| **S15** | **Teams Referral Dashboard** | Invitation code `9794678059`, Tier 1/2/3 breakdown | `src/screens/TeamsScreen.tsx` | `GET /api/v1/teams/report` | Verified |
| **S16** | **Subline Member Listing** | UID, registration date, recharge, commissions | `src/screens/SublineListScreen.tsx` | `GET /api/v1/teams/sublines` | Verified |
| **S17** | **Assets Overview** | Total balance, recharge, withdrawal, quota earnings | `src/screens/AssetsScreen.tsx` | `GET /api/v1/auth/me` | Verified |
| **S18** | **Billing Records** | Filterable ledger: All, Recharge, Withdraw, Quota | `src/screens/BillHistoryScreen.tsx` | `GET /api/v1/bills/history` | Verified |
| **S19** | **24/7 Customer Service Chat** | Live chat messaging, automated support responses | `src/screens/CustomerServiceScreen.tsx` | `GET/POST /api/v1/support/chat` | Verified |
| **S20** | **Bonus & Reward Tasks** | Daily check-in, invite milestones, task claim | `src/screens/BonusScreen.tsx` | `GET/POST /api/v1/rewards/tasks` | Verified |
| **S21** | **Language Switcher Modal** | English and Hindi dynamic translations | `src/components/modals/LanguageModal.tsx` | `@ipay/shared` localizations | Verified (Test T1) |
| **S22** | **Master Admin Portal (`/t20`)** | Dashboard KPIs, User search, Deposit/Withdraw review | `apps/web/app/t20/page.tsx` | `apps/web/app/api/v1/admin/*` | Verified (Tests T9-T12) |
| **S23** | **Web Download Landing Page** | Release metadata v1.0.32, direct APK download, QR modal | `apps/web/app/page.tsx` | Next.js App Router | Verified |

---

## 2. Automated Test Verification Summary

| Test ID | Test Category | Specification & Verification Rule | Status |
| :---: | :--- | :--- | :---: |
| **T1** | Localization | English & Hindi localizations contain all critical UI keys | **PASS** |
| **T2** | Authentication | Password hashing & verification (`King2141`) | **PASS** |
| **T3** | Security Lockout | Secondary PIN (`2621`) enforcement & 3-attempt lockout | **PASS** |
| **T4** | Financial Engine | USDT to INR conversion rate (`1 USDT = 109 INR`) | **PASS** |
| **T5** | Business Rules | INR Quota package boundaries & daily yield calculations | **PASS** |
| **T6** | Form Validation | Wallet binding validation enforces account details | **PASS** |
| **T7** | Reference Behavior | BharatPe OTP `3133` triggers exact KYC error response | **PASS** |
| **T8** | Risk Mitigation | Unbound UPI withdrawal request triggers Abnormal Order Warning | **PASS** |
| **T9** | Admin Security | Master Admin credentials verification (`admin` / `Admin@iPay2026!#`) | **PASS** |
| **T10** | Balance Ledger | Atomic balance crediting upon admin deposit approval | **PASS** |
| **T11** | Balance Ledger | Automatic balance refund upon admin withdrawal rejection | **PASS** |
| **T12** | Compliance | Privileged admin action generates tamper-evident audit log | **PASS** |

---

## 3. Strict Boundary Compliance

1. **Zero Dead Buttons**: Every single tab, card, quick action, modal button, and form submission contains real state mutation, input validation, or API communication.
2. **Exact Master Admin URL**: The admin portal is strictly located at `/t20`.
3. **True Reference Asset Reproduction**: All graphics (emerald logo, splash screen, Indian boy/girl reward banner, security notice) were generated as high-fidelity originals with zero external hotlinking.
4. **Offline & Serverless Resilience**: Fully operational in dual modes — serverless MongoDB Atlas pooling or zero-config in-memory database with instant pre-seeded test fixtures.
