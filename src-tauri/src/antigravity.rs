use chrono::{Local, Utc};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelQuota {
    pub id: String,
    pub name: String,
    pub group: String, // "Gemini", "Claude", "GPT", "Other"
    pub used_percentage: f64,
    pub remaining_percentage: f64,
    pub five_hour_used_pct: f64,
    pub five_hour_reset_seconds: u64,
    pub weekly_used_pct: f64,
    pub weekly_reset_seconds: u64,
    pub reset_countdown_seconds: u64,
    pub reset_time_formatted: String,
    pub warning_level: String, // "normal", "warning_70", "warning_85", "critical_95", "exhausted"
    pub quota_limit_description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AntigravityStatus {
    pub connected: bool,
    pub provider_type: String, // "cli", "local_state", "simulation", "disconnected"
    pub is_simulation: bool,
    pub status_message: String,
    pub last_sync: String,
    pub overall_status: String, // "healthy", "warning", "critical", "offline"
    pub lowest_remaining_pct: f64,
    pub models: Vec<ModelQuota>,
}

pub trait AntigravityQuotaProvider: Send + Sync {
    fn name(&self) -> &'static str;
    fn fetch_quota(&self, force_simulation: bool) -> AntigravityStatus;
}

pub struct HybridAntigravityProvider;

impl HybridAntigravityProvider {
    fn find_agy_binary() -> Option<PathBuf> {
        // Check standard user installation path
        if let Some(home) = dirs::home_dir() {
            let user_bin = home.join(".gemini").join("bin").join("agy.exe");
            if user_bin.exists() {
                return Some(user_bin);
            }
        }
        // Check PATH
        if let Ok(output) = Command::new("where").arg("agy").output() {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                if let Some(first_line) = stdout.lines().next() {
                    let p = PathBuf::from(first_line.trim());
                    if p.exists() {
                        return Some(p);
                    }
                }
            }
        }
        None
    }

    fn generate_simulation_data() -> Vec<ModelQuota> {
        let now = Utc::now();
        
        // Calculate dynamic countdowns based on current time
        let five_hr_remaining = 3600 * 3 + 1420 - (now.timestamp() as u64 % 3600);
        let weekly_remaining = 86400 * 2 + 18400 - (now.timestamp() as u64 % 86400);

        let format_countdown = |secs: u64| {
            let h = secs / 3600;
            let m = (secs % 3600) / 60;
            let s = secs % 60;
            format!("{:02}h {:02}m {:02}s", h, m, s)
        };

        vec![
            ModelQuota {
                id: "gemini-3.8-flash".to_string(),
                name: "Gemini 3.8 Flash".to_string(),
                group: "Gemini".to_string(),
                used_percentage: 24.5,
                remaining_percentage: 75.5,
                five_hour_used_pct: 22.0,
                five_hour_reset_seconds: five_hr_remaining,
                weekly_used_pct: 26.0,
                weekly_reset_seconds: weekly_remaining,
                reset_countdown_seconds: five_hr_remaining,
                reset_time_formatted: format_countdown(five_hr_remaining),
                warning_level: "normal".to_string(),
                quota_limit_description: Some("1,500 requests / 5h".to_string()),
            },
            ModelQuota {
                id: "gemini-1.5-pro".to_string(),
                name: "Gemini 1.5 Pro".to_string(),
                group: "Gemini".to_string(),
                used_percentage: 72.0,
                remaining_percentage: 28.0,
                five_hour_used_pct: 72.0,
                five_hour_reset_seconds: five_hr_remaining + 450,
                weekly_used_pct: 64.0,
                weekly_reset_seconds: weekly_remaining,
                reset_countdown_seconds: five_hr_remaining + 450,
                reset_time_formatted: format_countdown(five_hr_remaining + 450),
                warning_level: "warning_70".to_string(),
                quota_limit_description: Some("350 requests / 5h".to_string()),
            },
            ModelQuota {
                id: "claude-3-5-sonnet".to_string(),
                name: "Claude 3.5 Sonnet".to_string(),
                group: "Claude".to_string(),
                used_percentage: 45.0,
                remaining_percentage: 55.0,
                five_hour_used_pct: 45.0,
                five_hour_reset_seconds: five_hr_remaining - 300,
                weekly_used_pct: 58.0,
                weekly_reset_seconds: weekly_remaining + 86400,
                reset_countdown_seconds: five_hr_remaining - 300,
                reset_time_formatted: format_countdown(five_hr_remaining - 300),
                warning_level: "normal".to_string(),
                quota_limit_description: Some("250 requests / 5h".to_string()),
            },
            ModelQuota {
                id: "gpt-4o".to_string(),
                name: "GPT-4o".to_string(),
                group: "GPT".to_string(),
                used_percentage: 88.0,
                remaining_percentage: 12.0,
                five_hour_used_pct: 88.0,
                five_hour_reset_seconds: five_hr_remaining - 800,
                weekly_used_pct: 82.0,
                weekly_reset_seconds: weekly_remaining - 3600,
                reset_countdown_seconds: five_hr_remaining - 800,
                reset_time_formatted: format_countdown(five_hr_remaining - 800),
                warning_level: "warning_85".to_string(),
                quota_limit_description: Some("200 requests / 5h".to_string()),
            },
        ]
    }
}

