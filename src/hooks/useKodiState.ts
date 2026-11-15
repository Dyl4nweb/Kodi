'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ActiveTab,
  AntigravityStatus,
  IslandMode,
  KodiNotification,
  KodiSettings,
  MediaSessionState,
  SystemStats,
} from '@/types';
import { invokeCommand, isTauriEnvironment } from '@/lib/tauri';

export function useKodiState() {
  const [islandMode, setIslandMode] = useState<IslandMode>('compact');
  const [activeTab, setActiveTab] = useState<ActiveTab>('antigravity');
  const [settings, setSettings] = useState<KodiSettings | null>(null);
  const [antigravityStatus, setAntigravityStatus] = useState<AntigravityStatus | null>(null);
  const [mediaState, setMediaState] = useState<MediaSessionState | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [activeNotification, setActiveNotification] = useState<KodiNotification | null>(null);
  const [isRefreshingQuota, setIsRefreshingQuota] = useState(false);
  const [isMovieMode, setIsMovieMode] = useState(false);

  const toggleMovieMode = () => {
    setIsMovieMode((prev) => {
      const next = !prev;
      if (next) {
        invokeCommand('hide_island').catch(console.error);
      } else {
        invokeCommand('show_island').catch(console.error);
      }
      return next;
    });
  };

  // Global shortcut Ctrl + Alt + K for Movie Mode
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleMovieMode();
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  const warnedThresholdsRef = useRef<Set<string>>(new Set());
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync window size with Tauri whenever islandMode changes
  useEffect(() => {
    let targetWidth = 430;
    let targetHeight = 48;

    if (islandMode === 'expanded') {
      targetWidth = 530;
      targetHeight = 520;
    } else if (islandMode === 'notification') {
      targetWidth = 440;
      targetHeight = 78;
    } else if (islandMode === 'settings') {
      targetWidth = 540;
      targetHeight = 510;
    }

    invokeCommand('set_island_mode', {
      mode: islandMode,
      custom_width: targetWidth,
      custom_height: targetHeight,
    }).catch(console.error);
  }, [islandMode]);

  // Load initial settings
  useEffect(() => {
    invokeCommand<KodiSettings>('get_settings')
      .then((s) => {
        if (s) {
          setSettings(s);
          if (!s.compact_by_default) {
            setIslandMode('expanded');
          }
        }
      })
      .catch(console.error);
  }, []);

  // Fetch Antigravity quota
  const refreshQuota = async () => {
    setIsRefreshingQuota(true);
    try {
      const isSim = settings?.antigravity_simulation_mode ?? false;
      const status = await invokeCommand<AntigravityStatus>('get_antigravity_quota', {
        simulation_mode: isSim,
      });
      if (status) {
        setAntigravityStatus(status);
        checkQuotaNotifications(status);
      }
    } catch (err) {
      console.error('Failed to fetch quota:', err);
    } finally {
      setIsRefreshingQuota(false);
    }
  };

  // Quota notifications threshold checker
  const checkQuotaNotifications = (status: AntigravityStatus) => {
    if (!settings?.notifications_enabled) return;

    for (const model of status.models) {
      const checkThreshold = (pct: number, key: string, label: string) => {
        const warningKey = `${model.id}-${key}`;
        if (model.used_percentage >= pct && !warnedThresholdsRef.current.has(warningKey)) {
          warnedThresholdsRef.current.add(warningKey);
          triggerNotification({
            id: `quota-${Date.now()}`,
            type: 'quota',
            title: `Antigravity Quota Alert (${label})`,
            message: `${model.name} has consumed ${Math.round(model.used_percentage)}% of available quota.`,
            timestamp: new Date().toLocaleTimeString(),
            severity: pct >= 95 ? 'critical' : 'warning',
          });
        }
      };

      if (settings.warning_threshold_95) checkThreshold(95, '95', '95% Critical');
      else if (settings.warning_threshold_85) checkThreshold(85, '85', '85% Warning');
      else if (settings.warning_threshold_70) checkThreshold(70, '70', '70% Notice');
    }
  };

  // Trigger dynamic notification banner
  const triggerNotification = (notif: KodiNotification) => {
    setActiveNotification(notif);
    if (islandMode === 'compact') {
      setIslandMode('notification');
    }

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setActiveNotification(null);
      setIslandMode('compact');
    }, 5500);
  };

  const dismissNotification = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setActiveNotification(null);
    setIslandMode('compact');
  };

  // Polling loops
  useEffect(() => {
    refreshQuota();
    const intervalSecs = settings?.antigravity_refresh_interval_secs || 60;
    const quotaTimer = setInterval(refreshQuota, intervalSecs * 1000);
    return () => clearInterval(quotaTimer);
  }, [settings?.antigravity_refresh_interval_secs, settings?.antigravity_simulation_mode]);

  // Live 1-second countdown ticker for model quota reset timers
  useEffect(() => {
    const timer = setInterval(() => {
      setAntigravityStatus((prev) => {
        if (!prev || !prev.models || prev.models.length === 0) return prev;
        const formatTime = (secs: number) => {
          const h = Math.floor(secs / 3600);
          const m = Math.floor((secs % 3600) / 60);
          const s = secs % 60;
          return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        };
        const updatedModels = prev.models.map((m) => {
          const newFive = m.five_hour_reset_seconds > 0 ? m.five_hour_reset_seconds - 1 : 0;
          const newWeekly = m.weekly_reset_seconds > 0 ? m.weekly_reset_seconds - 1 : 0;
          const newReset = m.reset_countdown_seconds > 0 ? m.reset_countdown_seconds - 1 : 0;
          return {
            ...m,
            five_hour_reset_seconds: newFive,
            weekly_reset_seconds: newWeekly,
            reset_countdown_seconds: newReset,
            reset_time_formatted: formatTime(newReset),
          };
        });
        return { ...prev, models: updatedModels };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (settings && !settings.system_monitor_enabled) return;
    const fetchSystem = () => {
      invokeCommand<SystemStats>('get_system_stats')
        .then((stats) => stats && setSystemStats(stats))
        .catch(console.error);
    };
    fetchSystem();
    const timer = setInterval(fetchSystem, 2500);
    return () => clearInterval(timer);
  }, [settings?.system_monitor_enabled]);

  useEffect(() => {
    if (settings && !settings.music_integration_enabled) return;
    const fetchMedia = () => {
      invokeCommand<MediaSessionState>('get_media_state')
        .then((m) => m && setMediaState(m))
        .catch(console.error);
    };
    fetchMedia();
    const timer = setInterval(fetchMedia, 1200);
    return () => clearInterval(timer);
  }, [settings?.music_integration_enabled]);

  // Listen to Tauri events (e.g. from system tray)
  useEffect(() => {
    if (!isTauriEnvironment()) return;

    let unlistenToggle: (() => void) | undefined;
    let unlistenRefresh: (() => void) | undefined;

    import('@tauri-apps/api/event').then(({ listen }) => {
      listen('kodi:toggle_expand', () => {
        setIslandMode((prev) => (prev === 'compact' ? 'expanded' : 'compact'));
      }).then((u) => (unlistenToggle = u));

      listen('kodi:refresh_quota', () => {
        refreshQuota();
      }).then((u) => (unlistenRefresh = u));
    });

    return () => {
      unlistenToggle?.();
      unlistenRefresh?.();
    };
  }, []);

  // Save settings handler
  const updateSettings = async (newSettings: KodiSettings) => {
    setSettings(newSettings);
    try {
      await invokeCommand('save_settings', { settings: newSettings });
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  // Media controls
  const togglePlayPause = async () => {
    try {
      const playing = await invokeCommand<boolean>('media_toggle_play_pause');
      setMediaState((prev) => (prev ? { ...prev, is_playing: playing } : null));
    } catch (err) {
      console.error(err);
    }
  };

  const nextTrack = async () => {
    try {
      await invokeCommand('media_next_track');
    } catch (err) {
      console.error(err);
    }
  };

  const previousTrack = async () => {
    try {
      await invokeCommand('media_previous_track');
    } catch (err) {
      console.error(err);
    }
  };

  return {
    islandMode,
    setIslandMode,
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    antigravityStatus,
    mediaState,
    systemStats,
    activeNotification,
    isRefreshingQuota,
    refreshQuota,
    dismissNotification,
    togglePlayPause,
    nextTrack,
    previousTrack,
    isMovieMode,
    toggleMovieMode,
  };
}
