'use client';

import React from 'react';
import { 
  TrendingDown, 
  Cpu, 
  Leaf, 
  DollarSign, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { FinOpsMetrics } from '@/types/sandbox';

interface FinOpsWidgetProps {
  metrics: FinOpsMetrics | null;
}

export function FinOpsWidget({ metrics }: FinOpsWidgetProps) {
  if (!metrics) return null;

  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg overflow-hidden">
      <div className="px-5 py-3.5 border-b border-surface-border bg-surface-inset/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-nominal" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            FinOps & Cloud Cost Avoidance Engine
          </h3>
        </div>
        <span className="text-[11px] font-mono text-nominal">
          Policy: Strict Auto-Teardown TTL
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Dollars saved */}
          <div className="p-4 rounded bg-surface-inset border border-surface-border space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Cost Avoided</span>
              <DollarSign className="w-4 h-4 text-nominal" />
            </div>
            <div className="text-2xl font-bold font-mono text-nominal tabular-nums">
              ${metrics.estimatedCostAvoidedUsd}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              vs. 24/7 provisioned ECS containers
            </div>
          </div>

          {/* Zombie hours */}
          <div className="p-4 rounded bg-surface-inset border border-surface-border space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Zombie Hours Eliminated</span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {metrics.zombieHoursPrevented} hrs
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Idle compute time eradicated
            </div>
          </div>

          {/* Environmental green */}
          <div className="p-4 rounded bg-surface-inset border border-surface-border space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Carbon Offset</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {metrics.carbonGramsAvoided} g
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Estimated CO2 emissions prevented
            </div>
          </div>
        </div>

        {/* Cost Comparison Table */}
        <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
          <div className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-nominal" />
            <span>Ephemeral vs. Persistent Staging Comparison</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs font-mono">
            <div className="p-2.5 rounded bg-surface-raised/40 border border-critical/20 space-y-1">
              <span className="text-critical font-bold flex items-center gap-1 text-[11px]">
                <AlertOctagon className="w-3.5 h-3.5" />
                Persistent Staging (Traditional)
              </span>
              <p className="text-[11px] text-slate-400">
                10 QA environments running 24/7 = 7,200 container hours/mo. Forgotten testing branches continuously burn ECS/Fargate budget.
              </p>
            </div>

            <div className="p-2.5 rounded bg-surface-raised/40 border border-nominal/30 space-y-1">
              <span className="text-nominal font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kasa AutoBox Ephemeral (Current)
              </span>
              <p className="text-[11px] text-slate-400">
                Environments provisioned on-demand with enforced TTL (avg. 45 min). AWS EventBridge automatically cleans up orphan tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
