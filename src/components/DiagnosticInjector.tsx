'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  Gauge, 
  Send, 
  CheckCircle2, 
  Wrench, 
  Radio, 
  Sliders 
} from 'lucide-react';
import { EphemeralSandbox } from '@/types/sandbox';

interface DiagnosticInjectorProps {
  sandbox: EphemeralSandbox | null;
  onEventInjected: () => void;
}

export function DiagnosticInjector({ sandbox, onEventInjected }: DiagnosticInjectorProps) {
  const [rpm, setRpm] = useState<number>(sandbox?.telemetry.rpm || 1200);
  const [speed, setSpeed] = useState<number>(sandbox?.telemetry.speedKmh || 35);
  const [customDtc, setCustomDtc] = useState<string>('');
  const [customDtcDesc, setCustomDtcDesc] = useState<string>('');
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!sandbox) {
    return (
      <div className="p-6 bg-surface-raised border border-surface-border rounded-lg text-center font-mono text-slate-500 text-xs">
        Select a sandbox from the fleet to interact with its automotive diagnostics testbench.
      </div>
    );
  }

  const triggerEvent = async (payload: {
    type: 'DTC_FAULT' | 'TELEMETRY_UPDATE' | 'WORKSHOP_ACTION';
    code?: string;
    description?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH';
    rpm?: number;
    speedKmh?: number;
    checkEngine?: boolean;
    note?: string;
  }) => {
    setIsInjecting(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/sandboxes/${sandbox.id}/simulate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setActionMessage('Event successfully dispatched to container.');
        onEventInjected();
      }
    } catch {
      setActionMessage('Failed to dispatch event.');
    } finally {
      setIsInjecting(false);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const PRESET_DTCS = [
    { code: 'P0420', desc: 'Catalyst System Efficiency Below Threshold', severity: 'MEDIUM' as const },
    { code: 'P0300', desc: 'Random/Multiple Cylinder Misfire Detected', severity: 'HIGH' as const },
    { code: 'P0171', desc: 'System Too Lean (Bank 1 O2 Sensor)', severity: 'MEDIUM' as const },
    { code: 'P0217', desc: 'Engine Coolant Overtemperature Condition', severity: 'HIGH' as const },
  ];

  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-surface-border bg-surface-inset/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Automotive Diagnostic & Fault Testbench
          </h2>
        </div>
        <span className="text-[11px] font-mono text-nominal">
          Target: {sandbox.id}
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Preset DTC Injections */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Inject OBD-II Diagnostic Trouble Code (DTC)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_DTCS.map((dtc) => (
              <button
                key={dtc.code}
                onClick={() =>
                  triggerEvent({
                    type: 'DTC_FAULT',
                    code: dtc.code,
                    description: dtc.desc,
                    severity: dtc.severity,
                  })
                }
                disabled={isInjecting || sandbox.status === 'TERMINATED'}
                className="text-left p-2.5 rounded bg-surface-inset hover:bg-surface-inset/80 border border-surface-border hover:border-amber-500/50 transition-all font-mono group disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    {dtc.code}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400">
                    {dtc.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {dtc.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom DTC Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Custom DTC (e.g. P0500)"
            value={customDtc}
            onChange={(e) => setCustomDtc(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-32 bg-surface-inset border border-surface-border rounded px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-nominal"
          />
          <input
            type="text"
            placeholder="Fault description (e.g. Vehicle Speed Sensor Malfunction)"
            value={customDtcDesc}
            onChange={(e) => setCustomDtcDesc(e.target.value)}
            className="flex-1 bg-surface-inset border border-surface-border rounded px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-nominal"
          />
          <button
            onClick={() => {
              if (customDtc) {
                triggerEvent({
                  type: 'DTC_FAULT',
                  code: customDtc,
                  description: customDtcDesc || 'Custom Technician Simulated DTC',
                  severity: 'MEDIUM',
                });
                setCustomDtc('');
                setCustomDtcDesc('');
              }
            }}
            disabled={!customDtc || isInjecting || sandbox.status === 'TERMINATED'}
            className="px-3 py-1.5 bg-surface-inset hover:bg-surface-border border border-surface-border rounded text-xs font-mono text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Inject
          </button>
        </div>

        {/* Live CAN-Bus Telemetry Sliders */}
        <div className="space-y-3 pt-3 border-t border-surface-border">
          <label className="text-xs font-mono text-slate-400 block flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. CAN-Bus Driving Dynamics Simulator</span>
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              RPM: {rpm} | Speed: {speed} km/h
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* RPM Slider */}
            <div className="space-y-1 bg-surface-inset p-3 rounded border border-surface-border">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Engine Speed</span>
                <span className="text-slate-200 font-bold">{rpm} RPM</span>
              </div>
              <input
                type="range"
                min="700"
                max="6500"
                step="50"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Idle (700)</span>
                <span>Cruising (2500)</span>
                <span>Redline (6500)</span>
              </div>
            </div>

            {/* Speed Slider */}
            <div className="space-y-1 bg-surface-inset p-3 rounded border border-surface-border">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Vehicle Speed</span>
                <span className="text-slate-200 font-bold">{speed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Parked (0)</span>
                <span>Highway (100)</span>
                <span>Max (180)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() =>
                triggerEvent({
                  type: 'WORKSHOP_ACTION',
                  note: 'Reception intake completed: vehicle checked into service bay #3.',
                })
              }
              disabled={isInjecting || sandbox.status === 'TERMINATED'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-inset hover:bg-surface-border border border-surface-border rounded text-xs font-mono text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5 text-nominal" />
              <span>Log Workshop Reception</span>
            </button>

            <button
              onClick={() =>
                triggerEvent({
                  type: 'TELEMETRY_UPDATE',
                  rpm,
                  speedKmh: speed,
                })
              }
              disabled={isInjecting || sandbox.status === 'TERMINATED'}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs font-mono rounded transition-colors disabled:opacity-50"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast CAN Frame</span>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {actionMessage && (
          <div className="p-2 rounded bg-nominal/10 border border-nominal/30 text-nominal text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
