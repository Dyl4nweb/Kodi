# KODI — Lightweight Windows Dynamic Island

**KODI** is a minimal, elegant, and high-performance Windows desktop application inspired by Apple's Dynamic Island and the macOS notch. Living discreetly at the top-center of the Windows desktop as a floating pill, KODI expands smoothly to present desktop telemetry, native media controls, quick actions, and **Google Antigravity AI quota monitoring**.

---

## 🌟 Key Features

### 1. ⚡ Google Antigravity Quota Monitor (Priority Feature)
- **Model Quota Breakdown**: Live tracking for **Gemini 3.8 Flash**, **Gemini 1.5 Pro**, **Claude 3.5 Sonnet**, **GPT-4o**, and custom model groups.
- **Dual Usage Windows**: Real-time progress bars for both **5-hour** and **weekly** usage limits.
- **Precision Reset Countdowns**: Live `HH:MM:SS` countdown timer until quota windows refresh.
- **Proactive Threshold Alerts**: Configurable warning notifications when 70%, 85%, or 95% of quota is consumed.
- **Status Indicators**:
  - 🟢 **Healthy** (> 30% remaining quota)
  - 🟡 **Warning** (15% – 30% remaining quota)
  - 🔴 **Critical** (< 15% remaining quota)
  - ⚪ **Disconnected / Offline** (CLI or local state unavailable)
- **Modular Quota Provider**:
  - `CliQuotaProvider`: Auto-detects local `agy.exe` binary in `~/.gemini/bin` or system `PATH`.
  - `LocalStateQuotaProvider`: Inspects local Antigravity state and session logs.
  - `SimulationQuotaProvider`: An interactive demonstration mode for testing UI animations, countdowns, and alert banners when no active CLI session is present.
- **Privacy & Security**: Zero cloud telemetry, zero credential/token extraction, and strictly local-only monitoring.

### 2. 🎵 Spotify & Native Windows Media Sessions (GSMTC)
- Direct integration with Windows WinRT `GlobalSystemMediaTransportControlsSessionManager`.
- Special focus on **Spotify**:
  - Live equalizer bars in **Spotify Green (`#1DB954`)** in the compact notch.
  - One-click **"Launch Spotify App"** button (via `spotify:` protocol handler).
  - Track title, artist, album name, and native album artwork thumbnail.
  - Media controls: **Play / Pause**, **Previous Track**, and **Next Track**.
- Compatible with other media apps (YouTube Music, Apple Music, Chrome, Edge).

### 3. 🎬 Movie Mode (Hide with `Ctrl + Alt + K`)
- Dedicated stealth mode so KODI never blocks full-screen movies, videos, or games.
- **Global Hotkey `Ctrl + Alt + K`**: Instantly hide or show the Dynamic Island from anywhere.
- **Hover Quick-Hide**: Click the sleek `Hide` button when hovering over the pill.
- **Stealth Top-Edge Bar**: When hidden, a subtle top-edge bar lets you click or press `Ctrl + Alt + K` to bring the notch back smoothly.
- **System Tray Control**: Right-click tray option to toggle Movie Mode.

### 4. 🎨 macOS Notch & Dynamic Island Visual Design
- **Top-Flush Design**: Attaches seamlessly to the top edge of the primary display.
- **Concave Flared Ears**: Smooth inverted-curve corners that scoop naturally into the screen bezel, matching the user reference design.
- **Tri-Section Compact Layout**:
  - **Left**: Circular progress ring with inner orange `Week` label and percentage (`61%` weekly quota).
  - **Center**: Active app/terminal context or live Spotify equalizer wave with song title.
  - **Right**: Quota percentage (`12%`) paired with an emerald ring gauge and glowing gem icon.

### 5. 🖥️ Windows Hardware & System Monitor
- Native **CPU Usage %** with real-time delta tracking via `sysinfo`.
- **RAM Usage** metrics (used GB / total GB and usage percentage).
- **Battery & Power Telemetry** via native Win32 `GetSystemPowerStatus` (percentage, charging status, AC power detection).
- Network online/offline status and system uptime clock.
- Throttled, low-overhead background polling to ensure negligible CPU and RAM consumption.

### 4. 🪟 True Dynamic Island Floating Desktop Shell
- **Dynamic OS Window Resizing**: Unlike web mockups that scale a fixed transparent window, KODI uses native Tauri window resizing between states:
  - **Compact State** (`336 × 44 px`): Small, sleek pill at top-center. Clicks outside the pill fall directly through to desktop windows without blocking!
  - **Expanded State** (`480 × 440 px`): Fluid spring physics animation presenting widget tabs.
  - **Notification State** (`410 × 74 px`): Floating toast pill for quota threshold warnings and media updates with auto-collapse timer.
  - **Settings State** (`510 × 480 px`): Modal configuration view.
