'use client';

import React from 'react';

interface CircularProgressProps {
  percentage: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  strokeColor?: string;
  trackColor?: string;
  innerContent?: React.ReactNode;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 28,
  strokeWidth = 2.5,
  strokeColor = '#38bdf8', // Default sky blue
  trackColor = 'rgba(255, 255, 255, 0.12)',
  innerContent,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Centered label or icon */}
      {innerContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {innerContent}
        </div>
      )}
    </div>
  );
};

