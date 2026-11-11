import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Sparkles,
  HelpCircle,
  FlaskRound as Flask,
  Search,
  BookOpen,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MISSIONS, MODULE_NAMES, Mission } from '../../data/missionsData';

export const MissionsScreen: React.FC = () => {
  const { completedMissionIds, jumpToLabWithMission, activeMissionId, openTutorial } = useGame();
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Básico' | 'Intermedio' | 'Avanzado'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const toggleHint = (missionId: string) => {
    setRevealedHints((prev) => ({
      ...prev,
      [missionId]: !prev[missionId],
    }));
  };

  const filteredMissions = useMemo(() => {
    return MISSIONS.filter((m) => {
      if (selectedModule !== 'all' && m.moduleId !== selectedModule) return false;
      if (selectedDifficulty !== 'all' && m.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(query);
        const matchObjective = m.chemicalObjective.toLowerCase().includes(query);
        const matchConcept = m.educationalConcept.toLowerCase().includes(query);
        const matchOrder = m.order.toString().includes(query);
        if (!matchTitle && !matchObjective && !matchConcept && !matchOrder) return false;
      }
      return true;
    });
  }, [selectedModule, selectedDifficulty, searchQuery]);

  const totalCount = MISSIONS.length;
  const totalCompleted = completedMissionIds.length;
  const overallPercentage = Math.round((totalCompleted / totalCount) * 100);

  // Module stats
  const moduleStats = useMemo(() => {
    const stats: Record<number, { total: number; completed: number; xp: number }> = {};
    for (let i = 1; i <= 5; i++) {
      const moduleMissions = MISSIONS.filter((m) => m.moduleId === i);
      const completed = moduleMissions.filter((m) => completedMissionIds.includes(m.id)).length;
      const totalXp = moduleMissions.reduce((acc, m) => acc + m.rewardXp, 0);
      stats[i] = {
        total: moduleMissions.length,
        completed,
        xp: totalXp,
      };
    }
    return stats;
  }, [completedMissionIds]);

  return (
    <div className="space-y-6">
      {/* Top Banner with 100 Missions Overview */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100 Misiones Educativas de 10.º Grado
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                Tamara Villada Valencia & Adriana Isabel Martinez
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Desafíos Experimentales del Laboratorio
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Resuelve problemas químicos reales aplicando estequiometría, tipos de enlace, termodinámica y síntesis mineral. Completa cada módulo para obtener títulos científicos y logros.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openTutorial}
              className="px-3 py-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-all shadow-sm hover:shadow-emerald-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tutorial de Mezclas</span>
            </button>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Progreso General
              </div>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="font-mono text-emerald-400 font-bold text-lg">
                  {totalCompleted}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
                <span className="text-[11px] font-bold text-emerald-500 ml-1">
                  ({overallPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module Selector Cards (5 Modules) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setSelectedModule('all')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
            selectedModule === 'all'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
              : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">General</div>
            <div className="font-bold text-xs text-white mt-0.5">Todas</div>
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400 font-semibold">
            {totalCompleted} / 100
          </div>
        </button>

        {[1, 2, 3, 4, 5].map((mId) => {
          const stats = moduleStats[mId];
          const isSelected = selectedModule === mId;
          const shortNames = [
            '',
            'M1: Fundamentos',
            'M2: Óxidos y Bases',
            'M3: Ácidos y Sales',
            'M4: Redox y Metales',
            'M5: Alquimia Extrema',
          ];
          const isModuleDone = stats.completed === stats.total;

          return (
            <button
              key={mId}
              onClick={() => setSelectedModule(mId)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                  : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
              }`}
            >
              {isModuleDone && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
              <div>
                <div className="text-[10px] font-mono font-semibold text-slate-400">
                  Módulo 0{mId} (20)
                </div>
                <div className="font-bold text-xs text-white mt-0.5 truncate" title={MODULE_NAMES[mId]}>
                  {shortNames[mId]}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[11px] font-mono font-bold ${isModuleDone ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {stats.completed}/{stats.total}
                </span>
                <span className="text-[10px] text-slate-500">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b101d] border border-slate-800 p-3 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, compuesto objetivo o concepto..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          {(['all', 'Básico', 'Intermedio', 'Avanzado'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff === 'all' ? 'Dificultad: Todas' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Module Info Header if a specific module is selected */}
      {selectedModule !== 'all' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-emerald-400">
              {MODULE_NAMES[selectedModule]}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Misiones {((selectedModule as number) - 1) * 20 + 1} a {(selectedModule as number) * 20} · Recompensa acumulada: {moduleStats[selectedModule as number].xp} XP
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Progreso del Módulo:</span>
            <span className="font-mono text-white font-bold">
              {moduleStats[selectedModule as number].completed} de 20 completadas
            </span>
          </div>
        </div>
      )}

      {/* Missions Grid */}
      {filteredMissions.length === 0 ? (
        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Layers className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="font-semibold text-sm text-slate-300">No se encontraron misiones</p>
          <p className="text-xs text-slate-500 mt-1">Prueba cambiando los filtros de búsqueda o módulo.</p>
        </div>
      ) : (
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
                    ? 'bg-slate-900/40 border-emerald-500/30 shadow-sm'
                    : isActive
                    ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          #{mission.order}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                          Módulo {mission.moduleId}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
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
                        {mission.rewardTitle}
                      </span>
                    </div>
                  </div>

                  {/* Story Context */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {mission.storyPrompt}
                  </p>

                  {/* Objective */}
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                      Objetivo Químico:
                    </span>
                    <p className="text-slate-200 font-medium">
                      {mission.chemicalObjective}
                    </p>
                  </div>

                  {/* Educational concept note */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="font-medium text-slate-300">Concepto:</span>
                    <span>{mission.educationalConcept}</span>
                  </div>

                  {/* Hint toggle */}
                  {hintOpen && (
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200 animate-fadeIn">
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
      )}
    </div>
  );
};
