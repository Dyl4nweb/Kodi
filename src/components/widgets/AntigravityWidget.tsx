'use client';

import React from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Info,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AntigravityStatus, ModelQuota } from '@/types';
import { invokeCommand } from '@/lib/tauri';

interface AntigravityWidgetProps {
  status: AntigravityStatus | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export const AntigravityWidget: React.FC<AntigravityWidgetProps> = ({
  status,
  isRefreshing,
  onRefresh,
  onOpenSettings,
}) => {
  const handleLaunchCLI = () => {
    invokeCommand('open_antigravity_cli').catch(console.error);
  };

  const getProgressColor = (usedPct: number) => {
    if (usedPct >= 95) return 'from-rose-500 to-red-600';
    if (usedPct >= 85) return 'from-orange-500 to-rose-500';
    if (usedPct >= 70) return 'from-amber-400 to-orange-500';
    return 'from-sky-400 to-emerald-400';
  };

  const getBadgeColor = (usedPct: number) => {
    if (usedPct >= 95) return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    if (usedPct >= 85) return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    if (usedPct >= 70) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-y-auto px-4 py-3 custom-scrollbar pb-6">
      {/* Top Status & Sync Header */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              status?.connected
                ? status.lowest_remaining_pct < 15
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                  : status.lowest_remaining_pct < 30
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-700 bg-zinc-800/50 text-zinc-400'
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-200">
                Google Antigravity
              </span>
              {status?.is_simulation && (
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.2 text-[9px] font-medium text-sky-400">
                  Interactive Demo
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[240px]">
              {status?.status_message || 'Connecting to provider...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Quota"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`}
            />
          </button>
          <button
            onClick={handleLaunchCLI}
            title="Open Antigravity CLI in Terminal"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Disconnected State Callout */}
      {!status?.connected && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-black/40 p-6 text-center">
          <Info className="h-8 w-8 text-zinc-500 mb-2" />
          <h4 className="text-xs font-semibold text-zinc-300">
            No Antigravity Source Detected
          </h4>
          <p className="mt-1 text-[11px] text-zinc-500 max-w-xs">
            Neither the local Antigravity CLI nor direct quota telemetry could be resolved.
          </p>
          <button
            onClick={onOpenSettings}
            className="mt-3 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/20"
          >
            Enable Simulation Mode in Settings
          </button>
        </div>
      )}

      {/* Model Quota Cards List */}
      {status?.connected && status.models.length > 0 && (
        <div className="flex flex-col gap-2">
          {status.models.map((model) => {
            const usedPct = Math.min(100, Math.max(0, model.used_percentage));
            const remPct = Math.min(100, Math.max(0, model.remaining_percentage));

            return (
              <div
                key={model.id}
                className="group relative flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-[#0c0d10] p-2.5 shadow-sm transition-all hover:border-white/15 hover:bg-[#111317]"
              >
                {/* Model Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-100">
                      {model.name}
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">
                      {model.group}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full border px-2 py-0.2 text-[10px] font-semibold font-mono ${getBadgeColor(
                        usedPct
                      )}`}
                    >
                      {Math.round(remPct)}% rem
                    </span>
                  </div>
                </div>

                {/* Main Progress Bar */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/80">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getProgressColor(
                      usedPct
                    )}`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>

                {/* Windows Metrics: 5-Hour & Weekly windows + Countdown in Compact Strip */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {/* 5-Hour Usage Window */}
                  <div className="flex items-center justify-between rounded-lg bg-black/40 px-2 py-1.5 border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <Clock className="h-3 w-3 text-sky-400 flex-shrink-0" />
                      <span className="text-[9.5px] truncate">
                        Reset in {model.reset_time_formatted}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-zinc-200 ml-1 flex-shrink-0">
                      {Math.round(model.five_hour_used_pct)}%
                    </span>
                  </div>

                  {/* Weekly Usage Window */}
                  <div className="flex items-center justify-between rounded-lg bg-black/40 px-2 py-1.5 border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <Zap className="h-3 w-3 text-amber-400 flex-shrink-0" />
                      <span className="text-[9.5px] truncate">
                        {model.quota_limit_description || 'Weekly'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-zinc-200 ml-1 flex-shrink-0">
                      {Math.round(model.weekly_used_pct)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto flex items-center justify-between pt-1 pb-1 text-[10px] text-zinc-500 flex-shrink-0">
        <span>Synced: {status?.last_sync || 'Never'}</span>
        <span>Auto-refreshes every 60s</span>
      </div>
    </div>
  );
};

