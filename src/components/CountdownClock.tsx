'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownClockProps {
  expiresAt: string;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownClock({ expiresAt, onExpire, size = 'md' }: CountdownClockProps) {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(() => {
    return Math.max(0, new Date(expiresAt).getTime() - Date.now());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isExpired = timeLeftMs <= 0;
  const isExpiringSoon = timeLeftMs > 0 && timeLeftMs <= 15 * 60 * 1000;
  const isCritical = timeLeftMs > 0 && timeLeftMs <= 3 * 60 * 1000;

  // Format with strict zero-padding
  const formatDigit = (num: number) => String(num).padStart(2, '0');

  // Dynamic styling based on time threshold
  let badgeColor = 'bg-nominal/10 text-nominal border-nominal/30';
  let dotColor = 'bg-nominal';

  if (isExpired) {
    badgeColor = 'bg-critical/10 text-critical border-critical/30';
    dotColor = 'bg-critical';
  } else if (isCritical) {
    badgeColor = 'bg-critical/20 text-critical border-critical/50 animate-pulse';
    dotColor = 'bg-critical';
  } else if (isExpiringSoon) {
    badgeColor = 'bg-warning/15 text-warning border-warning/40';
    dotColor = 'bg-warning';
  }

  const textSizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded border font-mono tabular-nums tracking-wideCode ${badgeColor} ${textSizes[size]}`}
      title={`Sandbox Auto-Destruction: ${new Date(expiresAt).toLocaleTimeString()}`}
    >
      <span className="relative flex h-2 w-2">
        {!isExpired && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>

      {isCritical ? (
        <AlertTriangle className="w-3.5 h-3.5 text-critical animate-bounce" />
      ) : (
        <Clock className="w-3.5 h-3.5 opacity-80" />
      )}

      <span>
        {isExpired ? (
          <span className="font-semibold text-critical">EXPIRED (TEARDOWN)</span>
        ) : (
          <>
            {hours > 0 && `${formatDigit(hours)}:`}
            {formatDigit(minutes)}:{formatDigit(seconds)}
            <span className="text-[10px] opacity-60 ml-1">TTL</span>
          </>
        )}
      </span>
    </div>
  );
}
