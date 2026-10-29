import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Sparkles,
  HelpCircle,
  FlaskRound as Flask,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MISSIONS, Mission } from '../../data/missionsData';
import { SUBSTANCES } from '../../data/chemistryData';

export const MissionsScreen: React.FC = () => {
  const { completedMissionIds, jumpToLabWithMission, activeMissionId } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Básico' | 'Intermedio' | 'Avanzado'>('all');
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const toggleHint = (missionId: string) => {
    setRevealedHints((prev) => ({
      ...prev,
      [missionId]: !prev[missionId],
    }));
  };

  const filteredMissions = MISSIONS.filter((m) => {
    if (selectedDifficulty !== 'all' && m.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const completedCount = completedMissionIds.length;
  const totalCount = MISSIONS.length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Misiones y Desafíos del Laboratorio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Resuelve problemas reales combinando conocimientos químicos de 10.º grado.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400">
            Misiones Completadas:{' '}
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {completedCount}
            </span>{' '}
            / {totalCount}
          </div>
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setSelectedDifficulty('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedDifficulty === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Todas ({MISSIONS.length})
        </button>
        <button
          onClick={() => setSelectedDifficulty('Básico')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedDifficulty === 'Básico'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Básicas
        </button>
        <button
          onClick={() => setSelectedDifficulty('Intermedio')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedDifficulty === 'Intermedio'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Intermedias
        </button>
        <button
          onClick={() => setSelectedDifficulty('Avanzado')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedDifficulty === 'Avanzado'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Avanzadas
        </button>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isCompleted = completedMissionIds.includes(mission.id);
          const isActive = activeMissionId === mission.id;
          const hintOpen = revealedHints[mission.id];

          return (
            <div
              key={mission.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-slate-900/50 border-emerald-500/30'
                  : isActive
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        Misión 0{mission.order}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {mission.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                          mission.difficulty === 'Básico'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : mission.difficulty === 'Intermedio'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {mission.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white mt-1.5 flex items-center gap-2">
                      {mission.title}
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      +{mission.rewardXp} XP
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Título: {mission.rewardTitle}
                    </span>
                  </div>
                </div>

                {/* Story Context */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {mission.storyPrompt}
                </p>

                {/* Objective */}
                <div className="text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
                    Objetivo Químico:
                  </span>
                  <p className="text-slate-200 font-medium">
                    {mission.chemicalObjective}
                  </p>
                </div>

                {/* Educational concept note */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="font-medium text-slate-300">Concepto clave:</span>
                  <span>{mission.educationalConcept}</span>
                </div>

                {/* Hint toggle */}
                {hintOpen && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200">
                    <span className="font-semibold text-amber-300">Pista:</span> {mission.hint}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleHint(mission.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {hintOpen ? 'Ocultar Pista' : 'Ver Pista'}
                </button>

                {isCompleted ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Completada
                  </span>
                ) : (
                  <button
                    onClick={() => jumpToLabWithMission(mission.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Flask className="w-3.5 h-3.5" />
                    Ir al Laboratorio
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
