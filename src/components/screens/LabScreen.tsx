import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Zap,
  Sparkles,
  Trash2,
  Thermometer,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  HelpCircle,
  FlaskRound as Flask,
  Gauge,
  Atom,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SUBSTANCES, Substance } from '../../data/chemistryData';
import { ELEMENTS_118, ChemicalElement } from '../../data/elements118';
import {
  TemperatureLevel,
  PressureLevel,
  CatalystType,
  ElectricalState,
  ConcentrationLevel,
} from '../../data/reactionsEngine';
import { MISSIONS } from '../../data/missionsData';
import { LabCanvas } from '../LabCanvas';

export const LabScreen: React.FC = () => {
  const {
    selectedReactants,
    conditions,
    setTemperature,
    setPressure,
    setCatalyst,
    setElectricity,
    setConcentration,
    selectedVessel,
    setSelectedVessel,
    addReactant,
    removeReactant,
    clearVessel,
    isExperimentRunning,
    isExploding,
    executeExperiment,
    unlockedSubstanceIds,
    activeMissionId,
    setActiveMissionId,
    setCurrentScreen,
  } = useGame();

  const [shelfTab, setShelfTab] = useState<'compounds' | 'elements'>('compounds');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'gas' | 'líquido' | 'sólido'>('all');
  const [showConditionGuide, setShowConditionGuide] = useState(false);

  // Active mission details
  const activeMission = MISSIONS.find((m) => m.id === activeMissionId);

  // Unlocked substances list
  const availableSubstances = unlockedSubstanceIds
    .map((id) => SUBSTANCES[id])
    .filter((s): s is Substance => Boolean(s))
    .filter((s) => {
      if (filterState !== 'all' && s.state !== filterState) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.formula.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });

  // 118 Elements filtered
  const availableElements = ELEMENTS_118.filter((el) => {
    if (filterState !== 'all' && el.state !== filterState) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        el.number.toString() === q ||
        el.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Current Temperature Readout
  const tempLabels: Record<TemperatureLevel, string> = {
    ambient: '24 °C (Ambiente)',
    moderate: '450 °C (Bunsen)',
    extreme: '950 °C (Calcinación)',
  };

  // Helper to get name and formula of selected reactants
  const getReactantDisplay = (id: string) => {
    const el = ELEMENTS_118.find((e) => e.symbol === id);
    if (el) return { symbol: el.symbol, name: el.name, color: el.color };
    const sub = SUBSTANCES[id];
    if (sub) return { symbol: sub.formula, name: sub.name, color: sub.color };
    return { symbol: id, name: id, color: '#38bdf8' };
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Active Mission Banner if selected */}
      {activeMission && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">Misión Activa: {activeMission.title}</span>
            <span className="text-slate-400 hidden sm:inline">· {activeMission.chemicalObjective}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveMissionId(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Descartar
            </button>
            <button
              onClick={() => setCurrentScreen('missions')}
              className="text-emerald-400 hover:underline font-medium"
            >
              Ver Misión
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Workbench (Left/Top) & Reactant Shelf (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left: Interactive Laboratory Bench (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b101d] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative shadow-xl">
          {/* Top Bar: Vessel Selector & Sensors */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            {/* Vessel Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedVessel('erlenmeyer')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedVessel === 'erlenmeyer'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Matraz
              </button>
              <button
                onClick={() => setSelectedVessel('beaker')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedVessel === 'beaker'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vaso
              </button>
              <button
                onClick={() => setSelectedVessel('testtube')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedVessel === 'testtube'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tubo
              </button>
              <button
                onClick={() => setSelectedVessel('crucible')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedVessel === 'crucible'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Crisol
              </button>
            </div>

            {/* Live Telemetry Sensors */}
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span className="tabular-nums text-slate-200">{tempLabels[conditions.temperature]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-purple-400" />
                <span className="tabular-nums text-slate-200">
                  {conditions.pressure === 'high' ? '200 atm' : '1.0 atm'}
                </span>
              </div>
            </div>
          </div>

          {/* Central Experiment Area with Canvas */}
          <div className="relative py-1 flex flex-col items-center justify-center">
            <LabCanvas
              reactants={selectedReactants}
              conditions={conditions}
              vessel={selectedVessel}
              isReacting={isExperimentRunning}
              isExploding={isExploding}
            />

            {/* Selected Reactants In-Vessel Badge Cluster */}
            <div className="w-full max-w-md mt-1">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
                <span>Reactivos en Recipiente ({selectedReactants.length}/4)</span>
                {selectedReactants.length > 0 && (
                  <button
                    onClick={clearVessel}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Vaciar
                  </button>
                )}
              </div>

              <div className="min-h-[46px] p-2 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2 flex-wrap">
                {selectedReactants.length === 0 ? (
                  <span className="text-xs text-slate-500 italic px-2">
                    Selecciona elementos (118) o compuestos para introducirlos al recipiente...
                  </span>
                ) : (
                  <AnimatePresence>
                    {selectedReactants.map((id, index) => {
                      const disp = getReactantDisplay(id);
                      return (
                        <motion.div
                          key={`${id}-${index}`}
                          layout
                          initial={{ scale: 0.65, opacity: 0, y: -4 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.65, opacity: 0 }}
                          whileHover={{ scale: 1.04 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                          className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: disp.color }}
                          />
                          <span className="font-mono font-bold text-white">{disp.symbol}</span>
                          <span className="text-slate-400 hidden sm:inline">{disp.name}</span>
                          <button
                            onClick={() => removeReactant(id)}
                            className="text-slate-400 hover:text-red-400 ml-1 font-bold transition-colors"
                            title="Retirar reactivo"
                          >
                            ×
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* Experimental Variables Control Deck */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Variables Experimentales:
              </span>
              <button
                onClick={() => setShowConditionGuide(!showConditionGuide)}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Guía de Variables
              </button>
            </div>

            {/* Variable Selectors Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {/* Temperature */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Temperatura</label>
                <select
                  value={conditions.temperature}
                  onChange={(e) => setTemperature(e.target.value as TemperatureLevel)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="ambient">25 °C (Ambiente)</option>
                  <option value="moderate">450 °C (Bunsen)</option>
                  <option value="extreme">950 °C (Crisol)</option>
                </select>
              </div>

              {/* Pressure */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Presión</label>
                <select
                  value={conditions.pressure}
                  onChange={(e) => setPressure(e.target.value as PressureLevel)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="standard">1 atm (Estándar)</option>
                  <option value="high">200 atm (Cámara)</option>
                </select>
              </div>

              {/* Catalyst */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Catalizador</label>
                <select
                  value={conditions.catalyst}
                  onChange={(e) => setCatalyst(e.target.value as CatalystType)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="none">Sin catalizador</option>
                  <option value="Pt">Platino (Pt)</option>
                  <option value="Fe">Hierro (Fe)</option>
                  <option value="MnO2">Óxido Mn (MnO₂)</option>
                  <option value="Ni">Níquel (Ni)</option>
                  <option value="V2O5">Vanadio (V₂O₅)</option>
                </select>
              </div>

              {/* Electricity */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Electricidad</label>
                <select
                  value={conditions.electricity}
                  onChange={(e) => setElectricity(e.target.value as ElectricalState)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="none">Desactivada</option>
                  <option value="spark">Chispa / Arco</option>
                  <option value="electrolysis">Electrólisis</option>
                </select>
              </div>

              {/* Concentration */}
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] text-slate-400 block mb-1">Concentración</label>
                <select
                  value={conditions.concentration}
                  onChange={(e) => setConcentration(e.target.value as ConcentrationLevel)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="normal">Normal / Diluido</option>
                  <option value="concentrated">Concentrado</option>
                </select>
              </div>
            </div>

            {/* Condition Guide Popover */}
            {showConditionGuide && (
              <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white">Efectos de las Variables Experimentales:</div>
                <p>• <strong>Temperatura</strong>: Aumenta la energía cinética de las moléculas para superar la energía de activación (Ea). Necesaria para combustión, síntesis de óxidos y calcinación.</p>
                <p>• <strong>Presión</strong>: Según Le Chatelier, desplaza el equilibrio hacia el lado con menor número de moles gaseosos (ej. Haber-Bosch $N_2 + 3H_2 \rightleftharpoons 2NH_3$).</p>
                <p>• <strong>Catalizador</strong>: Provee una ruta de menor energía sin consumirse (ej. MnO₂ en descomposición de agua oxigenada, V₂O₅ en SO₃).</p>
                <p>• <strong>Electricidad</strong>: Aporta electrones directos para electrólisis o luz fotolítica ultravioleta.</p>
              </div>
            )}

            {/* Execute Experiment CTA */}
            <motion.button
              onClick={executeExperiment}
              disabled={selectedReactants.length === 0 || isExperimentRunning}
              whileHover={selectedReactants.length > 0 && !isExperimentRunning ? { scale: 1.015, y: -1 } : {}}
              whileTap={selectedReactants.length > 0 && !isExperimentRunning ? { scale: 0.985 } : {}}
              transition={{ duration: 0.15 }}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedReactants.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                  : isExperimentRunning
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/25 active:scale-[0.99]'
              }`}
            >
              <Flask className="w-4 h-4" />
              {isExperimentRunning ? 'Evaluando Leyes Químicas...' : 'Experimentar Reacción'}
            </motion.button>
          </div>
        </div>

        {/* Right: Dual Reagent Shelf (Compounds & 118 Elements) (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b101d] border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl">
          {/* Header & Tabs */}
          <div className="space-y-3 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-white">Bandeja de Reactivos</h3>
                <p className="text-xs text-slate-400">
                  {shelfTab === 'elements' ? '118 Elementos Químicos' : `${availableSubstances.length} Compuestos Desbloqueados`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('recipes')}
                  className="px-2.5 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg flex items-center gap-1 transition-colors"
                  title="Abrir Recetario de Síntesis"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Recetario</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('periodic')}
                  className="px-2.5 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>Tabla 118</span>
                </button>
              </div>
            </div>

            {/* Switch: Compuestos vs 118 Elementos */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setShelfTab('compounds')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  shelfTab === 'compounds'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Compuestos ({unlockedSubstanceIds.length})
              </button>
              <button
                onClick={() => setShelfTab('elements')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  shelfTab === 'elements'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                118 Elementos IUPAC
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder={shelfTab === 'elements' ? "Buscar elemento por símbolo (H, Fe, Au) o Z..." : "Buscar compuesto por fórmula (H₂O, NaCl)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Cards List / Grid */}
          <div className="overflow-y-auto flex-1 mt-3 space-y-2 pr-1 max-h-[500px]">
            {shelfTab === 'compounds' ? (
              availableSubstances.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No se encontraron compuestos con ese filtro.
                </div>
              ) : (
                availableSubstances.map((sub) => {
                  const countInVessel = selectedReactants.filter((id) => id === sub.id).length;
                  return (
                    <motion.div
                      key={sub.id}
                      onClick={() => addReactant(sub.id)}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm text-white shrink-0 border"
                          style={{
                            backgroundColor: sub.color + '25',
                            borderColor: sub.color + '60',
                          }}
                        >
                          {sub.formula}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                            {sub.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {sub.category} · {sub.state}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {countInVessel > 0 && (
                          <span className="font-mono text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-md font-bold">
                            ×{countInVessel}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">+ Añadir</span>
                      </div>
                    </motion.div>
                  );
                })
              )
            ) : (
              // Elements Tab (118 elements list)
              availableElements.map((el) => {
                const countInVessel = selectedReactants.filter((id) => id === el.symbol).length;
                return (
                  <motion.div
                    key={el.number}
                    onClick={() => addReactant(el.symbol)}
                    whileHover={{ x: 3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center font-mono shrink-0">
                        <span className="text-[9px] text-slate-400 leading-none">{el.number}</span>
                        <span className="font-bold text-sm text-white leading-none mt-0.5">{el.symbol}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                          {el.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {el.categoryName} · {el.atomicMass} u
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {countInVessel > 0 && (
                        <span className="font-mono text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-md font-bold">
                          ×{countInVessel}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">+ Añadir</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
