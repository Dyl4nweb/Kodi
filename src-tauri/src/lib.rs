pub mod antigravity;
pub mod media;
pub mod settings;
pub mod system;
pub mod window;

use system::SystemState;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacOsLauncher::LaunchAgent,
            Some(vec!["--autostart"]),
        ))
        .plugin(tauri_plugin_notification::init())
        .manage(SystemState::default())
        .invoke_handler(tauri::generate_handler![
            window::set_island_mode,
            window::center_island,
            window::hide_island,
            window::show_island,
            window::toggle_visibility,
            system::get_system_stats,
            media::get_media_state,
            media::media_toggle_play_pause,
            media::media_next_track,
            media::media_previous_track,
            media::open_spotify,
            antigravity::get_antigravity_quota,
            antigravity::open_antigravity_cli,
            settings::get_settings,
            settings::save_settings,
        ])
        .setup(|app| {
            // Create Tray Menu
            let show_item = MenuItem::with_id(app, "toggle_show", "Show / Hide KODI (Ctrl+Alt+K)", true, None::<&str>)?;
            let movie_item = MenuItem::with_id(app, "toggle_movie", "Movie Mode (Hide / Show)", true, None::<&str>)?;
            let toggle_expand_item = MenuItem::with_id(app, "toggle_expand", "Expand / Collapse Notch", true, None::<&str>)?;
            let refresh_quota_item = MenuItem::with_id(app, "refresh_quota", "Refresh Antigravity Quota", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit KODI", true, None::<&str>)?;

            let tray_menu = Menu::with_items(
                app,
                &[&show_item, &movie_item, &toggle_expand_item, &refresh_quota_item, &quit_item],
            )?;

            let _tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .tooltip("KODI — Windows Dynamic Island")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "toggle_show" | "toggle_movie" => {
                        if let Some(w) = app.get_webview_window("main") {
                            if w.is_visible().unwrap_or(false) {
                                let _ = w.hide();
                            } else {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                        }
                    }
                    "toggle_expand" => {
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.emit("kodi:toggle_expand", ());
                        }
                    }
                    "refresh_quota" => {
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.emit("kodi:refresh_quota", ());
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(w) = app.get_webview_window("main") {
                            if w.is_visible().unwrap_or(false) {
                                let _ = w.hide();
                            } else {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            // Initial positioning of the window at screen top center
            if let Some(w) = app.get_webview_window("main") {
                let _ = window::set_island_mode((*w).clone(), "compact".to_string(), None, None);
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running KODI application");
}
