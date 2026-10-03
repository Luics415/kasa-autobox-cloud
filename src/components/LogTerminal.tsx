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
  Info 
} from 'lucide-react';
import { CloudWatchLogEntry } from '@/types/sandbox';

interface LogTerminalProps {
  logs: CloudWatchLogEntry[];
  selectedSandboxId?: string;
  onRefresh: () => void;
}

export function LogTerminal({ logs, selectedSandboxId, onRefresh }: LogTerminalProps) {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0; // Since logs are sorted newest first, or reverse if bottom
    }
  }, [logs, autoScroll]);

  // Filter logs by sandbox, level, and search term
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
        log.sandboxId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getLevelBadge = (level: CloudWatchLogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">INFO</span>;
      case 'WARN':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">WARN</span>;
      case 'ERROR':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">ERROR</span>;
      case 'CAN_BUS':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">CAN-BUS</span>;
      case 'STS_AUTH':
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">STS-AUTH</span>;
    }
  };

  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-border bg-surface-inset/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-nominal" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Amazon CloudWatch Logs Stream
          </h3>
          {selectedSandboxId && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-slate-400">
              Filter: {selectedSandboxId}
            </span>
          )}
        </div>

        {/* Filter Badges & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-inset p-0.5 rounded border border-surface-border font-mono text-[11px]">
            {['ALL', 'CAN_BUS', 'ERRORS', 'STS'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filterLevel === lvl ? 'bg-surface-border text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded border text-xs transition-colors ${
              autoScroll
                ? 'bg-nominal/10 border-nominal/30 text-nominal'
                : 'bg-surface-inset border-surface-border text-slate-400'
            }`}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll paused'}
          >
            {autoScroll ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onRefresh}
            className="p-1.5 rounded bg-surface-inset hover:bg-surface-border border border-surface-border text-slate-400 hover:text-white transition-colors"
            title="Refresh Log Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-4 py-2 bg-surface-inset border-b border-surface-border flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Filter logs by keyword, VIN, DTC or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Terminal Output Body */}
      <div
        ref={logContainerRef}
        className="flex-1 p-4 bg-surface-inset overflow-y-auto space-y-1.5 font-mono text-xs select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-slate-600 py-16">
            No CloudWatch events found matching current criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 py-0.5 hover:bg-surface-raised/40 px-1 rounded transition-colors group"
              >
                <span className="text-[11px] text-slate-500 tabular-nums shrink-0">
                  {time}
                </span>
                <span className="shrink-0">{getLevelBadge(log.level)}</span>
                <span className="text-[11px] text-slate-400 shrink-0 group-hover:text-slate-300">
                  [{log.source}]
                </span>
                <span className="text-slate-300 break-all leading-relaxed">
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-1.5 bg-surface-inset/80 border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>CloudWatch LogGroup: /ecs/kasa-autobox-sandboxes</span>
        <span>Showing {filteredLogs.length} events</span>
      </div>
    </div>
  );
}
