use serde::Serialize;
use std::sync::Mutex;
use sysinfo::System;

#[derive(Debug, Serialize, Clone)]
pub struct SystemStats {
    pub cpu_percent: f32,
    pub memory_used_gb: f64,
    pub memory_total_gb: f64,
    pub memory_percent: f32,
    pub battery_percent: Option<u8>,
    pub battery_charging: Option<bool>,
    pub battery_ac_online: Option<bool>,
    pub battery_life_time_secs: Option<i32>,
    pub is_online: bool,
    pub uptime_seconds: u64,
}

pub struct SystemState {
    pub sys: Mutex<System>,
}

impl Default for SystemState {
    fn default() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self {
            sys: Mutex::new(sys),
        }
    }
}

#[cfg(windows)]
fn read_windows_power_status() -> (Option<u8>, Option<bool>, Option<bool>, Option<i32>) {
    use windows::Win32::System::Power::{GetSystemPowerStatus, SYSTEM_POWER_STATUS};
    unsafe {
        let mut status = SYSTEM_POWER_STATUS::default();
        if GetSystemPowerStatus(&mut status).is_ok() {
            // Check if system has no battery installed (e.g. desktop PC)
            let has_no_battery = (status.BatteryFlag & 128) != 0 || status.BatteryLifePercent == 255;
            let ac_online = status.ACLineStatus == 1;

            if has_no_battery {
                return (None, Some(false), Some(ac_online), None);
            }

            let percent = if status.BatteryLifePercent <= 100 {
                Some(status.BatteryLifePercent)
            } else {
                None
            };

            // BatteryFlag: bit 3 (8) = Charging
            let is_charging = (status.BatteryFlag & 8) != 0 || (ac_online && percent.map_or(false, |p| p < 100));

            let life_secs = if status.BatteryLifeTime > 0 && status.BatteryLifeTime != u32::MAX {
                Some(status.BatteryLifeTime as i32)
            } else {
                None
            };

            (percent, Some(is_charging), Some(ac_online), life_secs)
        } else {
            (None, None, None, None)
        }
    }
}

#[cfg(not(windows))]
fn read_windows_power_status() -> (Option<u8>, Option<bool>, Option<bool>, Option<i32>) {
    (None, None, None, None)
}

#[tauri::command]
pub fn get_system_stats(state: tauri::State<'_, SystemState>) -> Result<SystemStats, String> {
    let mut sys = state.sys.lock().map_err(|e| e.to_string())?;
    
    // Refresh CPU and memory across all cores
    sys.refresh_cpu_all();
    sys.refresh_memory();

    let cpu_percent = sys.global_cpu_usage();
    let total_mem = sys.total_memory() as f64 / (1024.0 * 1024.0 * 1024.0);
    let used_mem = sys.used_memory() as f64 / (1024.0 * 1024.0 * 1024.0);
    let memory_percent = if total_mem > 0.0 {
        ((used_mem / total_mem) * 100.0) as f32
    } else {
        0.0
    };

    let (battery_percent, battery_charging, battery_ac_online, battery_life_time_secs) = read_windows_power_status();

    let uptime_seconds = System::uptime();

    Ok(SystemStats {
        cpu_percent: (cpu_percent * 10.0).round() / 10.0,
        memory_used_gb: (used_mem * 100.0).round() / 100.0,
        memory_total_gb: (total_mem * 100.0).round() / 100.0,
        memory_percent: (memory_percent * 10.0).round() / 10.0,
        battery_percent,
        battery_charging,
        battery_ac_online,
        battery_life_time_secs,
        is_online: true,
        uptime_seconds,
    })
}

#[tauri::command]
pub fn open_bluetooth_settings() -> Result<(), String> {
    std::process::Command::new("cmd")
        .args(["/c", "start", "ms-settings:bluetooth"])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn open_wifi_settings() -> Result<(), String> {
    std::process::Command::new("cmd")
        .args(["/c", "start", "ms-settings:network-wifi"])
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}
