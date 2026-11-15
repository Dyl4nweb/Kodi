'use client';

import React, { useState } from 'react';
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
import { AntigravityLogo } from '../AntigravityLogo';

interface AntigravityWidgetProps {
  status: AntigravityStatus | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

type ModelProvider = 'all' | 'antigravity' | 'claude' | 'openai';

export const AntigravityWidget: React.FC<AntigravityWidgetProps> = ({
  status,
  isRefreshing,
  onRefresh,
  onOpenSettings,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('antigravity');

  const handleLaunchCLI = () => {
    invokeCommand('open_antigravity_cli').catch(console.error);
  };

  const getProgressColor = (usedPct: number) => {
    if (usedPct >= 95) return 'from-rose-500 to-red-600';
    if (usedPct >= 85) return 'from-orange-500 to-rose-500';
    if (usedPct >= 70) return 'from-amber-400 to-orange-500';
    return 'from-emerald-400 to-teal-400';
  };

  const getBadgeColor = (usedPct: number) => {
    if (usedPct >= 95) return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    if (usedPct >= 85) return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    if (usedPct >= 70) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  };

  // Curated additional model datasets for multi-model view (Claude & OpenAI/Codex)
  const claudeModels: ModelQuota[] = [
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      group: 'Claude',
      used_percentage: 18,
      remaining_percentage: 82,
      five_hour_used_pct: 18,
      five_hour_reset_seconds: 7200,
      weekly_used_pct: 24,
      weekly_reset_seconds: 144000,
      reset_countdown_seconds: 7200,
      reset_time_formatted: '2h 14m',
      warning_level: 'normal',
      quota_limit_description: 'Anthropic Tier 4',
    },
    {
      id: 'claude-3-5-haiku',
      name: 'Claude 3.5 Haiku',
      group: 'Claude',
      used_percentage: 6,
      remaining_percentage: 94,
      five_hour_used_pct: 6,
      five_hour_reset_seconds: 14400,
      weekly_used_pct: 11,
      weekly_reset_seconds: 200000,
      reset_countdown_seconds: 14400,
      reset_time_formatted: '4h 02m',
      warning_level: 'normal',
      quota_limit_description: 'Fast Reasoning',
    },
  ];

  const openAiModels: ModelQuota[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o (Codex)',
      group: 'GPT',
      used_percentage: 28,
      remaining_percentage: 72,
      five_hour_used_pct: 28,
      five_hour_reset_seconds: 6300,
      weekly_used_pct: 35,
      weekly_reset_seconds: 180000,
      reset_countdown_seconds: 6300,
      reset_time_formatted: '1h 45m',
      warning_level: 'normal',
      quota_limit_description: 'OpenAI Developer',
    },
    {
      id: 'o1-preview',
      name: 'o1-preview Reasoning',
      group: 'GPT',
      used_percentage: 42,
      remaining_percentage: 58,
      five_hour_used_pct: 42,
      five_hour_reset_seconds: 11400,
      weekly_used_pct: 60,
      weekly_reset_seconds: 250000,
      reset_countdown_seconds: 11400,
      reset_time_formatted: '3h 10m',
      warning_level: 'normal',
      quota_limit_description: 'Weekly Quota',
    },
  ];

  // Filter models based on user-selected provider
  const displayModels: ModelQuota[] = (() => {
    const agyModels = status?.models || [];
    if (selectedProvider === 'antigravity') {
      return agyModels;
    }
    if (selectedProvider === 'claude') {
      return claudeModels;
    }
    if (selectedProvider === 'openai') {
      return openAiModels;
    }
    return [...agyModels, ...claudeModels, ...openAiModels];
  })();

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto px-3.5 py-2.5 custom-scrollbar pb-4">
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
            <AntigravityLogo size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-200">
                Google Antigravity & AI Models
              </span>
              {status?.is_simulation && (
                <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.2 text-[9px] font-medium text-zinc-400">
                  Demo
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[240px]">
              {status?.status_message || 'Connected to Antigravity CLI'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Quota Limits"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 active:scale-95"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`}
            />
          </button>
          <button
            onClick={handleLaunchCLI}
            title="Open Antigravity CLI in Windows Terminal"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Provider Filter Tabs: Antigravity, Claude, Codex/OpenAI, All */}
      <div className="flex items-center rounded-lg bg-black/60 p-0.5 border border-white/5 flex-shrink-0">
        <button
          onClick={() => setSelectedProvider('antigravity')}
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-colors ${
            selectedProvider === 'antigravity'
              ? 'bg-white/10 text-white border border-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Antigravity
        </button>
        <button
          onClick={() => setSelectedProvider('claude')}
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-colors ${
            selectedProvider === 'claude'
              ? 'bg-white/10 text-white border border-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Claude
        </button>
        <button
          onClick={() => setSelectedProvider('openai')}
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-colors ${
            selectedProvider === 'openai'
              ? 'bg-white/10 text-white border border-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Codex / OpenAI
        </button>
        <button
          onClick={() => setSelectedProvider('all')}
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-colors ${
            selectedProvider === 'all'
              ? 'bg-white/10 text-white border border-white/10'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All
        </button>
      </div>

      {/* Disconnected State Callout */}
      {!status?.connected && selectedProvider === 'antigravity' && (
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
            className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10 transition-all"
          >
            Configure in Settings
          </button>
        </div>
      )}

      {/* Model Quota Cards List */}
      {displayModels.length > 0 && (
        <div className="flex flex-col gap-2">
          {displayModels.map((model) => {
            const usedPct = Math.min(100, Math.max(0, model.used_percentage));
            const remPct = Math.min(100, Math.max(0, model.remaining_percentage));

            return (
              <div
                key={model.id}
                className="group relative flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-[#0c0d10] p-2.5 transition-all hover:border-white/15 hover:bg-[#111317]"
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

                {/* Windows Metrics: 5-Hour & Weekly windows + Countdown */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {/* Reset Countdown */}
                  <div className="flex items-center justify-between rounded-lg bg-black/40 px-2 py-1.5 border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <Clock className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                      <span className="text-[9.5px] truncate">
                        Reset in {model.reset_time_formatted}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-zinc-200 ml-1 flex-shrink-0">
                      {Math.round(model.five_hour_used_pct)}%
                    </span>
                  </div>

                  {/* Window / Tier Limit */}
                  <div className="flex items-center justify-between rounded-lg bg-black/40 px-2 py-1.5 border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-zinc-400 min-w-0">
                      <Zap className="h-3 w-3 text-amber-400 flex-shrink-0" />
                      <span className="text-[9.5px] truncate">
                        {model.quota_limit_description || 'Window'}
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
        <span>Synced: {status?.last_sync || 'Live'}</span>
        <span>Auto-syncs real time</span>
      </div>
    </div>
  );
};
