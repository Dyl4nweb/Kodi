'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronDown,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Film,
  Github,
  Laptop,
  Monitor,
  Music,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AntigravityLogo } from './AntigravityLogo';
import { CompactPill } from './CompactPill';
import { ExpandedNotch } from './ExpandedNotch';
import { SettingsModal } from './SettingsModal';
import { useKodiState } from '@/hooks/useKodiState';

export const WebLandingPage: React.FC = () => {
  const [copiedWinget, setCopiedWinget] = useState(false);
  const repoUrl = 'https://github.com/Dyl4nweb/Kodi';
  const downloadUrl = `${repoUrl}/releases/latest/download/KODI_1.0.0_x64-setup.exe`;

  const {
    islandMode,
    setIslandMode,
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    antigravityStatus,
    mediaState,
    systemStats,
    isRefreshingQuota,
    refreshQuota,
    togglePlayPause,
    nextTrack,
    previousTrack,
    isMovieMode,
    toggleMovieMode,
  } = useKodiState();

  const handleCopyWinget = () => {
    navigator.clipboard.writeText('winget install Dyl4nweb.Kodi');
    setCopiedWinget(true);
    setTimeout(() => setCopiedWinget(false), 2200);
  };

  return (
    <div className="min-h-screen w-full bg-[#030305] text-zinc-100 font-sans antialiased selection:bg-sky-500/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-sky-600/15 via-indigo-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[600px] right-[-100px] h-[400px] w-[500px] rounded-full bg-emerald-600/10 blur-3xl opacity-50" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2.5 group">
          <AntigravityLogo size={22} glow />
          <span className="text-lg font-bold tracking-wider font-mono text-white group-hover:text-sky-300 transition-colors">
            KODI
          </span>
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
            v1.0.0
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <a href="#demo" className="hover:text-white transition-colors">
            Live Preview
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-to-install" className="hover:text-white transition-colors">
            Install Guide
          </a>
          <a
            href="https://github.com/Dyl4nweb/Kodi/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Privacy
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <Github className="h-4 w-4" />
          </a>

          <a
            href={downloadUrl}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all active:scale-95"
          >
            <Download className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-16 text-center">
        {/* Release Pill Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 backdrop-blur-md mb-6 shadow-sm">
          <Sparkles className="h-3 w-3 text-sky-400" />
          <span>The Next-Generation Dynamic Island for Windows 10 & 11</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          A sleek, floating notch for your{' '}
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Windows Desktop.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
          Monitor Google Antigravity AI quotas in real-time, control Spotify and native media, and track PC telemetry — all in an ultra-smooth, discreet top-center island.
        </p>

        {/* Primary Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={downloadUrl}
            className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-white px-7 font-semibold text-zinc-950 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:bg-zinc-100 transition-all active:scale-98"
          >
            <Download className="h-4 w-4 text-sky-600 transition-transform group-hover:-translate-y-0.5" />
            <span>Download for Windows (64-bit)</span>
          </a>

          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 font-medium text-zinc-200 transition-all active:scale-98"
          >
            <Github className="h-4 w-4" />
            <span>View Source on GitHub</span>
          </a>
        </div>

        {/* Quick CLI Winget install option */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <span>Or install via terminal:</span>
          <button
            onClick={handleCopyWinget}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-sky-500/40 hover:text-white transition-all"
          >
            <span>winget install Dyl4nweb.Kodi</span>
            {copiedWinget ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 text-zinc-500 group-hover:text-zinc-300" />
            )}
          </button>
        </div>
      </section>

      {/* Interactive Live Sandbox Preview */}
      <section id="demo" className="relative z-20 mx-auto max-w-4xl px-4 pb-20">
        <div className="text-center mb-4">
          <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-sky-400">
            Interactive Live Sandbox
          </span>
          <p className="text-xs text-zinc-400 mt-0.5">
            Try KODI live in your browser right now! Click the pill below to expand and switch tabs.
          </p>
        </div>

        {/* Mock Monitor Bezel Frame */}
        <div className="relative mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c0d12] to-[#040407] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top Bezel / Camera dot */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Desktop wallpaper background preview */}
          <div className="relative flex min-h-[580px] w-full flex-col items-center justify-start rounded-2xl bg-gradient-to-b from-[#111625] via-[#090b14] to-[#020205] pt-0 border border-white/5 overflow-hidden">
            {/* Embedded Live Dynamic Island */}
            <div className="relative z-30 pt-0">
              {islandMode === 'compact' ? (
                <CompactPill
                  antigravityStatus={antigravityStatus}
                  mediaState={mediaState}
                  systemStats={systemStats}
                  onExpand={() => setIslandMode('expanded')}
                  onHideMovieMode={toggleMovieMode}
                />
              ) : islandMode === 'expanded' ? (
                <ExpandedNotch
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  antigravityStatus={antigravityStatus}
                  mediaState={mediaState}
                  systemStats={systemStats}
                  isRefreshingQuota={isRefreshingQuota}
                  onRefreshQuota={refreshQuota}
                  onCollapse={() => setIslandMode('compact')}
                  onOpenSettings={() => setIslandMode('settings')}
                  onTogglePlayPause={togglePlayPause}
                  onNextTrack={nextTrack}
                  onPreviousTrack={previousTrack}
                />
              ) : (
                <div className="h-[490px] w-[520px] p-2">
                  <SettingsModal
                    settings={settings}
                    onSave={updateSettings}
                    onClose={() => setIslandMode('compact')}
                    onRefreshQuota={refreshQuota}
                  />
                </div>
              )}
            </div>

            {/* Desktop Mock Workspace Content behind the Notch */}
            <div className="mt-auto mb-10 text-center px-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-md">
                <Laptop className="h-3.5 w-3.5 text-sky-400" />
                <span>Simulating Windows Desktop Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 font-mono">
            Key Capabilities
          </h2>
          <h3 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered for developers, creators, and power users.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Antigravity */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-sky-500/30 hover:bg-white/[0.04] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 mb-5">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              Google Antigravity Quota
            </h4>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Real-time tracking of 5-hour and weekly request windows for Gemini 3.8 Flash, Pro, Claude 3.5 Sonnet, and GPT-4o with countdown timers.
            </p>
          </div>

          {/* Card 2: Spotify & Media */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-[#1DB954]/30 hover:bg-white/[0.04] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1DB954]/10 text-[#1DB954] mb-5">
              <Music className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              Spotify & GSMTC Media
            </h4>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Deep integration with Windows Global System Media Transport Controls. Play, pause, skip, and see live album artwork from Spotify and web players.
            </p>
          </div>

          {/* Card 3: System Telemetry */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-amber-500/30 hover:bg-white/[0.04] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-5">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              Hardware Telemetry
            </h4>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              CPU utilization, active memory usage, uptime counter, and accurate laptop battery percentages with charging status indicators.
            </p>
          </div>

          {/* Card 4: Movie Mode */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-rose-500/30 hover:bg-white/[0.04] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-5">
              <Film className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              Movie Mode (Ctrl + Alt + K)
            </h4>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Watching a movie or giving a presentation? Press Ctrl + Alt + K to stealthily hide the island instantly without quitting the app.
            </p>
          </div>

          {/* Card 5: Performance & Footprint */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-indigo-500/30 hover:bg-white/[0.04] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              Featherlight Footprint
            </h4>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Built on Tauri 2 and Rust with native Win32 APIs. Consumes only ~30 MB of RAM, leaving your system resources completely untouched.
            </p>
          </div>

          {/* Card 6: Privacy */}
          <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              100% Local & Private
            </h4>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              No remote servers, no user tracking, no telemetry beacons. All configurations stay locally inside %LOCALAPPDATA%\KODI.
            </p>
          </div>
        </div>
      </section>

      {/* How to Install Section */}
      <section id="how-to-install" className="relative z-10 mx-auto max-w-4xl px-6 py-20 border-t border-white/5">
        <div className="text-center mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 font-mono">
            Installation
          </h2>
          <h3 className="mt-2 text-3xl font-bold text-white">
            Up and running in 30 seconds.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30 font-mono text-sm font-bold text-sky-400 mb-4">
              1
            </div>
            <h4 className="font-semibold text-white">Download Setup</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Click the download button to get the latest <code>KODI_1.0.0_x64-setup.exe</code>.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30 font-mono text-sm font-bold text-sky-400 mb-4">
              2
            </div>
            <h4 className="font-semibold text-white">Run Installer</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Double-click the setup file. It installs to your local user profile without requiring admin privileges.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30 font-mono text-sm font-bold text-sky-400 mb-4">
              3
            </div>
            <h4 className="font-semibold text-white">Enjoy KODI</h4>
            <p className="text-xs text-zinc-400 mt-1">
              KODI appears automatically as an unobtrusive floating notch at the top of your screen!
            </p>
          </div>
        </div>

        {/* Big Bottom Download Banner */}
        <div className="mt-16 rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-8 sm:p-12 text-center">
          <h4 className="text-2xl font-bold text-white">
            Ready to upgrade your desktop workflow?
          </h4>
          <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
            Free and open-source forever under MIT / Apache-2.0. Compatible with Windows 10 and 11.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={downloadUrl}
              className="flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-semibold text-zinc-950 shadow-lg hover:bg-zinc-100 transition-all active:scale-95"
            >
              <Download className="h-4 w-4 text-sky-600" />
              <span>Download KODI for Windows</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <AntigravityLogo size={14} />
          <span>© 2026 KODI. Created with passion for the developer community.</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Dyl4nweb/Kodi/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="https://github.com/Dyl4nweb/Kodi/blob/main/TERMS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};
