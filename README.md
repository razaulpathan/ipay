# iPay — Full-Stack Fintech Platform & Mobile Application

A complete, production-ready recreation of the **iPay** mobile application and fintech ecosystem based directly on the reference screen recording (`video6249126949814280694.mp4`).

Includes a React Native / Expo mobile app, a Next.js 14 responsive landing and download portal, a Master Admin portal under `/t20`, and 26 serverless-compatible REST API endpoints backed by MongoDB Atlas with a zero-config in-memory fallback.

---

## 1. System Architecture

```
├── apps/
│   ├── mobile/                    # React Native / Expo application
│   │   ├── src/screens/           # 14 authentic screens (Home, Deposit, USDT, Tools, Teams, etc.)
│   │   ├── src/components/        # Modals, custom SVG 🙂/☹️ popups, WhatsApp FAB
│   │   └── src/context/           # State, auth, session persistence, language toggle
│   └── web/                       # Next.js 14 App Router
│       ├── app/api/v1/            # 26 serverless REST API endpoints
│       ├── app/t20/               # Master Admin management portal
│       ├── app/page.tsx           # APK download portal & install instructions
│       └── lib/                   # Mongoose connection pooling, dataService, JWT auth
├── packages/
│   └── shared/                    # Types, models, constants, English & Hindi dictionaries
├── assets/images/                 # High-resolution original graphics and banners
├── docs/                          # In-depth architectural & deployment guides
├── scripts/                       # Database seed and maintenance utilities
└── tests/                         # Automated 12/12 integration test suite
```

---

## 2. Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested with `v24.x`)
- **npm**: `v9.x` or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Shared Package
```bash
npm run build:shared
```

### 3. Run Automated Integration Tests
```bash
npm test
```
*Executes all 12 validation suites (auth, secondary PIN, USDT calculation, KYC rules, admin mutations, audit logs) with a 100% pass rate.*

### 4. Start Next.js Web App & Backend API
```bash
npm run dev:web
```
- **Web Download Portal**: [http://localhost:3000](http://localhost:3000)
- **Master Admin Portal**: [http://localhost:3000/t20](http://localhost:3000/t20)
- **API Health Check**: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

### 5. Start Mobile Application
```bash
npm run dev:mobile
```
- Press `w` for Web preview
- Press `a` for Android emulator
- Scan the terminal QR code with the **Expo Go** app on your physical smartphone

---

## 3. Pre-Seeded Default Credentials

### User Account (from screen recording)
- **Phone Number**: `9794678059`
- **Login Password**: `King2141`
- **Secondary Transaction PIN**: `2621`
- **User ID**: `113429`
- **Initial Balance**: `₹10.00`
- **Referral Code**: `9794678059`

### Master Admin Portal (`/t20`)
- **Portal URL**: [http://localhost:3000/t20](http://localhost:3000/t20)
- **Username**: `admin`
- **Password**: `Admin@iPay2026!#`

---

## 4. Key Highlights & Reference Fidelity

1. **Zero Dead Buttons**: Every single card, button, tab, quick-action, and modal form has complete working logic, state persistence, or API integration.
2. **Authentic Emerald Design**: Styled to the exact reference emerald color (`#00b87c`), custom SVG sad face ☹️ and smiling face 🙂 dialogs, dark overlays, and responsive typography.
3. **TRC20 USDT Deposit Engine**: Live exchange rate calculation (`1 USDT = 109 INR`), clipboard address copy, and proof voucher upload with instant admin review queue.
4. **Secondary Password Protection**: 4-digit PIN verification (`2621`) with a custom 0–9 numpad, masking, and automated 3-attempt lockout security.
5. **Multi-Wallet Binding**: PhonePe, BharatPe OTP (with authentic OTP `3133` KYC error trigger), and Paytm account binding.
6. **Multi-Tier Teams Hierarchy**: 3-level referral network (Tier 1, Tier 2, Tier 3) tracking active members, recharge volumes, and commission yields.
7. **Master Admin (`/t20`)**: Executive dashboard with user balance management, 1-click deposit approvals, withdrawal reviews with automatic balance refunds upon rejection, and tamper-evident audit logs.
8. **Dual Persistence Support**: Transparent Mongoose connection caching for MongoDB Atlas, plus an automatic zero-config in-memory fallback for instant local and preview deployments.

---

## 5. Documentation Index

- [Local Development Guide](docs/LOCAL_DEVELOPMENT.md) — Step-by-step local machine setup and execution.
- [API Documentation](docs/API_DOCUMENTATION.md) — Specification of all 26 REST API routes.
- [Database Setup Guide](docs/DATABASE_SETUP.md) — MongoDB Atlas configuration, indexing, and data models.
- [Expo Go Testing Guide](docs/EXPO_GO_TESTING.md) — Physical device testing checklist and instructions.
- [Android Standalone APK & EAS Build Guide](docs/ANDROID_EAS_BUILD.md) — Standalone APK generation and release steps.
- [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT.md) — Production deployment settings and environment variables.
- [Comprehensive Feature Matrix](docs/FEATURE_MATRIX.md) — Full alignment matrix of all 23+ screens and 12 automated test specifications.
