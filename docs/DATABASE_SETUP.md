# MongoDB Database Architecture & Setup Guide

## 1. Overview
The iPay database layer is built using MongoDB Atlas with Mongoose. It uses strict schema validation, unique indexes on primary business keys, atomic balance operations, and immutable audit logs.

## 2. Collections & Indexes

### 2.1 `users`
- `userId` (String, unique, indexed) - e.g. `"113429"`
- `phone` (String, unique, indexed) - e.g. `"9794678059"`
- `passwordHash` (String) - bcrypt/argon2 hashed
- `secondaryPasswordHash` (String) - secondary verification
- `failedSecondaryAttempts` (Number, default 0)
- `isSecondaryLocked` (Boolean, default false)
- `balance` (Number, default 10) - INR precision
- `totalDeposit` / `totalWithdrawal` (Number)
- `isUpiBound` (Boolean, default false)
- `referralCode` (String, unique, indexed)
- `status` (Enum: `ACTIVE`, `FROZEN`, `BANNED`)

### 2.2 `depositorders`
- `orderNumber` (String, unique, indexed) - e.g. `"USDT172941000"`
- `userId` (String, indexed)
- `type` (`INR` | `USDT`)
- `amount` (Number)
- `amountInr` (Number)
- `txidOrHash` (String)
- `proofImageUrl` (String)
- `status` (Enum: `PENDING`, `SUCCESS`, `CANCELLED`, `REJECTED`)
- `createdAt` / `completedAt` (Date)

### 2.3 `withdrawalorders`
- `orderNumber` (String, unique, indexed)
- `userId` (String, indexed)
- `amount` (Number)
- `upiId` (String)
- `status` (Enum: `PENDING`, `SUCCESS`, `CANCELLED`, `REJECTED`)

### 2.4 `billrecords`
- `userId` (String, indexed)
- `type` (String) - e.g. `"Bonus_Join telegram"`
- `amount` (Number)
- `isPositive` (Boolean)
- `balanceAfter` (Number)
- `createdAt` (Date)

### 2.5 `adminusers` & `auditlogs`
- Role-based administration accounts with timestamped audit records.

## 3. MongoDB Atlas Setup Instructions

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a free M0 or production cluster.
3. In **Database Access**, create an application user with read/write permissions.
4. In **Network Access**, add `0.0.0.0/0` (or Vercel serverless IP ranges).
5. Copy your connection string into `.env`:
   ```bash
   MONGODB_URI=mongodb+srv://admin:secure_password@cluster0.mongodb.net/ipay?retryWrites=true&w=majority
   ```
6. Run the database seed script:
   ```bash
   node scripts/seed.js
   ```

## 4. Zero-Config Local Mode
If `MONGODB_URI` is not set, the platform automatically activates its zero-config In-Memory data store (`lib/memoryStore.ts`) pre-seeded with the exact user from the recording (`9794678059` / `King2141` / `2621`).
