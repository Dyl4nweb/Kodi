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

    fn count_recent_requests() -> usize {
        if let Some(home) = dirs::home_dir() {
            let log_path = home.join(".gemini").join("antigravity").join("cli.log");
            if let Ok(content) = std::fs::read_to_string(log_path) {
                return content.lines().filter(|l| l.contains("streamGenerateContent")).count();
            }
        }
        0
    }

    fn generate_simulation_data() -> Vec<ModelQuota> {
        let now = Utc::now();
        
        // Calculate dynamic countdowns based on current time
        let five_hr_remaining = 3600 * 4 + 1800 - (now.timestamp() as u64 % 3600);
        let weekly_remaining = 86400 * 5 + 14400 - (now.timestamp() as u64 % 86400);

        let format_countdown = |secs: u64| {
            let h = secs / 3600;
            let m = (secs % 3600) / 60;
            let s = secs % 60;
            format!("{:02}h {:02}m {:02}s", h, m, s)
        };

        vec![
            ModelQuota {
                id: "gemini-3.8-flash-high".to_string(),
                name: "Gemini 3.8 Flash (High)".to_string(),
                group: "Gemini".to_string(),
                used_percentage: 4.2,
                remaining_percentage: 95.8,
                five_hour_used_pct: 4.2,
                five_hour_reset_seconds: five_hr_remaining,
                weekly_used_pct: 8.5,
                weekly_reset_seconds: weekly_remaining,
                reset_countdown_seconds: five_hr_remaining,
                reset_time_formatted: format_countdown(five_hr_remaining),
                warning_level: "normal".to_string(),
                quota_limit_description: Some("1,500 requests / 5h".to_string()),
            },
            ModelQuota {
                id: "claude-sonnet-4-6".to_string(),
                name: "Claude Sonnet 4.6 (Thinking)".to_string(),
                group: "Claude".to_string(),
                used_percentage: 14.0,
                remaining_percentage: 86.0,
                five_hour_used_pct: 14.0,
                five_hour_reset_seconds: five_hr_remaining,
                weekly_used_pct: 22.0,
                weekly_reset_seconds: weekly_remaining,
                reset_countdown_seconds: five_hr_remaining,
                reset_time_formatted: format_countdown(five_hr_remaining),
                warning_level: "normal".to_string(),
                quota_limit_description: Some("350 requests / 5h".to_string()),
            },
            ModelQuota {
                id: "claude-opus-4-6-thinking".to_string(),
                name: "Claude Opus 4.6 (Thinking)".to_string(),
                group: "Claude".to_string(),
                used_percentage: 38.0,
                remaining_percentage: 62.0,
                five_hour_used_pct: 38.0,
                five_hour_reset_seconds: five_hr_remaining - 300,
                weekly_used_pct: 45.0,
                weekly_reset_seconds: weekly_remaining,
                reset_countdown_seconds: five_hr_remaining - 300,
                reset_time_formatted: format_countdown(five_hr_remaining - 300),
                warning_level: "normal".to_string(),
                quota_limit_description: Some("100 requests / 5h".to_string()),
            },
            ModelQuota {
                id: "gpt-oss-120b-medium".to_string(),
                name: "GPT-OSS 120B (Medium)".to_string(),
                group: "GPT".to_string(),
                used_percentage: 18.0,
                remaining_percentage: 82.0,
                five_hour_used_pct: 18.0,
                five_hour_reset_seconds: five_hr_remaining - 600,
                weekly_used_pct: 28.0,
                weekly_reset_seconds: weekly_remaining,
                reset_countdown_seconds: five_hr_remaining - 600,
                reset_time_formatted: format_countdown(five_hr_remaining - 600),
                warning_level: "normal".to_string(),
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

            if let Ok(out) = output {
                if out.status.success() {
                    let stdout = String::from_utf8_lossy(&out.stdout);
                    let recent_requests_5h = Self::count_recent_requests();
                    let now = Utc::now();
                    let five_hr_remaining = 3600 * 5 - (now.timestamp() as u64 % (3600 * 5));
                    let weekly_remaining = 86400 * 7 - (now.timestamp() as u64 % (86400 * 7));

                    let format_countdown = |secs: u64| {
                        let h = secs / 3600;
                        let m = (secs % 3600) / 60;
                        let s = secs % 60;
                        format!("{:02}h {:02}m {:02}s", h, m, s)
                    };

                    let mut models = Vec::new();
                    for line in stdout.lines() {
                        let trimmed = line.trim();
                        if trimmed.is_empty() || trimmed.starts_with("Fetching") {
                            continue;
                        }
                        let parts: Vec<&str> = trimmed.split('\t').collect();
                        let (id, name) = if parts.len() >= 2 {
                            (parts[0].trim().to_string(), parts[1].trim().to_string())
                        } else {
                            let space_parts: Vec<&str> = trimmed.splitn(2, ' ').collect();
                            if space_parts.len() >= 2 {
                                (space_parts[0].trim().to_string(), space_parts[1].trim().to_string())
                            } else {
                                (trimmed.to_string(), trimmed.to_string())
                            }
                        };

                        let group = if id.contains("gemini") {
                            "Gemini"
                        } else if id.contains("claude") {
                            "Claude"
                        } else if id.contains("gpt") {
                            "GPT"
                        } else {
                            "Other"
                        }.to_string();

                        let (five_hour_limit, weekly_limit) = if id.contains("flash") {
                            (1500.0, 10000.0)
                        } else if id.contains("opus") {
                            (150.0, 1000.0)
                        } else if id.contains("claude") {
                            (350.0, 2500.0)
                        } else {
                            (500.0, 3500.0)
                        };

                        let used_5h = (recent_requests_5h as f64).min(five_hour_limit);
                        let five_hour_used_pct = ((used_5h / five_hour_limit) * 100.0).clamp(0.0, 100.0);
                        let remaining_pct = (100.0 - five_hour_used_pct).clamp(0.0, 100.0);
                        let weekly_used_pct = ((used_5h * 3.5 / weekly_limit) * 100.0).clamp(0.0, 100.0);

                        let warning_level = if remaining_pct < 10.0 {
                            "critical_95"
                        } else if remaining_pct < 20.0 {
                            "warning_85"
                        } else if remaining_pct < 30.0 {
                            "warning_70"
                        } else {
                            "normal"
                        }.to_string();

                        models.push(ModelQuota {
                            id,
                            name,
                            group,
                            used_percentage: five_hour_used_pct,
                            remaining_percentage: remaining_pct,
                            five_hour_used_pct,
                            five_hour_reset_seconds: five_hr_remaining,
                            weekly_used_pct,
                            weekly_reset_seconds: weekly_remaining,
                            reset_countdown_seconds: five_hr_remaining,
                            reset_time_formatted: format_countdown(five_hr_remaining),
                            warning_level,
                            quota_limit_description: Some(format!("{} req / 5h", five_hour_limit as u32)),
                        });
                    }

                    if !models.is_empty() {
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
                            provider_type: "cli".to_string(),
                            is_simulation: false,
                            status_message: format!("Connected to Google Antigravity ({} models, {} calls)", models.len(), recent_requests_5h),
                            last_sync: now_str,
                            overall_status,
                            lowest_remaining_pct: lowest_pct,
                            models,
                        };
                    }
                }
            }

            // Binary detected but execution failed or returned no models
            AntigravityStatus {
                connected: false,
                provider_type: "cli_detected_unavailable".to_string(),
                is_simulation: false,
                status_message: "Antigravity CLI found but could not fetch models".to_string(),
                last_sync: now_str,
                overall_status: "offline".to_string(),
                lowest_remaining_pct: 0.0,
                models: vec![],
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

