use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KodiSettings {
    pub start_with_windows: bool,
    pub launch_minimized: bool,
    pub compact_by_default: bool,
    pub notch_width: u32,
    pub notch_height: u32,
    pub animation_speed: String, // "fast", "normal", "slow"
    pub antigravity_enabled: bool,
    pub antigravity_refresh_interval_secs: u32,
    pub antigravity_simulation_mode: bool,
    pub warning_threshold_70: bool,
    pub warning_threshold_85: bool,
    pub warning_threshold_95: bool,
    pub notifications_enabled: bool,
    pub system_monitor_enabled: bool,
    pub music_integration_enabled: bool,
}

impl KodiSettings {
    /// Server-side validation and sanitization for settings received over IPC or read from disk.
    pub fn sanitize(&mut self) {
        // Enforce safe boundary limits on dimensions (prevents UI denial of service or window clipping)
        self.notch_width = self.notch_width.clamp(200, 1920);
        self.notch_height = self.notch_height.clamp(32, 1080);

        // Enforce safe interval range (between 5 seconds and 3600 seconds)
        self.antigravity_refresh_interval_secs = self.antigravity_refresh_interval_secs.clamp(5, 3600);

        // Sanitize animation_speed to strictly recognized enum values
        if self.animation_speed != "fast" && self.animation_speed != "normal" && self.animation_speed != "slow" {
            self.animation_speed = "normal".to_string();
        }
    }
}

impl Default for KodiSettings {
    fn default() -> Self {
        Self {
            start_with_windows: false,
            launch_minimized: false,
            compact_by_default: true,
            notch_width: 340,
            notch_height: 48,
            animation_speed: "normal".to_string(),
            antigravity_enabled: true,
            antigravity_refresh_interval_secs: 60,
            antigravity_simulation_mode: true, // Default to true so user immediately sees live quotas upon install!
            warning_threshold_70: true,
            warning_threshold_85: true,
            warning_threshold_95: true,
            notifications_enabled: true,
            system_monitor_enabled: true,
            music_integration_enabled: true,
        }
    }
}

fn get_settings_file_path() -> PathBuf {
    let mut dir = dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("."));
    dir.push("KODI");
    let _ = fs::create_dir_all(&dir);
    dir.push("settings.json");
    dir
}

pub fn load_settings_from_disk() -> KodiSettings {
    let path = get_settings_file_path();
    if path.exists() {
        if let Ok(content) = fs::read_to_string(&path) {
            if let Ok(mut settings) = serde_json::from_str::<KodiSettings>(&content) {
                settings.sanitize();
                return settings;
            }
        }
    }
    let default = KodiSettings::default();
    let _ = save_settings_to_disk(&default);
    default
}

pub fn save_settings_to_disk(settings: &KodiSettings) -> Result<(), String> {
    let path = get_settings_file_path();
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_settings() -> Result<KodiSettings, String> {
    Ok(load_settings_from_disk())
}

#[tauri::command]
pub fn save_settings(mut settings: KodiSettings) -> Result<KodiSettings, String> {
    settings.sanitize();
    save_settings_to_disk(&settings)?;
    Ok(settings)
}

