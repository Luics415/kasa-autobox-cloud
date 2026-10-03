'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { SandboxLauncher } from '../components/SandboxLauncher';
import { SandboxCard } from '../components/SandboxCard';
import { DiagnosticInjector } from '../components/DiagnosticInjector';
import { LogTerminal } from '../components/LogTerminal';
import { CredentialsDrawer } from '../components/CredentialsDrawer';
import { FinOpsWidget } from '../components/FinOpsWidget';
import { DuplicateConfirmModal } from '../components/DuplicateConfirmModal';
import { ArchivedFleetBay } from '../components/ArchivedFleetBay';
import { DocumentationView } from '../components/DocumentationView';
import { 
  EphemeralSandbox, 
  ArchivedSandbox,
  CloudWatchLogEntry, 
  FinOpsMetrics, 
  SandboxTemplateId 
} from '../types/sandbox';
import { 
  Activity, 
  Archive, 
  BookOpen, 
  Layers, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'archive' | 'docs'>('dashboard');

  const [sandboxes, setSandboxes] = useState<EphemeralSandbox[]>([]);
  const [selectedSandboxId, setSelectedSandboxId] = useState<string>('');
  const [logs, setLogs] = useState<CloudWatchLogEntry[]>([]);
  const [metrics, setMetrics] = useState<FinOpsMetrics | null>(null);
  const [mode, setMode] = useState<'mock' | 'aws'>('mock');
  
  // Credentials modal state
  const [credentialsSandbox, setCredentialsSandbox] = useState<EphemeralSandbox | null>(null);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);

  // Duplicate Conflict Modal state
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [conflictExisting, setConflictExisting] = useState<EphemeralSandbox | null>(null);
  const [pendingLaunchParams, setPendingLaunchParams] = useState<{
    templateId: SandboxTemplateId;
    ttlMinutes: number;
    vehicleVin: string;
    customName: string;
  } | null>(null);

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
      const targetId = sbxId !== undefined ? sbxId : selectedSandboxId;
      const url = targetId ? `/api/sandboxes/${targetId}/logs` : '/api/sandboxes/all/logs';
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

  // Launch New Sandbox with Conflict Check
  const handleLaunchSandbox = async (
    params: {
      templateId: SandboxTemplateId;
      ttlMinutes: number;
      vehicleVin: string;
      customName: string;
    },
    action?: 'create' | 'restart_ttl' | 'force_duplicate'
  ) => {
    setIsLaunching(true);
    try {
      const res = await fetch('/api/sandboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, action }),
      });

      if (res.status === 409) {
        // Vehicle already has an active sandbox! Trigger double-confirmation modal.
        const data = await res.json();
        setConflictExisting(data.existingSandbox);
        setPendingLaunchParams(params);
        setIsConflictOpen(true);
        setIsLaunching(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIsConflictOpen(false);
        setPendingLaunchParams(null);
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

  // Conflict Modal Handlers
  const handleConflictResetTtl = async () => {
    if (!pendingLaunchParams) return;
    await handleLaunchSandbox(pendingLaunchParams, 'restart_ttl');
    setIsConflictOpen(false);
  };

  const handleConflictFocusExisting = () => {
    if (conflictExisting) {
      setSelectedSandboxId(conflictExisting.id);
    }
    setIsConflictOpen(false);
  };

  const handleConflictForceDuplicate = async () => {
    if (!pendingLaunchParams) return;
    await handleLaunchSandbox(pendingLaunchParams, 'force_duplicate');
    setIsConflictOpen(false);
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

  // Relaunch from Archive
  const handleRelaunchFromArchive = async (archived: ArchivedSandbox) => {
    try {
      const res = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: archived.templateId,
          vehicleVin: archived.vehicle.vin,
          customName: `Relaunched: ${archived.name}`,
          ttlMinutes: 45,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveTab('dashboard');
        await refreshAll();
        if (data.sandbox?.id) {
          setSelectedSandboxId(data.sandbox.id);
        }
      }
    } catch (err) {
      console.error('Error relaunching sandbox:', err);
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

      {/* Main Tab Navigation Bar */}
      <div className="border-b border-surface-border bg-surface-raised/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-1 border-b-2 font-mono text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-nominal text-nominal'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Bahía de Mando (Activos)</span>
              {sandboxes.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-nominal/15 text-nominal font-bold">
                  {sandboxes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`py-3 px-1 border-b-2 font-mono text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'archive'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Bóveda Histórica (Cold Storage)</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`py-3 px-1 border-b-2 font-mono text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'docs'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Documentación & Mantenimiento</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: OPERATIONAL DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* Top Hero Notice & Context */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-surface-raised border border-surface-border">
              <div className="space-y-0.5">
                <h1 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
                  <span>Controlador de Bahías Automotrices Kasa</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-nominal/15 text-nominal font-bold">
                    SYSTEM NOMINAL
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-mono">
                  Entornos efímeros en AWS para pruebas de software en talleres, telemetría vehicular OBD-II y testbench de fallas con auto-terminación.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Motor Activo:</span>
                <span className={`px-2.5 py-1 rounded font-bold ${
                  mode === 'aws' ? 'bg-aws-blue/20 text-aws-blue border border-aws-blue/30' : 'bg-nominal/15 text-nominal border border-nominal/30'
                }`}>
                  {mode === 'aws' ? 'AWS Fargate (Cloud)' : 'Simulador Local (Cero Costo)'}
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

            {/* Section 2: Fleet Bay (Active Ephemeral Sandboxes ONLY) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-nominal" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                    Entornos Automotrices en Ejecución ({sandboxes.length} Activos)
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Los entornos caducados se archivan automáticamente para no saturar esta bahía
                </span>
              </div>

              {isLoading ? (
                <div className="p-12 text-center font-mono text-xs text-slate-500 bg-surface-raised border border-surface-border rounded-lg">
                  Sincronizando bahías con el plano de control de AWS...
                </div>
              ) : sandboxes.length === 0 ? (
                <div className="p-12 text-center font-mono text-xs text-slate-500 bg-surface-raised border border-surface-border rounded-lg space-y-2">
                  <p>No hay sandboxes activos en este momento.</p>
                  <p className="text-slate-400">Usa el lanzador superior para aprovisionar un entorno automotriz con su reloj de vida.</p>
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

            {/* Section 3: Diagnostic Testbench & Enriched CloudWatch Stream */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (5 cols): Diagnostic Injector */}
              <div className="lg:col-span-5 space-y-4">
                <DiagnosticInjector
                  sandbox={activeSandbox}
                  onEventInjected={refreshAll}
                />
              </div>

              {/* Right Column (7 cols): Enriched Terminal CloudWatch Logs */}
              <div className="lg:col-span-7 space-y-4">
                <LogTerminal
                  logs={logs}
                  selectedSandboxId={selectedSandboxId}
                  onClearFilter={() => setSelectedSandboxId('')}
                  onRefresh={() => loadLogs()}
                />
              </div>
            </section>

            {/* Section 4: FinOps Cost Avoidance Summary */}
            <section>
              <FinOpsWidget metrics={metrics} />
            </section>
          </>
        )}

        {/* TAB 2: COLD STORAGE & HISTORICAL ARCHIVE */}
        {activeTab === 'archive' && (
          <section>
            <ArchivedFleetBay onRelaunch={handleRelaunchFromArchive} />
          </section>
        )}

        {/* TAB 3: BEGINNER DOCUMENTATION & MAINTENANCE GUIDE */}
        {activeTab === 'docs' && (
          <section>
            <DocumentationView />
          </section>
        )}
      </main>

      {/* Temporary Credentials Drawer / Modal */}
      <CredentialsDrawer
        sandbox={credentialsSandbox}
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
      />

      {/* Duplicate Conflict Confirmation Modal */}
      <DuplicateConfirmModal
        isOpen={isConflictOpen}
        existingSandbox={conflictExisting}
        attemptedVin={pendingLaunchParams?.vehicleVin || ''}
        onClose={() => setIsConflictOpen(false)}
        onResetTtl={handleConflictResetTtl}
        onFocusExisting={handleConflictFocusExisting}
        onForceDuplicate={handleConflictForceDuplicate}
      />

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-raised/40 py-6 mt-12 text-xs font-mono text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Kasa AutoBox Cloud — Plataforma de Entornos Efímeros para Servicios Automotrices</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>AWS ECS Fargate • DynamoDB TTL • CloudWatch Logs</span>
            <span>•</span>
            <span className="text-nominal">Estándar de Diseño Impeccable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
