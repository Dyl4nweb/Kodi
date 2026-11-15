pub mod antigravity;
pub mod media;
pub mod settings;
pub mod system;
pub mod window;

use system::SystemState;
use tauri::image::Image;
use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
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
            system::open_bluetooth_settings,
            system::open_wifi_settings,
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
            // Create Tray Menu Items (Tauri v2 Menu API)
            let show_item = MenuItemBuilder::with_id("toggle_show", "Show / Hide KODI (Ctrl+Alt+K)").build(app)?;
            let movie_item = MenuItemBuilder::with_id("toggle_movie", "Movie Mode (Hide / Show)").build(app)?;
            let toggle_expand_item = MenuItemBuilder::with_id("toggle_expand", "Expand / Collapse Notch").build(app)?;
            let refresh_quota_item = MenuItemBuilder::with_id("refresh_quota", "Refresh Antigravity Quota").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit KODI").build(app)?;

            let tray_menu = MenuBuilder::new(app)
                .items(&[&show_item, &movie_item, &toggle_expand_item, &refresh_quota_item, &quit_item])
                .build()?;

            let mut tray_builder = TrayIconBuilder::new()
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .tooltip("KODI — Windows Dynamic Island")
                .on_menu_event(|app, event| match event.id().as_ref() {
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
                });

            let tray_icon = Image::from_bytes(include_bytes!("../icons/32x32.png"))
                .ok()
                .or_else(|| app.default_window_icon().cloned());

            if let Some(icon) = tray_icon {
                tray_builder = tray_builder.icon(icon);
            }

            // Safely initialize system tray with fallback
            if let Err(e) = tray_builder.build(app) {
                eprintln!("[KODI] System tray initialization skipped or failed: {}", e);
            }

            // Initial positioning of the window at screen top center
            if let Some(w) = app.get_webview_window("main") {
                let _ = window::apply_island_mode(&w, "compact", None, None);
                let _ = w.show();
                let _ = w.set_focus();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running KODI application");
}