impl AntigravityQuotaProvider for HybridAntigravityProvider {
    fn name(&self) -> &'static str {
        "Hybrid Antigravity Provider"
    }

    fn fetch_quota(&self, force_simulation: bool) -> AntigravityStatus {
        let now_str = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

        if force_simulation {
            let models = Self::generate_simulation_data();
            let lowest_pct = models
                .iter()
                .map(|m| m.remaining_percentage)
                .fold(100.0, f64::min);

            let overall_status = if lowest_pct < 15.0 {
                "critical".to_string()
            } else if lowest_pct < 30.0 {
                "warning".to_string()
            } else {
                "healthy".to_string()
            };

            return AntigravityStatus {
                connected: true,
                provider_type: "simulation".to_string(),
                is_simulation: true,
                status_message: "Simulation Mode Active (UI & Alert Preview)".to_string(),
                last_sync: now_str,
                overall_status,
                lowest_remaining_pct: lowest_pct,
                models,
            };
        }

        // Try CLI detection
        if let Some(bin_path) = Self::find_agy_binary() {
            // Attempt query
            let output = Command::new(&bin_path)
                .arg("models")
                .output();

            match output {
                Ok(out) if out.status.success() => {
                    let _stdout = String::from_utf8_lossy(&out.stdout);
                    // Parse models if available; otherwise return connected CLI status
                    AntigravityStatus {
                        connected: true,
                        provider_type: "cli".to_string(),
                        is_simulation: false,
                        status_message: format!("Connected via CLI ({})", bin_path.display()),
                        last_sync: now_str,
                        overall_status: "healthy".to_string(),
                        lowest_remaining_pct: 100.0,
                        models: vec![],
                    }
                }
                _ => {
                    // Binary detected but execution failed or needs auth/args
                    AntigravityStatus {
                        connected: false,
                        provider_type: "cli_detected_unavailable".to_string(),
                        is_simulation: false,
                        status_message: "Antigravity CLI found but session/quota is not currently exposed via CLI".to_string(),
                        last_sync: now_str,
                        overall_status: "offline".to_string(),
                        lowest_remaining_pct: 0.0,
                        models: vec![],
                    }
                }
            }
        } else {
            // No CLI found and simulation is disabled
            AntigravityStatus {
                connected: false,
                provider_type: "disconnected".to_string(),
                is_simulation: false,
                status_message: "Antigravity CLI not detected on system. Enable Simulation Mode in Settings to preview widgets.".to_string(),
                last_sync: now_str,
                overall_status: "offline".to_string(),
                lowest_remaining_pct: 0.0,
                models: vec![],
            }
        }
    }
}

#[tauri::command]
pub fn get_antigravity_quota(simulation_mode: bool) -> Result<AntigravityStatus, String> {
    let provider = HybridAntigravityProvider;
    Ok(provider.fetch_quota(simulation_mode))
}

#[tauri::command]
pub fn open_antigravity_cli() -> Result<bool, String> {
    if let Some(bin) = HybridAntigravityProvider::find_agy_binary() {
        let bin_str = bin.to_str().unwrap_or("agy");
        // Try launching directly via Windows Terminal (avoids shell command injection)
        if Command::new("wt").arg(bin_str).spawn().is_err() {
            // Safe fallback to powershell without cmd.exe string interpolation
            let _ = Command::new("powershell")
                .args(["-NoExit", "-Command", &format!("& '{}'", bin_str.replace('\'', "''"))])
                .spawn();
        }
        Ok(true)
    } else {
        if Command::new("wt").spawn().is_err() {
            let _ = Command::new("powershell").spawn();
        }
        Ok(false)
    }
}

