use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct MediaSessionState {
    pub is_active: bool,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub app_name: String,
    pub is_playing: bool,
    pub is_spotify: bool,
    pub thumbnail_base64: Option<String>,
}

impl Default for MediaSessionState {
    fn default() -> Self {
        Self {
            is_active: false,
            title: "".to_string(),
            artist: "".to_string(),
            album: "".to_string(),
            app_name: "".to_string(),
            is_playing: false,
            is_spotify: false,
            thumbnail_base64: None,
        }
    }
}

#[cfg(windows)]
mod win_media {
    use super::MediaSessionState;
    use windows::Media::Control::{
        GlobalSystemMediaTransportControlsSession,
        GlobalSystemMediaTransportControlsSessionManager,
        GlobalSystemMediaTransportControlsSessionMediaProperties,
        GlobalSystemMediaTransportControlsSessionPlaybackStatus,
    };

    fn wait_manager(
        op: windows::Foundation::IAsyncOperation<GlobalSystemMediaTransportControlsSessionManager>,
    ) -> Result<GlobalSystemMediaTransportControlsSessionManager, Box<dyn std::error::Error>> {
        let (tx, rx) = std::sync::mpsc::channel();
        let handler = windows::Foundation::AsyncOperationCompletedHandler::new(move |_, _| {
            let _ = tx.send(());
            Ok(())
        });
        op.SetCompleted(&handler)?;
        let _ = rx.recv_timeout(std::time::Duration::from_millis(800));
        let res = op.GetResults()?;
        Ok(res)
    }

    fn wait_props(
        op: windows::Foundation::IAsyncOperation<GlobalSystemMediaTransportControlsSessionMediaProperties>,
    ) -> Result<GlobalSystemMediaTransportControlsSessionMediaProperties, Box<dyn std::error::Error>> {
        let (tx, rx) = std::sync::mpsc::channel();
        let handler = windows::Foundation::AsyncOperationCompletedHandler::new(move |_, _| {
            let _ = tx.send(());
            Ok(())
        });
        op.SetCompleted(&handler)?;
        let _ = rx.recv_timeout(std::time::Duration::from_millis(800));
        let res = op.GetResults()?;
        Ok(res)
    }

    fn wait_bool(
        op: windows::Foundation::IAsyncOperation<bool>,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let (tx, rx) = std::sync::mpsc::channel();
        let handler = windows::Foundation::AsyncOperationCompletedHandler::new(move |_, _| {
            let _ = tx.send(());
            Ok(())
        });
        op.SetCompleted(&handler)?;
        let _ = rx.recv_timeout(std::time::Duration::from_millis(800));
        let res = op.GetResults()?;
        Ok(res)
    }

    fn get_active_session() -> Result<Option<GlobalSystemMediaTransportControlsSession>, Box<dyn std::error::Error>> {
        let op = GlobalSystemMediaTransportControlsSessionManager::RequestAsync()?;
        let manager = wait_manager(op)?;
        
        let mut playing_session: Option<GlobalSystemMediaTransportControlsSession> = None;
        let mut spotify_session: Option<GlobalSystemMediaTransportControlsSession> = None;

        // Inspect all active or backgrounded media sessions
        if let Ok(sessions) = manager.GetSessions() {
            for session in sessions {
                let app_id = session
                    .SourceAppUserModelId()
                    .map(|s| s.to_string().to_lowercase())
                    .unwrap_or_default();
                let is_spotify = app_id.contains("spotify");

                if is_spotify && spotify_session.is_none() {
                    spotify_session = Some(session.clone());
                }

                if let Ok(info) = session.GetPlaybackInfo() {
                    if let Ok(status) = info.PlaybackStatus() {
                        if status == GlobalSystemMediaTransportControlsSessionPlaybackStatus::Playing {
                            // If Spotify is actively playing, return immediately
                            if is_spotify {
                                return Ok(Some(session));
                            }
                            if playing_session.is_none() {
                                playing_session = Some(session);
                            }
                        }
                    }
                }
            }
        }

        // Return actively playing session first
        if let Some(s) = playing_session {
            return Ok(Some(s));
        }

        // Fallback to Spotify even if paused
        if let Some(s) = spotify_session {
            return Ok(Some(s));
        }

        // Fallback to current default session
        if let Ok(current) = manager.GetCurrentSession() {
            return Ok(Some(current));
        }

        Ok(None)
    }

