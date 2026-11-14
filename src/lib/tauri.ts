import {
  AntigravityStatus,
  IslandMode,
  KodiSettings,
  MediaSessionState,
  SystemStats,
} from '@/types';
import { webAudioSynth } from './webAudioSynth';

const DEMO_PLAYLIST = [
  {
    title: 'Sample Audio Track',
    artist: 'Interactive Demo',
    album: 'KODI Sample Audio',
  },
  {
    title: 'Sample Audio (Ambient)',
    artist: 'Interactive Demo',
    album: 'KODI Sample Audio',
  },
  {
    title: 'Sample Audio (Lo-Fi)',
    artist: 'Interactive Demo',
    album: 'KODI Sample Audio',
  },
];
let currentTrackIdx = 0;

// Safely check if Tauri environment is available
export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}

// Live Hardware Battery Listener for browser fallback (Chrome, Edge, Opera)
let browserBatteryState: {
  percent: number | null;
  charging: boolean | null;
  acOnline: boolean | null;
  dischargingTime: number | null;
} = {
  percent: 85,
  charging: false,
  acOnline: true,
  dischargingTime: null,
};

if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'getBattery' in navigator) {
  (navigator as any)
    .getBattery()
    .then((battery: any) => {
      const update = () => {
        browserBatteryState = {
          percent: Math.round(battery.level * 100),
          charging: battery.charging,
          acOnline: battery.charging,
          dischargingTime:
            battery.dischargingTime && battery.dischargingTime !== Infinity
              ? battery.dischargingTime
              : null,
        };
      };
      update();
      battery.addEventListener('levelchange', update);
      battery.addEventListener('chargingchange', update);
    })
    .catch(() => {});
}

// Fallback state for local dev & testing
let mockSimulationMode = true;
let mockPlaying = true;

const fallbackSettings: KodiSettings = {
  start_with_windows: false,
  launch_minimized: false,
  compact_by_default: true,
  notch_width: 340,
  notch_height: 48,
  animation_speed: 'normal',
  antigravity_enabled: true,
  antigravity_refresh_interval_secs: 60,
  antigravity_simulation_mode: true,
  warning_threshold_70: true,
  warning_threshold_85: true,
  warning_threshold_95: true,
  notifications_enabled: true,
  system_monitor_enabled: true,
  music_integration_enabled: true,
};

