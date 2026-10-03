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
  DollarSign
} from 'lucide-react';

export function DocumentationView() {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'sts' | 'diagnostics' | 'archive' | 'architecture' | 'troubleshooting'>('quickstart');

  const SECTIONS = [
    { id: 'quickstart', label: '1. Guía Rápida para Principiantes', icon: BookOpen },
    { id: 'sts', label: '2. Credenciales AWS STS y Conexión', icon: Key },
    { id: 'diagnostics', label: '3. Diagnóstico Automotriz OBD-II', icon: Radio },
    { id: 'archive', label: '4. Bóveda en Frío e Historial', icon: Archive },
    { id: 'architecture', label: '5. Arquitectura y Mantenimiento AWS', icon: Wrench },
    { id: 'troubleshooting', label: '6. Solución de Problemas (FAQ)', icon: HelpCircle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-mono">
      {/* Sidebar Navigation */}
      <div className="md:col-span-4 bg-surface-raised border border-surface-border rounded-lg p-3 space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-surface-border mb-2">
          Manual de Operación
        </div>
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`w-full text-left px-3 py-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                isActive
                  ? 'bg-nominal/15 text-nominal font-bold border border-nominal/30'
                  : 'text-slate-400 hover:bg-surface-inset hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{sec.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}

        <div className="p-3 mt-4 rounded bg-surface-inset border border-surface-border text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-slate-300 block">Soporte de Plataforma</span>
          <p>Kasa AutoBox Cloud v1.2</p>
          <p className="text-slate-500">Diseñado con el estándar Impeccable</p>
        </div>
      </div>

      {/* Main Documentation Article Content */}
      <div className="md:col-span-8 bg-surface-raised border border-surface-border rounded-lg p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
        {/* SECTION 1: QUICKSTART */}
        {activeSection === 'quickstart' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-nominal" />
                <span>1. Guía Rápida para Principiantes</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Aprende qué es Kasa AutoBox Cloud y cómo poner en marcha tu primer entorno en 30 segundos.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-100">¿Qué problema resuelve esta herramienta?</h4>
              <p>
                En empresas de software automotriz (como talleres mecánicos, redes de concesionarios y telemática de flotas estilo <em>Kasa-service</em>), levantar un ambiente de pruebas en AWS y olvidarlo encendido cuesta cientos de dólares al mes.
              </p>
              <p>
                <strong>Kasa AutoBox Cloud</strong> te permite crear entornos de prueba desechables (<em>sandboxes efímeros</em>). Cada entorno tiene un <strong>reloj de vida (TTL)</strong> predeterminado. Cuando el reloj llega a cero, el contenedor se apaga solo y se guarda comprimido en el historial, garantizando <strong>cero recursos zombi y cero gastos fantasmas</strong>.
              </p>
            </div>

            <div className="p-4 rounded bg-surface-inset border border-surface-border space-y-2">
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Paso a Paso: Crear un Entorno</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Elige el Stack Automotriz:</strong> Selecciona entre API de Recepción de Taller, Gateway de Telemática OBD-II o Simulador de Fallas ECU.</li>
                <li><strong>Vincula el Automóvil (VIN):</strong> Escoge uno de los 9 modelos disponibles (Toyota Hilux, Ford Ranger, Tesla, Audi, etc.).</li>
                <li><strong>Define el Tiempo de Vida (TTL):</strong> Escoge entre 15 min, 30 min, 1 hora o 2 horas.</li>
                <li><strong>Pulsa "Provision Sandbox":</strong> Tu contenedor se desplegará de inmediato en AWS ECS Fargate (o en el simulador local) con su propio puerto y endpoint.</li>
              </ol>
            </div>

            <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Prevención de Duplicados en Vivo</span>
              </span>
              <p className="text-[11px] text-amber-200/90">
                Si intentas crear un sandbox para un vehículo que ya está activo, el sistema te mostrará una alerta con doble confirmación para que elijas entre <strong>reiniciar la cuenta regresiva</strong> del existente, <strong>enfocarte en él</strong> o <strong>duplicar intencionalmente</strong>.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: STS CREDENTIALS */}
        {activeSection === 'sts' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-nominal" />
                <span>2. Credenciales Temporales AWS STS y Conexión Externa</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Cómo autenticarte de forma segura contra el entorno usando tokens de sesión de corta duración.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                Por seguridad (principio de mínimo privilegio), ningún entorno expone claves permanentes de AWS. En su lugar, el sistema genera credenciales temporales mediante <strong>AWS STS AssumeRole</strong> que mueren al mismo tiempo que el sandbox.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Variables emitidas por cada sandbox:</h4>
              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1 font-mono text-[11px]">
                <p><code className="text-cyan-400">AWS_ACCESS_KEY_ID</code>: Clave de acceso temporal (prefijo ASIAR...)</p>
                <p><code className="text-cyan-400">AWS_SECRET_ACCESS_KEY</code>: Clave secreta criptográfica</p>
                <p><code className="text-cyan-400">AWS_SESSION_TOKEN</code>: Token de sesión obligatorio para STS</p>
                <p><code className="text-cyan-400">KASA_SERVICE_URL</code>: URL directa hacia el contenedor</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Cómo probar el endpoint desde tu terminal:</h4>
              <pre className="p-3 rounded bg-surface-inset border border-surface-border text-[11px] text-slate-300 overflow-x-auto">
{`# 1. Copia el snippet "bash export" desde el botón "STS Token"
export AWS_ACCESS_KEY_ID="ASIAR928BKAOTEMP..."
export AWS_SECRET_ACCESS_KEY="qZ8y7K+v..."
export AWS_SESSION_TOKEN="IQoJb3JpZ2luX2Vj..."

# 2. Realiza una petición HTTP al servicio del taller
curl -X GET $KASA_SERVICE_URL/health`}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 3: DIAGNOSTICS */}
        {activeSection === 'diagnostics' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                <span>3. Diagnóstico Automotriz OBD-II y Bus CAN</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Significado de los códigos DTC precargados y simulación de telemetría vehicular.
              </p>
            </div>

            <p>
              El banco de pruebas integrado permite transmitir eventos en tiempo real al microservicio en ejecución para verificar cómo reacciona tu software:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="text-amber-400 font-bold">P0420 — Catalizador</span>
                <p className="text-[11px] text-slate-400">
                  Eficiencia del convertidor catalítico por debajo del umbral. Provoca encendido inmediato del Check Engine (MIL).
                </p>
              </div>
              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="text-red-400 font-bold">P0300 — Misfire Múltiple</span>
                <p className="text-[11px] text-slate-400">
                  Fallo aleatorio de encendido en cilindros. Simula pérdida de potencia y vibraciones del motor.
                </p>
              </div>
              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="text-amber-400 font-bold">P0171 — Mezcla Pobre</span>
                <p className="text-[11px] text-slate-400">
                  Demasiado aire y poco combustible detectado por la sonda Lambda en Banco 1.
                </p>
              </div>
              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="text-red-400 font-bold">P0217 — Sobrecalentamiento</span>
                <p className="text-[11px] text-slate-400">
                  Temperatura de refrigerante fuera de rango operativo crítico (&gt;110°C).
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
              <span className="font-semibold text-slate-200">Simulador de Conducción CAN-Bus:</span>
              <p className="text-[11px] text-slate-400">
                Al mover las barras de RPM y Velocidad y pulsar <em>"Broadcast CAN Frame"</em>, se emite una trama estandarizada OBD-II (PID 0x0C y 0x0D) que aparecerá de inmediato en los logs de CloudWatch.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 4: ARCHIVE */}
        {activeSection === 'archive' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-cyan-400" />
                <span>4. Bóveda en Frío e Historial (Almacenamiento Comprimido)</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Cómo se archivan los entornos caducados para no saturar la bahía principal.
              </p>
            </div>

            <p>
              A diferencia de plataformas convencionales donde las instancias apagadas se acumulan y ensucian la lista, en Kasa AutoBox:
            </p>

            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>Los entornos terminados o caducados se <strong>retiran de la bahía operativa inmediatamente</strong>.</li>
              <li>El estado final (DTCs registrados, telemetría y métricas) se comprime en formato <strong>JSON comprimido (GZIP)</strong> en una tabla fría de DynamoDB / S3 Glacier.</li>
              <li>Dispones de <strong>3 filtros temporales</strong>: <em>Menos de 1 semana</em>, <em>Menos de 1 mes</em> y <em>Menos de 1 año</em>.</li>
              <li>Puedes pulsar <strong>"Relanzar"</strong> en cualquier momento para volver a levantar ese mismo automóvil con la misma configuración.</li>
            </ul>
          </div>
        )}

        {/* SECTION 5: ARCHITECTURE & MAINTENANCE */}
        {activeSection === 'architecture' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <span>5. Arquitectura y Mantenimiento de Infraestructura AWS</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Guía técnica para administradores de sistemas y DevOps que gestionen la cuenta de AWS.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Componentes de AWS utilizados:</h4>
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded bg-surface-inset border border-surface-border">
                  <strong className="text-white">Amazon ECS (Fargate Spot):</strong> Ejecuta los contenedores sin servidores EC2 dedicados. Usa Fargate Spot para un ahorro adicional del 70% en cómputo.
                </div>
                <div className="p-2.5 rounded bg-surface-inset border border-surface-border">
                  <strong className="text-white">Amazon DynamoDB (TTL):</strong> Guarda el ID del sandbox y la fecha límite en formato epoch (<code className="text-amber-400">expiresAtEpoch</code>). DynamoDB borra el registro automáticamente sin costo de lectura/escritura.
                </div>
                <div className="p-2.5 rounded bg-surface-inset border border-surface-border">
                  <strong className="text-white">AWS EventBridge Scheduler:</strong> Se dispara cada 5 minutos e invoca una función Lambda reaper que revisa tareas ECS huérfanas y las termina forzosamente si excedieron el tiempo.
                </div>
                <div className="p-2.5 rounded bg-surface-inset border border-surface-border">
                  <strong className="text-white">Amazon CloudWatch Logs:</strong> Almacena las salidas estándar (<code className="text-slate-300">stdout/stderr</code>) en el log group <code className="text-slate-300">/ecs/kasa-autobox-sandboxes</code> con retención de 7 días.
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Despliegue con Terraform:</h4>
              <pre className="p-2.5 rounded bg-ground border border-surface-border text-[11px] text-slate-300 overflow-x-auto">
{`# 1. Navegar a la carpeta terraform
cd terraform

# 2. Inicializar proveedores de AWS
terraform init

# 3. Planificar y aplicar infraestructura
terraform apply`}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 6: TROUBLESHOOTING */}
        {activeSection === 'troubleshooting' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-surface-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>6. Preguntas Frecuentes y Solución de Problemas (Troubleshooting)</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Respuestas directas a las dudas y situaciones más comunes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="font-bold text-slate-100">¿Qué pasa si necesito más tiempo antes de que expire el sandbox?</span>
                <p className="text-slate-400 text-[11px]">
                  En la tarjeta del sandbox activo, haz clic en el botón <strong>"+30m"</strong>. El sistema recalculará la expiración y renovará automáticamente la validez de las credenciales STS.
                </p>
              </div>

              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="font-bold text-slate-100">¿Por qué no puedo crear 2 entornos para el mismo VIN?</span>
                <p className="text-slate-400 text-[11px]">
                  Para evitar colisiones de telemetría y puertos en uso. Si necesitas probar dos cosas a la vez para el mismo auto, selecciona <em>"Duplicar de todos modos"</em> en la modal de confirmación.
                </p>
              </div>

              <div className="p-3 rounded bg-surface-inset border border-surface-border space-y-1">
                <span className="font-bold text-slate-100">¿Cómo cambio entre el Modo Simulado (Local) y AWS Real?</span>
                <p className="text-slate-400 text-[11px]">
                  En la barra superior hay un interruptor táctico. Haz clic en <strong>"Live AWS"</strong> para conectar tu cuenta real de AWS o en <strong>"Mock Engine"</strong> para pruebas locales con costo cero.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
