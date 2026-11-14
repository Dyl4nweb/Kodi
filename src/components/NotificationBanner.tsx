'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Bell, CheckCircle2, X } from 'lucide-react';
import { KodiNotification } from '@/types';

interface NotificationBannerProps {
  notification: KodiNotification | null;
  onDismiss: () => void;
  onExpand: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
  onExpand,
}) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <motion.div
      layoutId="kodi-notch-container"
      className="relative flex h-[74px] w-[410px] items-center justify-between rounded-3xl border border-white/10 bg-[#08080a]/95 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          {getIcon()}
        </div>
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-100 truncate">
              {notification.title}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {notification.timestamp}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 truncate mt-0.5">
            {notification.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-2">
        <button
          onClick={onExpand}
          className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[11px] font-medium text-sky-300 hover:bg-sky-500/20"
        >
          View
        </button>
        <button
          onClick={onDismiss}
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

