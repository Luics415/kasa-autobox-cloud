'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Key, 
  Trash2, 
  PlusCircle, 
  Activity, 
  Radio, 
  Gauge, 
  AlertCircle, 
  Car,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { EphemeralSandbox } from '@/types/sandbox';
import { CountdownClock } from './CountdownClock';

interface SandboxCardProps {
  sandbox: EphemeralSandbox;
  isSelected: boolean;
  onSelect: () => void;
  onExtendTtl: (id: string) => Promise<void>;
  onTerminate: (id: string) => Promise<void>;
  onOpenCredentials: (sandbox: EphemeralSandbox) => void;
}

export function SandboxCard({
  sandbox,
  isSelected,
  onSelect,
  onExtendTtl,
  onTerminate,
  onOpenCredentials,
}: SandboxCardProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedVin, setCopiedVin] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

  const copyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sandbox.endpointUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyVin = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sandbox.vehicle.vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2000);
  };

  const handleExtend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExtending(true);
    await onExtendTtl(sandbox.id);
    setIsExtending(false);
  };

  const handleTerminate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to terminate sandbox ${sandbox.id}?`)) {
      setIsTerminating(true);
      await onTerminate(sandbox.id);
      setIsTerminating(false);
    }
  };

  const isTerminated = sandbox.status === 'TERMINATED';

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg border transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-surface-raised border-nominal shadow-lg shadow-nominal/5 ring-1 ring-nominal/20'
          : 'bg-surface-raised/80 border-surface-border hover:border-slate-600'
      } ${isTerminated ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Top Banner */}
      <div className="p-4 border-b border-surface-border flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-inset border border-surface-border text-slate-400">
              {sandbox.id}
            </span>
            <h3 className="font-semibold text-sm text-slate-100 font-mono truncate max-w-[260px]">
              {sandbox.name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Car className="w-3.5 h-3.5 text-slate-400" />
            <span>{sandbox.vehicle.model}</span>
          </p>
        </div>

        {/* Real-time Countdown Clock */}
        <div className="shrink-0">
          <CountdownClock expiresAt={sandbox.expiresAt} size="sm" />
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3.5">
        {/* VIN & Direct URL Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {/* VIN */}
          <div className="flex items-center justify-between p-2 rounded bg-surface-inset border border-surface-border">
            <div className="truncate">
              <span className="text-slate-500 block text-[10px]">VEHICLE VIN</span>
              <span className="text-slate-300 font-bold">{sandbox.vehicle.vin}</span>
            </div>
            <button
              onClick={copyVin}
              className="p-1 rounded hover:bg-surface-border text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy VIN"
            >
              {copiedVin ? <Check className="w-3.5 h-3.5 text-nominal" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Endpoint URL */}
          <div className="flex items-center justify-between p-2 rounded bg-surface-inset border border-surface-border">
            <div className="truncate mr-2">
              <span className="text-slate-500 block text-[10px]">DIRECT ENDPOINT</span>
              <span className="text-aws-blue truncate block">{sandbox.endpointUrl}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyUrl}
                className="p-1 rounded hover:bg-surface-border text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy Direct URL"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-nominal" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={sandbox.endpointUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-surface-border text-slate-400 hover:text-slate-200 transition-colors"
                title="Open Service Endpoint"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="p-2.5 rounded bg-surface-inset border border-surface-border">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" />
              <span>LIVE ECU TELEMETRY</span>
            </span>
            {sandbox.telemetry.checkEngineLight && (
              <span className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse">
                <AlertCircle className="w-3 h-3" />
                <span>CHECK ENGINE (MIL)</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-surface-raised/60 p-1.5 rounded border border-surface-border/50">
              <span className="text-[10px] text-slate-500 block">RPM</span>
              <span className="text-xs font-bold text-slate-200 tabular-nums">
                {sandbox.telemetry.rpm}
              </span>
            </div>
            <div className="bg-surface-raised/60 p-1.5 rounded border border-surface-border/50">
              <span className="text-[10px] text-slate-500 block">SPEED</span>
              <span className="text-xs font-bold text-slate-200 tabular-nums">
                {sandbox.telemetry.speedKmh} km/h
              </span>
            </div>
            <div className="bg-surface-raised/60 p-1.5 rounded border border-surface-border/50">
              <span className="text-[10px] text-slate-500 block">FUEL</span>
              <span className="text-xs font-bold text-slate-200 tabular-nums">
                {sandbox.telemetry.fuelLevelPct}%
              </span>
            </div>
            <div className="bg-surface-raised/60 p-1.5 rounded border border-surface-border/50">
              <span className="text-[10px] text-slate-500 block">TEMP</span>
              <span className="text-xs font-bold text-slate-200 tabular-nums">
                {sandbox.telemetry.engineTempC}°C
              </span>
            </div>
          </div>

          {/* Active DTC Badges if any */}
          {sandbox.telemetry.activeDtcs.length > 0 && (
            <div className="mt-2 pt-2 border-t border-surface-border/50 flex flex-wrap gap-1.5">
              {sandbox.telemetry.activeDtcs.map((dtc) => (
                <span
                  key={dtc.code}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold"
                  title={dtc.description}
                >
                  DTC: {dtc.code}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-2.5 bg-surface-inset/60 border-t border-surface-border flex items-center justify-between gap-2">
        {/* Credentials Drawer Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCredentials(sandbox);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised hover:bg-surface-hover border border-surface-border text-xs font-mono text-slate-200 hover:text-white transition-colors"
          title="View Scoped STS Credentials"
        >
          <Key className="w-3.5 h-3.5 text-nominal" />
          <span>STS Token</span>
        </button>

        {/* Life cycle actions */}
        <div className="flex items-center gap-1.5">
          {!isTerminated && (
            <>
              <button
                onClick={handleExtend}
                disabled={isExtending}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-raised hover:bg-surface-hover border border-surface-border text-xs font-mono text-slate-300 hover:text-nominal transition-colors disabled:opacity-50"
                title="Extend environment lifetime by 30 minutes"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+30m</span>
              </button>

              <button
                onClick={handleTerminate}
                disabled={isTerminating}
                className="p-1.5 rounded hover:bg-critical/20 text-slate-400 hover:text-critical transition-colors disabled:opacity-50"
                title="Immediate Teardown"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <div
            className={`px-2 py-1 text-xs font-mono rounded ${
              isSelected
                ? 'bg-nominal text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isSelected ? 'Active Bay' : 'Inspect'}
          </div>
        </div>
      </div>
    </div>
  );
}
