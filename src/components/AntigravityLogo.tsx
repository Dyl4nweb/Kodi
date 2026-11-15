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
      <img
        src="/antigravity-logo.png"
        alt="Google Antigravity"
        width={size}
        height={size}
        className="relative z-10 object-contain"
        draggable={false}
      />
    </div>
  );
};

