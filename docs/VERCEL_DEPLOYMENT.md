# iPay — Vercel Production Deployment Guide

This guide details the exact procedure for deploying the **iPay** backend APIs, Master Admin portal (`/t20`), and responsive APK download website to [Vercel](https://vercel.com).

---

## 1. Architectural Highlights for Vercel

1. **Serverless Architecture**: All 26 backend REST endpoints are natively hosted inside `apps/web/app/api/v1/` as Next.js App Router route handlers. This eliminates the need for a separate long-running container or virtual machine.
2. **Serverless Database Pooling**: `lib/db.ts` caches the Mongoose connection across serverless lambda invocations to prevent connection exhaustion.
3. **Zero-Config In-Memory Fallback**: If `MONGODB_URI` is not provided in environment variables, the system seamlessly uses an in-memory data store (`lib/memoryStore.ts`) pre-seeded with all recording data (`9794678059`, King2141, 2621, packages, and wallets). This guarantees instant 1-click preview deployments without mandatory database provisioning.
4. **Master Admin Route**: The admin interface is hosted directly at `/t20` with JWT cookie authentication and audit logging.

---

## 2. Deploying via Vercel Dashboard

### Step 1: Import Repository
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your Git repository containing the iPay monorepo.

### Step 2: Configure Project Settings

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Next.js` | Vercel detects Next.js automatically |
| **Root Directory** | `apps/web` | Click **Edit** and select `apps/web` |
| **Build Command** | `cd ../.. && npm run build:shared && cd apps/web && npm run build` | Builds `@ipay/shared` package first |
| **Output Directory** | `.next` (default) | Standard Next.js output |
| **Install Command** | `cd ../.. && npm install` | Installs root monorepo dependencies |

### Step 3: Configure Environment Variables

Add the following environment variables in the Vercel project configuration:

```env
# Database (MongoDB Atlas) - Optional for initial preview
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ipay?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=ipay-production-secure-jwt-secret-2026-v1

# Master Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@iPay2026!#

# Public Base URL
NEXT_PUBLIC_API_URL=https://<your-project-name>.vercel.app
```

### Step 4: Deploy
Click **"Deploy"**. Vercel will build the shared package, compile the Next.js production bundle, and deploy the application worldwide on the Vercel Edge Network.

---

## 3. Deploying via Vercel CLI (Alternative)

You can also deploy directly from your local terminal:

```bash
# Install Vercel CLI
npm install -g vercel

# Log in
vercel login

# Deploy from repository root
vercel --cwd apps/web
```

---

## 4. Post-Deployment Verification

Once deployed, verify each component:

1. **API Health Check**:
   Visit `https://<your-domain>.vercel.app/api/v1/health`
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-10-20T...",
     "database": "connected",
     "version": "1.0.32"
   }
   ```

2. **Web Download Portal**:
   Visit `https://<your-domain>.vercel.app/`
   - Test APK Download button.
   - Test "Scan to Install" modal with dynamic QR code.
   - Verify responsive layout on desktop and mobile viewports.

3. **Master Admin Portal**:
   Visit `https://<your-domain>.vercel.app/t20`
   - Log in with `admin` / `Admin@iPay2026!#`.
   - Inspect live metrics, User Accounts, Deposit Approvals, Withdrawal Reviews, and Audit Logs.

4. **Connect React Native Mobile App**:
   Update `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to point to your new Vercel domain:
   ```env
   EXPO_PUBLIC_API_URL=https://<your-domain>.vercel.app
   ```
