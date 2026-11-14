# Complete Guide: Releasing KODI to the Microsoft Store 🚀

This guide provides the exact, step-by-step procedure to publish **KODI — Windows Dynamic Island** to the official **Microsoft Store**.

---

## 📌 1. Overview & Strategy

Since Windows 11, Microsoft officially accepts **Win32 Desktop Applications (`.exe` / `.msi`)** in the Microsoft Store without needing complex MSIX conversion or wrappers.

Tauri 2 builds a clean, lightweight, standalone **NSIS installer (`.exe`)**:
- Location: `src-tauri/target/release/bundle/nsis/KODI_1.0.0_x64-setup.exe`
- Install mode: `currentUser` (installs cleanly to `%LOCALAPPDATA%\Programs\KODI` with **zero UAC administrator popups**).
- Silent install parameter: `/S`
- Silent uninstall parameter: `/S`

---

## 🔑 2. Prerequisites

1. **Microsoft Partner Center Account**:
   - Register at [partner.microsoft.com/dashboard](https://partner.microsoft.com/dashboard).
   - An Individual Developer account requires a one-time registration fee (~$19 USD, no annual renewals).
2. **Visual Studio C++ Build Tools** (if compiling on your local machine):
   - Needed by Rust to link the final desktop `.exe`.
   - Download: [Visual Studio Build Tools](https://aka.ms/vs/17/release/vs_BuildTools.exe) (Select *"Desktop development with C++"* and *"Windows 10/11 SDK"*).
3. **App Privacy Policy**:
   - Already created in [PRIVACY.md](file:///c:/Personal%20Projects/KODI/PRIVACY.md). When published to your GitHub repo, use the raw or web link (e.g., `https://github.com/your-username/kodi/blob/main/PRIVACY.md`).

---

## 🛠️ 3. Building the Release Binary

Run the automated build script:
```powershell
.\build.bat
# or manually:
npm run build
npm run tauri build
```

Once the build finishes, your installer will be ready at:
```
src-tauri\target\release\bundle\nsis\KODI_1.0.0_x64-setup.exe
```

---

## 📋 4. Step-by-Step Microsoft Partner Center Submission

### Step 1: Create a New App
1. Go to [Microsoft Partner Center](https://partner.microsoft.com/dashboard/apps-and-games/overview).
2. Click **"New product"** > **"MSIX or PWA app"** OR **"Win32 application"**.
   - *Recommended*: Select **"Win32 application"** (or use the MSIX packaging tool if you prefer an `.msix` bundle).
3. **Reserve Product Name**: Type `KODI` (or `KODI — Windows Dynamic Island`). Click **Reserve product name**.

---

### Step 2: Package & Installer Setup
Under the **Packages** or **Installer details** section:
- **Installer Type**: `EXE` (NSIS)
- **Installer URL / Upload**: Upload `KODI_1.0.0_x64-setup.exe` or provide your hosted download link (e.g. from GitHub Releases).
- **Silent Install Parameters**: `/S`
- **Silent Uninstall Parameters**: `/S`
- **Architecture**: `X64`
- **Minimum OS Version**: `Windows 10 version 1809 (Build 17763) or higher`

---

### Step 3: Store Listing & Metadata
Fill in the official listing fields:

#### Product Title
`KODI — Windows Dynamic Island`

#### Short Description (up to 100 characters)
`Lightweight, elegant Windows Dynamic Island with Google Antigravity quota monitoring & Spotify.`

#### Full Description
```
KODI is a lightweight, elegant, and high-performance desktop utility inspired by Apple's Dynamic Island and the macOS notch, designed specifically for Windows 10 and Windows 11.

Living discreetly at the top-center of your desktop as an obsidian floating pill, KODI expands smoothly to present Google Antigravity AI quota monitoring, Spotify and native media controls, hardware telemetry, and productivity shortcuts.

🌟 KEY FEATURES:
• Google Antigravity AI Quota Monitor: Track Gemini 3.8 Flash, Gemini 1.5 Pro, Claude 3.5 Sonnet, and GPT-4o usage with live 1-second countdown reset clocks and proactive threshold alerts.
• Spotify & Media Integration: Live audio wave visualizer in Spotify green (#1DB954), track information, album artwork, and native playback controls (Play/Pause, Next, Previous).
• Hardware & Power Telemetry: Multi-core CPU utilization, RAM consumption, and real-time laptop battery percentage with charging lightning-bolt indicator.
• Movie Mode (Ctrl + Alt + K): Instant stealth hide mode so the notch never obstructs full-screen movies, YouTube videos, or games.
• Zero Cloud Telemetry: Completely local-only utility with zero tracking, no token extraction, and negligible background resource consumption.
```

#### Search Keywords (Tags)
`dynamic island`, `notch`, `antigravity`, `gemini`, `spotify`, `system monitor`, `battery`, `desktop widget`, `productivity`

---

### Step 4: Properties & Categories
- **Category**: `Productivity` or `Utilities & tools`
- **Privacy Policy URL**: Link to your `PRIVACY.md`
- **Website / Support Contact**: Your GitHub profile or support email.

---

### Step 5: Age Rating (IARC)
1. Click **Age Ratings**.
2. Complete the short questionnaire:
   - Does the app contain violence? -> *No*
   - Does it share user location? -> *No*
   - Does it allow communication with strangers? -> *No*
3. You will receive an instant rating of **3+ / Everyone** worldwide.

---

### Step 6: Store Assets (Images & Screenshots)
Prepare and upload:
1. **App Icon**: 
   - 1:1 Square PNG (`512x512` or `300x300`). Found in [src-tauri/icons/icon.png](file:///c:/Personal%20Projects/KODI/src-tauri/icons/icon.png).
2. **Screenshots** (1920x1080 or 1366x768):
   - **Screenshot 1**: Top-flush Dynamic Island in Compact mode with Google Antigravity logo & battery ring.
   - **Screenshot 2**: Expanded Quota dashboard with live countdown clocks and model cards.
   - **Screenshot 3**: Music tab with Spotify player, album art, and green equalizer.
   - **Screenshot 4**: System tab with multi-core CPU, RAM, and battery charging metrics.
   - **Screenshot 5**: Movie Mode stealth hide indicator (`Ctrl + Alt + K`).

---

### Step 7: Pricing and Availability
- **Pricing**: `Free`
- **Markets**: `All markets (Worldwide)`
- **Visibility**: `Public`

---

### Step 8: Submit for Certification!
1. Review all sections. Ensure every section shows a green checkmark.
2. Click **"Submit to the Store"**.
3. Microsoft's automated and human certification review typically completes within **24 to 72 hours**.
4. Once approved, KODI will be live and downloadable directly from the Microsoft Store on Windows 10 and 11! 🎉

