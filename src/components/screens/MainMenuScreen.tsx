import React, { useEffect } from 'react';
import {
  FlaskConical,
  BookOpen,
  BookMarked,
  Target,
  Atom,
  Award,
  Settings,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SUBSTANCES } from '../../data/chemistryData';
import { MISSIONS } from '../../data/missionsData';

export const MainMenuScreen: React.FC = () => {
  const {
    setCurrentScreen,
    openTutorial,
    xp,
    level,
    alchemistRank,
    unlockedSubstanceIds,
    completedMissionIds,
    experimentCount,
  } = useGame();

  const totalSubstances = Object.keys(SUBSTANCES).length;
  const discoveredCount = unlockedSubstanceIds.length;
  const totalMissions = MISSIONS.length;
  const completedMissionsCount = completedMissionIds.length;

  // Keyboard shortcut listener: Enter or Space to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCurrentScreen('lab');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentScreen]);

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Cinematic Background Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_alchemy_lab_1793212048776.jpg"
          alt="Laboratorio de Alquimia Imposible"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] saturate-[1.15] scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/70 to-[#060911]/30" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#060911]/50 to-[#060911]" />
      </div>

      {/* Top Banner Status Cluster */}
      <div className="relative z-10 p-6 md:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-2xl shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs">
            {level}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              {alchemistRank}
            </div>
            <div className="text-xs font-mono text-slate-300">
              <span className="text-white font-bold">{xp}</span> XP acumulados
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-2xl text-xs font-mono text-slate-300">
          <span>Descubrimientos: <strong className="text-emerald-400">{discoveredCount}</strong>/{totalSubstances}</span>
          <span className="text-slate-600">·</span>
          <span>Misiones: <strong className="text-cyan-400">{completedMissionsCount}</strong>/{totalMissions}</span>
        </div>
      </div>

      {/* Hero Title & Identity Lockup with Creators Feature */}
      <div className="relative z-10 px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Title, Authorship, CTA */}
        <div className="lg:col-span-7 space-y-4">
          {/* Alchemy Insignia & Authors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Química Experimental Interactiva · 10.º Grado</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <span>Por Tamara Villada Valencia & Adriana Isabel Martinez</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            ALQUIMIA <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">IMPOSIBLE</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl text-balance">
            Laboratorio visual interactivo creado por <strong className="text-emerald-300">Tamara Villada Valencia</strong> y <strong className="text-cyan-300">Adriana Isabel Martinez</strong>. Experimenta con 118 elementos y sustancias químicas reales mediante simulaciones visuales, 3D y reacciones auténticas.
          </p>

          {/* Start Game Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setCurrentScreen('lab')}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-[0.98] group"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{experimentCount > 0 ? 'Continuar en el Laboratorio' : 'Entrar al Laboratorio'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={openTutorial}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-emerald-300 hover:text-emerald-200 bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/40 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Tutorial Visual</span>
            </button>

            <span className="text-[11px] text-slate-400 text-center sm:text-left font-mono sm:ml-2">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Enter</kbd> para iniciar
            </span>
          </div>
        </div>

        {/* Right Column: Visual Researchers Showcase Card with Creators Portrait */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden group">
            {/* Visual Header Image of the Researchers Duo */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-800/80">
              <img
                src="/src/assets/images/alchemist_creators_duo_1794361242094.jpg"
                alt="Tamara Villada Valencia y Adriana Isabel Martinez en el Laboratorio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono">
                    Investigadoras Creadoras
                  </div>
                  <div className="font-bold text-sm sm:text-base text-white">
                    Tamara Villada Valencia & Adriana Isabel Martinez
                  </div>
                </div>
                <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-lg">
                  Lab 10.º Grado
                </div>
              </div>
            </div>

            {/* Quick Visual Highlights replacing plain text */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <button
                onClick={() => setCurrentScreen('bondlab')}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col items-center gap-1 group/btn"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-200">Enlaces 3D</span>
              </button>

              <button
                onClick={() => setCurrentScreen('recipes')}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/50 transition-all flex flex-col items-center gap-1 group/btn"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <BookMarked className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-200">Reacciones</span>
              </button>

              <button
                onClick={() => setCurrentScreen('catalog')}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col items-center gap-1 group/btn"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-200">Bóveda Visual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Selection Grid: Highly visual cards with icons and distinct color themes */}
      <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-[#060911] via-[#060911]/95 to-transparent border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] font-mono">
            Módulos del Laboratorio Químico
          </span>
          <span className="text-[11px] text-emerald-400">
            {discoveredCount} sustancias · 118 elementos listos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <button
            onClick={() => setCurrentScreen('lab')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-emerald-950/20 hover:from-slate-850 hover:to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">Laboratorio</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mesa & Crisol</div>
          </button>

          <button
            onClick={() => setCurrentScreen('bondlab')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-cyan-950/20 hover:from-slate-850 hover:to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">Taller Enlaces</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Examen 3D</div>
          </button>

          <button
            onClick={() => setCurrentScreen('recipes')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-amber-950/20 hover:from-slate-850 hover:to-amber-950/40 border border-amber-500/30 hover:border-amber-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-110 group-hover:bg-amber-500/30 transition-all shadow-sm">
              <BookMarked className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Recetario</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fórmulas & Fuego</div>
          </button>

          <button
            onClick={() => setCurrentScreen('catalog')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-teal-950/20 hover:from-slate-850 hover:to-teal-950/40 border border-teal-500/30 hover:border-teal-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-2.5 group-hover:scale-110 group-hover:bg-teal-500/30 transition-all shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors">Catálogo</div>
            <div className="text-[10px] text-teal-400 font-mono mt-0.5">{discoveredCount} descubiertas</div>
          </button>

          <button
            onClick={() => setCurrentScreen('missions')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-rose-950/20 hover:from-slate-850 hover:to-rose-950/40 border border-rose-500/30 hover:border-rose-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2.5 group-hover:scale-110 group-hover:bg-rose-500/30 transition-all shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-rose-300 transition-colors">Misiones</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{totalMissions - completedMissionsCount} por hacer</div>
          </button>

          <button
            onClick={() => setCurrentScreen('periodic')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/20 hover:from-slate-850 hover:to-purple-950/40 border border-purple-500/30 hover:border-purple-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-2.5 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all shadow-sm">
              <Atom className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">Tabla 118</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Átomos & Capas</div>
          </button>

          <button
            onClick={() => setCurrentScreen('progress')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-yellow-950/20 hover:from-slate-850 hover:to-yellow-950/40 border border-yellow-500/30 hover:border-yellow-400/70 text-left transition-all group active:scale-[0.98] shadow-lg relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-2.5 group-hover:scale-110 group-hover:bg-yellow-500/30 transition-all shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-white group-hover:text-yellow-300 transition-colors">Progreso</div>
            <div className="text-[10px] text-yellow-400 font-mono mt-0.5">{alchemistRank}</div>
          </button>
        </div>
      </div>
    </div>
  );
};
