use tauri::{LogicalPosition, LogicalSize, Monitor, WebviewWindow};

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct WindowDimensions {
    pub width: f64,
    pub height: f64,
    pub x: f64,
    pub y: f64,
}

pub fn apply_island_mode(
    window: &WebviewWindow,
    mode: &str,
    custom_width: Option<f64>,
    custom_height: Option<f64>,
) -> Result<WindowDimensions, String> {
    let (target_width, target_height) = match mode {
        "compact" => (
            custom_width.unwrap_or(384.0),
            custom_height.unwrap_or(40.0),
        ),
        "notification" => (
            custom_width.unwrap_or(440.0),
            custom_height.unwrap_or(78.0),
        ),
        "expanded" => (
            custom_width.unwrap_or(530.0),
            custom_height.unwrap_or(520.0),
        ),
        "settings" => (
            custom_width.unwrap_or(540.0),
            custom_height.unwrap_or(510.0),
        ),
        _ => (430.0, 48.0),
    };

    // Find the monitor where the window currently resides or primary monitor
    let monitor: Option<Monitor> = window.current_monitor().map_err(|e| e.to_string())?;

    let (monitor_x, monitor_y, monitor_w) = if let Some(m) = monitor {
        let scale = m.scale_factor();
        let pos = m.position();
        let size = m.size();
        let logical_x = pos.x as f64 / scale;
        let logical_y = pos.y as f64 / scale;
        let logical_w = size.width as f64 / scale;
        (logical_x, logical_y, logical_w)
    } else {
        (0.0, 0.0, 1920.0)
    };

    let target_x = monitor_x + (monitor_w - target_width) / 2.0;
    let target_y = monitor_y; // Flush against top screen bezel for seamless notch integration

    // Resize window
    window
        .set_size(LogicalSize::new(target_width, target_height))
        .map_err(|e| e.to_string())?;

    // Reposition window at top center
    window
        .set_position(LogicalPosition::new(target_x, target_y))
        .map_err(|e| e.to_string())?;

    Ok(WindowDimensions {
        width: target_width,
        height: target_height,
        x: target_x,
        y: target_y,
    })
}

#[tauri::command]
pub fn set_island_mode(
    window: WebviewWindow,
    mode: String,
    custom_width: Option<f64>,
    custom_height: Option<f64>,
) -> Result<WindowDimensions, String> {
    apply_island_mode(&window, &mode, custom_width, custom_height)
}

#[tauri::command]
pub fn center_island(window: WebviewWindow) -> Result<(), String> {
    apply_island_mode(&window, "compact", None, None)?;
    Ok(())
}

#[tauri::command]
pub fn hide_island(window: WebviewWindow) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn show_island(window: WebviewWindow) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn toggle_visibility(window: WebviewWindow) -> Result<bool, String> {
    if window.is_visible().unwrap_or(false) {
        window.hide().map_err(|e| e.to_string())?;
        Ok(false)
    } else {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        Ok(true)
    }
}
