'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronUp,
  Clock,
  Command,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Github,
  Laptop,
  Layers,
  Minimize2,
  Music,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { KodiLogo } from './KodiLogo';
import { CompactPill } from './CompactPill';
import { ExpandedNotch } from './ExpandedNotch';
import { SettingsModal } from './SettingsModal';
import { useKodiState } from '@/hooks/useKodiState';

export const WebLandingPage: React.FC = () => {
  const [copiedWinget, setCopiedWinget] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const repoUrl = 'https://github.com/Dyl4nweb/Kodi';
  const downloadUrl = '/KODI_Setup.exe';

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyWinget = () => {
    navigator.clipboard.writeText('winget install Dyl4nweb.Kodi');
    setCopiedWinget(true);
    setTimeout(() => setCopiedWinget(false), 2200);
  };

  // Quick preset triggers for the live sandbox
  const setPresetMode = (mode: 'compact' | 'quota' | 'music' | 'system' | 'movie') => {
    if (mode === 'compact') {
      if (isMovieMode) toggleMovieMode();
      setIslandMode('compact');
    } else if (mode === 'quota') {
      if (isMovieMode) toggleMovieMode();
      setIslandMode('expanded');
      setActiveTab('antigravity');
    } else if (mode === 'music') {
      if (isMovieMode) toggleMovieMode();
      setIslandMode('expanded');
      setActiveTab('media');
    } else if (mode === 'system') {
      if (isMovieMode) toggleMovieMode();
      setIslandMode('expanded');
      setActiveTab('system');
    } else if (mode === 'movie') {
      if (!isMovieMode) toggleMovieMode();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-zinc-100 font-sans antialiased selection:bg-sky-500/25 selection:text-white">
      {/* Refined Ambient Lighting Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[860px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14),rgba(20,24,40,0.05)_60%,transparent_75%)] blur-3xl" />
        <div className="absolute top-[800px] left-1/4 h-[350px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-3xl" />
      </div>

      {/* Sleek Top Navigation */}
      <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2.5 group">
          <KodiLogo size={26} variant="blue" />
          <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 border border-white/10 bg-white/[0.03] px-2 py-0.5 rounded-full">
            v1.0.0
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#interactive-preview" className="hover:text-white transition-colors">
            Live Preview
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#shortcuts" className="hover:text-white transition-colors">
            Shortcuts
          </a>
          <a href="#install" className="hover:text-white transition-colors">
            Install
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
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white transition-all active:scale-95"
          >
            <Github className="h-4 w-4" />
          </a>

          <a
            href={downloadUrl}
            download="KODI_Setup.exe"
            className="group flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-950 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-12 pb-14 text-center">
        {/* App Icon */}
        <div className="flex justify-center mb-6">
          <KodiLogo
            size={88}
            variant="icon"
            className="drop-shadow-[0_20px_40px_rgba(56,189,248,0.22)] select-none hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </div>

        {/* Minimal pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-md mb-6 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          <span className="font-medium">Native Windows Dynamic Island</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400">Windows 10 & 11</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
          The Dynamic Island.
          <br />
          <span className="text-zinc-500">Brought to Windows.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
          Monitor Google Antigravity quotas in real time, command Spotify playback, and keep track of system vitals — discreetly floating at the top edge of your screen.
        </p>

        {/* Primary Download & Winget actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a
            href={downloadUrl}
            download="KODI_Setup.exe"
            className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950 shadow-[0_12px_24px_rgba(255,255,255,0.15)] hover:bg-zinc-200 transition-all active:scale-98 cursor-pointer"
          >
            <Download className="h-4 w-4 text-sky-600 transition-transform group-hover:-translate-y-0.5" />
            <span>Download for Windows (64-bit)</span>
          </a>

          <button
            onClick={handleCopyWinget}
            className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-xs font-mono text-zinc-300 hover:border-white/20 hover:bg-white/[0.06] transition-all active:scale-98"
          >
            <Terminal className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
            <span>winget install Dyl4nweb.Kodi</span>
            {copiedWinget ? (
              <Check className="h-3.5 w-3.5 text-emerald-400 ml-1" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 ml-1" />
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-zinc-500 font-mono">
          <span>Free & Open Source</span>
          <span>·</span>
          <span>Lightweight ~32MB RAM</span>
          <span>·</span>
          <span>Zero Telemetry</span>
        </div>
      </section>

      {/* Interactive Live Sandbox Preview */}
      <section id="interactive-preview" className="relative z-20 mx-auto max-w-4xl px-4 pb-20">
        {/* Preset Selector Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mr-2 hidden sm:inline">
            Interactive Stage:
          </span>
          <button
            onClick={() => setPresetMode('compact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMovieMode && islandMode === 'compact'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Compact Pill</span>
          </button>
          <button
            onClick={() => setPresetMode('quota')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMovieMode && islandMode === 'expanded' && activeTab === 'antigravity'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>AI Quota</span>
          </button>
          <button
            onClick={() => setPresetMode('music')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMovieMode && islandMode === 'expanded' && activeTab === 'media'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            <span>Media</span>
          </button>
          <button
            onClick={() => setPresetMode('system')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMovieMode && islandMode === 'expanded' && activeTab === 'system'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Hardware</span>
          </button>
          <button
            onClick={() => setPresetMode('movie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isMovieMode
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Movie Mode</span>
          </button>
        </div>

        {/* Floating Desktop Canvas */}
        <div className="relative mx-auto rounded-2xl border border-white/[0.08] bg-[#08080d] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="relative flex min-h-[540px] w-full flex-col items-center justify-start rounded-xl bg-gradient-to-b from-[#0e1017] via-[#090a0f] to-[#040407] pt-0 border border-white/[0.04] overflow-hidden">
            {/* Screen Top Bezel hint */}
            <div className="h-1.5 w-full bg-black/80 border-b border-white/[0.03]" />

            {/* Live Interactive Notch */}
            <div className="relative z-30 pt-0">
              {isMovieMode ? (
                <div className="mt-2 flex flex-col items-center">
                  <button
                    onClick={toggleMovieMode}
                    className="flex h-6 items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 text-xs text-amber-300 hover:bg-amber-500/20 transition-all"
                  >
                    <Film className="h-3 w-3" />
                    <span>Movie Mode Active · Click to Reveal Notch</span>
                  </button>
                </div>
              ) : islandMode === 'compact' ? (
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

            {/* Subtle Interactive Stage Workspace Note */}
            <div className="mt-auto mb-6 text-center px-4">
              <span className="font-mono text-[11px] text-zinc-500">
                Click inside the notch to switch tabs · Click [Back up] or press Esc to collapse
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Section (Minimal, Aesthetic, Non-Generic) */}
      <section id="features" className="relative z-10 mx-auto max-w-5xl px-6 py-20 border-t border-white/[0.06]">
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-sky-400">
            Design & Architecture
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything in your periphery.
            <br />
            <span className="text-zinc-500">Nothing in your way.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bento Card 1: Antigravity AI Quota (Wide - 2 columns) */}
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-7 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs mb-3">
                <BrainCircuit className="h-4 w-4" />
                <span>Google Antigravity Telemetry</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Live AI quota countdowns and limits
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-lg">
                Never get surprised by rate limits mid-workflow. Kodi monitors 5-hour rolling windows and weekly quota allowances for Gemini 3.8 Flash, Pro, and Claude with live reset timers.
              </p>
            </div>

            {/* Visual preview strip inside card */}
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/60 p-4 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300 mb-2">
                <span className="text-sky-400 font-semibold">Gemini 3.8 Flash</span>
                <span className="text-zinc-500">Reset in 02h 27m</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-teal-400 w-[74%]" />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Spotify & Media */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-7 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-3">
                <Music className="h-4 w-4" />
                <span>Windows GSMTC</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Spotify & Media Control
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Play, pause, skip, and see live dancing audio equalizers right from your screen edge without alt-tabbing.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/60 p-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Music className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-white truncate">Resonance</div>
                <div className="text-[10px] text-zinc-500 truncate">KODI Chillhop · Lo-Fi Sessions</div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Movie Mode Stealth */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-7 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-3">
                <Film className="h-4 w-4" />
                <span>Stealth Mode</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Movie Mode (Ctrl + Alt + K)
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Streaming, gaming, or presenting? Press the shortcut to completely hide the island. Hover the top edge to peek anytime.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/60 p-3 font-mono text-[11px] text-zinc-400">
              <span>Shortcut:</span>
              <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-white">
                Ctrl + Alt + K
              </kbd>
            </div>
          </div>

          {/* Bento Card 4: Native Rust & Win32 Performance (Wide - 2 columns) */}
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-7 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-3">
                <Zap className="h-4 w-4" />
                <span>Native Performance</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                ~32 MB RAM · Native Rust Architecture
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-lg">
                Built with Tauri 2 and direct Win32 message hooks. Unlike heavy Chromium webview apps, KODI runs with near-zero CPU overhead and zero memory bloat.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-center">
              <div className="rounded-xl border border-white/[0.06] bg-black/60 p-3">
                <div className="text-base font-bold text-white">~32 MB</div>
                <div className="text-[10px] text-zinc-500 uppercase mt-0.5">RAM Usage</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/60 p-3">
                <div className="text-base font-bold text-white">&lt; 0.2%</div>
                <div className="text-[10px] text-zinc-500 uppercase mt-0.5">Idle CPU</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/60 p-3">
                <div className="text-base font-bold text-emerald-400">100%</div>
                <div className="text-[10px] text-zinc-500 uppercase mt-0.5">Offline Privacy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts Strip */}
      <section id="shortcuts" className="relative z-10 mx-auto max-w-5xl px-6 py-12 border-t border-white/[0.06]">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-sky-400">Keyboard First</span>
            <h4 className="text-lg font-semibold text-white mt-0.5">
              Control everything without reaching for the mouse.
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-zinc-300">
              <kbd className="text-zinc-500">Esc</kbd>
              <span>Collapse</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-zinc-300">
              <kbd className="text-zinc-500">Ctrl + Alt + K</kbd>
              <span>Movie Stealth</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-zinc-300">
              <kbd className="text-zinc-500">Space</kbd>
              <span>Play / Pause</span>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="install" className="relative z-10 mx-auto max-w-4xl px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-sky-400">
            Get Started
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Install in seconds.
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            No admin privileges required. Installs cleanly to your Windows user profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Direct Installer */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-6 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                Option 1 · Standalone Setup
              </div>
              <h4 className="text-lg font-semibold text-white">
                Windows Executable (.exe)
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Download the official NSIS installer and launch. Automatically creates your start menu shortcut and tray icon.
              </p>
            </div>
            <a
              href={downloadUrl}
              download="KODI_Setup.exe"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-all active:scale-98 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-sky-600" />
              <span>Download KODI_Setup.exe</span>
            </a>
          </div>

          {/* Option B: Terminal Winget */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-6 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                Option 2 · Windows Package Manager
              </div>
              <h4 className="text-lg font-semibold text-white">
                Command Line (winget)
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Run this command in Windows Terminal or PowerShell for quick, automated installation and updates.
              </p>
            </div>
            <button
              onClick={handleCopyWinget}
              className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/70 px-4 py-2.5 font-mono text-xs text-zinc-300 hover:border-sky-500/40 transition-all active:scale-98"
            >
              <span>winget install Dyl4nweb.Kodi</span>
              {copiedWinget ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-zinc-500" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <KodiLogo size={18} variant="white" />
          <span>© 2026 KODI · Windows Dynamic Island</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Dyl4nweb/Kodi/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://github.com/Dyl4nweb/Kodi/blob/main/TERMS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Terms
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

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            title="Back to Top"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/80 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-zinc-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-sky-500/50 hover:bg-black/95 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <ChevronUp className="h-4 w-4 text-sky-400" />
            <span>Back to top</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