export async function invokeCommand<T>(cmd: string, args: Record<string, any> = {}): Promise<T> {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<T>(cmd, args);
    } catch (err) {
      console.warn(`[Tauri] Native invoke '${cmd}' failed, using fallback handler:`, err);
    }
  }

  // Web fallback simulation handlers
  switch (cmd) {
    case 'set_island_mode': {
      return {
        width: args.custom_width || (args.mode === 'compact' ? 340 : 480),
        height: args.custom_height || (args.mode === 'compact' ? 48 : 440),
        x: 0,
        y: 12,
      } as T;
    }

    case 'toggle_visibility':
    case 'hide_island':
    case 'show_island':
      return true as T;

    case 'get_settings':
      return fallbackSettings as T;

    case 'save_settings':
      return args.settings as T;

    case 'get_system_stats': {
      const now = Date.now();
      const cpu = 18.5 + Math.sin(now / 5000) * 12.0;
      return {
        cpu_percent: Math.max(2, Math.min(100, Math.round(cpu * 10) / 10)),
        memory_used_gb: 14.2,
        memory_total_gb: 32.0,
        memory_percent: 44.4,
        battery_percent: browserBatteryState.percent,
        battery_charging: browserBatteryState.charging,
        battery_ac_online: browserBatteryState.acOnline,
        battery_life_time_secs: browserBatteryState.dischargingTime,
        is_online: typeof navigator !== 'undefined' ? navigator.onLine : true,
        uptime_seconds: 48200,
      } as T;
    }

    case 'get_media_state': {
      const track = DEMO_PLAYLIST[currentTrackIdx];
      return {
        is_active: true,
        title: track.title,
        artist: track.artist,
        album: track.album,
        app_name: 'Spotify',
        is_playing: mockPlaying,
        is_spotify: true,
        thumbnail_base64: null,
      } as T;
    }

    case 'open_spotify': {
      if (typeof window !== 'undefined') {
        window.location.href = 'spotify:';
      }
      return true as T;
    }

    case 'media_toggle_play_pause': {
      mockPlaying = !mockPlaying;
      if (typeof window !== 'undefined') {
        if (mockPlaying) {
          webAudioSynth.start();
        } else {
          webAudioSynth.stop();
        }
      }
      return mockPlaying as T;
    }

    case 'media_next_track': {
      currentTrackIdx = (currentTrackIdx + 1) % DEMO_PLAYLIST.length;
      return true as T;
    }

    case 'media_previous_track': {
      currentTrackIdx = (currentTrackIdx - 1 + DEMO_PLAYLIST.length) % DEMO_PLAYLIST.length;
      return true as T;
    }

    case 'get_antigravity_quota': {
      const isSim = args.simulation_mode ?? mockSimulationMode;
      const now = new Date();
      const formatCountdown = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
      };

      const fiveHrSecs = 3600 * 3 + 1240 - (Math.floor(now.getTime() / 1000) % 3600);
      const weeklySecs = 86400 * 2 + 14800;

      if (!isSim) {
        return {
          connected: false,
          provider_type: 'disconnected',
          is_simulation: false,
          status_message: 'Antigravity CLI not connected. Enable simulation mode in Settings.',
          last_sync: now.toLocaleTimeString(),
          overall_status: 'offline',
          lowest_remaining_pct: 0,
          models: [],
        } as T;
      }

      return {
        connected: true,
        provider_type: 'simulation',
        is_simulation: true,
        status_message: 'Simulation Mode (Interactive Demo)',
        last_sync: now.toLocaleTimeString(),
        overall_status: 'warning',
        lowest_remaining_pct: 12.0,
        models: [
          {
            id: 'gemini-3.8-flash',
            name: 'Gemini 3.8 Flash',
            group: 'Gemini',
            used_percentage: 24.5,
            remaining_percentage: 75.5,
            five_hour_used_pct: 22.0,
            five_hour_reset_seconds: fiveHrSecs,
            weekly_used_pct: 26.0,
            weekly_reset_seconds: weeklySecs,
            reset_countdown_seconds: fiveHrSecs,
            reset_time_formatted: formatCountdown(fiveHrSecs),
            warning_level: 'normal',
            quota_limit_description: '1,500 requests / 5h',
          },
          {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            group: 'Gemini',
            used_percentage: 72.0,
            remaining_percentage: 28.0,
            five_hour_used_pct: 72.0,
            five_hour_reset_seconds: fiveHrSecs + 450,
            weekly_used_pct: 64.0,
            weekly_reset_seconds: weeklySecs,
            reset_countdown_seconds: fiveHrSecs + 450,
            reset_time_formatted: formatCountdown(fiveHrSecs + 450),
            warning_level: 'warning_70',
            quota_limit_description: '350 requests / 5h',
          },
          {
            id: 'claude-3-5-sonnet',
            name: 'Claude 3.5 Sonnet',
            group: 'Claude',
            used_percentage: 45.0,
            remaining_percentage: 55.0,
            five_hour_used_pct: 45.0,
            five_hour_reset_seconds: fiveHrSecs - 300,
            weekly_used_pct: 58.0,
            weekly_reset_seconds: weeklySecs + 86400,
            reset_countdown_seconds: fiveHrSecs - 300,
            reset_time_formatted: formatCountdown(fiveHrSecs - 300),
            warning_level: 'normal',
            quota_limit_description: '250 requests / 5h',
          },
          {
            id: 'gpt-4o',
            name: 'GPT-4o',
            group: 'GPT',
            used_percentage: 88.0,
            remaining_percentage: 12.0,
            five_hour_used_pct: 88.0,
            five_hour_reset_seconds: fiveHrSecs - 800,
            weekly_used_pct: 82.0,
            weekly_reset_seconds: weeklySecs - 3600,
            reset_countdown_seconds: fiveHrSecs - 800,
            reset_time_formatted: formatCountdown(fiveHrSecs - 800),
            warning_level: 'warning_85',
            quota_limit_description: '200 requests / 5h',
          },
        ],
      } as T;
    }

    default:
      return null as T;
  }
}
