'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  ChevronUp,
  Cpu,
  Grid,
  Music,
  Settings as SettingsIcon,
} from 'lucide-react';
import {
  ActiveTab,
  AntigravityStatus,
  MediaSessionState,
  SystemStats,
} from '@/types';
import { AntigravityWidget } from './widgets/AntigravityWidget';
import { MediaWidget } from './widgets/MediaWidget';
import { SystemWidget } from './widgets/SystemWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { AntigravityLogo } from './AntigravityLogo';
import { KodiLogo } from './KodiLogo';

interface ExpandedNotchProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  antigravityStatus: AntigravityStatus | null;
  mediaState: MediaSessionState | null;
  systemStats: SystemStats | null;
  isRefreshingQuota: boolean;
  onRefreshQuota: () => void;
  onCollapse: () => void;
  onOpenSettings: () => void;
  onTogglePlayPause: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
}

export const ExpandedNotch: React.FC<ExpandedNotchProps> = ({
  activeTab,
  setActiveTab,
  antigravityStatus,
  mediaState,
  systemStats,
  isRefreshingQuota,
  onRefreshQuota,
  onCollapse,
  onOpenSettings,
  onTogglePlayPause,
  onNextTrack,
  onPreviousTrack,
}) => {
  const tabs = [
    { id: 'antigravity', label: 'Quota', icon: BrainCircuit },
    { id: 'media', label: 'Music', icon: Music },
    { id: 'system', label: 'System', icon: Cpu },
    { id: 'actions', label: 'Actions', icon: Grid },
  ] as const;

  return (
    <motion.div
      layoutId="kodi-notch-container"
      className="relative flex h-[495px] w-[500px] flex-col rounded-[26px] border border-white/[0.12] bg-[#000000]/95 shadow-[0_24px_60px_rgba(0,0,0,0.98)] backdrop-blur-3xl select-none transform-gpu will-change-transform"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.85 }}
    >
      {/* Top subtle specular highlight */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Inner Container with overflow-hidden & rounded-b to smoothly clip scroll contents */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[26px]">
        {/* Top Navigation & Controls Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 py-2 flex-shrink-0">
          {/* Left: Brand Identity with Click-to-Collapse */}
          <div
            onClick={onCollapse}
            title="Click to collapse notch (Back up)"
            className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer rounded-lg px-1.5 py-1 transition-all hover:bg-white/5 active:scale-95"
          >
            <KodiLogo size={19} variant="blue" />
          </div>

          {/* Center: Sleek Tab Switcher */}
          <div className="flex items-center rounded-xl bg-black/60 p-0.5 border border-white/5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`relative flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-pill"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon className="relative z-10 h-3 w-3" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Window Controls with Prominent "Back to Up" (Collapse) Button */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onOpenSettings}
              title="Settings"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SettingsIcon className="h-3.5 w-3.5" />
            </button>

            {/* BACK TO UP / COLLAPSE BUTTON */}
            <button
              onClick={onCollapse}
              title="Back up to Dynamic Island (Esc)"
              className="group/btn flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/25 px-2.5 py-1 text-xs font-medium text-sky-300 hover:text-white transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)] active:scale-95"
            >
              <ChevronUp className="h-3.5 w-3.5 text-sky-400 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
              <span className="text-[11px] font-semibold tracking-tight">Back up</span>
            </button>
          </div>
        </div>

        {/* Main Widget Body */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'antigravity' && (
                <AntigravityWidget
                  status={antigravityStatus}
                  isRefreshing={isRefreshingQuota}
                  onRefresh={onRefreshQuota}
                  onOpenSettings={onOpenSettings}
                />
              )}

              {activeTab === 'media' && (
                <MediaWidget
                  mediaState={mediaState}
                  onTogglePlayPause={onTogglePlayPause}
                  onNext={onNextTrack}
                  onPrevious={onPreviousTrack}
                />
              )}

              {activeTab === 'system' && <SystemWidget stats={systemStats} />}

              {activeTab === 'actions' && (
                <QuickActionsWidget
                  onOpenSettings={onOpenSettings}
                  onRefreshQuota={onRefreshQuota}
                  onCollapse={onCollapse}
                  onSelectTab={setActiveTab}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Bottom Grab Bar / Back to Up */}
        <div
          onClick={onCollapse}
          title="Click to collapse notch up [Esc]"
          className="group/grab flex h-7 w-full cursor-pointer items-center justify-center gap-1.5 border-t border-white/[0.06] bg-gradient-to-t from-black via-black/90 to-black/60 hover:bg-white/10 transition-all select-none flex-shrink-0"
        >
          <ChevronUp className="h-3.5 w-3.5 text-zinc-400 group-hover/grab:text-sky-400 group-hover/grab:-translate-y-0.5 transition-all" />
          <span className="text-[11px] font-medium text-zinc-400 group-hover/grab:text-zinc-100 transition-colors">
            Back up · Collapse
          </span>
        </div>
      </div>
    </motion.div>
  );
};

