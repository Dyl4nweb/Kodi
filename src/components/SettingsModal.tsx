'use client';

import React, { useState } from 'react';
import {
  Bell,
  BrainCircuit,
  Check,
  ChevronRight,
  Cpu,
  Monitor,
  Music,
  Palette,
  Power,
  RotateCcw,
  Sliders,
  X,
} from 'lucide-react';
import { KodiSettings } from '@/types';

interface SettingsModalProps {
  settings: KodiSettings | null;
  onSave: (settings: KodiSettings) => void;
  onClose: () => void;
  onRefreshQuota: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
  onRefreshQuota,
}) => {
  const [localSettings, setLocalSettings] = useState<KodiSettings>(
    settings || {
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
    }
  );

  const [activeSection, setActiveSection] = useState<
    'general' | 'appearance' | 'antigravity' | 'system'
  >('general');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof KodiSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#000000] border border-white/[0.08] text-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.95)]">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm font-semibold tracking-wide">KODI Settings</h2>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-36 border-r border-white/5 bg-black/40 p-2 flex flex-col gap-1">
          {[
            { id: 'general', label: 'General', icon: Power },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'antigravity', label: 'Antigravity', icon: BrainCircuit },
            { id: 'system', label: 'System', icon: Cpu },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-xs">
          {/* GENERAL SECTION */}
          {activeSection === 'general' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-zinc-200">Start with Windows</div>
                  <div className="text-[11px] text-zinc-500">
                    Automatically launch KODI Dynamic Island at Windows logon.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.start_with_windows}
                  onChange={() => handleToggle('start_with_windows')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-zinc-200">Compact by Default</div>
                  <div className="text-[11px] text-zinc-500">
                    Always start or collapse to the small unobtrusive top-center pill.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.compact_by_default}
                  onChange={() => handleToggle('compact_by_default')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-zinc-200">Launch Minimized</div>
                  <div className="text-[11px] text-zinc-500">
                    Start hidden in the system tray instead of opening on desktop.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.launch_minimized}
                  onChange={() => handleToggle('launch_minimized')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500 focus:ring-0"
                />
              </div>
            </div>
          )}

          {/* APPEARANCE SECTION */}
          {activeSection === 'appearance' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-medium text-zinc-200 block mb-1">
                  Animation Speed
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['fast', 'normal', 'slow'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() =>
                        setLocalSettings((prev) => ({ ...prev, animation_speed: spd }))
                      }
                      className={`rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${
                        localSettings.animation_speed === spd
                          ? 'border-sky-500/40 bg-sky-500/15 text-sky-300'
                          : 'border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-200 block mb-1">
                  Compact Notch Width ({localSettings.notch_width}px)
                </label>
                <input
                  type="range"
                  min="280"
                  max="420"
                  step="10"
                  value={localSettings.notch_width}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      notch_width: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-sky-400"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-200 block mb-1">
                  Theme Surfaces
                </label>
                <div className="text-[11px] text-zinc-400">
                  macOS Obsidian Dynamic Island (Deep Dark #050505 with glass highlights)
                </div>
              </div>
            </div>
          )}

          {/* ANTIGRAVITY SECTION */}
          {activeSection === 'antigravity' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-zinc-200">
                    Enable Quota Monitoring
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Display real-time model quota windows and countdowns.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.antigravity_enabled}
                  onChange={() => handleToggle('antigravity_enabled')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div>
                  <div className="font-medium text-zinc-200">
                    Simulation / Interactive Demo Mode
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Populate live multi-model quotas (Gemini, Claude, GPT) when CLI is not detected.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.antigravity_simulation_mode}
                  onChange={() => handleToggle('antigravity_simulation_mode')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500"
                />
              </div>

              <div className="border-t border-white/5 pt-2">
                <label className="font-medium text-zinc-200 block mb-1">
                  Refresh Interval: {localSettings.antigravity_refresh_interval_secs}s
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={localSettings.antigravity_refresh_interval_secs}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      antigravity_refresh_interval_secs: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-sky-400"
                />
              </div>

              <div className="border-t border-white/5 pt-2">
                <div className="font-medium text-zinc-200 mb-1.5">
                  Warning Threshold Alerts
                </div>
                <div className="flex flex-col gap-1.5 text-[11px]">
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={localSettings.warning_threshold_70}
                      onChange={() => handleToggle('warning_threshold_70')}
                      className="rounded border-zinc-700 bg-zinc-800 text-sky-500"
                    />
                    <span>Notify at 70% Quota Consumed</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={localSettings.warning_threshold_85}
                      onChange={() => handleToggle('warning_threshold_85')}
                      className="rounded border-zinc-700 bg-zinc-800 text-sky-500"
                    />
                    <span>Notify at 85% Quota Consumed</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={localSettings.warning_threshold_95}
                      onChange={() => handleToggle('warning_threshold_95')}
                      className="rounded border-zinc-700 bg-zinc-800 text-sky-500"
                    />
                    <span>Notify at 95% Quota Critical</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM SECTION */}
          {activeSection === 'system' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-zinc-200">
                    Hardware Monitoring
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Read native CPU, RAM, and Battery power status.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.system_monitor_enabled}
                  onChange={() => handleToggle('system_monitor_enabled')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div>
                  <div className="font-medium text-zinc-200">
                    Windows Media Session Integration
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Sync playback controls and metadata with Spotify & browsers.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.music_integration_enabled}
                  onChange={() => handleToggle('music_integration_enabled')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div>
                  <div className="font-medium text-zinc-200">
                    Desktop Island Notifications
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Show smooth floating toast alerts for important updates.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.notifications_enabled}
                  onChange={() => handleToggle('notifications_enabled')}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-white/10 bg-black/50 px-5 py-2.5">
        <button
          onClick={onRefreshQuota}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Sync Quota Now</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

