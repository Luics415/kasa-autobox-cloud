'use client';

import React from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  Eye, 
  CopyPlus, 
  X, 
  Clock, 
  Car,
  Layers
} from 'lucide-react';
import { EphemeralSandbox } from '@/types/sandbox';
import { CountdownClock } from './CountdownClock';

interface DuplicateConfirmModalProps {
  isOpen: boolean;
  existingSandbox: EphemeralSandbox | null;
  attemptedVin: string;
  onClose: () => void;
  onResetTtl: () => void;
  onFocusExisting: () => void;
  onForceDuplicate: () => void;
}

export function DuplicateConfirmModal({
  isOpen,
  existingSandbox,
  attemptedVin,
  onClose,
  onResetTtl,
  onFocusExisting,
  onForceDuplicate,
}: DuplicateConfirmModalProps) {
  if (!isOpen || !existingSandbox) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ground/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-surface-raised border border-amber-500/40 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
                CONFLICTO DETECTADO: VEHÍCULO YA ACTIVO
              </h2>
              <p className="text-xs text-slate-300">
                Ya existe un entorno en ejecución para este automóvil.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-surface-border text-slate-400 hover:text-slate-200 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="text-xs text-slate-300 font-mono leading-relaxed">
            Se detectó que el vehículo <strong className="text-white">{existingSandbox.vehicle.model}</strong> con VIN <strong className="text-amber-400">{attemptedVin}</strong> ya cuenta con un sandbox activo provisionado. Generar múltiples puertos y contenedores paralelos para la misma unidad puede provocar colisiones de puertos y consumo innecesario de recursos.
          </div>

          {/* Active Sandbox Preview Card */}
          <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-slate-300">
                  {existingSandbox.id}
                </span>
                <span className="text-xs font-semibold text-slate-200 font-mono">
                  {existingSandbox.name}
                </span>
              </div>
              <CountdownClock expiresAt={existingSandbox.expiresAt} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-surface-border/60">
              <div>
                <span className="text-slate-500 block">ENDPOINT ACTIVO:</span>
                <span className="text-aws-blue truncate block">{existingSandbox.endpointUrl}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ESTADO ACTUAL:</span>
                <span className="text-nominal font-bold">{existingSandbox.status}</span>
              </div>
            </div>
          </div>

          {/* Decision Options */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 font-mono block">
              ¿Qué acción deseas realizar?
            </span>

            {/* Option 1: Reset Countdown */}
            <button
              onClick={onResetTtl}
              className="w-full text-left p-3 rounded bg-surface-inset hover:bg-surface-inset/80 border border-nominal/40 hover:border-nominal transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-nominal/10 text-nominal group-hover:bg-nominal/20">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 font-mono group-hover:text-nominal">
                    1. Reiniciar Cuenta Regresiva (Recomendado)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Restablece el reloj de vida del contenedor existente sin crear duplicados.
                  </div>
                </div>
              </div>
            </button>

            {/* Option 2: Focus Existing */}
            <button
              onClick={onFocusExisting}
              className="w-full text-left p-3 rounded bg-surface-inset hover:bg-surface-inset/80 border border-surface-border hover:border-slate-500 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-surface-raised text-cyan-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 font-mono group-hover:text-cyan-300">
                    2. Ir al Entorno Existente
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Cierra esta advertencia y te enfoca directamente en el sandbox que ya está corriendo.
                  </div>
                </div>
              </div>
            </button>

            {/* Option 3: Force Duplicate */}
            <button
              onClick={onForceDuplicate}
              className="w-full text-left p-3 rounded bg-surface-inset hover:bg-surface-inset/80 border border-surface-border hover:border-amber-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-surface-raised text-amber-400">
                  <CopyPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300 font-mono group-hover:text-amber-300">
                    3. Duplicar de Todos Modos (Entorno Paralelo)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Levanta una segunda instancia en un puerto aislado para pruebas de concurrencia.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
