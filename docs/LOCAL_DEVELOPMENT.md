# iPay — Local Development Guide

This guide walks you through setting up and running the entire **iPay** monorepo locally, including the shared package, Next.js web application & backend API, and the React Native / Expo mobile application.

---

## 1. System Requirements & Prerequisites

- **Node.js**: `v18.0.0` or higher (tested with Node `v24.x`)
- **Package Manager**: `npm` `v9.x` or higher
- **Expo CLI**: bundled with `npx expo`
- **Optional**: MongoDB connection URI (if omitted, the system automatically uses its zero-config in-memory database with pre-seeded demo state)

---

## 2. Monorepo Architecture

```
.
├── apps/
│   ├── mobile/         # React Native (Expo) mobile application
│   └── web/            # Next.js 14 App Router (Web Portal, Master Admin /t20, Backend API)
├── packages/
│   └── shared/         # TypeScript types, constants, localizations (EN/HI)
├── assets/images/      # Recreated high-fidelity UI visual assets
├── docs/               # Technical documentation, guides, and matrices
├── scripts/            # Seed scripts and maintenance utilities
└── tests/              # 12/12 integration and flow test suites
```

---

## 3. Environment Configuration

Copy the example environment configuration into both root and `apps/web/`:

```bash
cp .env.example .env
cp .env.example apps/web/.env.local
```

### Key Environment Variables (`.env.example`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas or local connection string | `mongodb+srv://...` (Leave blank for in-memory DB) |
| `JWT_SECRET` | Secret key for JSON Web Tokens | `ipay-production-secure-jwt-secret-2026-v1` |
| `ADMIN_USERNAME` | Master Admin login username | `admin` |
| `ADMIN_PASSWORD` | Master Admin login password | `Admin@iPay2026!#` |
| `NEXT_PUBLIC_API_URL` | Public API URL for web client | `http://localhost:3000` |
| `EXPO_PUBLIC_API_URL` | API endpoint for mobile app | `http://<YOUR_LOCAL_IP>:3000` or production URL |

---

## 4. Step-by-Step Local Run

### Step 1: Install Dependencies

From the repository root:
```bash
npm install
```

### Step 2: Build the Shared Domain Package

Build the TypeScript definitions, validation models, and English/Hindi dictionaries:
```bash
npm run build:shared
```

### Step 3: Seed Database (Optional / Verification)

Seed test accounts, wallet bindings, orders, packages, and system config:
```bash
npm run seed
```

### Step 4: Start the Web App & Backend API

Launch Next.js in development mode:
```bash
npm run dev:web
```
- **Web Download Portal**: [http://localhost:3000](http://localhost:3000)
- **Master Admin Portal**: [http://localhost:3000/t20](http://localhost:3000/t20)
- **API Health Check**: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

### Step 5: Start the Mobile App

In a separate terminal:
```bash
npm run dev:mobile
```
Press:
- `w` to open in web browser preview
- `a` to open in Android Emulator
- Scan QR code with the **Expo Go** app on your physical Android device

---

## 5. Pre-Seeded Default Accounts

### Mobile User Account (from screen recording)
- **Phone Number**: `9794678059`
- **Login Password**: `King2141`
- **Secondary Transaction Password**: `2621`
- **User ID**: `113429`
- **Initial Account Balance**: `₹10.00`
- **Referral Code**: `9794678059`

### Master Admin Portal (`/t20`)
- **URL**: `http://localhost:3000/t20`
- **Username**: `admin`
- **Password**: `Admin@iPay2026!#`

---

## 6. Running Integration Tests

Run the complete 12-test validation suite covering auth, secondary password 3-strike lockout, USDT calculation, Quota packages, BharatPe OTP 3133 KYC rule, abnormal order warning, admin deposit/withdrawal balance mutations, and audit logging:

```bash
npm test
```
All 12 tests must return `[PASS] (100% Success)`.
