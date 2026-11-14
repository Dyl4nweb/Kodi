'use client';

import React from 'react';

interface KodiLogoProps {
  size?: number;
  variant?: 'blue' | 'white' | 'icon';
  className?: string;
}

export const KodiLogo: React.FC<KodiLogoProps> = ({
  size = 20,
  variant = 'blue',
  className = '',
}) => {
  if (variant === 'icon') {
    return (
      <img
        src="/kodi-icon.png"
        alt="KODI"
        style={{ height: `${size}px`, width: `${size}px` }}
        className={`object-contain select-none ${className}`}
      />
    );
  }

  const src = variant === 'white' ? '/kodi-logo-white.png' : '/kodi-logo-blue.png';

  return (
    <img
      src={src}
      alt="KODI"
      style={{ height: `${size}px`, width: 'auto' }}
      className={`object-contain select-none flex-shrink-0 ${className}`}
    />
  );
};

