import React, { useState } from 'react';
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
  Radiation,
  Wrench,
  ShieldAlert,
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
import { NuclearWarningModal } from '../NuclearWarningModal';
import { LabInstrumentsPanel } from '../LabInstrumentsPanel';

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
    openTutorial,
    isLabDevastated,
    isNuclearWarningOpen,
    setIsNuclearWarningOpen,
    isNuclearCinematicRunning,
    isReconstructing,
    repairLaboratory,
    isMagneticStirrerActive,
    stirrerRpm,
    isFumeHoodActive,
    isVesselSealed,
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
        <div className={`lg:col-span-7 ${
          isLabDevastated
            ? 'bg-[#13090e] border-2 border-red-500/50 shadow-red-500/10'
            : 'bg-[#0b101d] border border-slate-800'
        } rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative shadow-xl transition-colors`}>
          {/* Quarantine Alert Banner if devastated */}
          {isLabDevastated && (
            <div className="mb-3 p-3 bg-red-950/70 border border-red-500/60 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xl animate-pulse">
              <div className="flex items-center gap-2.5 text-red-300">
                <Radiation className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <div className="font-bold font-mono text-red-200 tracking-wider flex items-center gap-1.5">
                    <span>ÁREA BAJO CUARENTENA RADIOLÓGICA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">
                    Mesa de experimentación fracturada y calcinada por fisión no confinada.
                  </div>
                </div>
              </div>
              <button
                onClick={repairLaboratory}
                disabled={isReconstructing}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-lg shadow-md shrink-0 active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>{isReconstructing ? 'Limpiando...' : 'Restaurar'}</span>
              </button>
            </div>
          )}

          {/* Advanced Laboratory Instruments Panel (7 Vessels, pH Meter, Pt100, Balance, Stirrer, Hood) */}
          <LabInstrumentsPanel />

          {/* Central Experiment Area with Canvas */}
          <div className="relative py-1 flex flex-col items-center justify-center">
            <LabCanvas
              reactants={selectedReactants}
              conditions={conditions}
              vessel={selectedVessel}
              isReacting={isExperimentRunning}
              isExploding={isExploding}
              isDevastated={isLabDevastated}
              isReconstructing={isReconstructing}
              isMagneticStirrerActive={isMagneticStirrerActive}
              stirrerRpm={stirrerRpm}
              isFumeHoodActive={isFumeHoodActive}
              isVesselSealed={isVesselSealed}
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
                  selectedReactants.map((id, index) => {
                    const disp = getReactantDisplay(id);
                    return (
                      <div
                        key={`${id}-${index}`}
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
                          className="text-slate-400 hover:text-red-400 ml-1 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
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
                  <option value="spark">Chispa de Alta Tensión</option>
                  <option value="electrolysis">Electrólisis Continua</option>
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
                  <option value="normal">Solución Estándar</option>
                  <option value="concentrated">Concentrado</option>
                </select>
              </div>
            </div>

            {/* Scientific Thermodynamic & Orbital Analyzer */}
            {selectedReactants.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Atom className="w-3.5 h-3.5" />
                    Analizador Termodinámico y de Enlaces
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Estequiometría Activa
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Reactivos</div>
                    <div className="text-white font-bold">{selectedReactants.length} especie(s)</div>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Aporte Térmico</div>
                    <div className="text-amber-400 font-bold">
                      {conditions.temperature === 'extreme' ? 'Alta Entalpía' : conditions.temperature === 'moderate' ? 'Bunsen 450 °C' : 'Ambiente 25 °C'}
                    </div>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Cinética (Ea)</div>
                    <div className="text-cyan-400 font-bold">
                      {conditions.catalyst !== 'none' ? `${conditions.catalyst} (Activo)` : 'Barrera Estándar'}
                    </div>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Presión de Enlace</div>
                    <div className="text-purple-400 font-bold">
                      {conditions.pressure === 'high' ? '200 atm (Le Chatelier)' : '1 atm'}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {/* Execute Experiment CTA OR Devastated Restoration CTA */}
            {isLabDevastated ? (
              <button
                onClick={repairLaboratory}
                disabled={isReconstructing}
                className="w-full py-3.5 px-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all shadow-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isReconstructing
                    ? 'Iniciando Nanobots de Limpieza y Reparación...'
                    : 'Restaurar y Descontaminar Laboratorio'}
                </span>
              </button>
            ) : (
              <button
                onClick={executeExperiment}
                disabled={selectedReactants.length === 0 || isExperimentRunning}
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
              </button>
            )}
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
                  onClick={openTutorial}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-emerald-500/20"
                  title="Tutorial paso a paso y mezclas guiadas"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Tutorial</span>
                </button>
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
                    <div
                      key={sub.id}
                      onClick={() => addReactant(sub.id)}
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]"
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
                    </div>
                  );
                })
              )
            ) : (
              // Elements Tab (118 elements list)
              availableElements.map((el) => {
                const countInVessel = selectedReactants.filter((id) => id === el.symbol).length;
                return (
                  <div
                    key={el.number}
                    onClick={() => addReactant(el.symbol)}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]"
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Nuclear Safety Warning Modal */}
      <NuclearWarningModal />
    </div>
  );
};
