'use client';

import React from 'react';

interface AntigravityLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const AntigravityLogo: React.FC<AntigravityLogoProps> = ({
  size = 18,
  className = '',
  glow = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-orange-500/25 to-blue-600/30 blur-[4px] pointer-events-none"
          style={{ width: size * 1.2, height: size * 1.2 }}
        />
      )}
      <img
        src="/antigravity-logo.png"
        alt="Google Antigravity"
        width={size}
        height={size}
        className="relative z-10 object-contain drop-shadow-[0_0_4px_rgba(56,189,248,0.35)]"
        draggable={false}
      />
    </div>
  );
};

