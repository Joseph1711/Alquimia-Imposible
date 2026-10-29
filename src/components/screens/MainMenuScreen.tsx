import React, { useEffect } from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SUBSTANCES } from '../../data/chemistryData';
import { MISSIONS } from '../../data/missionsData';

export const MainMenuScreen: React.FC = () => {
  const {
    setCurrentScreen,
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

      {/* Hero Title & Identity Lockup */}
      <div className="relative z-10 px-6 md:px-12 py-8 max-w-2xl space-y-4">
        {/* Alchemy Insignia */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium tracking-wide shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Química Experimental Interactiva · 10.º Grado</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
          ALQUIMIA <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">IMPOSIBLE</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl text-balance">
          Sé el alquimista moderno: combina sustancias reales en tu laboratorio interactivo, domina enlaces químicos, resuelve misiones críticas y desbloquea los secretos de la materia.
        </p>

        {/* Start Game Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <motion.button
            onClick={() => setCurrentScreen('lab')}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-colors flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 group"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{experimentCount > 0 ? 'Continuar en el Laboratorio' : 'Entrar al Laboratorio'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <span className="text-[11px] text-slate-400 text-center sm:text-left font-mono">
            Presiona <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Enter</kbd> o pulsa para comenzar
          </span>
        </div>
      </div>

      {/* Screen Selection Grid */}
      <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-[#060911] via-[#060911]/90 to-transparent border-t border-slate-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.button
            onClick={() => setCurrentScreen('lab')}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-emerald-500/50 text-left transition-colors group"
          >
            <FlaskConical className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-white">Laboratorio</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mesa y crisol</div>
          </motion.button>

          <motion.button
            onClick={() => setCurrentScreen('recipes')}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-amber-500/50 text-left transition-colors group"
          >
            <BookMarked className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-white">Recetario</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fórmulas & Explosiones</div>
          </motion.button>

          <motion.button
            onClick={() => setCurrentScreen('catalog')}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-cyan-500/50 text-left transition-colors group"
          >
            <BookOpen className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-white">Catálogo</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{discoveredCount} descubiertas</div>
          </motion.button>

          <motion.button
            onClick={() => setCurrentScreen('missions')}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-amber-500/50 text-left transition-colors group"
          >
            <Target className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-white">Misiones</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{totalMissions - completedMissionsCount} pendientes</div>
          </motion.button>

          <motion.button
            onClick={() => setCurrentScreen('periodic')}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-purple-500/50 text-left transition-colors group"
          >
            <Atom className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-white">Tabla 118</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Elementos & Enlaces</div>
          </motion.button>

          <motion.button
            onClick={() => setCurrentScreen('progress')}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-yellow-500/50 text-left transition-colors group"
          >
            <Award className="w-5 h-5 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-white">Progreso</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rango y logros</div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
