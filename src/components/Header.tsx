'use client';

import React from 'react';
import { 
  Cpu, 
  Shield, 
  Cloud, 
  RefreshCw, 
  TrendingDown, 
  Wrench,
  Activity
} from 'lucide-react';
import { FinOpsMetrics } from '@/types/sandbox';

interface HeaderProps {
  metrics: FinOpsMetrics | null;
  mode: 'mock' | 'aws';
  onToggleMode: (newMode: 'mock' | 'aws') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({
  metrics,
  mode,
  onToggleMode,
  onRefresh,
  isRefreshing,
}: HeaderProps) {
  return (
    <header className="border-b border-surface-border bg-surface-raised/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded bg-surface-inset border border-surface-border flex items-center justify-center text-nominal shadow-inner">
            <Wrench className="w-5 h-5 text-nominal" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-mono">
                KASA AUTOBOX
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-border text-slate-300 font-mono uppercase tracking-wider">
                CLOUD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <span>Automotive Ephemeral Sandboxes</span>
              <span className="text-slate-600">•</span>
              <span className="text-aws-blue">AWS ECS Fargate</span>
            </p>
          </div>
        </div>

        {/* Center: FinOps Live Metric Ribbon */}
        {metrics && (
          <div className="hidden md:flex items-center gap-6 px-4 py-1.5 rounded-full bg-surface-inset border border-surface-border text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-nominal" />
              <span>Active:</span>
              <span className="text-nominal font-bold">{metrics.activeInstances}</span>
            </div>
            <span className="text-surface-border">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Zombie Hrs Avoided:</span>
              <span className="text-slate-100 font-bold">{metrics.zombieHoursPrevented}h</span>
            </div>
            <span className="text-surface-border">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <TrendingDown className="w-3.5 h-3.5 text-nominal" />
              <span>Cost Saved:</span>
              <span className="text-nominal font-bold">${metrics.estimatedCostAvoidedUsd}</span>
            </div>
          </div>
        )}

        {/* Right Actions: Mode Switcher & Refresh */}
        <div className="flex items-center gap-3">
          {/* Dual-Mode Pill Switch */}
          <div className="flex items-center bg-surface-inset p-1 rounded-lg border border-surface-border">
            <button
              onClick={() => onToggleMode('mock')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                mode === 'mock'
                  ? 'bg-nominal/15 text-nominal border border-nominal/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Runs local zero-cost simulation engine"
            >
              <Shield className="w-3 h-3" />
              <span>Mock Engine</span>
            </button>
            <button
              onClick={() => onToggleMode('aws')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                mode === 'aws'
                  ? 'bg-aws-blue/20 text-aws-blue border border-aws-blue/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Direct integration with Amazon Web Services"
            >
              <Cloud className="w-3 h-3" />
              <span>Live AWS</span>
            </button>
          </div>

          {/* Refresh Trigger */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded bg-surface-inset hover:bg-surface-border border border-surface-border text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh Fleet State"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-nominal' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
