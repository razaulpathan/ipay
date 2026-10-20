# iPay — Android Standalone APK & EAS Build Guide

This document provides instructions for compiling, packaging, and distributing the **iPay** mobile application as a standalone Android APK (`com.ipay.app`, version `1.0.32`) using Expo Application Services (EAS Build) or local Gradle toolchains.

---

## 1. EAS Build Configuration (`eas.json`)

To enable cloud builds, create or verify `eas.json` in `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 9.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-production-domain.vercel.app"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-production-domain.vercel.app"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

> **Note**: The `"preview"` profile produces a direct `.apk` file that users can sideload without going through the Google Play Store, perfectly matching the direct download landing page flow.

---

## 2. Cloud Build Steps with EAS CLI

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Log into Expo Account
```bash
eas login
```

### Step 3: Link Project & Configure EAS
From the mobile directory (`apps/mobile`):
```bash
cd apps/mobile
eas build:configure
```

### Step 4: Run the Standalone APK Build
Trigger the Android APK generation using the preview profile:
```bash
eas build -p android --profile preview
```
- EAS will build the project in the cloud.
- Once complete, EAS will output a direct download URL for `ipay-v1.0.32.apk`.

---

## 3. Placing the APK into the Next.js Download Portal

Once the APK is downloaded:
1. Move the APK file into the web public downloads directory:
   ```bash
   cp ipay-v1.0.32.apk apps/web/public/downloads/ipay-v1.0.32.apk
   ```
2. The landing page (`apps/web/app/page.tsx`) immediately serves this APK at:
   `https://<your-domain>/downloads/ipay-v1.0.32.apk`
3. The QR Code generator on the landing page allows Android users to scan and download the file directly to their devices.

---

## 4. Local Offline Build (Alternative via Android Studio / Gradle)

If you have Android Studio and the Android SDK (API 34) installed locally:

### Step 1: Prebuild Native Android Project
```bash
cd apps/mobile
npx expo prebuild --platform android
```

### Step 2: Assemble Release APK
```bash
cd android
./gradlew assembleRelease
```
The output APK will be generated at:
`apps/mobile/android/app/build/outputs/apk/release/app-release.apk`

---

## 5. Android Permissions & App Manifest

The app configuration in `app.json` includes all necessary permissions matching the screen recording:
- `CAMERA`: For photographing payment slips and USDT transfer confirmations.
- `READ_EXTERNAL_STORAGE` / `READ_MEDIA_IMAGES`: For uploading deposit vouchers from the gallery.
- `INTERNET`: For connecting to the iPay backend APIs and WebSocket customer support.
- `ACCESS_NETWORK_STATE`: For detecting network availability.
