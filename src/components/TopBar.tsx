import React from 'react';
import { Settings, Sparkles, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const TopBar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    audioEnabled,
    setAudioEnabled,
    isMobileFrame,
    setIsMobileFrame,
    level,
    xp,
  } = useGame();

  return (
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#060911]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => setCurrentScreen('menu')}
        className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
        <span>Alquimia Imposible</span>
      </button>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
        <button
          onClick={() => setCurrentScreen('lab')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentScreen === 'lab' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Laboratorio
        </button>
        <button
          onClick={() => setCurrentScreen('recipes')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentScreen === 'recipes' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Recetario
        </button>
        <button
          onClick={() => setCurrentScreen('catalog')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentScreen === 'catalog' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setCurrentScreen('missions')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentScreen === 'missions' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Misiones
        </button>
        <button
          onClick={() => setCurrentScreen('periodic')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentScreen === 'periodic' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Tabla & Enlaces
        </button>
        <button
          onClick={() => setCurrentScreen('progress')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentScreen === 'progress' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Progreso
        </button>
      </nav>

      {/* Zone 3: 1 primary action cluster */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Silenciar audio' : 'Activar audio'}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title={isMobileFrame ? 'Salir de vista móvil' : 'Simular móvil (Android / iOS)'}
          className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
        >
          {isMobileFrame ? <Monitor className="w-4 h-4 text-cyan-400" /> : <Smartphone className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setCurrentScreen('settings')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentScreen === 'settings'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ajustes</span>
        </button>
      </div>
    </header>
  );
};
