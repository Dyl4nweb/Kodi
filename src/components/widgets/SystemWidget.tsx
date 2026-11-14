'use client';

import React from 'react';
import {
  Battery,
  BatteryCharging,
  Clock,
  Cpu,
  Globe,
  HardDrive,
  Laptop,
  Plug,
  Wifi,
  Zap,
} from 'lucide-react';
import { SystemStats } from '@/types';

interface SystemWidgetProps {
  stats: SystemStats | null;
}

export const SystemWidget: React.FC<SystemWidgetProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-zinc-500 text-xs">
        Loading system telemetry...
      </div>
    );
  }

  const formatUptime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex h-full flex-col gap-3 p-4 overflow-y-auto custom-scrollbar pb-6">
      {/* Top Grid: CPU & Memory */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* CPU Card */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-[#0e0f12] p-3 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Processor</span>
            <Cpu className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-white">
              {Math.round(stats.cpu_percent)}
            </span>
            <span className="text-xs text-zinc-500">%</span>
          </div>
          {/* CPU Progress */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stats.cpu_percent > 80
                  ? 'bg-rose-500'
                  : stats.cpu_percent > 50
                  ? 'bg-amber-400'
                  : 'bg-sky-400'
              }`}
              style={{ width: `${Math.min(100, stats.cpu_percent)}%` }}
            />
          </div>
        </div>

        {/* Memory Card */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-[#0e0f12] p-3 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">RAM</span>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-white">
              {Math.round(stats.memory_percent)}
            </span>
            <span className="text-xs text-zinc-500">%</span>
          </div>
          <div className="mt-1 text-[10px] text-zinc-400 font-mono">
            {stats.memory_used_gb} GB / {stats.memory_total_gb} GB
          </div>
          {/* Memory Bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${Math.min(100, stats.memory_percent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Power & Network Status */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Battery / Power Card */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-[#0e0f12] p-3 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Power</span>
            {stats.battery_charging ? (
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
                <Zap className="h-3 w-3 fill-emerald-400 animate-pulse" />
                <span>Charging</span>
              </div>
            ) : stats.battery_percent !== null ? (
              stats.battery_ac_online ? (
                <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400 font-medium">
                  <Plug className="h-3 w-3" />
                  <span>Plugged In</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-medium">
                  <Battery className="h-3 w-3" />
                  <span>On Battery</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-medium">
                <Plug className="h-3 w-3" />
                <span>AC Desktop</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-white">
              {stats.battery_percent !== null ? Math.round(stats.battery_percent) : 'AC'}
            </span>
            {stats.battery_percent !== null && (
              <span className="text-xs text-zinc-500">%</span>
            )}
          </div>

          {/* Battery Status Label & Remaining Time */}
          <div className="mt-1 text-[10px] text-zinc-400 font-mono truncate">
            {stats.battery_percent !== null ? (
              stats.battery_life_time_secs ? (
                <span>
                  ~{Math.floor(stats.battery_life_time_secs / 3600)}h{' '}
                  {Math.floor((stats.battery_life_time_secs % 3600) / 60)}m left
                </span>
              ) : stats.battery_charging ? (
                <span>Charging active</span>
              ) : stats.battery_percent === 100 ? (
                <span>100% Full</span>
              ) : (
                <span>On battery</span>
              )
            ) : (
              <span>Continuous AC Power</span>
            )}
          </div>

          {/* Battery Progress Bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stats.battery_charging
                  ? 'bg-emerald-400'
                  : stats.battery_percent !== null
                  ? stats.battery_percent > 50
                    ? 'bg-emerald-400'
                    : stats.battery_percent > 20
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                  : 'bg-sky-400'
              }`}
              style={{
                width: `${
                  stats.battery_percent !== null
                    ? Math.min(100, Math.max(2, stats.battery_percent))
                    : 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Network & Connectivity Card */}
        <div className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#0e0f12] p-3 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Network</span>
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                stats.is_online
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  stats.is_online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span>{stats.is_online ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sky-400">
              <Wifi className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                {stats.is_online ? 'WiFi / Ethernet' : 'No Connection'}
              </div>
              <div className="text-[10px] text-zinc-500">
                {stats.is_online ? 'Local Gateway Active' : 'Check network cable'}
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-zinc-500">
            Fast telemetry sync active
          </div>
        </div>
      </div>

      {/* System Uptime Footer */}
      <div className="mt-auto flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span>System Uptime</span>
        </div>
        <span className="font-mono text-zinc-200 font-medium">
          {formatUptime(stats.uptime_seconds)}
        </span>
      </div>
    </div>
  );
};

