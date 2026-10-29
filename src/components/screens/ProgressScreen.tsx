import React from 'react';
import {
  Award,
  FlaskConical,
  Flame,
  Zap,
  Activity,
  ShieldCheck,
  Atom,
  BookOpen,
  CheckCircle2,
  Crown,
  Lock,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SUBSTANCES } from '../../data/chemistryData';
import { MISSIONS } from '../../data/missionsData';

const ICON_MAP: Record<string, React.ElementType> = {
  FlaskConical,
  Flame,
  Zap,
  Activity,
  ShieldCheck,
  Atom,
  BookOpen,
  Award,
  CheckCircle2,
  Crown,
};

export const ProgressScreen: React.FC = () => {
  const {
    xp,
    level,
    alchemistRank,
    xpToNextLevel,
    xpCurrentLevelProgress,
    unlockedSubstanceIds,
    completedMissionIds,
    achievements,
    experimentCount,
    successfulReactionsCount,
  } = useGame();

  const totalSubstances = Object.keys(SUBSTANCES).length;
  const discoveredCount = unlockedSubstanceIds.length;
  const totalMissions = MISSIONS.length;
  const completedMissionsCount = completedMissionIds.length;

  const successRate = experimentCount > 0 ? Math.round((successfulReactionsCount / experimentCount) * 100) : 0;
  const progressRatio = Math.min(100, Math.round((xpCurrentLevelProgress / xpToNextLevel) * 100));

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Alchemist Profile Card */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src="/src/assets/images/lab_alchemist_avatar_1793212049070.jpg"
            alt="Alquimista"
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-bold font-mono px-2 py-0.5 rounded-md shadow-md">
            NVL {level}
          </div>
        </div>

        {/* Identity & Rank Details */}
        <div className="flex-1 w-full space-y-3 text-center md:text-left">
          <div>
            <div className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
              Rango de Alquimista
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {alchemistRank}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Laboratorio de Investigación Química Experimental · Nivel {level} de 5
            </p>
          </div>

          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>Experiencia: <strong className="text-emerald-400">{xp} XP</strong></span>
              <span>
                {xpCurrentLevelProgress} / {xpToNextLevel} XP ({progressRatio}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Laboratory Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400">Descubrimientos</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {discoveredCount} <span className="text-xs font-normal text-slate-500">/ {totalSubstances}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            {Math.round((discoveredCount / totalSubstances) * 100)}% del catálogo
          </div>
        </div>

        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400">Experimentos Totales</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {experimentCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {successfulReactionsCount} exitosos
          </div>
        </div>

        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400">Tasa de Éxito</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {successRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Precisión química
          </div>
        </div>

        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="text-xs text-slate-400">Misiones Resueltas</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {completedMissionsCount} <span className="text-xs font-normal text-slate-500">/ {totalMissions}</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-mono">
            {Math.round((completedMissionsCount / totalMissions) * 100)}% completadas
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Logros del Alquimista</h3>
            <p className="text-xs text-slate-400">
              Desbloquea insignias dominando las leyes químicas y completando retos.
            </p>
          </div>
          <div className="font-mono text-xs text-emerald-400 font-bold">
            {unlockedAchievementsCount} / {achievements.length} Desbloqueados
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => {
            const Icon = ICON_MAP[ach.iconName] || Award;
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition-all ${
                  ach.unlocked
                    ? 'bg-slate-900/80 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ach.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">
                      {ach.title}
                    </span>
                    {ach.unlocked && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        Completado
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
