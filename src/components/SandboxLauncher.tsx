'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  Wrench, 
  Radio, 
  Activity, 
  Car, 
  Clock, 
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { SANDBOX_TEMPLATES, PRESET_VEHICLES } from '@/lib/templates';
import { SandboxTemplateId } from '@/types/sandbox';

interface SandboxLauncherProps {
  onLaunch: (params: {
    templateId: SandboxTemplateId;
    ttlMinutes: number;
    vehicleVin: string;
    customName: string;
  }) => Promise<void>;
  isLaunching: boolean;
}

export function SandboxLauncher({ onLaunch, isLaunching }: SandboxLauncherProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SandboxTemplateId>('workshop-bay');
  const [selectedVin, setSelectedVin] = useState<string>(PRESET_VEHICLES[0].vin);
  const [selectedTtl, setSelectedTtl] = useState<number>(60);
  const [customName, setCustomName] = useState<string>('');

  const currentTemplate = SANDBOX_TEMPLATES.find(t => t.id === selectedTemplate) || SANDBOX_TEMPLATES[0];
  const currentVehicle = PRESET_VEHICLES.find(v => v.vin === selectedVin) || PRESET_VEHICLES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLaunch({
      templateId: selectedTemplate,
      ttlMinutes: selectedTtl,
      vehicleVin: selectedVin,
      customName: customName.trim(),
    });
    setCustomName('');
  };

  const getTemplateIcon = (id: SandboxTemplateId) => {
    switch (id) {
      case 'workshop-bay':
        return <Wrench className="w-4 h-4 text-emerald-400" />;
      case 'obd-telematics':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'fault-simulator':
        return <Activity className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-surface-border bg-surface-inset/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-nominal" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Provision Ephemeral Sandbox
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Auto-Destruct Enabled
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">
            1. Select Automotive Service Stack
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {SANDBOX_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`text-left p-3 rounded border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface-inset border-nominal text-white shadow-sm'
                      : 'bg-surface-inset/40 border-surface-border text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="p-1 rounded bg-surface-raised border border-surface-border">
                        {getTemplateIcon(tmpl.id)}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-border/60 text-slate-400">
                        Port {tmpl.containerPort}
                      </span>
                    </div>
                    <div className="font-medium text-xs text-slate-200 leading-snug">
                      {tmpl.name}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-surface-border/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{tmpl.defaultCpuUnits} CPU</span>
                    <span>{tmpl.defaultMemoryMb}MB RAM</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle Selection & TTL Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehicle Binding */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              <span>2. Bind Test Vehicle (VIN Profile)</span>
            </label>
            <div className="relative">
              <select
                value={selectedVin}
                onChange={(e) => setSelectedVin(e.target.value)}
                className="w-full bg-surface-inset border border-surface-border rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-nominal"
              >
                {PRESET_VEHICLES.map((v) => (
                  <option key={v.vin} value={v.vin}>
                    {v.model} ({v.licensePlate}) - VIN: {v.vin}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between px-1">
              <span>Odometer: {currentVehicle.odometerKm.toLocaleString()} km</span>
              <span>Fuel: {currentVehicle.fuelType}</span>
            </div>
          </div>

          {/* TTL Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>3. Enforce Life Span (Auto-Destruct TTL)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 60, 120].map((mins) => {
                const isSelected = selectedTtl === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedTtl(mins)}
                    className={`py-2 px-1 text-center rounded border font-mono text-xs transition-colors ${
                      isSelected
                        ? 'bg-nominal/15 border-nominal text-nominal font-bold'
                        : 'bg-surface-inset border-surface-border text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] font-mono text-slate-400 px-1">
              Instance automatically tears down after expiration.
            </div>
          </div>
        </div>

        {/* Optional Custom Tag */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <input
            type="text"
            placeholder="Custom environment label (e.g. 'Toyota Hilux Brake Service QA')"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full sm:flex-1 bg-surface-inset border border-surface-border rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-nominal"
          />

          <button
            type="submit"
            disabled={isLaunching}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-nominal hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-nominal/10"
          >
            <Rocket className={`w-4 h-4 ${isLaunching ? 'animate-bounce' : ''}`} />
            <span>{isLaunching ? 'Launching ECS Task...' : 'Provision Sandbox'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
