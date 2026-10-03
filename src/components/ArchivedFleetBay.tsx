'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Archive, 
  Calendar, 
  Car, 
  RotateCcw, 
  Database, 
  FileArchive, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { ArchivedSandbox } from '@/types/sandbox';

interface ArchivedFleetBayProps {
  onRelaunch: (archived: ArchivedSandbox) => Promise<void>;
}

export function ArchivedFleetBay({ onRelaunch }: ArchivedFleetBayProps) {
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('month');
  const [archives, setArchives] = useState<ArchivedSandbox[]>([]);
  const [totalStoredKb, setTotalStoredKb] = useState<number>(0);
  const [totalHistoricalCost, setTotalHistoricalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relaunchingId, setRelaunchingId] = useState<string | null>(null);

  const fetchArchives = useCallback(async (selectedFilter: 'week' | 'month' | 'year') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/archive?filter=${selectedFilter}`);
      if (res.ok) {
        const data = await res.json();
        setArchives(data.archivedSandboxes || []);
        setTotalStoredKb(data.totalStoredKb || 0);
        setTotalHistoricalCost(data.totalHistoricalCost || 0);
      }
    } catch (err) {
      console.error('Error fetching archives:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchives(filter);
  }, [filter, fetchArchives]);

  const handleRelaunch = async (item: ArchivedSandbox) => {
    setRelaunchingId(item.id);
    await onRelaunch(item);
    setRelaunchingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-surface-raised border border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-100 font-mono">
              Bóveda Histórica & Almacenamiento en Frío (Archived Cold Storage)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Los entornos caducados se comprimen y resguardan aquí para mantener despejada la bahía operativa principal.
          </p>
        </div>

        {/* 3 Filters: Week, Month, Year */}
        <div className="flex items-center gap-2 bg-surface-inset p-1 rounded-lg border border-surface-border">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setFilter('week')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'week'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Menos de 1 Semana
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'month'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Menos de 1 Mes
            </button>
            <button
              onClick={() => setFilter('year')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'year'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Menos de 1 Año
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Storage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded bg-surface-inset border border-surface-border flex items-center justify-between">
          <span className="text-slate-400">Total Entornos Archivados:</span>
          <span className="text-slate-100 font-bold">{archives.length} registros</span>
        </div>
        <div className="p-3 rounded bg-surface-inset border border-surface-border flex items-center justify-between">
          <span className="text-slate-400">Volumen Comprimido:</span>
          <span className="text-cyan-400 font-bold">{totalStoredKb} KB (GZIP JSON)</span>
        </div>
        <div className="p-3 rounded bg-surface-inset border border-surface-border flex items-center justify-between">
          <span className="text-slate-400">Costo Histórico Facturado:</span>
          <span className="text-emerald-400 font-bold">${totalHistoricalCost} USD</span>
        </div>
      </div>

      {/* Archived Cards List */}
      {isLoading ? (
        <div className="p-12 text-center font-mono text-xs text-slate-500 bg-surface-raised border border-surface-border rounded-lg">
          Consultando registros históricos en tabla fría de DynamoDB...
        </div>
      ) : archives.length === 0 ? (
        <div className="p-12 text-center font-mono text-xs text-slate-500 bg-surface-raised border border-surface-border rounded-lg">
          No hay entornos archivados en el periodo seleccionado ({filter}).
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archives.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-surface-raised/80 border border-surface-border space-y-3 font-mono text-xs hover:border-slate-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-surface-border pb-2.5">
                <div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-inset text-slate-400 border border-surface-border">
                    {item.id}
                  </span>
                  <h4 className="font-semibold text-slate-200 mt-1 truncate max-w-[220px]">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Car className="w-3 h-3" />
                    <span>{item.vehicle.model}</span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-inset border border-surface-border text-cyan-400 font-bold shrink-0">
                  {item.compressedSizeKb} KB
                </span>
              </div>

              {/* Uptime and Reason */}
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Terminación:</span>
                  <span className={item.terminationReason === 'TTL_EXPIRED' ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                    {item.terminationReason === 'TTL_EXPIRED' ? 'TTL Caducado (Auto)' : 'Manual por Usuario'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo de vida:</span>
                  <span className="text-slate-200">{item.totalUptimeMinutes} minutos</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha de cierre:</span>
                  <span className="text-slate-400">{new Date(item.terminatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Final captured DTCs */}
              {item.finalDtcs.length > 0 && (
                <div className="pt-2 border-t border-surface-border/50">
                  <span className="text-[10px] text-slate-500 block mb-1">DTCs CAPTURADOS:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.finalDtcs.map((dtc) => (
                      <span
                        key={dtc.code}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      >
                        {dtc.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relaunch Button */}
              <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Costo: ${item.estimatedCostUsd}</span>
                <button
                  onClick={() => handleRelaunch(item)}
                  disabled={relaunchingId === item.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-inset hover:bg-surface-border border border-surface-border text-xs text-slate-200 hover:text-white transition-colors disabled:opacity-50"
                  title="Reabrir entorno con esta misma configuración"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-nominal ${relaunchingId === item.id ? 'animate-spin' : ''}`} />
                  <span>{relaunchingId === item.id ? 'Restaurando...' : 'Relanzar'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
