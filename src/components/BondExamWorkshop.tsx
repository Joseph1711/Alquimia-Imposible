import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Play,
  ArrowRight,
  Info,
  Layers,
  Zap,
  Atom,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  BOND_EXAM_COMPOUNDS,
  BondExamCompound,
  BondExamType,
  UserBond,
  evaluateBondExamAttempt,
  calculateAtomValenceStates,
  ExamGradeResult,
} from '../data/bondsExamData';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

export const BondExamWorkshop: React.FC = () => {
  const { addXp } = useGame();

  // Selected compound for the workshop
  const [selectedCompoundId, setSelectedCompoundId] = useState<string>('co2');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeLevelFilter, setActiveLevelFilter] = useState<number | 'all'>('all');

  // Currently active bonding tool
  const [activeTool, setActiveTool] = useState<BondExamType>('double');

  // Currently selected atom to initiate connection
  const [selectedAtomIndex, setSelectedAtomIndex] = useState<number | null>(null);

  // User established bonds for current compound
  const [userBonds, setUserBonds] = useState<UserBond[]>([]);

  // Exam evaluation result
  const [examResult, setExamResult] = useState<ExamGradeResult | null>(null);

  // Toggle show pedagogical solution
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Current active compound object
  const currentCompound: BondExamCompound = useMemo(() => {
    return (
      BOND_EXAM_COMPOUNDS.find((c) => c.id === selectedCompoundId) ||
      BOND_EXAM_COMPOUNDS[0]
    );
  }, [selectedCompoundId]);

  // Current atom electronic states
  const atomStates = useMemo(() => {
    return calculateAtomValenceStates(currentCompound.atoms, userBonds);
  }, [currentCompound, userBonds]);

  // Filtered compounds list
  const filteredCompounds = useMemo(() => {
    return BOND_EXAM_COMPOUNDS.filter((c) => {
      if (activeCategoryFilter !== 'all' && c.category !== activeCategoryFilter) return false;
      if (activeLevelFilter !== 'all' && c.levelNumber !== activeLevelFilter) return false;
      return true;
    });
  }, [activeCategoryFilter, activeLevelFilter]);

  // Handler to select another compound
  const handleSelectCompound = (compound: BondExamCompound) => {
    sound.playClick();
    setSelectedCompoundId(compound.id);
    setUserBonds([]);
    setSelectedAtomIndex(null);
    setExamResult(null);
    setShowSolution(false);
    // Suggest an intuitive tool based on compound type
    if (compound.expectedBondClassification === 'ionico') {
      setActiveTool('ionic');
    } else if (compound.targetBonds.some((b) => b.type === 'triple')) {
      setActiveTool('triple');
    } else if (compound.targetBonds.some((b) => b.type === 'double')) {
      setActiveTool('double');
    } else {
      setActiveTool('simple');
    }
  };

  // Click on an atom on the board
  const handleAtomClick = (index: number) => {
    sound.playSpark();

    if (selectedAtomIndex === null) {
      // First atom selected
      setSelectedAtomIndex(index);
    } else if (selectedAtomIndex === index) {
      // Deselect
      setSelectedAtomIndex(null);
    } else {
      // Connect selectedAtomIndex to index
      const from = Math.min(selectedAtomIndex, index);
      const to = Math.max(selectedAtomIndex, index);

      // Check if bond already exists between these two
      const existingIndex = userBonds.findIndex(
        (b) =>
          (b.fromAtomIndex === from && b.toAtomIndex === to) ||
          (b.fromAtomIndex === to && b.toAtomIndex === from)
      );

      if (existingIndex >= 0) {
        // Update bond type with active tool
        const updated = [...userBonds];
        updated[existingIndex] = {
          fromAtomIndex: from,
          toAtomIndex: to,
          type: activeTool,
        };
        setUserBonds(updated);
        sound.playGlassClink();
      } else {
        // Add new bond
        setUserBonds((prev) => [
          ...prev,
          {
            fromAtomIndex: from,
            toAtomIndex: to,
            type: activeTool,
          },
        ]);
        sound.playSuccessChime();
      }

      setSelectedAtomIndex(null);
      // Reset previous exam result when modifying structure
      if (examResult) setExamResult(null);
    }
  };

  // Remove a specific bond
  const handleRemoveBond = (bondIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setUserBonds((prev) => prev.filter((_, idx) => idx !== bondIdx));
    if (examResult) setExamResult(null);
  };

  // Cycle bond type directly by clicking on its badge
  const handleCycleBondType = (bondIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSpark();
    const types: BondExamType[] = ['simple', 'double', 'triple', 'coordinate', 'ionic'];
    const currentType = userBonds[bondIdx].type;
    const nextType = types[(types.indexOf(currentType) + 1) % types.length];

    setUserBonds((prev) => {
      const copy = [...prev];
      copy[bondIdx] = { ...copy[bondIdx], type: nextType };
      return copy;
    });
    if (examResult) setExamResult(null);
  };

  // Reset board
  const handleResetBoard = () => {
    sound.playClick();
    setUserBonds([]);
    setSelectedAtomIndex(null);
    setExamResult(null);
    setShowSolution(false);
  };

  // Grade Exam attempt
  const handleGradeExam = () => {
    sound.playNuclearAlarm();
    const result = evaluateBondExamAttempt(currentCompound, userBonds);
    setExamResult(result);

    if (result.isPerfect) {
      sound.playFanfare();
      addXp(result.awardedXp);
    } else if (result.isPassed) {
      sound.playSuccessChime();
      addXp(result.awardedXp);
    } else {
      sound.playFailureBuzzer();
    }
  };

  // Load official solution
  const handleApplySolution = () => {
    sound.playSpark();
    setUserBonds(
      currentCompound.targetBonds.map((b) => ({
        fromAtomIndex: b.from,
        toAtomIndex: b.to,
        type: b.type,
      }))
    );
    setShowSolution(true);
    setExamResult(null);
  };

  // Next compound in list
  const handleNextCompound = () => {
    sound.playClick();
    const currentIndex = BOND_EXAM_COMPOUNDS.findIndex((c) => c.id === currentCompound.id);
    const next = BOND_EXAM_COMPOUNDS[(currentIndex + 1) % BOND_EXAM_COMPOUNDS.length];
    handleSelectCompound(next);
  };

  return (
    <div className="space-y-6">
      {/* Workshop Header & Traditional Nomenclature Banner */}
      <div className="bg-gradient-to-r from-[#0d1527] via-[#0b101d] to-[#141b2d] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                Taller & Examen de Enlaces Químicos
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Nomenclatura Tradicional
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{currentCompound.traditionalName}</span>
              <span className="text-base sm:text-lg font-mono font-bold text-cyan-400">
                ({currentCompound.formula})
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Conecta los átomos con los enlaces químicamente correctos (covalentes simples, dobles, triples, dativos o transferencia iónica). Satisface la regla del octeto y califica tu resultado como un examen real de química.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Dificultad</div>
              <div className="text-xs font-bold text-amber-400">{currentCompound.difficulty}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Δ Electronegatividad</div>
              <div className="text-xs font-mono font-bold text-emerald-400">ΔEN = {currentCompound.deltaEN}</div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Compound Drawer (Left) + Interactive Workbench (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Compound Catalog & Level Selectors */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Compuestos del Examen
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {BOND_EXAM_COMPOUNDS.length} disponibles
              </span>
            </div>

            {/* Level Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setActiveLevelFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLevelFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveLevelFilter(1)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLevelFilter === 1
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Nivel 1
              </button>
              <button
                onClick={() => setActiveLevelFilter(2)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLevelFilter === 2
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Nivel 2 (Iónicos)
              </button>
              <button
                onClick={() => setActiveLevelFilter(3)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLevelFilter === 3
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Nivel 3 (Múltiples)
              </button>
              <button
                onClick={() => setActiveLevelFilter(4)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLevelFilter === 4
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Nivel 4 (Dativos)
              </button>
            </div>

            {/* Compound Items List */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredCompounds.map((item) => {
                const isSelected = item.id === currentCompound.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectCompound(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-300 group-hover:text-cyan-400'
                        }`}
                      >
                        {item.formula}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {item.traditionalName}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{item.categoryLabel}</span>
                          <span>·</span>
                          <span className="text-cyan-400/90 font-mono">Nivel {item.levelNumber}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Assembly Board (The Exam Workbench) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tool Selector Bar */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Herramienta de Enlace:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTool('simple');
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                  activeTool === 'simple'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
                title="Enlace Covalente Simple: Comparte 1 par (2 e⁻)"
              >
                <span>Simple (—)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTool('double');
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                  activeTool === 'double'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
                title="Enlace Covalente Doble: Comparte 2 pares (4 e⁻)"
              >
                <span>Doble (=)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTool('triple');
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                  activeTool === 'triple'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
                title="Enlace Covalente Triple: Comparte 3 pares (6 e⁻)"
              >
                <span>Triple (≡)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTool('coordinate');
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                  activeTool === 'coordinate'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
                title="Enlace Coordinado o Dativo: Un átomo cede el par completo (→)"
              >
                <span>Dativo (→)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTool('ionic');
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                  activeTool === 'ionic'
                    ? 'bg-rose-500 text-white shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
                title="Transferencia Iónica: Cede electrones de valencia generando catión y anión"
              >
                <span>Iónico (+ / -)</span>
              </button>
            </div>
          </div>

          {/* Interactive Workbench Canvas */}
          <div className="bg-[#080d1a] border-2 border-slate-800 rounded-2xl relative min-h-[380px] sm:min-h-[420px] overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Workbench Top Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 relative z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-300">
                  {selectedAtomIndex !== null ? (
                    <strong className="text-amber-400">
                      Selecciona el segundo átomo para formar enlace {activeTool.toUpperCase()}
                    </strong>
                  ) : (
                    'Pulsa un átomo y luego el segundo para enlazarlos'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetBoard}
                  className="px-2.5 py-1 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1 transition"
                  title="Limpiar enlaces"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

            {/* SVG Visual Connections (Bond Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {userBonds.map((bond, idx) => {
                const atomA = currentCompound.atoms[bond.fromAtomIndex];
                const atomB = currentCompound.atoms[bond.toAtomIndex];
                if (!atomA || !atomB) return null;

                const x1 = atomA.initialX;
                const y1 = atomA.initialY;
                const x2 = atomB.initialX;
                const y2 = atomB.initialY;

                // Color based on type
                let strokeColor = '#10b981'; // simple
                let strokeWidth = 3;
                let strokeDasharray = 'none';

                if (bond.type === 'double') {
                  strokeColor = '#06b6d4';
                  strokeWidth = 5;
                } else if (bond.type === 'triple') {
                  strokeColor = '#a855f7';
                  strokeWidth = 6;
                } else if (bond.type === 'coordinate') {
                  strokeColor = '#f59e0b';
                  strokeWidth = 4;
                  strokeDasharray = '4 3';
                } else if (bond.type === 'ionic') {
                  strokeColor = '#f43f5e';
                  strokeWidth = 3;
                  strokeDasharray = '6 4';
                }

                return (
                  <g key={`bond-line-${idx}`}>
                    {/* Shadow / glow */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth + 4}
                      strokeOpacity={0.3}
                      strokeLinecap="round"
                    />
                    {/* Main line */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Atoms (Placed on board) */}
            <div className="relative w-full h-[320px] sm:h-[350px] z-20 my-auto">
              {currentCompound.atoms.map((atom, index) => {
                const isSelected = selectedAtomIndex === index;
                const state = atomStates[index];
                const fulfills = state?.fulfillsOctet;
                const hypervalent = state?.isHypervalent;

                return (
                  <div
                    key={`atom-node-${index}`}
                    onClick={() => handleAtomClick(index)}
                    style={{
                      left: `${atom.initialX}px`,
                      top: `${atom.initialY}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute cursor-pointer transition-all duration-200 select-none group flex flex-col items-center ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
                    }`}
                  >
                    {/* Atom Circle with Lewis Electron Quadrants */}
                    <div
                      className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl transition-all ${
                        isSelected
                          ? 'border-amber-400 ring-4 ring-amber-400/30 bg-amber-950/70'
                          : fulfills
                          ? 'border-emerald-400/80 bg-emerald-950/50 shadow-emerald-500/20'
                          : hypervalent
                          ? 'border-rose-500 bg-rose-950/50 shadow-rose-500/20'
                          : 'border-cyan-500/60 bg-[#0d162d] shadow-cyan-500/10'
                      }`}
                    >
                      {/* Valence Electron Indicators (Lewis dots around circumference) */}
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        {atom.valenceElectrons >= 5 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                      </span>
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                        {atom.valenceElectrons >= 2 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                        {atom.valenceElectrons >= 6 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                      </span>
                      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                        {atom.valenceElectrons >= 3 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                        {atom.valenceElectrons >= 7 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                      </span>
                      <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                        {atom.valenceElectrons >= 4 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                        {atom.valenceElectrons >= 8 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                        )}
                      </span>

                      {/* Chemical Symbol */}
                      <div className="font-mono font-black text-xl text-white tracking-tight">
                        {atom.symbol}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 -mt-0.5">
                        EN {atom.electronegativity}
                      </div>
                    </div>

                    {/* Status Badge below atom */}
                    <div className="mt-1.5 flex items-center gap-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          fulfills
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : hypervalent
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {state?.currentElectrons}/{atom.octetTarget} e⁻
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Established Bonds Badges on the board */}
              {userBonds.map((bond, idx) => {
                const atomA = currentCompound.atoms[bond.fromAtomIndex];
                const atomB = currentCompound.atoms[bond.toAtomIndex];
                if (!atomA || !atomB) return null;

                const midX = (atomA.initialX + atomB.initialX) / 2;
                const midY = (atomA.initialY + atomB.initialY) / 2;

                return (
                  <div
                    key={`bond-badge-${idx}`}
                    style={{
                      left: `${midX}px`,
                      top: `${midY}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-30 flex items-center gap-1 bg-slate-950/90 border border-slate-700 px-2 py-1 rounded-full shadow-lg"
                  >
                    <button
                      onClick={(e) => handleCycleBondType(idx, e)}
                      title="Pulsa para cambiar el tipo de enlace"
                      className="text-[10px] font-bold text-white uppercase hover:text-cyan-400 transition"
                    >
                      {bond.type === 'simple' && '— Simple'}
                      {bond.type === 'double' && '= Doble'}
                      {bond.type === 'triple' && '≡ Triple'}
                      {bond.type === 'coordinate' && '→ Dativo'}
                      {bond.type === 'ionic' && 'Iónico'}
                    </button>
                    <button
                      onClick={(e) => handleRemoveBond(idx, e)}
                      title="Eliminar enlace"
                      className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Workbench Bottom Action Cluster */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 relative z-20">
              <div className="text-xs text-slate-400">
                Enlaces actuales: <strong className="text-white">{userBonds.length}</strong>
                <span className="text-slate-600 mx-2">·</span>
                {userBonds.length === 0 ? (
                  <span>Conecta los átomos para comenzar</span>
                ) : (
                  <span className="text-cyan-400">Pulsa en cualquier enlace para cambiar su orden</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplySolution}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-1.5 transition"
                  title="Ver la estructura y solución correcta del examen"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Solución</span>
                </button>

                <button
                  onClick={handleGradeExam}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Calificar Examen de Enlaces</span>
                </button>
              </div>
            </div>
          </div>

          {/* Solution Educational Panel (When toggled) */}
          {showSolution && (
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-2.5 animate-fade-in text-xs">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  Solución Pedagógica Oficial ({currentCompound.traditionalName}):
                </span>
                <span className="font-mono text-[11px]">{currentCompound.geometryName}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentCompound.scientificExplanation}
              </p>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-amber-500/20 text-slate-400 font-mono text-[11px]">
                Regla del Octeto: {currentCompound.octetRuleExplanation}
              </div>
            </div>
          )}

          {/* Exam Grade Card (When user clicks Calificar Examen) */}
          {examResult && (
            <div
              className={`border-2 rounded-2xl p-5 shadow-2xl space-y-4 animate-fade-in ${
                examResult.isPerfect
                  ? 'bg-gradient-to-b from-emerald-950/80 to-slate-950 border-emerald-500/60'
                  : examResult.isPassed
                  ? 'bg-gradient-to-b from-cyan-950/80 to-slate-950 border-cyan-500/60'
                  : 'bg-gradient-to-b from-red-950/80 to-slate-950 border-red-500/60'
              }`}
            >
              {/* Header with Letter Grade & Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-2xl shadow-xl ${
                      examResult.isPerfect
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                        : examResult.isPassed
                        ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/30'
                        : 'bg-red-500 text-white shadow-red-500/30'
                    }`}
                  >
                    {examResult.letterGrade}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {examResult.isPerfect
                        ? '¡EXAMEN PERFECTO! (100%)'
                        : examResult.isPassed
                        ? '¡APROBADO CON NOTABLE!'
                        : 'NECESITA CORRECCIÓN QUÍMICA'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluación de enlace para {examResult.traditionalName} ({currentCompound.formula})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Puntaje</div>
                    <div className="text-lg font-mono font-black text-white">{examResult.score}/100</div>
                  </div>
                  {examResult.awardedXp > 0 && (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      +{examResult.awardedXp} XP
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Evaluation Criteria Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Desglose de Criterios Científicos:
                </div>
                <div className="space-y-2">
                  {examResult.criteria.map((c, i) => (
                    <div
                      key={`crit-${i}`}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs"
                    >
                      {c.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className={`font-semibold ${c.passed ? 'text-white' : 'text-slate-300'}`}>
                          {c.title}
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{c.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educational Summary Note */}
              <p className="text-xs text-slate-300 italic bg-black/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                "{examResult.feedbackSummary}"
              </p>

              {/* Next Step Button */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={handleNextCompound}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition"
                >
                  <span>Siguiente Reto del Examen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
