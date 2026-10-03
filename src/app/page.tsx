'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { SandboxLauncher } from '../components/SandboxLauncher';
import { SandboxCard } from '../components/SandboxCard';
import { DiagnosticInjector } from '../components/DiagnosticInjector';
import { LogTerminal } from '../components/LogTerminal';
import { CredentialsDrawer } from '../components/CredentialsDrawer';
import { FinOpsWidget } from '../components/FinOpsWidget';
import { 
  EphemeralSandbox, 
  CloudWatchLogEntry, 
  FinOpsMetrics, 
  SandboxTemplateId 
} from '../types/sandbox';
import { 
  Car, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Server,
  Terminal,
  Activity
} from 'lucide-react';

export default function Home() {
  const [sandboxes, setSandboxes] = useState<EphemeralSandbox[]>([]);
  const [selectedSandboxId, setSelectedSandboxId] = useState<string>('');
  const [logs, setLogs] = useState<CloudWatchLogEntry[]>([]);
  const [metrics, setMetrics] = useState<FinOpsMetrics | null>(null);
  const [mode, setMode] = useState<'mock' | 'aws'>('mock');
  
  const [credentialsSandbox, setCredentialsSandbox] = useState<EphemeralSandbox | null>(null);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load Sandboxes
  const loadSandboxes = useCallback(async () => {
    try {
      const res = await fetch('/api/sandboxes');
      if (res.ok) {
        const data = await res.json();
        setSandboxes(data.sandboxes || []);
        
        // Auto-select first sandbox if none selected
        if (!selectedSandboxId && data.sandboxes?.length > 0) {
          setSelectedSandboxId(data.sandboxes[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching sandboxes:', err);
    }
  }, [selectedSandboxId]);

  // Load Logs
  const loadLogs = useCallback(async (sbxId?: string) => {
    try {
      const targetId = sbxId || selectedSandboxId;
      const url = targetId ? `/api/sandboxes/${targetId}/logs` : '/api/sandboxes';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  }, [selectedSandboxId]);

  // Load Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([loadSandboxes(), loadLogs(), loadStats()]);
    setIsRefreshing(false);
    setIsLoading(false);
  }, [loadSandboxes, loadLogs, loadStats]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(() => {
      loadSandboxes();
      loadLogs();
      loadStats();
    }, 4000);

    return () => clearInterval(interval);
  }, [refreshAll, loadSandboxes, loadLogs, loadStats]);

  // Launch New Sandbox
  const handleLaunchSandbox = async (params: {
    templateId: SandboxTemplateId;
    ttlMinutes: number;
    vehicleVin: string;
    customName: string;
  }) => {
    setIsLaunching(true);
    try {
      const res = await fetch('/api/sandboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        await refreshAll();
        if (data.sandbox?.id) {
          setSelectedSandboxId(data.sandbox.id);
        }
      }
    } catch (err) {
      console.error('Error launching sandbox:', err);
    } finally {
      setIsLaunching(false);
    }
  };

  // Extend TTL
  const handleExtendTtl = async (id: string) => {
    try {
      const res = await fetch(`/api/sandboxes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalMinutes: 30 }),
      });
      if (res.ok) {
        await refreshAll();
      }
    } catch (err) {
      console.error('Error extending TTL:', err);
    }
  };

  // Terminate Sandbox
  const handleTerminate = async (id: string) => {
    try {
      const res = await fetch(`/api/sandboxes/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshAll();
      }
    } catch (err) {
      console.error('Error terminating sandbox:', err);
    }
  };

  const handleOpenCredentials = (sandbox: EphemeralSandbox) => {
    setCredentialsSandbox(sandbox);
    setIsCredentialsOpen(true);
  };

  const activeSandbox = sandboxes.find((s) => s.id === selectedSandboxId) || sandboxes[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-ground text-slate-100">
      {/* Header with dual mode and FinOps ribbon */}
      <Header
        metrics={metrics}
        mode={mode}
        onToggleMode={(newMode) => setMode(newMode)}
        onRefresh={refreshAll}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero Notice & Context */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-surface-raised border border-surface-border">
          <div className="space-y-0.5">
            <h1 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
              <span>Automotive Service Bay Controller</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-nominal/15 text-nominal font-bold">
                SYSTEM NOMINAL
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              On-demand AWS containerized environments for dealership testing, OBD-II telemetry streams, and fault injection with auto-destruction.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Current Engine:</span>
            <span className={`px-2.5 py-1 rounded font-bold ${
              mode === 'aws' ? 'bg-aws-blue/20 text-aws-blue border border-aws-blue/30' : 'bg-nominal/15 text-nominal border border-nominal/30'
            }`}>
              {mode === 'aws' ? 'AWS Fargate (Live Cloud)' : 'Zero-Cost Local Simulator'}
            </span>
          </div>
        </div>

        {/* Section 1: Provisioning Bay (Sandbox Launcher) */}
        <section>
          <SandboxLauncher
            onLaunch={handleLaunchSandbox}
            isLaunching={isLaunching}
          />
        </section>

        {/* Section 2: Fleet Bay (Active Ephemeral Sandboxes) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-nominal" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                Active Automotive Sandboxes ({sandboxes.filter(s => s.status !== 'TERMINATED').length} Live)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Click any bay to connect diagnostics & live logs
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center font-mono text-xs text-slate-500 bg-surface-raised border border-surface-border rounded-lg">
              Connecting to AWS ECS control plane...
            </div>
          ) : sandboxes.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs text-slate-500 bg-surface-raised border border-surface-border rounded-lg space-y-2">
              <p>No active ephemeral sandboxes running.</p>
              <p className="text-slate-400">Use the launcher above to provision an isolated automotive environment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sandboxes.map((sbx) => (
                <SandboxCard
                  key={sbx.id}
                  sandbox={sbx}
                  isSelected={sbx.id === selectedSandboxId}
                  onSelect={() => setSelectedSandboxId(sbx.id)}
                  onExtendTtl={handleExtendTtl}
                  onTerminate={handleTerminate}
                  onOpenCredentials={handleOpenCredentials}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Diagnostic Testbench & CloudWatch Logs Stream */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Diagnostic Injector */}
          <div className="lg:col-span-5 space-y-4">
            <DiagnosticInjector
              sandbox={activeSandbox}
              onEventInjected={refreshAll}
            />
          </div>

          {/* Right Column (7 cols): Terminal CloudWatch Logs */}
          <div className="lg:col-span-7 space-y-4">
            <LogTerminal
              logs={logs}
              selectedSandboxId={selectedSandboxId}
              onRefresh={() => loadLogs()}
            />
          </div>
        </section>

        {/* Section 4: FinOps Cost Avoidance Summary */}
        <section>
          <FinOpsWidget metrics={metrics} />
        </section>
      </main>

      {/* Temporary Credentials Drawer / Modal */}
      <CredentialsDrawer
        sandbox={credentialsSandbox}
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-raised/40 py-6 mt-12 text-xs font-mono text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Kasa AutoBox Cloud — Automotive Ephemeral Sandbox Platform</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by AWS ECS, DynamoDB, EventBridge & CloudWatch</span>
            <span>•</span>
            <span className="text-nominal">Impeccable Design Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
