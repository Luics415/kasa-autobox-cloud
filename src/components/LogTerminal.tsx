'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  Trash2, 
  Pause, 
  Play, 
  RefreshCw, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Maximize2,
  Minimize2,
  Download,
  ChevronDown,
  ChevronRight,
  Cpu,
  Clock,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import { CloudWatchLogEntry } from '@/types/sandbox';

interface LogTerminalProps {
  logs: CloudWatchLogEntry[];
  selectedSandboxId?: string;
  onClearFilter?: () => void;
  onRefresh: () => void;
}

export function LogTerminal({ 
  logs, 
  selectedSandboxId, 
  onClearFilter, 
  onRefresh 
}: LogTerminalProps) {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(3000); // 3s default
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval === 0) return;
    const timer = setInterval(() => {
      onRefresh();
    }, refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval, onRefresh]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (selectedSandboxId && log.sandboxId !== selectedSandboxId) {
      return false;
    }
    if (filterLevel === 'CAN_BUS' && log.level !== 'CAN_BUS') return false;
    if (filterLevel === 'ERRORS' && log.level !== 'ERROR' && log.level !== 'WARN') return false;
    if (filterLevel === 'STS' && log.level !== 'STS_AUTH') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.message.toLowerCase().includes(term) ||
        log.source.toLowerCase().includes(term) ||
        log.sandboxId.toLowerCase().includes(term) ||
        (log.traceId && log.traceId.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Export logs to JSON file
  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cloudwatch-logs-${selectedSandboxId || 'all'}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLevelBadge = (level: CloudWatchLogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">INFO</span>;
      case 'WARN':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">WARN</span>;
      case 'ERROR':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold font-mono">ERROR</span>;
      case 'CAN_BUS':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">CAN-BUS</span>;
      case 'STS_AUTH':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">STS-AUTH</span>;
    }
  };

  return (
    <div className={`bg-surface-raised border border-surface-border rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50 shadow-2xl bg-ground/95' : 'h-[640px]'
    }`}>
      {/* Top Bar with Detailed AWS CloudWatch Metadata */}
      <div className="px-5 py-3 border-b border-surface-border bg-surface-inset/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-surface-raised border border-surface-border text-nominal">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
                Amazon CloudWatch Logs Stream
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-border text-slate-300 font-mono">
                Live Ingestion
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span>LogGroup: <code className="text-slate-300">/ecs/kasa-autobox-sandboxes</code></span>
              {selectedSandboxId ? (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-nominal flex items-center gap-1">
                    Stream: <code className="text-slate-200">{selectedSandboxId}</code>
                    {onClearFilter && (
                      <button 
                        onClick={onClearFilter} 
                        className="text-slate-400 hover:text-white ml-1 p-0.5" 
                        title="Ver todos los logs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">Mostrando logs globales de la flota</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Frequency Picker */}
          <div className="flex items-center bg-surface-inset px-2 py-1 rounded border border-surface-border font-mono text-[11px] text-slate-400">
            <span className="mr-1 text-[10px] text-slate-500">Refresco:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={1000} className="bg-surface-raised">1s (Rápido)</option>
              <option value={3000} className="bg-surface-raised">3s (Normal)</option>
              <option value={5000} className="bg-surface-raised">5s (Ahorro)</option>
              <option value={0} className="bg-surface-raised">Pausado</option>
            </select>
          </div>

          {/* Level Filter Badges */}
          <div className="flex items-center bg-surface-inset p-0.5 rounded border border-surface-border font-mono text-[11px]">
            {['ALL', 'CAN_BUS', 'ERRORS', 'STS'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filterLevel === lvl ? 'bg-surface-border text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Export JSON Button */}
          <button
            onClick={exportLogsAsJson}
            className="p-1.5 rounded bg-surface-inset hover:bg-surface-border border border-surface-border text-slate-400 hover:text-white transition-colors"
            title="Exportar logs a JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded border text-xs transition-colors ${
              autoScroll
                ? 'bg-nominal/10 border-nominal/30 text-nominal'
                : 'bg-surface-inset border-surface-border text-slate-400'
            }`}
            title={autoScroll ? 'Auto-scroll activo' : 'Auto-scroll pausado'}
          >
            {autoScroll ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Expand Fullscreen Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded bg-surface-inset hover:bg-surface-border border border-surface-border text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Reducir tamaño' : 'Maximizar consola'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Search Filter & Diagnostics Metadata */}
      <div className="px-5 py-2 bg-surface-inset border-b border-surface-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por mensaje, TraceId, VIN, código de error o RequestId..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 shrink-0"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-3 shrink-0">
          <span>Total en búfer: {logs.length}</span>
          <span>Filtrados: {filteredLogs.length}</span>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div
        ref={logContainerRef}
        className="flex-1 p-4 bg-surface-inset overflow-y-auto space-y-1 font-mono text-xs select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-slate-600 py-24 font-mono space-y-2">
            <p>No se encontraron eventos en este stream con los filtros actuales.</p>
            <p className="text-[11px] text-slate-500">
              Prueba inyectar una falla o transmitir telemetría CAN en el banco de pruebas.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            const isPayloadOpen = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="rounded hover:bg-surface-raised/50 border border-transparent hover:border-surface-border/50 transition-colors"
              >
                <div 
                  onClick={() => log.payload && setExpandedLogId(isPayloadOpen ? null : log.id)}
                  className={`flex items-start gap-2.5 py-1 px-2 rounded cursor-pointer ${
                    isPayloadOpen ? 'bg-surface-raised/70' : ''
                  }`}
                >
                  {/* Expand icon if payload present */}
                  <span className="shrink-0 mt-0.5 text-slate-500">
                    {log.payload ? (
                      isPayloadOpen ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                    ) : (
                      <span className="w-3.5 inline-block" />
                    )}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[11px] text-slate-500 tabular-nums shrink-0">
                    {time}
                  </span>

                  {/* Level Badge */}
                  <span className="shrink-0">{getLevelBadge(log.level)}</span>

                  {/* Sandbox Target */}
                  <span className="text-[11px] text-slate-400 shrink-0 font-semibold">
                    [{log.sandboxId}]
                  </span>

                  {/* Source */}
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {log.source}:
                  </span>

                  {/* Log Message */}
                  <span className="text-slate-200 break-all leading-relaxed flex-1">
                    {log.message}
                  </span>

                  {/* Micro-metrics right side */}
                  <div className="hidden lg:flex items-center gap-2.5 text-[10px] text-slate-500 shrink-0">
                    {log.durationMs && (
                      <span className="text-slate-400">{log.durationMs}ms</span>
                    )}
                    {log.cpuPct && (
                      <span>CPU: {log.cpuPct}%</span>
                    )}
                    {log.httpStatusCode && (
                      <span className="px-1 rounded bg-slate-800 text-emerald-400">
                        {log.httpStatusCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Payload & AWS Metadata Drawer */}
                {isPayloadOpen && log.payload && (
                  <div className="ml-8 mr-2 my-1.5 p-3 rounded bg-surface-raised border border-surface-border text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 border-b border-surface-border/60 pb-1.5">
                      <div className="flex items-center gap-3">
                        {log.traceId && (
                          <span><strong>X-Ray Trace:</strong> <code className="text-slate-300">{log.traceId}</code></span>
                        )}
                        {log.requestId && (
                          <span><strong>Request ID:</strong> <code className="text-slate-300">{log.requestId}</code></span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>Memoria: {log.memoryUsageMb || 128} MB</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold block mb-1">
                        PAYLOAD JSON ESTRUCTURADO:
                      </span>
                      <pre className="p-2 rounded bg-surface-inset border border-surface-border/50 text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Status Footer */}
      <div className="px-5 py-2 bg-surface-inset/90 border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nominal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nominal" />
            </span>
            <span>CloudWatch Receiver Online</span>
          </span>
          <span className="hidden md:inline">Driver: awslogs (Fargate VPC Eni)</span>
        </div>

        <span className="text-slate-400">
          Haz clic en cualquier fila para inspeccionar el payload JSON y trazas X-Ray
        </span>
      </div>
    </div>
  );
}
