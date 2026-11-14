export type IslandMode = 'compact' | 'expanded' | 'notification' | 'settings';

export type ActiveTab = 'antigravity' | 'media' | 'system' | 'actions';

export interface ModelQuota {
  id: string;
  name: string;
  group: 'Gemini' | 'Claude' | 'GPT' | 'Other' | string;
  used_percentage: number;
  remaining_percentage: number;
  five_hour_used_pct: number;
  five_hour_reset_seconds: number;
  weekly_used_pct: number;
  weekly_reset_seconds: number;
  reset_countdown_seconds: number;
  reset_time_formatted: string;
  warning_level: 'normal' | 'warning_70' | 'warning_85' | 'critical_95' | 'exhausted';
  quota_limit_description?: string;
}

export interface AntigravityStatus {
  connected: boolean;
  provider_type: 'cli' | 'local_state' | 'simulation' | 'disconnected' | string;
  is_simulation: boolean;
  status_message: string;
  last_sync: string;
  overall_status: 'healthy' | 'warning' | 'critical' | 'offline';
  lowest_remaining_pct: number;
  models: ModelQuota[];
}

export interface MediaSessionState {
  is_active: boolean;
  title: string;
  artist: string;
  album: string;
  app_name: string;
  is_playing: boolean;
  is_spotify?: boolean;
  thumbnail_base64?: string | null;
}

export interface SystemStats {
  cpu_percent: number;
  memory_used_gb: number;
  memory_total_gb: number;
  memory_percent: number;
  battery_percent: number | null;
  battery_charging: boolean | null;
  battery_ac_online?: boolean | null;
  battery_life_time_secs?: number | null;
  is_online: boolean;
  uptime_seconds: number;
}

export interface KodiSettings {
  start_with_windows: boolean;
  launch_minimized: boolean;
  compact_by_default: boolean;
  notch_width: number;
  notch_height: number;
  animation_speed: 'fast' | 'normal' | 'slow';
  antigravity_enabled: boolean;
  antigravity_refresh_interval_secs: number;
  antigravity_simulation_mode: boolean;
  warning_threshold_70: boolean;
  warning_threshold_85: boolean;
  warning_threshold_95: boolean;
  notifications_enabled: boolean;
  system_monitor_enabled: boolean;
  music_integration_enabled: boolean;
}

export interface KodiNotification {
  id: string;
  type: 'quota' | 'media' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity?: 'normal' | 'warning' | 'critical';
}
