'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Key, 
  Cpu, 
  Radio, 
  Terminal, 
  FileCode, 
  Layers, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Archive,
  DollarSign,
  Copy,
  Check,
  Server,
  Zap,
  CheckCircle2,
  Database,
  Sliders,
  Code
} from 'lucide-react';

export function DocumentationView() {
  const [activeSection, setActiveSection] = useState<
    'quickstart' | 'sts' | 'diagnostics' | 'archive' | 'maintenance' | 'api' | 'troubleshooting'
  >('quickstart');

  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const SECTIONS = [
    { id: 'quickstart', label: '1. Guía Rápida para Principiantes', icon: BookOpen, badge: 'Básico' },
    { id: 'sts', label: '2. Seguridad y Credenciales AWS STS', icon: Key, badge: 'Seguridad' },
    { id: 'diagnostics', label: '3. Diagnóstico Automotriz OBD-II & CAN', icon: Radio, badge: 'Taller' },
    { id: 'archive', label: '4. Bóveda en Frío e Historial Comprimido', icon: Archive, badge: 'Storage' },
    { id: 'maintenance', label: '5. Arquitectura AWS & Guía DevOps', icon: Wrench, badge: 'Avanzado' },
    { id: 'api', label: '6. Referencia de API REST & cURL', icon: Code, badge: 'Desarrollo' },
    { id: 'troubleshooting', label: '7. Matriz de Errores & FAQ', icon: HelpCircle, badge: 'Soporte' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-mono">
      {/* Sidebar Navigation */}
      <div className="md:col-span-4 bg-surface-raised border border-surface-border rounded-lg p-3 space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-surface-border mb-2 flex items-center justify-between">
          <span>Manual de Operación</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-nominal/15 text-nominal font-mono">v1.3</span>
        </div>

        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`w-full text-left px-3 py-2.5 rounded text-xs transition-colors flex items-center justify-between group ${
                isActive
                  ? 'bg-nominal/15 text-nominal font-bold border border-nominal/30'
                  : 'text-slate-400 hover:bg-surface-inset hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-nominal' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="truncate">{sec.label}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <span className={`text-[9px] px-1.5 py-0.2 rounded border ${
                  isActive 
                    ? 'bg-nominal/20 border-nominal/40 text-nominal' 
                    : 'bg-surface-inset border-surface-border text-slate-500'
                }`}>
                  {sec.badge}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-nominal" />}
              </div>
            </button>
          );
        })}

        <div className="p-3 mt-4 rounded bg-surface-inset border border-surface-border text-[11px] text-slate-400 space-y-1.5">
          <span className="font-bold text-slate-200 block flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-nominal" />
            <span>Kasa AutoBox Cloud v1.3</span>
          </span>
          <p className="text-slate-400">
            Plataforma de Sandboxes Efímeros para Servicios Automotrices y Diagnóstico de Talleres.
          </p>
          <div className="pt-1.5 border-t border-surface-border/50 text-[10px] text-slate-500 flex justify-between">
            <span>Estándar: Impeccable UI</span>
            <span className="text-nominal">Production-Ready</span>
          </div>
        </div>
      </div>

      {/* Main Documentation Article Content */}
      <div className="md:col-span-8 bg-surface-raised border border-surface-border rounded-lg p-6 space-y-6 text-xs text-slate-300 leading-relaxed shadow-sm">
        
        {/* ============================================================== */}
        {/* SECTION 1: QUICKSTART */}
        {/* ============================================================== */}
        {activeSection === 'quickstart' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-nominal" />
                  <span>1. Guía Rápida para Principiantes</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-inset text-slate-400 border border-surface-border">
                  Lectura: 4 min
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Aprende qué es Kasa AutoBox Cloud, por qué existe y cómo operar tus entornos efímeros en segundos.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>El Problema Real en Talleres y Software Automotriz</span>
              </h4>
              <p>
                En redes de concesionarios y talleres mecánicos modernos (como <em>Kasa-service</em>), los desarrolladores necesitan probar integraciones con APIs de vehículos, gateways telemáticos y simuladores de inyección de fallas OBD-II.
              </p>
              <p>
                El problema habitual en AWS es que los desarrolladores o técnicos despliegan contenedores o instancias EC2 de prueba y <strong>olvidan apagarlos al terminar la jornada</strong>. Esos entornos zombi quedan consumiendo cómputo, IPs elásticas y balanceadores, generando facturas imprevistas de cientos o miles de dólares al mes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-inset border border-surface-border space-y-3">
              <h4 className="text-xs font-bold text-nominal uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nominal" />
                <span>La Solución: Entornos Desechables con Reloj de Vida (TTL)</span>
              </h4>
              <p className="text-slate-300">
                Cada <strong>Sandbox</strong> es un entorno totalmente aislado que corre en Amazon ECS Fargate. Al crearse, se le asigna un <strong>Time-To-Live (TTL)</strong> exacto.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Aislamiento por Vehículo:</strong> Cada sandbox vincula un VIN específico, su microservicio y su propio endpoint directo.</li>
                <li><strong className="text-slate-200">Reloj de Desconexión Automática:</strong> Si nadie extiende el tiempo, el sandbox se apaga automáticamente al llegar a 00:00:00.</li>
                <li><strong className="text-slate-200">Auto-Archivado Limpio:</strong> El entorno no se queda estorbando; se comprime y se mueve a la Bóveda en Frío, manteniendo despejada la bahía de trabajo activa.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Anatomía de los Controles en Cada Tarjeta:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center gap-1.5 text-nominal font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reloj TTL & Botón +30m</span>
                  </div>
                  <p className="text-slate-400">
                    Muestra el conteo regresivo en formato <code className="text-slate-300">HH:MM:SS</code>. Si tus pruebas requieren más tiempo, pulsa <strong>"+30m"</strong> para renovar 30 minutos extra al instante.
                  </p>
                </div>

                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Eliminar con Doble Confirmación</span>
                  </div>
                  <p className="text-slate-400">
                    Al pulsar el icono de papelera, se transforma en un botón táctico <strong>"¿Confirmar?"</strong>. Al validarlo, se destruyen los recursos en AWS y el estado se archiva en la Bóveda.
                  </p>
                </div>

                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Key className="w-3.5 h-3.5" />
                    <span>Botón "STS Token"</span>
                  </div>
                  <p className="text-slate-400">
                    Abre el cajón lateral con credenciales temporales emitidas por AWS Security Token Service. Puedes copiarlas para terminal, archivo <code className="text-slate-300">.env</code> o AWS CLI.
                  </p>
                </div>

                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-nominal" />
                    <span>Tarjeta & Botón "Inspect"</span>
                  </div>
                  <p className="text-slate-400">
                    Al hacer clic en cualquier tarjeta, la pantalla se desplaza suavemente hacia el terminal de <strong>CloudWatch Logs</strong> para filtrar el stream exclusivo de ese vehículo.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Prevención de Colisiones de Vehículos (Anti-Duplicate Guard)</span>
              </span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Si intentas aprovisionar un vehículo cuyo VIN ya está en ejecución, el sistema bloqueará la creación accidental y te ofrecerá una ventana modal táctica con 3 opciones inteligentes:
              </p>
              <ul className="list-disc list-inside text-[11px] text-amber-300/80 space-y-1 pl-2">
                <li><strong>Reiniciar Conteo (Reset TTL):</strong> Restablece el reloj del entorno existente al tiempo solicitado sin crear una segunda instancia.</li>
                <li><strong>Enfocarse en Existente:</strong> Te lleva a la tarjeta activa y despliega sus logs en CloudWatch sin modificar nada.</li>
                <li><strong>Duplicar de Todos Modos:</strong> Crea una segunda instancia en un puerto aislado para pruebas de estrés o concurrencia.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: STS CREDENTIALS */}
        {/* ============================================================== */}
        {activeSection === 'sts' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-nominal" />
                  <span>2. Seguridad y Credenciales Temporales AWS STS</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Zero Long-Term Secrets
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Arquitectura de mínimo privilegio mediante tokens de sesión efímeros de corta duración.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                ¿Por qué NO usamos credenciales fijas de AWS?
              </h4>
              <p>
                Almacenar <code className="text-cyan-400">AWS_ACCESS_KEY_ID</code> y <code className="text-cyan-400">AWS_SECRET_ACCESS_KEY</code> permanentes de usuarios IAM es una de las principales causas de brechas de seguridad en la nube.
              </p>
              <p>
                Kasa AutoBox Cloud invoca <strong>AWS STS AssumeRole</strong> (<code className="text-slate-300">sts:AssumeRole</code>). Esto genera credenciales criptográficas con un prefijo <code className="text-slate-300">ASIAR...</code> que <strong>expiran exactamente cuando vence el TTL del sandbox</strong>. Una vez vencido el entorno, las llaves son completamente inútiles para cualquier atacante.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Snippets de Conexión Rápida:
              </h4>

              {/* Snippet 1: Bash */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">Entorno Linux / macOS (Bash / Zsh):</span>
                  <button
                    onClick={() => copyToClipboard(`export AWS_ACCESS_KEY_ID="ASIAR928BKAOTEMP404Y"\nexport AWS_SECRET_ACCESS_KEY="wL9x8J+m1R3t4VqS2kK3hN0jP9rE5gF7cB1aZ3d8"\nexport AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQDf8k2w..."\ncurl -X GET $KASA_SERVICE_URL/health`, 'bash')}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-nominal transition-colors"
                  >
                    {copiedSnippet === 'bash' ? <Check className="w-3.5 h-3.5 text-nominal" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'bash' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-ground border border-surface-border text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
{`export AWS_ACCESS_KEY_ID="ASIAR928BKAOTEMP404Y"
export AWS_SECRET_ACCESS_KEY="wL9x8J+m1R3t4VqS2kK3hN0jP9rE5gF7cB1aZ3d8"
export AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQDf8k2w..."

# Probar endpoint directo del contenedor
curl -X GET https://sbx-obd-404.us-east-1.ecs.kasa-autobox.net/health`}
                </pre>
              </div>

              {/* Snippet 2: PowerShell */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">Entorno Windows (PowerShell):</span>
                  <button
                    onClick={() => copyToClipboard(`$env:AWS_ACCESS_KEY_ID="ASIAR928BKAOTEMP404Y"\n$env:AWS_SECRET_ACCESS_KEY="wL9x8J+m1R3t4VqS2kK3hN0jP9rE5gF7cB1aZ3d8"\n$env:AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQDf8k2w..."\nInvoke-RestMethod -Uri "https://sbx-obd-404.us-east-1.ecs.kasa-autobox.net/health"`, 'ps')}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-nominal transition-colors"
                  >
                    {copiedSnippet === 'ps' ? <Check className="w-3.5 h-3.5 text-nominal" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'ps' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-ground border border-surface-border text-[11px] text-cyan-300 overflow-x-auto whitespace-pre">
{`$env:AWS_ACCESS_KEY_ID="ASIAR928BKAOTEMP404Y"
$env:AWS_SECRET_ACCESS_KEY="wL9x8J+m1R3t4VqS2kK3hN0jP9rE5gF7cB1aZ3d8"
$env:AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQDf8k2w..."

# Probar endpoint desde PowerShell
Invoke-RestMethod -Uri "https://sbx-obd-404.us-east-1.ecs.kasa-autobox.net/health"`}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Política IAM de Mínimo Privilegio (Scoped Role):
              </h4>
              <p className="text-slate-400 text-[11px]">
                El rol asumido solo concede lectura/escritura a streams con el prefijo exacto del sandbox y deniega cualquier acceso al resto de la cuenta:
              </p>
              <pre className="p-3 rounded bg-surface-inset border border-surface-border text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:GetLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/ecs/kasa-autobox-sandboxes:log-stream:sbx-*"
    },
    {
      "Effect": "Deny",
      "Action": ["iam:*", "ec2:TerminateInstances", "dynamodb:DeleteTable"],
      "Resource": "*"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: AUTOMOTIVE DIAGNOSTICS */}
        {/* ============================================================== */}
        {activeSection === 'diagnostics' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  <span>3. Diagnóstico Automotriz OBD-II y Bus CAN</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  SAE J1979 Standard
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Especificación técnica de fallas mecánicas, parámetros en vivo y tramas de red vehicular.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                ¿Qué es el Banco de Pruebas de Diagnóstico?
              </h4>
              <p>
                En los talleres Kasa-service, los escáneres OBD-II se conectan al puerto bajo el volante para leer las computadoras del motor (ECU) y transmisión (TCU).
              </p>
              <p>
                Este simulador replica las tramas binarias del bus <strong>CAN (Controller Area Network)</strong> y transmite paquetes a los microservicios desplegados en AWS ECS para verificar cómo reacciona tu software antes de conectarlo a vehículos físicos.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Catálogo de Códigos de Falla (DTC) Integrados:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">P0420 — Catalizador</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">Medio</span>
                  </div>
                  <p className="text-slate-400">
                    <strong>Descripción:</strong> Eficiencia del catalizador por debajo del umbral de emisiones (Banco 1).
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Provoca encendido inmediato del Check Engine (MIL) y alerta en la recepción de taller.
                  </p>
                </div>

                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-bold">P0300 — Misfire Múltiple</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">Crítico</span>
                  </div>
                  <p className="text-slate-400">
                    <strong>Descripción:</strong> Fallo aleatorio de encendido en múltiples cilindros del motor.
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Simula pérdida súbita de potencia, tironeo y emisión excesiva de hidrocarburos no quemados.
                  </p>
                </div>

                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">P0171 — Mezcla Pobre</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">Medio</span>
                  </div>
                  <p className="text-slate-400">
                    <strong>Descripción:</strong> Exceso de aire y falta de combustible detectado por la sonda Lambda.
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Común por fugas en el colector de admisión o sensor de flujo de masa de aire (MAF) sucio.
                  </p>
                </div>

                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-bold">P0217 — Sobrecalentamiento</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">Emergencia</span>
                  </div>
                  <p className="text-slate-400">
                    <strong>Descripción:</strong> Temperatura de refrigerante por encima del umbral crítico (&gt;110°C).
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Dispara alarma acústica y activa modo de protección ("Limp Home Mode") para proteger la culata.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Estructura de la Trama CAN-Bus Transmitida a CloudWatch:
              </h4>
              <p className="text-slate-400 text-[11px]">
                Cuando mueves los deslizadores de RPM o Velocidad en la interfaz, se emite este payload estructurado que puedes inspeccionar en el stream:
              </p>
              <pre className="p-3 rounded bg-surface-inset border border-surface-border text-[11px] text-cyan-300 overflow-x-auto whitespace-pre">
{`{
  "canId": "0x7DF",           // Standard OBD-II Broadcast Request ID
  "mode": "0x01",            // Show Current Diagnostic Data
  "pids": {
    "0x0C": { "label": "Engine RPM", "raw": "0x1A 0xF8", "parsed": 3450 },
    "0x0D": { "label": "Vehicle Speed", "raw": "0x5A", "parsed": 90 },
    "0x05": { "label": "Coolant Temp", "raw": "0x82", "parsed": 90 }
  },
  "vin": "3FA6P0H74HR120932",
  "busLoadPct": "18.4%"
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 4: ARCHIVE & COLD STORAGE */}
        {/* ============================================================== */}
        {activeSection === 'archive' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Archive className="w-5 h-5 text-cyan-400" />
                  <span>4. Bóveda en Frío e Historial Comprimido</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Cold Storage Tier
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Arquitectura de almacenamiento comprimido para evitar saturación de la bahía operativa.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                ¿Por qué separar los entornos activos del historial?
              </h4>
              <p>
                En consolas convencionales de computación, las instancias apagadas, terminadas o con errores suelen permanecer en la misma lista principal. Tras semanas de uso, encontrar un entorno activo se convierte en una molestia.
              </p>
              <p>
                En <strong>Kasa AutoBox Cloud</strong>, en el mismo instante en que un sandbox llega al final de su reloj o es terminado por el técnico:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-2">
                <li><strong className="text-slate-200">Desaparición Inmediata:</strong> La tarjeta se remueve de la Bahía de Mando mediante una actualización reactiva instantánea.</li>
                <li><strong className="text-slate-200">Empaquetado y Compresión GZIP:</strong> El estado final (DTCs activos, horas totales de uso, telemetría y conteo de logs) se serializa y comprime en formato binario.</li>
                <li><strong className="text-slate-200">Persistencia en Tabla Secundaria:</strong> Se guarda en una tabla fría de DynamoDB o bucket S3 Glacier con un tamaño típicamente inferior a 2 KB por registro.</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Los 3 Filtros Temporales de la Bóveda:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <span className="text-cyan-400 font-bold block">Menos de 1 Semana</span>
                  <p className="text-slate-400">
                    Ideal para técnicos de turno revisando pruebas concluidas en los últimos 7 días.
                  </p>
                </div>
                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <span className="text-cyan-400 font-bold block">Menos de 1 Mes</span>
                  <p className="text-slate-400">
                    Vista para jefes de taller que auditan las revisiones y diagnósticos del mes en curso.
                  </p>
                </div>
                <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                  <span className="text-cyan-400 font-bold block">Menos de 1 Año</span>
                  <p className="text-slate-400">
                    Historial anual consolidado para cálculo de reportes FinOps y retorno de inversión.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
              <h4 className="text-xs font-bold text-nominal uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nominal" />
                <span>Función de Relanzamiento en 1 Clic (1-Click Relaunch)</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Si un vehículo histórico requiere una segunda sesión de calibración, no necesitas volver a configurar el formulario. En la pestaña <strong>"Bóveda Histórica"</strong>, pulsa el botón <strong>"Relanzar"</strong> junto al vehículo archivado. El sistema volverá a provisionar una tarea ECS fresca con el mismo VIN y plantilla automáticamente.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 5: AWS ARCHITECTURE & MAINTENANCE GUIDE */}
        {/* ============================================================== */}
        {activeSection === 'maintenance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-400" />
                  <span>5. Arquitectura AWS y Manual de Mantenimiento (DevOps)</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Infraestructura Cloud
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Guía técnica exhaustiva para DevOps, administradores de nube y arquitectos de soluciones.
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Diagrama de Flujo y Componentes de AWS:
              </h4>
              <pre className="p-4 rounded-lg bg-ground border border-surface-border text-[10px] text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed font-mono">
{`+-----------------------------------------------------------------------------+
|                            USUARIO / TALLER KASA                            |
|             (Navegador Web / Frontend Next.js 15 en Fargate/Vercel)         |
+--------------------------------------+--------------------------------------+
                                       | HTTP REST / STS Tokens
                                       v
+-----------------------------------------------------------------------------+
|                      APPLICATION LOAD BALANCER (ALB)                        |
|        - Enrutamiento por Host Header / Path /sbx-{id}                      |
|        - Certificado TLS ACM con terminación segura                         |
+-------------------+-----------------------------------+---------------------+
                    |                                   |
         Crea/Maneja Tareas                     Valida Expiración
                    v                                   v
+------------------------------------+  +-------------------------------------+
|        AMAZON ECS FARGATE          |  |       AMAZON DYNAMODB (ACTIVE)      |
|    (Cluster: kasa-autobox-prod)    |  |  - PK: sandboxId (String)           |
|                                    |  |  - TTL Attr: expiresAtEpoch (Unix)  |
|  [ Task: sbx-bay-819 (Hilux) ]     |  |  - Auto-purge nativo sin costo      |
|  [ Task: sbx-obd-404 (Ranger) ]    |  +------------------+------------------+
|  [ Task: sbx-sim-312 (RS6) ]       |                     |
+-------------------+----------------+                     | DynamoDB Streams
                    | Logs / Tracing                       v
                    v                           +-----------------------------+
+------------------------------------+          | AWS EVENTBRIDGE REAPER CRON |
|      AMAZON CLOUDWATCH LOGS        |          |  - Disparo cada 5 minutos   |
|   /ecs/kasa-autobox-sandboxes      |          |  - Invoca Lambda Auditora   |
|   - Retención: 7 días              |          |  - Fuerza StopTask si expira|
|   - X-Ray Trace IDs correlacionados|          +--------------+--------------+
+------------------------------------+                         |
                                                               v
                                                +-----------------------------+
                                                | DYNAMODB HISTORICAL ARCHIVE |
                                                |  - Payload GZIP Comprimido  |
                                                |  - Filtros: Semana/Mes/Año  |
                                                +-----------------------------+`}
              </pre>
            </div>

            {/* Step-by-Step Maintenance Procedures */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Procedimientos Operativos de Mantenimiento Rutinario:
              </h4>

              <div className="space-y-3 text-[11px]">
                {/* Routine 1 */}
                <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-nominal" />
                      <span>1. Monitoreo de Tareas Huérfanas en ECS</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Frecuencia: Semanal</span>
                  </div>
                  <p className="text-slate-400">
                    Aunque el EventBridge Reaper apaga las tareas automáticamente, ejecuta este comando en el AWS CLI para listar cualquier contenedor que lleve más de 4 horas corriendo:
                  </p>
                  <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`aws ecs list-tasks --cluster kasa-autobox-prod --desired-status RUNNING`}
                  </pre>
                </div>

                {/* Routine 2 */}
                <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>2. Verificación de la Propiedad TTL en DynamoDB</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Frecuencia: Mensual</span>
                  </div>
                  <p className="text-slate-400">
                    Asegúrate de que la función de Time To Live (TTL) permanezca activada en la tabla <code className="text-slate-300">kasa_ephemeral_sandboxes</code>:
                  </p>
                  <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`aws dynamodb describe-time-to-live --table-name kasa_ephemeral_sandboxes`}
                  </pre>
                </div>

                {/* Routine 3 */}
                <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span>3. Drenado de Emergencia en Caso de Sobrecosto</span>
                    </span>
                    <span className="text-[10px] text-red-400">Procedimiento Runbook</span>
                  </div>
                  <p className="text-slate-400">
                    Si por error de configuración se crearon decenas de sandboxes concurrentes, puedes detener todas las tareas activas de inmediato con este loop en Bash:
                  </p>
                  <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-red-300 overflow-x-auto whitespace-pre">
{`for task in $(aws ecs list-tasks --cluster kasa-autobox-prod --output text --query "taskArns[]"); do
  aws ecs stop-task --cluster kasa-autobox-prod --task $task --reason "Emergency mass drain"
done`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Despliegue con Terraform */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Despliegue de Infraestructura con Terraform:
              </h4>
              <p className="text-slate-400 text-[11px]">
                El repositorio incluye plantillas Terraform preconfiguradas en el directorio <code className="text-slate-300">/terraform</code>:
              </p>
              <pre className="p-3 rounded bg-ground border border-surface-border text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`# 1. Posicionarse en el directorio de infraestructura
cd terraform

# 2. Inicializar providers (AWS, TLS, Random)
terraform init

# 3. Validar el plan de ejecución
terraform plan -out=tfplan

# 4. Desplegar los recursos en tu cuenta de AWS
terraform apply tfplan`}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 6: API REST & CURL REFERENCE */}
        {/* ============================================================== */}
        {activeSection === 'api' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-nominal" />
                  <span>6. Referencia de API REST & Guía cURL</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-inset text-slate-400 border border-surface-border">
                  OpenAPI / REST
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Endpoints HTTP disponibles para automatizar aprovisionamientos mediante CI/CD, scripts o escáneres.
              </p>
            </div>

            <div className="space-y-4">
              {/* Endpoint 1: List Sandboxes */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">GET</span>
                    <code className="text-white text-xs">/api/sandboxes</code>
                  </div>
                  <span className="text-[10px] text-slate-500">Listar bahías activas</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Retorna únicamente los sandboxes cuyo TTL aún no ha expirado. Los expirados se auto-archivan de forma transparente.
                </p>
                <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X GET http://localhost:3000/api/sandboxes`}
                </pre>
              </div>

              {/* Endpoint 2: Create Sandbox */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">POST</span>
                    <code className="text-white text-xs">/api/sandboxes</code>
                  </div>
                  <span className="text-[10px] text-slate-500">Aprovisionar nuevo entorno</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Si el vehículo ya está corriendo, retorna <code className="text-amber-400">409 Conflict</code> junto con los datos del sandbox en colisión.
                </p>
                <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X POST http://localhost:3000/api/sandboxes \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "workshop-bay",
    "vehicleVin": "3FA6P0H74HR120932",
    "ttlMinutes": 30,
    "customName": "Recepción Taller Nissan - Prueba Frenos"
  }'`}
                </pre>
              </div>

              {/* Endpoint 3: Extend TTL */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">PATCH</span>
                    <code className="text-white text-xs">/api/sandboxes/:id</code>
                  </div>
                  <span className="text-[10px] text-slate-500">Extender TTL (+30m)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Suma minutos adicionales al reloj de vida y renueva la expiración de las credenciales STS.
                </p>
                <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X PATCH http://localhost:3000/api/sandboxes/sbx-bay-819 \\
  -H "Content-Type: application/json" \\
  -d '{"additionalMinutes": 30}'`}
                </pre>
              </div>

              {/* Endpoint 4: Delete / Archive */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">DELETE</span>
                    <code className="text-white text-xs">/api/sandboxes/:id</code>
                  </div>
                  <span className="text-[10px] text-slate-500">Terminar y Archivar</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Detiene la tarea en ECS Fargate, genera el paquete comprimido y lo inserta en la Bóveda Histórica.
                </p>
                <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X DELETE http://localhost:3000/api/sandboxes/sbx-bay-819`}
                </pre>
              </div>

              {/* Endpoint 5: Simulate Event */}
              <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">POST</span>
                    <code className="text-white text-xs">/api/sandboxes/:id/simulate-event</code>
                  </div>
                  <span className="text-[10px] text-slate-500">Inyectar DTC o Telemetría</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Transmite un evento de diagnóstico al contenedor y lo registra en CloudWatch Logs.
                </p>
                <pre className="p-2 rounded bg-ground border border-surface-border text-[10px] text-slate-300 overflow-x-auto whitespace-pre">
{`curl -X POST http://localhost:3000/api/sandboxes/sbx-bay-819/simulate-event \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "DTC_FAULT",
    "code": "P0420",
    "description": "Catalyst System Efficiency Below Threshold",
    "severity": "MEDIUM"
  }'`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 7: TROUBLESHOOTING & FAQ */}
        {/* ============================================================== */}
        {activeSection === 'troubleshooting' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>7. Matriz de Errores y Preguntas Frecuentes (FAQ)</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-inset text-slate-400 border border-surface-border">
                  Troubleshooting
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Resolución guiada de los escenarios y dudas más frecuentes en la operación diaria.
              </p>
            </div>

            {/* Error Codes Matrix Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Matriz de Códigos de Respuesta HTTP:
              </h4>
              <div className="border border-surface-border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-surface-inset border-b border-surface-border text-slate-300 font-bold">
                      <th className="p-2.5">Código</th>
                      <th className="p-2.5">Significado</th>
                      <th className="p-2.5">Causa Probable</th>
                      <th className="p-2.5">Acción Recomendada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    <tr className="hover:bg-surface-inset/50">
                      <td className="p-2.5 font-bold text-amber-400">409 Conflict</td>
                      <td className="p-2.5 text-slate-200">Vehículo Ya en Ejecución</td>
                      <td className="p-2.5 text-slate-400">Se intentó crear un sandbox para un VIN con reloj activo.</td>
                      <td className="p-2.5 text-slate-300">Seleccionar "Reiniciar TTL" o "Duplicar" en la modal.</td>
                    </tr>
                    <tr className="hover:bg-surface-inset/50">
                      <td className="p-2.5 font-bold text-red-400">404 Not Found</td>
                      <td className="p-2.5 text-slate-200">Sandbox No Encontrado</td>
                      <td className="p-2.5 text-slate-400">El sandbox ya expiró o fue eliminado por el Reaper.</td>
                      <td className="p-2.5 text-slate-300">Revisar la pestaña "Bóveda Histórica" para relanzarlo.</td>
                    </tr>
                    <tr className="hover:bg-surface-inset/50">
                      <td className="p-2.5 font-bold text-cyan-400">400 Bad Request</td>
                      <td className="p-2.5 text-slate-200">Parámetros Inválidos</td>
                      <td className="p-2.5 text-slate-400">Falta el VIN, templateId no reconocido o TTL &lt; 5m.</td>
                      <td className="p-2.5 text-slate-300">Validar el payload JSON enviado al endpoint.</td>
                    </tr>
                    <tr className="hover:bg-surface-inset/50">
                      <td className="p-2.5 font-bold text-emerald-400">200 / 201 OK</td>
                      <td className="p-2.5 text-slate-200">Operación Exitosa</td>
                      <td className="p-2.5 text-slate-400">Aprovisionamiento, extensión o diagnóstico aceptado.</td>
                      <td className="p-2.5 text-slate-300">Monitorear logs en el terminal de CloudWatch.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ Q&A */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Preguntas Frecuentes (FAQ):
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>¿Por qué mi sandbox caducó y desapareció de repente?</span>
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    El reloj de vida (TTL) llegó a 00:00:00. Para proteger la cuenta contra gastos imprevistos, los contenedores caducados son destruidos automáticamente. Puedes consultar su estado final y relanzarlo desde la <strong>Bóveda Histórica</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>¿Cómo funciona el cambio entre Modo Simulado y Live AWS?</span>
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    En la barra superior hay un interruptor táctico. El <strong>"Simulador Local"</strong> corre un motor in-memory con cero costo y latencias ultrarrápidas, ideal para pruebas locales o demostraciones. El modo <strong>"Live AWS"</strong> usa el AWS SDK v3 para comunicarse directamente con tu VPC, ECS y CloudWatch.
                  </p>
                </div>

                <div className="p-3.5 rounded bg-surface-inset border border-surface-border space-y-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>¿Puedo conectar un escáner OBD-II físico real por Bluetooth/WiFi?</span>
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Sí. Si configuras un túnel o gateway en el taller físico que serialice las tramas CAN a JSON, puedes enviar peticiones HTTP POST hacia el endpoint <code className="text-slate-300">/api/sandboxes/:id/simulate-event</code> y ver la respuesta en vivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
