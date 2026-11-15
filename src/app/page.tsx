'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useKodiState } from '@/hooks/useKodiState';
import { CompactPill } from '@/components/CompactPill';
import { ExpandedNotch } from '@/components/ExpandedNotch';
import { NotificationBanner } from '@/components/NotificationBanner';
import { SettingsModal } from '@/components/SettingsModal';
import { WebLandingPage } from '@/components/WebLandingPage';
import { isTauriEnvironment } from '@/lib/tauri';
import { Film } from 'lucide-react';

export default function KodiIslandPage() {
  const [mounted, setMounted] = useState(false);
  const [isWebBrowser, setIsWebBrowser] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isExternalWeb =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('github.io') ||
        (window.location.hostname === 'localhost' && window.location.port === '3000'));

    if (isExternalWeb || !isTauriEnvironment()) {
      setIsWebBrowser(true);
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      }
    } else {
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
    }
  }, []);

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
    activeNotification,
    isRefreshingQuota,
    refreshQuota,
    dismissNotification,
    togglePlayPause,
    nextTrack,
    previousTrack,
    isMovieMode,
    toggleMovieMode,
  } = useKodiState();

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && islandMode !== 'compact') {
        setIslandMode('compact');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [islandMode, setIslandMode]);

  if (!mounted) {
    return (
      <main
        className="flex h-full w-full flex-col items-center justify-start pt-0 bg-transparent select-none overflow-hidden"
        data-tauri-drag-region
      >
        <div className="h-[38px] w-[384px] rounded-[19px] bg-black/95 border border-white/[0.12] shadow-[0_10px_32px_rgba(0,0,0,0.95)]" />
      </main>
    );
  }

  // When loaded in a web browser (Vercel, GitHub Pages, Chrome, etc.), show the full Product Landing Page
  if (isWebBrowser) {
    return <WebLandingPage />;
  }

  return (
    <main
      className="flex h-full w-full flex-col items-center justify-start pt-0 bg-transparent select-none overflow-hidden"
      data-tauri-drag-region
    >
      <AnimatePresence mode="wait">
        {isMovieMode ? (
          <motion.div
            key="movie-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 440, damping: 32 }}
            className="group flex flex-col items-center"
          >
            {/* Subtle top-edge indicator that reveals on hover */}
            <button
              onClick={toggleMovieMode}
              title="Movie Mode Active (Click or press Ctrl+Alt+K to unhide)"
              className="mt-0 flex h-4 items-center gap-1.5 rounded-b-lg bg-black/60 px-3 text-[10px] text-zinc-500 opacity-20 transition-all hover:h-6 hover:bg-black/90 hover:text-zinc-200 hover:opacity-100"
            >
              <Film className="h-3 w-3 text-amber-400" />
              <span>Movie Mode · Press Ctrl+Alt+K to show</span>
            </button>
          </motion.div>
        ) : islandMode === 'compact' ? (
          <motion.div
            key="compact"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 440, damping: 32, mass: 0.8 }}
            className="pt-0"
          >
            <CompactPill
              antigravityStatus={antigravityStatus}
              mediaState={mediaState}
              systemStats={systemStats}
              onExpand={() => setIslandMode('expanded')}
              onHideMovieMode={toggleMovieMode}
            />
          </motion.div>
        ) : islandMode === 'notification' ? (
          <motion.div
            key="notification"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 440, damping: 32 }}
            className="pt-1"
          >
            <NotificationBanner
              notification={activeNotification}
              onDismiss={dismissNotification}
              onExpand={() => setIslandMode('expanded')}
            />
          </motion.div>
        ) : islandMode === 'expanded' ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.85 }}
            className="pt-0"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="h-[480px] w-[510px] pt-2"
          >
            <SettingsModal
              settings={settings}
              onSave={updateSettings}
              onClose={() => setIslandMode('expanded')}
              onRefreshQuota={refreshQuota}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
