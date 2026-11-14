# Privacy Policy for KODI — Windows Dynamic Island

**Last updated:** November 14, 2026

## 1. Overview
KODI ("the Application") is an open, lightweight, and local-only desktop utility designed for Windows 10 and Windows 11. Your privacy is paramount: **KODI does not collect, transmit, sell, or store any personal information on external servers.**

## 2. Data Collection and Processing
- **Zero Cloud Telemetry**: The Application does not send any telemetry, analytics, usage statistics, or crash reports to remote servers.
- **Local Storage Only**: All user settings, preferences, and window positions are saved locally on your computer at `%LOCALAPPDATA%\KODI\settings.json`.
- **Google Antigravity Quota**: Quota calculations, reset timers, and model tracking are resolved strictly on your local machine using the locally installed Antigravity CLI binary (`agy.exe`) or local state. The Application never inspects, extracts, or stores your private Google authentication tokens, cookies, or account credentials.
- **Media Sessions (Spotify / GSMTC)**: Playback status, song titles, artists, and album thumbnails are read locally from the Windows WinRT `GlobalSystemMediaTransportControlsSessionManager`. Audio streams or media files are never recorded or transmitted.
- **Hardware & Battery Telemetry**: System statistics (CPU utilization, RAM consumption, battery percentage, charging state, and network connectivity) are obtained directly from local Windows kernel APIs (`GetSystemPowerStatus`, `sysinfo`). No hardware identifiers or unique device fingerprints are uploaded.

## 3. Third-Party Services
KODI does not integrate with any third-party advertising networks, cloud databases, or tracking SDKs.

## 4. Permissions Required
- **System Tray & Startup**: Optional autostart with Windows if enabled by the user in Settings.
- **Media Controls**: Access to native Windows transport controls to allow playback controls (Play, Pause, Skip).
- **Global Hotkeys**: Registers `Ctrl + Alt + K` locally to toggle Movie Mode (hide/show the notch).

## 5. Security & Safety
KODI complies with Microsoft Store security guidelines:
- Runs within standard user privileges (no elevated administrator requirements).
- Does not modify protected system files or registry keys.
- Completely clean uninstallation via Windows Settings > Installed Apps.

## 6. Contact & Support
If you have questions, feedback, or concerns about this Privacy Policy, please open an issue on the official project repository or contact the developer.

