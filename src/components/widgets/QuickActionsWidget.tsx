'use client';

import React from 'react';
import {
  AlignCenter,
  BrainCircuit,
  Film,
  Minimize2,
  Music,
  RefreshCw,
  Settings,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { invokeCommand } from '@/lib/tauri';

interface QuickActionsWidgetProps {
  onOpenSettings: () => void;
  onRefreshQuota: () => void;
  onCollapse: () => void;
  onSelectTab: (tab: 'antigravity' | 'system') => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  onOpenSettings,
  onRefreshQuota,
  onCollapse,
  onSelectTab,
}) => {
  const handleLaunchCLI = () => {
    invokeCommand('open_antigravity_cli').catch(console.error);
  };

  const handleCenterNotch = () => {
    invokeCommand('center_island').catch(console.error);
  };

  const handleHideToTray = () => {
    invokeCommand('hide_island').catch(console.error);
  };

  const actions = [
    {
      title: 'Movie Mode',
      desc: 'Hide notch while watching (Ctrl+Alt+K)',
      icon: Film,
      color: 'text-rose-400',
      action: () => {
        onCollapse();
        invokeCommand('hide_island').catch(console.error);
      },
    },
    {
      title: 'Open Spotify',
      desc: 'Launch Spotify music player',
      icon: Music,
      color: 'text-[#1DB954]',
      action: () => invokeCommand('open_spotify').catch(console.error),
    },
    {
      title: 'Refresh Quota',
      desc: 'Sync latest AI model limits',
      icon: RefreshCw,
      color: 'text-sky-400',
      action: onRefreshQuota,
    },
    {
      title: 'Launch Antigravity',
      desc: 'Open AGY CLI in Windows Terminal',
      icon: Terminal,
      color: 'text-emerald-400',
      action: handleLaunchCLI,
    },
    {
      title: 'KODI Preferences',
      desc: 'Configure thresholds & notch appearance',
      icon: Settings,
      color: 'text-amber-400',
      action: onOpenSettings,
    },
    {
      title: 'Center Island',
      desc: 'Snap window back to top-center',
      icon: AlignCenter,
      color: 'text-indigo-400',
      action: handleCenterNotch,
    },
    {
      title: 'Collapse Island',
      desc: 'Return to compact pill state',
      icon: Minimize2,
      color: 'text-zinc-400',
      action: onCollapse,
    },
    {
      title: 'Hide to System Tray',
      desc: 'Keep running quietly in background',
      icon: Sparkles,
      color: 'text-purple-400',
      action: handleHideToTray,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-2 p-4 overflow-y-auto custom-scrollbar pb-6">
      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1">
        Desktop Utilities
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={act.action}
              className="flex flex-col items-start rounded-xl border border-white/5 bg-[#0e0f12] p-3 text-left transition-all hover:border-white/15 hover:bg-[#141518] active:scale-95"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 mb-2">
                <Icon className={`h-4 w-4 ${act.color}`} />
              </div>
              <span className="text-xs font-medium text-zinc-200">
                {act.title}
              </span>
              <span className="mt-0.5 text-[10px] text-zinc-500 leading-tight">
                {act.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
