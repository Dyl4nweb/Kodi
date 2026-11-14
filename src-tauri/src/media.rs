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
    use base64::prelude::*;
    use windows::Media::Control::{
        GlobalSystemMediaTransportControlsSession,
        GlobalSystemMediaTransportControlsSessionManager,
        GlobalSystemMediaTransportControlsSessionPlaybackStatus,
    };
    use windows::Storage::Streams::DataReader;

    async fn get_active_session() -> Result<Option<GlobalSystemMediaTransportControlsSession>, Box<dyn std::error::Error>> {
        let manager = GlobalSystemMediaTransportControlsSessionManager::RequestAsync()?.await?;
        
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

    pub async fn query_media_state() -> Result<MediaSessionState, Box<dyn std::error::Error>> {
        let session = match get_active_session().await? {
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

        let media_props = match session.TryGetMediaPropertiesAsync()?.await {
            Ok(props) => props,
            Err(_) => return Ok(MediaSessionState::default()),
        };

        let title = media_props.Title().map(|s| s.to_string()).unwrap_or_default();
        let artist = media_props.Artist().map(|s| s.to_string()).unwrap_or_default();
        let album = media_props.AlbumTitle().map(|s| s.to_string()).unwrap_or_default();

        if title.is_empty() && artist.is_empty() {
            return Ok(MediaSessionState::default());
        }

        // Try reading album art thumbnail
        let mut thumbnail_base64 = None;
        if let Ok(thumb_ref) = media_props.Thumbnail() {
            if let Ok(stream_op) = thumb_ref.OpenReadAsync() {
                if let Ok(stream) = stream_op.await {
                    if let Ok(size) = stream.Size() {
                        if size > 0 && size < 5 * 1024 * 1024 {
                            if let Ok(reader) = DataReader::CreateDataReader(&stream) {
                                if let Ok(load_op) = reader.LoadAsync(size as u32) {
                                    if load_op.await.is_ok() {
                                        let mut buffer = vec![0u8; size as usize];
                                        if reader.ReadBytes(&mut buffer).is_ok() {
                                            let encoded = BASE64_STANDARD.encode(&buffer);
                                            thumbnail_base64 = Some(format!("data:image/jpeg;base64,{}", encoded));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        Ok(MediaSessionState {
            is_active: true,
            title,
            artist,
            album,
            app_name,
            is_playing,
            is_spotify,
            thumbnail_base64,
        })
    }

    pub async fn play_pause() -> Result<bool, Box<dyn std::error::Error>> {
        if let Some(session) = get_active_session().await? {
            let res = session.TryTogglePlayPauseAsync()?.await?;
            Ok(res)
        } else {
            Ok(false)
        }
    }

    pub async fn next() -> Result<bool, Box<dyn std::error::Error>> {
        if let Some(session) = get_active_session().await? {
            let res = session.TrySkipNextAsync()?.await?;
            Ok(res)
        } else {
            Ok(false)
        }
    }

    pub async fn previous() -> Result<bool, Box<dyn std::error::Error>> {
        if let Some(session) = get_active_session().await? {
            let res = session.TrySkipPreviousAsync()?.await?;
            Ok(res)
        } else {
            Ok(false)
        }
    }
}

#[tauri::command]
pub async fn get_media_state() -> Result<MediaSessionState, String> {
    #[cfg(windows)]
    {
        win_media::query_media_state().await.or_else(|_| Ok(MediaSessionState::default()))
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
        win_media::play_pause().await.or_else(|_| Ok(false))
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
        win_media::next().await.or_else(|_| Ok(false))
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
        win_media::previous().await.or_else(|_| Ok(false))
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
