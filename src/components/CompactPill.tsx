'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Battery,
  BatteryCharging,
  Cpu,
  EyeOff,
  Flame,
  Pause,
  Plug,
  Radio,
  Terminal,
  Zap,
} from 'lucide-react';
import { AntigravityStatus, MediaSessionState, SystemStats } from '@/types';
import { CircularProgress } from './CircularProgress';
import { AntigravityLogo } from './AntigravityLogo';

interface CompactPillProps {
  antigravityStatus: AntigravityStatus | null;
  mediaState: MediaSessionState | null;
  systemStats: SystemStats | null;
  onExpand: () => void;
  onHideMovieMode?: () => void;
}

export const CompactPill: React.FC<CompactPillProps> = ({
  antigravityStatus,
  mediaState,
  systemStats,
  onExpand,
  onHideMovieMode,
}) => {
  const [rightGaugeMode, setRightGaugeMode] = useState<'battery' | 'quota'>('battery');
  const isMediaPlaying = mediaState?.is_active && mediaState.is_playing;
  const isSpotify =
    mediaState?.is_spotify ||
    mediaState?.app_name?.toLowerCase().includes('spotify');

  // Quota & window calculations from Antigravity
  const activeModel = antigravityStatus?.models?.[0];
  const quotaRemaining = activeModel
    ? Math.round(activeModel.remaining_percentage)
    : antigravityStatus?.lowest_remaining_pct
    ? Math.round(antigravityStatus.lowest_remaining_pct)
    : 92;
  const lowestRemaining = antigravityStatus
    ? Math.round(antigravityStatus.lowest_remaining_pct)
    : 12;

  // Battery calculations from SystemStats
  const hasBattery =
    systemStats?.battery_percent !== null &&
    systemStats?.battery_percent !== undefined;
  const batteryPct = hasBattery ? Math.round(systemStats!.battery_percent!) : 85;
  const isCharging = !!systemStats?.battery_charging;
  const isAcOnline = !!systemStats?.battery_ac_online;

  // Metric to display on right gauge
  const isBatteryActive = rightGaugeMode === 'battery';
  const displayPercentage = isBatteryActive ? batteryPct : lowestRemaining;

  // Determine stroke color for right ring
  const getRightRingColor = () => {
    if (isBatteryActive) {
      if (isCharging) return '#10b981'; // Emerald when charging
      if (batteryPct > 50) return '#10b981'; // Emerald healthy
      if (batteryPct > 20) return '#f59e0b'; // Amber warning
      return '#f43f5e'; // Rose low battery
    }
    if (!antigravityStatus || !antigravityStatus.connected) return '#71717a';
    if (lowestRemaining < 15) return '#f43f5e'; // Rose critical
    if (lowestRemaining < 30) return '#f59e0b'; // Amber warning
    return '#10b981'; // Emerald healthy
  };

  return (
    <motion.div
      layoutId="kodi-notch-container"
      onClick={onExpand}
      className="group relative flex h-[38px] w-[392px] cursor-pointer items-center justify-between rounded-[19px] bg-black/95 px-3.5 py-1 shadow-[0_10px_32px_rgba(0,0,0,0.95)] border border-white/[0.12] transition-all duration-300 select-none hover:border-white/[0.22] hover:shadow-[0_12px_36px_rgba(0,0,0,0.98)] transform-gpu will-change-transform"
      whileHover={{ y: 1.5, scale: 1.002 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.8 }}
    >
      {/* Subtle top rim specular edge */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* LEFT: Circular Progress Ring with Google Antigravity Logo & Percentage */}
      <div
        className="flex items-center gap-2 group/left"
        title={`Google Antigravity: ${activeModel?.name || 'Active'}: ${quotaRemaining}% quota remaining`}
      >
        <CircularProgress
          percentage={quotaRemaining}
          size={25}
          strokeWidth={2.2}
          strokeColor="#0084ff"
          trackColor="rgba(255, 255, 255, 0.14)"
          innerContent={
            <div className="flex items-center justify-center p-0.5 transition-transform duration-300 group-hover/left:scale-110">
              <AntigravityLogo size={14} />
            </div>
          }
        />
        <span className="font-mono text-xs font-semibold text-zinc-100 tracking-tight">
          {quotaRemaining}%
        </span>
      </div>

      {/* CENTER: Dynamic Context Tag (Active Window / Terminal / Spotify) */}
      <div className="flex max-w-[170px] flex-1 items-center justify-center overflow-hidden px-2">
        {isMediaPlaying ? (
          <div className="flex items-center gap-1.5 truncate">
            {/* Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              <span
                className={`w-0.5 rounded-full animate-[music-bar-1_0.8s_ease-in-out_infinite] h-2 ${
                  isSpotify ? 'bg-[#1DB954]' : 'bg-sky-400'
                }`}
              />
              <span
                className={`w-0.5 rounded-full animate-[music-bar-2_1.1s_ease-in-out_infinite] h-2.5 ${
                  isSpotify ? 'bg-[#1DB954]' : 'bg-sky-400'
                }`}
              />
              <span
                className={`w-0.5 rounded-full animate-[music-bar-3_0.9s_ease-in-out_infinite] h-1.5 ${
                  isSpotify ? 'bg-[#1DB954]' : 'bg-sky-400'
                }`}
              />
            </div>
            <span className="truncate text-xs font-medium text-zinc-100">
              {mediaState?.title || 'Playing'}
            </span>
          </div>
        ) : mediaState?.is_active && mediaState.title ? (
          <div className="flex items-center gap-1.5 truncate">
            <Pause className="h-2.5 w-2.5 text-zinc-500 flex-shrink-0" />
            <span className="truncate text-xs font-medium text-zinc-300">
              {mediaState.title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 truncate">
            {/* Terminal / App Indicator Icon */}
            <div className="flex h-3.5 w-3.5 items-center justify-center text-[#c28e67]">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 3h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 3v4h10V6H3zm1-1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm2.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
              </svg>
            </div>
            <span className="truncate text-xs font-medium text-zinc-200">
              {activeModel ? `${activeModel.name}` : 'KODI · Ready'}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: Percentage & Circular Ring Gauge with Battery / Quota Indicator */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={(e) => {
            e.stopPropagation();
            setRightGaugeMode((prev) => (prev === 'battery' ? 'quota' : 'battery'));
          }}
          title={
            isBatteryActive
              ? `Battery: ${hasBattery ? `${batteryPct}%` : 'AC Power'} ${
                  isCharging ? '(Charging)' : isAcOnline ? '(Plugged In)' : '(On Battery)'
                } · Click to switch to Quota`
              : `Antigravity Quota: ${lowestRemaining}% remaining · Click to switch to Battery`
          }
        >
          <span className="font-mono text-xs font-semibold text-zinc-100 tracking-tight min-w-[32px] text-right">
            {hasBattery || !isBatteryActive ? `${displayPercentage}%` : 'AC'}
          </span>

          <CircularProgress
            percentage={displayPercentage}
            size={25}
            strokeWidth={2.4}
            strokeColor={getRightRingColor()}
            trackColor="rgba(255, 255, 255, 0.14)"
            innerContent={
              isBatteryActive ? (
                isCharging ? (
                  <Zap className="h-2.5 w-2.5 text-emerald-400 fill-emerald-400" />
                ) : hasBattery ? (
                  <Zap
                    className={`h-2.5 w-2.5 ${
                      batteryPct > 50
                        ? 'text-emerald-400 fill-emerald-400'
                        : batteryPct > 20
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-rose-400 fill-rose-400'
                    }`}
                  />
                ) : (
                  <Plug className="h-2.5 w-2.5 text-sky-400" />
                )
              ) : (
                <Zap className="h-2.5 w-2.5 text-sky-400 fill-sky-400" />
              )
            }
          />
        </div>

        {/* Integrated Movie Mode Quick Toggle on Hover */}
        {onHideMovieMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHideMovieMode();
            }}
            title="Hide to Movie Mode (Ctrl+Alt+K)"
            className="flex h-5 w-0 opacity-0 group-hover:w-5 group-hover:opacity-100 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all overflow-hidden"
          >
            <EyeOff className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
