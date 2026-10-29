import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Apple,
  Download,
  Info,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const SettingsScreen: React.FC = () => {
  const {
    audioEnabled,
    setAudioEnabled,
    isMobileFrame,
    setIsMobileFrame,
    resetProgress,
  } = useGame();

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Ajustes y Configuración del Laboratorio
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Opciones de audio procedural, compatibilidad multiplataforma (Android & iOS) y gestión de datos.
        </p>
      </div>

      {/* Audio & Visual Experience */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">Experiencia y Rendimiento</h3>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-semibold text-xs text-white">Efectos de Sonido Procedurales</div>
              <div className="text-[11px] text-slate-400">
                Sintetizador Web Audio API de laboratorio (burbujas, llamas, choques de cristalería).
              </div>
            </div>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              audioEnabled
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {audioEnabled ? 'Activado' : 'Silenciado'}
          </button>
        </div>

        {/* Frame Mode Toggle (Mobile Simulator vs Desktop) */}
        <div className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
              {isMobileFrame ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-semibold text-xs text-white">Modo Simulador Móvil (Android / iOS)</div>
              <div className="text-[11px] text-slate-400">
                Enmarca la aplicación con relación de aspecto de smartphone para probar controles táctiles.
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isMobileFrame
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isMobileFrame ? 'Marco Activo' : 'Pantalla Completa'}
          </button>
        </div>
      </div>

      {/* Cross-Platform Android & iOS Installation Guide */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Instalación en Dispositivos Móviles (Android e iOS)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Alquimia Imposible</strong> está optimizado con arquitectura web de alto rendimiento y diseño táctil adaptativo que se ejecuta a 60 fps en cualquier pantalla. Puedes instalarlo como aplicación independiente en tu teléfono o tableta:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Android Guide */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Smartphone className="w-4 h-4" />
              Android (Google Chrome / Samsung Internet)
            </div>
            <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Abre el menú de <strong>tres puntos (⋮)</strong> en el navegador.</li>
              <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla principal"</strong>.</li>
              <li>El juego se ejecutará en pantalla completa con rendimiento nativo.</li>
            </ol>
          </div>

          {/* iOS Guide */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <Apple className="w-4 h-4" />
              iOS / iPhone / iPad (Safari)
            </div>
            <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Pulsa el botón <strong>Compartir</strong> (<span className="font-mono">⎋</span>) en la barra inferior de Safari.</li>
              <li>Desliza hacia abajo y pulsa <strong>"Añadir a pantalla de inicio"</strong>.</li>
              <li>¡Listo! El juego se abre con icono propio y sin barras del navegador.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Reset Progress Section */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-semibold text-white">Almacenamiento y Progreso</h3>
        <p className="text-xs text-slate-400">
          Tu progreso se guarda automáticamente en la memoria local de tu dispositivo. Si deseas reiniciar tus descubrimientos para volver a jugar desde cero:
        </p>

        {confirmReset ? (
          <div className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              ¿Confirmas que deseas borrar todos los descubrimientos y reiniciar tu nivel?
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
              >
                Confirmar Reinicio
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar Partida y Descubrimientos
          </button>
        )}

        {resetDone && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Progreso reiniciado con éxito. Comienzas con los 10 reactivos elementales.
          </div>
        )}
      </div>

      {/* Curriculum Credit */}
      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Estándares Científicos:</strong> Diseñado de acuerdo con el currículo de química general de grado 10.º. Todas las reacciones, nomenclaturas IUPAC, fórmulas balanceadas y tipos de enlace corresponden a principios químicos auténticos verificados.
        </div>
      </div>
    </div>
  );
};
