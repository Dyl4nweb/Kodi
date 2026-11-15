'use client';

import React from 'react';
import {
  Disc3,
  ExternalLink,
  Music,
  Pause,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { MediaSessionState } from '@/types';
import { invokeCommand } from '@/lib/tauri';

interface MediaWidgetProps {
  mediaState: MediaSessionState | null;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const MediaWidget: React.FC<MediaWidgetProps> = ({
  mediaState,
  onTogglePlayPause,
  onNext,
  onPrevious,
}) => {
  const isPlaying = mediaState?.is_active && mediaState.is_playing;
  const isSpotify =
    mediaState?.is_spotify ||
    mediaState?.app_name?.toLowerCase().includes('spotify');

  const handleOpenSpotify = () => {
    invokeCommand('open_spotify').catch(console.error);
  };

  if (!mediaState || !mediaState.is_active) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-5 text-center">
        {/* Spotify Brand Card */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/25 text-[#1DB954] mb-3 shadow-[0_0_20px_rgba(29,185,84,0.15)]">
          {/* Custom SVG Spotify Logo */}
          <svg
            className="h-8 w-8 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.674.465-1.027.25-2.812-1.718-6.352-2.107-10.52-1.155-.403.092-.808-.16-.9-.563-.092-.402.16-.807.563-.9 4.563-1.042 8.483-.598 11.634 1.34.353.216.465.675.25 1.028zm1.467-3.262c-.27.44-.847.58-1.287.31-3.22-1.978-8.127-2.55-11.935-1.393-.496.15-1.025-.133-1.176-.63-.15-.496.133-1.025.63-1.176 4.353-1.32 9.767-.68 13.458 1.593.44.27.58.847.31 1.29zm.126-3.41c-3.86-2.292-10.228-2.503-13.905-1.387-.593.18-1.222-.154-1.402-.746-.18-.593.154-1.222.746-1.402 4.23-1.284 11.26-1.04 15.694 1.593.533.316.708 1.008.392 1.54-.316.533-1.008.708-1.54.392z" />
          </svg>
        </div>

        <h3 className="text-sm font-semibold text-zinc-100">
          Connect to Spotify
        </h3>

        <p className="mt-1 max-w-[260px] text-[11px] text-zinc-400 leading-relaxed">
          Open Spotify on your Windows PC and play any track. KODI seamlessly synchronizes album art, title, and playback controls!
        </p>

        <button
          onClick={handleOpenSpotify}
          className="mt-4 flex items-center gap-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black px-4 py-2 text-xs font-bold transition-all shadow-[0_4px_15px_rgba(29,185,84,0.3)] hover:scale-105 active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-black" />
          <span>Launch Spotify App</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between p-4">
      {/* App Source Header */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          {isSpotify ? (
            <div className="flex items-center gap-1.5 text-[#1DB954] font-semibold">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.674.465-1.027.25-2.812-1.718-6.352-2.107-10.52-1.155-.403.092-.808-.16-.9-.563-.092-.402.16-.807.563-.9 4.563-1.042 8.483-.598 11.634 1.34.353.216.465.675.25 1.028zm1.467-3.262c-.27.44-.847.58-1.287.31-3.22-1.978-8.127-2.55-11.935-1.393-.496.15-1.025-.133-1.176-.63-.15-.496.133-1.025.63-1.176 4.353-1.32 9.767-.68 13.458 1.593.44.27.58.847.31 1.29zm.126-3.41c-3.86-2.292-10.228-2.503-13.905-1.387-.593.18-1.222-.154-1.402-.746-.18-.593.154-1.222.746-1.402 4.23-1.284 11.26-1.04 15.694 1.593.533.316.708 1.008.392 1.54-.316.533-1.008.708-1.54.392z" />
              </svg>
              <span>Spotify Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{mediaState.app_name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSpotify && (
            <button
              onClick={handleOpenSpotify}
              title="Open Spotify Window"
              className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
            >
              <span>Open</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
          <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono text-zinc-400">
            Live Stream
          </span>
        </div>
      </div>

      {/* Main Track Display with Album Art & Animated Vinyl Disc */}
      <div className="my-auto flex items-center gap-4 py-2">
        {/* Album Artwork or Vinyl Spinner with rotation animation */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-zinc-950 shadow-2xl flex items-center justify-center">
          {mediaState.thumbnail_base64 ? (
            <img
              src={mediaState.thumbnail_base64}
              alt={mediaState.title}
              className={`h-full w-full object-cover rounded-full ${
                isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
              }`}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-black rounded-full ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            >
              <Disc3
                className={`h-11 w-11 ${
                  isSpotify ? 'text-[#1DB954]' : 'text-zinc-300'
                }`}
              />
            </div>
          )}

          {/* Center spindle hole of the vinyl disc */}
          <div className="absolute h-4 w-4 rounded-full border border-black bg-zinc-900 shadow-inner flex items-center justify-center pointer-events-none">
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
          </div>

          {/* Floating live sound equalizer indicator badge */}
          {isPlaying && (
            <div className="absolute bottom-0 right-0 flex items-end gap-0.5 rounded-full bg-black/85 px-1.5 py-1 border border-white/10 backdrop-blur-sm pointer-events-none">
              <span
                className={`w-0.5 rounded-full animate-[music-bar-1_0.8s_ease-in-out_infinite] ${
                  isSpotify ? 'bg-[#1DB954]' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`w-0.5 rounded-full animate-[music-bar-2_1.1s_ease-in-out_infinite] ${
                  isSpotify ? 'bg-[#1DB954]' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`w-0.5 rounded-full animate-[music-bar-3_0.9s_ease-in-out_infinite] ${
                  isSpotify ? 'bg-[#1DB954]' : 'bg-emerald-400'
                }`}
              />
            </div>
          )}
        </div>

        {/* Track Title, Artist, & Live Animated Visualizer */}
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-zinc-100">
            {mediaState.title || 'Unknown Title'}
          </h3>
          <p className="truncate text-xs font-medium text-zinc-400 mt-0.5">
            {mediaState.artist || 'Unknown Artist'}
          </p>
          {mediaState.album && (
            <p className="truncate text-[10px] text-zinc-500 mt-0.5">
              {mediaState.album}
            </p>
          )}

          {/* Equalizer Wave Indicator */}
          {isPlaying && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex items-end gap-1 h-3.5">
                <span className="w-1 rounded-full bg-[#1DB954] animate-[music-bar-1_0.8s_ease-in-out_infinite]" />
                <span className="w-1 rounded-full bg-[#1DB954] animate-[music-bar-2_1.1s_ease-in-out_infinite]" />
                <span className="w-1 rounded-full bg-[#1DB954] animate-[music-bar-3_0.9s_ease-in-out_infinite]" />
                <span className="w-1 rounded-full bg-[#1DB954] animate-[music-bar-4_0.7s_ease-in-out_infinite]" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#1DB954] font-mono font-medium">
                Live Equalizer
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="text-[10px] text-zinc-500 font-mono">
          {isPlaying ? (isSpotify ? 'Playing on Spotify' : 'Active Audio') : 'Paused'}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrevious}
            title="Previous Track"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-300 transition-transform active:scale-90 hover:bg-white/10 hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={onTogglePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
              isSpotify
                ? 'bg-[#1DB954] text-black hover:bg-[#1ed760] shadow-[#1DB954]/25'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            title="Next Track"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-300 transition-transform active:scale-90 hover:bg-white/10 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="w-12 text-right">
          {isSpotify && (
            <span className="rounded-md border border-[#1DB954]/30 bg-[#1DB954]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#1DB954]">
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