- **Borderless & Transparent**: Zero window decorations, DWM transparency, always-on-top positioning, and hidden from the Windows taskbar.
- **System Tray Integration**: Quiet background execution with tray icon and context menu (`Show/Hide`, `Expand/Collapse`, `Refresh Quota`, `Quit`).

### 5. ⚙️ Local Settings & Preferences
- Stored locally in `%LOCALAPPDATA%\KODI\settings.json`.
- Preferences for:
  - Startup with Windows (logon launch).
  - Launch minimized to system tray.
  - Compact mode by default.
  - Notch width and animation speed (Fast, Normal, Slow).
  - Antigravity refresh interval (30s – 300s).
  - Warning thresholds (70%, 85%, 95%).
  - Hardware and media monitor toggles.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js App Router (React 19, TypeScript)
- **Styling**: Tailwind CSS with custom obsidian glassmorphic design
- **Animations**: Framer Motion spring physics
- **Icons**: Lucide React
- **Desktop Shell**: Tauri 2 (Rust)
- **Windows Integrations**: `windows` crate (WinRT GSMTC, Win32 Power APIs, DWM), `sysinfo`, `dirs`
- **Output Target**: Next.js Static Export (`output: 'export'`) loaded directly by Tauri with zero Node.js server overhead

---

## 📂 Project Structure

```
KODI/
├── src/
│   ├── app/
│   │   ├── globals.css         # Glassmorphic surfaces, keyframes, scrollbars
│   │   ├── layout.tsx          # Root transparent HTML layout
│   │   └── page.tsx            # Island orchestrator & keyboard accessibility
│   ├── components/
│   │   ├── CompactPill.tsx     # 336x44 compact Dynamic Island pill
│   │   ├── ExpandedNotch.tsx   # Expanded tabbed notch container
│   │   ├── NotificationBanner.tsx # Floating toast alerts
│   │   ├── SettingsModal.tsx   # Comprehensive preferences window
│   │   └── widgets/
│   │       ├── AntigravityWidget.tsx # Quota dashboard & reset timers
│   │       ├── MediaWidget.tsx       # GSMTC native media controls
│   │       ├── SystemWidget.tsx      # CPU, RAM, Battery monitor
│   │       └── QuickActionsWidget.tsx# Desktop utility shortcuts
│   ├── hooks/
│   │   └── useKodiState.ts     # State management, polling, notifications
│   ├── lib/
│   │   └── tauri.ts            # Safe Tauri invoke & browser fallback bridge
│   └── types/
│       └── index.ts            # Full TypeScript schemas
├── src-tauri/
│   ├── src/
│   │   ├── main.rs             # Application entrypoint (windows_subsystem)
│   │   ├── lib.rs              # Tauri builder, commands & system tray
│   │   ├── window.rs           # Dynamic OS window positioning & resizing
│   │   ├── antigravity.rs      # Quota provider trait & model monitors
│   │   ├── media.rs            # WinRT GSMTC session query & controls
│   │   ├── system.rs           # Win32 hardware & battery telemetry
│   │   └── settings.rs         # Disk persistence in LocalAppData
│   ├── capabilities/
│   │   └── default.json        # Tauri 2 security capabilities
│   ├── icons/                  # High-DPI icons (.ico, .png)
│   ├── Cargo.toml              # Rust crate dependencies
│   └── tauri.conf.json         # Tauri 2 configuration
├── out/                        # Next.js static production export
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Development & Build Instructions

### Prerequisites
- **Node.js**: v18+ (tested with Node.js v24.16.0, npm v11.13.0)
- **Rust**: 1.80+ (MSVC toolchain or GNU toolchain)
- **Windows C++ Build Tools**: Visual Studio 2022 Build Tools (with C++ workload and Windows SDK) for Tauri desktop binary compilation.

### 1. Install Dependencies
```powershell
npm install
```

### 2. Run in Development Mode
To test the interactive Dynamic Island in your browser or local dev server:
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to interact with the full island states, toggle widgets, test audio visualizer, inspect quota cards, and trigger notifications.

### 3. Generate Static Next.js Production Build
```powershell
npm run build
```
This generates the zero-server static HTML/JS/CSS assets into the `out/` directory.

### 4. Run Desktop Shell with Tauri
```powershell
npm run tauri dev
```

### 5. Build Final Windows Desktop Installer (.exe / .msi)
```powershell
npm run tauri build
```
The compiled standalone executable and NSIS installer will be located in:
`src-tauri/target/release/bundle/nsis/KODI_1.0.0_x64-setup.exe`

---

## 🔒 Privacy & Security Guarantees
- No cloud telemetry or third-party tracking.
- No credential or authentication token extraction.
- Completely local desktop utility operating within standard Windows user privileges.

