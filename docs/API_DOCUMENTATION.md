# iPay REST API v1 Specification

**Base URL**: `/api/v1`

---

## 1. Authentication Endpoints

### 1.1 `POST /auth/login`
Authenticates a user via phone and password.
- **Request Body**:
  ```json
  {
    "phone": "9794678059",
    "password": "King2141"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "userId": "113429",
      "phone": "9794678059",
      "phoneMasked": "97*****8059",
      "balance": 10,
      "isUpiBound": false,
      "referralCode": "dwkPTEzMzQyOSZjaGFuk"
    }
  }
  ```
- **Error (400 Bad Request)**:
  ```json
  {
    "error": "Account or password error"
  }
  ```

### 1.2 `POST /auth/register`
Creates a new user profile with welcome bonus.
- **Request Body**:
  ```json
  {
    "phone": "9876543210",
    "password": "Password123",
    "referralCode": "dwkPTEzMzQyOSZjaGFuk"
  }
  ```

### 1.3 `GET /auth/me`
Fetches the currently authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns full `UserProfile` object.

### 1.4 `POST /auth/verify-secondary`
Verifies user's secondary password for high-security actions.
- **Request Body**:
  ```json
  {
    "secondaryPassword": "2621"
  }
  ```
- **Error (400 Bad Request)**:
  ```json
  {
    "error": "Wrong secondary password. 2 attempt(s) remaining. Repeated errors lock operations.",
    "remainingAttempts": 2
  }
  ```

---

## 2. Quota & Deposit Endpoints

### 2.1 `GET /deposit/packages`
Returns all configured INR Quota packages.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "packages": [
      {
        "id": "quota-1",
        "rangeText": "100-301 INR",
        "minAmount": 100,
        "maxAmount": 301,
        "incomeText": "₹3.80(3.8%)+3.00(Activity)",
        "stockCount": 119,
        "quotaBonus": 106.8
      }
    ]
  }
  ```

### 2.2 `POST /deposit/usdt/initiate`
Initiates Tron TRC20 USDT deposit order with fixed ratio (109 INR).
- **Request Body**:
  ```json
  {
    "amountUsdt": 10,
    "withdrawalAddress": "800"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "order": {
      "orderNumber": "USDT172941000",
      "amountUsdt": 10,
      "amountInr": 1090,
      "usdtRatio": 109,
      "depositAddress": "TPFKUWVEYB772899N9UL",
      "network": "Tron(TRC20)",
      "expiresInSeconds": 3600
    }
  }
  ```

### 2.3 `POST /deposit/usdt/submit`
Submits Txid or Hash proof for USDT deposit.
- **Request Body**:
  ```json
  {
    "orderNumber": "USDT172941000",
    "txidOrHash": "0x4b789...e9a",
    "proofUrl": "/uploads/proof_sample.jpg"
  }
  ```

---

## 3. Wallet Binding Endpoints

### 3.1 `GET /wallets/available`
Lists supported payment providers (PhonePe, Paytm, BharatPe, Mobikwik, Freecharge, etc.) with methods and recommendation tags.

### 3.2 `POST /wallets/bind`
Binds merchant or consumer UPI account with OTP verification.
- **Request Body**:
  ```json
  {
    "provider": "bharatpe_business",
    "method": "OTP",
    "phoneNumber": "9794678059",
    "otp": "3133"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Error occurred, please try again. Detail: kyc not completed: status=NOT_ACTIVATED"
  }
  ```

---

## 4. Withdrawal & Records Endpoints

### 4.1 `POST /withdrawals`
Creates a withdrawal order. Enforces UPI binding and quota invariants.
- **Error if Unbound (400 Bad Request)**:
  ```json
  {
    "error": "ABNORMAL_ORDER",
    "message": "1. This order is abnormal.\n\n2. Please verify your UPI status and contact customer service promptly.\n\n⚠️ Note:\nFailure to respond in a timely manner will result in automatic order failure. Funds will not be credited, and any losses incurred shall be borne by yourself."
  }
  ```

### 4.2 `GET /bills`
Returns financial statement / audit trail.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "bills": [
      {
        "type": "Bonus_Join telegram",
        "amount": 10,
        "isPositive": true,
        "balanceAfter": 10,
        "createdAt": "23:13:58 19/10/2026"
      }
    ]
  }
  ```

---

## 5. Master Admin Endpoints (/t20)

### 5.1 `POST /admin/auth/login`
- **Request Body**: `{ "username": "admin", "password": "Admin@iPay2026!#" }`
- **Response**: Sets `ipay_admin_token` cookie and returns admin profile.

### 5.2 `PATCH /admin/deposits`
Approves or rejects user deposit.
- **Request Body**: `{ "orderNumber": "USDT172941000", "action": "APPROVE" }`
- **Action**: Atomically credits user balance and writes immutable BillRecord.

### 5.3 `PATCH /admin/users`
Updates account status (ACTIVE, FROZEN, BANNED), balance adjustment, or resets secondary password lock.

### 5.4 `POST /admin/settings`
Updates live USDT conversion ratio, TRC20 address, and compliance notice text.
