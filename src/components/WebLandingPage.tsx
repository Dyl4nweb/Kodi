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
  const [showBackToTop, setShowBackToTop] = useState(false);
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
    <div className="relative min-h-screen w-full bg-[#050508] text-zinc-100 font-sans antialiased selection:bg-emerald-500/25 selection:text-white">
      {/* Refined Ambient Lighting Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[860px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),rgba(20,24,40,0.05)_60%,transparent_75%)] blur-3xl" />
        <div className="absolute top-[800px] left-1/4 h-[350px] w-[500px] rounded-full bg-zinc-800/[0.04] blur-3xl" />
      </div>

      {/* Sleek Top Navigation */}
      <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2.5 group">
          <KodiLogo size={26} variant="blue" />
          <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 border border-white/10 bg-white/[0.03] px-2 py-0.5 rounded-full">
            PRO EDITION
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#interactive-preview" className="hover:text-white transition-colors">
            Live Preview
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#shortcuts" className="hover:text-white transition-colors">
            Shortcuts
          </a>
          <a href="#install" className="hover:text-white transition-colors">
            Download
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
          >
            <span>$2.99 (~₱150)</span>
          </a>

          <a
            href={downloadUrl}
            download="KODI_Setup.exe"
            className="group flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-950 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span>Download KODI</span>
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
            className="drop-shadow-[0_20px_40px_rgba(16,185,129,0.15)] select-none hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </div>

        {/* Minimal pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-md mb-6 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
          Monitor Google Antigravity & AI quotas in real time, command Spotify playback with animated vinyl disc visualizers, and manage system vitals — discreetly floating at the top of your screen.
        </p>

        {/* Primary Download action */}
        <div className="mt-8 flex items-center justify-center">
          <a
            href={downloadUrl}
            download="KODI_Setup.exe"
            className="group flex h-12 items-center justify-center gap-2.5 rounded-xl bg-white px-8 text-sm font-semibold text-zinc-950 shadow-[0_12px_24px_rgba(255,255,255,0.15)] hover:bg-zinc-200 transition-all active:scale-98 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-600 transition-transform group-hover:-translate-y-0.5" />
            <span>Download KODI Pro · $2.99 (~₱150)</span>
          </a>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-zinc-500 font-mono">
          <span>Lifetime License · $2.99 USD (~₱150 PHP)</span>
          <span>·</span>
          <span>Runs in Background Tray</span>
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
                ? 'bg-emerald-500 text-white shadow-sm'
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
                <div className="h-[400px] w-[430px] p-0">
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
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
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
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-3">
                <BrainCircuit className="h-4 w-4" />
                <span>Google Antigravity & AI Quotas</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Live AI quota countdowns and limits
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-lg">
                Never get surprised by rate limits mid-workflow. Kodi monitors 5-hour rolling windows and weekly quota allowances for Google Antigravity, Claude, and OpenAI / Codex models with live reset timers.
              </p>
            </div>

            {/* Visual preview strip inside card */}
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/60 p-4 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300 mb-2">
                <span className="text-emerald-400 font-semibold">Gemini 2.5 Flash</span>
                <span className="text-zinc-500">Reset in 02h 27m</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 w-[74%]" />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Spotify & Media */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-7 flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="flex items-center gap-2 text-[#1DB954] font-mono text-xs mb-3">
                <Music className="h-4 w-4" />
                <span>Windows GSMTC & Spotify</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Spotify & Media Control
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Play, pause, skip, and see live dancing audio equalizers and spinning vinyl disc art right from your screen edge.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/60 p-3">
              <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#1DB954]">
                <Music className="h-4 w-4 text-[#1DB954]" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-white truncate">Spotify Active Stream</div>
                <div className="text-[10px] text-zinc-500 truncate">Synchronized Playback Controls</div>
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
                Built with Tauri 2 and direct Win32 message hooks. Runs silently in the Windows system tray without crowding your taskbar or consuming battery.
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

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 mx-auto max-w-4xl px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Simple, Transparent Pricing
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Get KODI Pro for a one-time price.
          </h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            Pay once, keep it forever. No monthly subscriptions, no hidden renewals.
          </p>
        </div>

        <div className="mx-auto max-w-lg rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0e1410] to-[#060807] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full font-semibold">
              Lifetime License
            </span>
            <span className="text-xs text-zinc-400 font-mono">One-time payment</span>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-extrabold text-white">$2.99</span>
            <span className="text-xl text-zinc-400 font-medium">USD</span>
            <span className="ml-2 text-sm text-emerald-400 font-mono font-medium">(~₱150 PHP)</span>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-6 mb-8 text-xs text-zinc-300">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Full Windows Dynamic Island (Compact Pill & Expanded Notch)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Real-time Google Antigravity, Claude, and OpenAI / Codex Quotas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Spotify & Native Media Controller with Animated Vinyl Visualizer</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Hardware Telemetry, Battery Gauge & Connectivity Shortcuts (Bluetooth, Wi-Fi)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Stealth Movie Mode with Global Hotkey (Ctrl+Alt+K)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Runs silently in the Windows System Tray (Zero taskbar footprint)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>100% Offline Capable, Zero Telemetry, Free Lifetime Updates</span>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="KODI_Setup.exe"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-[0_10px_25px_rgba(255,255,255,0.2)] transition-all active:scale-98 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Download KODI Pro — $2.99 (~₱150)</span>
          </a>
        </div>
      </section>

      {/* Keyboard Shortcuts Strip */}
      <section id="shortcuts" className="relative z-10 mx-auto max-w-5xl px-6 py-12 border-t border-white/[0.06]">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-emerald-400">Keyboard First</span>
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
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Instant Setup
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Install in seconds.
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            No admin privileges required. Installs cleanly to your Windows user profile.
          </p>
        </div>

        <div className="mx-auto max-w-lg rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-8 flex flex-col items-center text-center hover:border-white/15 transition-all">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
            Standalone Windows Executable
          </div>
          <h4 className="text-xl font-bold text-white">
            Official NSIS Installer (.exe)
          </h4>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
            Download the official setup and run it. Automatically sets up your start menu shortcut and discreet system tray background icon.
          </p>
          <a
            href={downloadUrl}
            download="KODI_Setup.exe"
            className="mt-6 flex items-center justify-center gap-2.5 rounded-xl bg-white px-8 py-3 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-all active:scale-98 cursor-pointer shadow-lg shadow-white/10"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Download KODI_Setup.exe (64-bit)</span>
          </a>
          <span className="mt-3 text-[11px] font-mono text-zinc-500">
            Version 1.1.1 · Windows 10 & 11 compatible · Offline
          </span>
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
            href="/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/TERMS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Terms of Service
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/80 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-zinc-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-white/30 hover:bg-black/95 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <ChevronUp className="h-4 w-4 text-zinc-400" />
            <span>Back to top</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