    pub fn query_media_state() -> Result<MediaSessionState, Box<dyn std::error::Error>> {
        let session = match get_active_session()? {
            Some(s) => s,
            None => return Ok(MediaSessionState::default()),
        };

        let playback_info = session.GetPlaybackInfo()?;
        let status = playback_info.PlaybackStatus()?;
        let is_playing = status == GlobalSystemMediaTransportControlsSessionPlaybackStatus::Playing;

        let raw_app_name = session
            .SourceAppUserModelId()
            .map(|s| s.to_string())
            .unwrap_or_else(|_| "Media Player".to_string());

        let is_spotify = raw_app_name.to_lowercase().contains("spotify");
        let app_name = if is_spotify {
            "Spotify".to_string()
        } else {
            raw_app_name
        };

        let op = session.TryGetMediaPropertiesAsync()?;
        let media_props = match wait_props(op) {
            Ok(props) => props,
            Err(_) => return Ok(MediaSessionState::default()),
        };

        let title = media_props.Title().map(|s| s.to_string()).unwrap_or_default();
        let artist = media_props.Artist().map(|s| s.to_string()).unwrap_or_default();
        let album = media_props.AlbumTitle().map(|s| s.to_string()).unwrap_or_default();

        if title.is_empty() && artist.is_empty() {
            return Ok(MediaSessionState::default());
        }

        Ok(MediaSessionState {
            is_active: true,
            title,
            artist,
            album,
            app_name,
            is_playing,
            is_spotify,
            thumbnail_base64: None,
        })
    }

    pub fn play_pause() -> Result<bool, Box<dyn std::error::Error>> {
        if let Some(session) = get_active_session()? {
            let op = session.TryTogglePlayPauseAsync()?;
            wait_bool(op)
        } else {
            Ok(false)
        }
    }

    pub fn next() -> Result<bool, Box<dyn std::error::Error>> {
        if let Some(session) = get_active_session()? {
            let op = session.TrySkipNextAsync()?;
            wait_bool(op)
        } else {
            Ok(false)
        }
    }

    pub fn previous() -> Result<bool, Box<dyn std::error::Error>> {
        if let Some(session) = get_active_session()? {
            let op = session.TrySkipPreviousAsync()?;
            wait_bool(op)
        } else {
            Ok(false)
        }
    }
}

#[tauri::command]
pub async fn get_media_state() -> Result<MediaSessionState, String> {
    #[cfg(windows)]
    {
        tokio::task::spawn_blocking(|| {
            win_media::query_media_state().unwrap_or_default()
        })
        .await
        .map_err(|e| e.to_string())
    }
    #[cfg(not(windows))]
    {
        Ok(MediaSessionState::default())
    }
}

#[tauri::command]
pub async fn media_toggle_play_pause() -> Result<bool, String> {
    #[cfg(windows)]
    {
        tokio::task::spawn_blocking(|| {
            win_media::play_pause().unwrap_or(false)
        })
        .await
        .map_err(|e| e.to_string())
    }
    #[cfg(not(windows))]
    {
        Ok(false)
    }
}

#[tauri::command]
pub async fn media_next_track() -> Result<bool, String> {
    #[cfg(windows)]
    {
        tokio::task::spawn_blocking(|| {
            win_media::next().unwrap_or(false)
        })
        .await
        .map_err(|e| e.to_string())
    }
    #[cfg(not(windows))]
    {
        Ok(false)
    }
}

#[tauri::command]
pub async fn media_previous_track() -> Result<bool, String> {
    #[cfg(windows)]
    {
        tokio::task::spawn_blocking(|| {
            win_media::previous().unwrap_or(false)
        })
        .await
        .map_err(|e| e.to_string())
    }
    #[cfg(not(windows))]
    {
        Ok(false)
    }
}

#[tauri::command]
pub fn open_spotify() -> Result<bool, String> {
    #[cfg(windows)]
    {
        let _ = std::process::Command::new("cmd")
            .args(["/c", "start", "", "spotify:"])
            .spawn();
        Ok(true)
    }
    #[cfg(not(windows))]
    {
        Ok(false)
    }
}
