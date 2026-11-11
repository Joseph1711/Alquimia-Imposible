import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Atom,
  Search,
  Plus,
  Trash2,
  RotateCcw,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  FlaskRound as Flask,
  Compass,
  Play,
  GraduationCap,
} from 'lucide-react';
import { ELEMENTS_118, ChemicalElement, getAtomicStructure } from '../../data/elements118';
import {
  PRESET_MOLECULES,
  MoleculeRecipe,
  evaluateCustomCombination,
  EvaluationResult,
} from '../../data/bondsEngine';
import { BondFormation3D } from '../3d/BondFormation3D';
import { AtomViewer3D } from '../3d/AtomViewer3D';
import { BondExamWorkshop } from '../BondExamWorkshop';
import { useGame } from '../../context/GameContext';

export const BondLabScreen: React.FC = () => {
  const { setCurrentScreen } = useGame();

  // Top screen mode: 'workshop' (Taller de Enlaces) vs 'formation3d' vs 'atom3d'
  const [screenMode, setScreenMode] = useState<'workshop' | 'formation3d' | 'atom3d'>('workshop');

  // Staged atoms in the workbench (symbols array)
  const [stagedSymbols, setStagedSymbols] = useState<string[]>(['Na', 'Cl']);
  const [activeTab, setActiveTab] = useState<'formation3d' | 'atom3d' | 'lewis'>('formation3d');
  const [selectedAtomFor3D, setSelectedAtomFor3D] = useState<ChemicalElement>(
    ELEMENTS_118.find((e) => e.symbol === 'Na') || ELEMENTS_118[0]
  );
  const [searchElementQuery, setSearchElementQuery] = useState('');
  const [elementCategoryFilter, setElementCategoryFilter] = useState<string>('all');

  // Dynamic evaluation of currently staged combination
  const evaluation: EvaluationResult = useMemo(() => {
    return evaluateCustomCombination(stagedSymbols);
  }, [stagedSymbols]);

  // Find if current staged atoms match a full preset recipe with rich 3D animation steps
  const activePresetRecipe: MoleculeRecipe = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const sym of stagedSymbols) {
      counts[sym] = (counts[sym] || 0) + 1;
    }

    for (const preset of PRESET_MOLECULES) {
      const pCounts: Record<string, number> = {};
      preset.atoms.forEach((a) => {
        pCounts[a.symbol] = a.count;
      });

      const keysA = Object.keys(counts).sort();
      const keysB = Object.keys(pCounts).sort();

      if (keysA.length === keysB.length && keysA.every((k, i) => k === keysB[i])) {
        if (keysA.every((k) => counts[k] === pCounts[k])) {
          return preset;
        }
      }
    }

    // Fallback generated recipe for any custom combination
    const primarySymbols = stagedSymbols.slice(0, 4);
    const atomStates = primarySymbols.map((sym, idx) => {
      const offsetX = (idx - (primarySymbols.length - 1) / 2) * 2.2;
      return {
        symbol: sym,
        charge: '0',
        position: [offsetX, 0, 0] as [number, number, number],
        scale: 1.0,
        highlightValence: true,
      };
    });

    return {
      id: 'custom_' + stagedSymbols.join('_'),
      formula: evaluation.formula,
      name: evaluation.compoundName,
      iupacName: evaluation.compoundName,
      atoms: Object.entries(counts).map(([symbol, count]) => ({ symbol, count })),
      bondClassification: evaluation.bondClassification,
      bondClassificationName: evaluation.bondClassificationName,
      multiplicity: 'simple',
      multiplicityName: evaluation.multiplicityName,
      geometry: evaluation.geometry,
      geometryName: evaluation.geometryName,
      bondAngle: 'Variable',
      deltaEN: evaluation.deltaEN,
      polarity: evaluation.bondClassification === 'ionic' ? 'Iónico (Sal)' : evaluation.deltaEN > 0.4 ? 'Polar' : 'No Polar',
      stability: evaluation.stability === 'No respaldada' ? 'Inestable' : evaluation.stability,
      octetRuleExplanation: evaluation.octetStatus,
      educationalSummary: evaluation.scientificFeedback,
      lewisStructureDescription: `Estructura de Lewis estimada para ${evaluation.formula}`,
      realWorldApplication: 'Combinación personalizada en el simulador molecular.',
      animationSteps: [
        {
          stepNumber: 1,
          title: 'Aproximación de Átomos Libres',
          subtitle: 'Aparición de los elementos en el espacio de reacción',
          explanation: `Se sitúan los átomos de ${stagedSymbols.join(', ')} a distancia de interacción química.`,
          scientificDetail: `Diferencia de electronegatividad calculada: ΔEN = ${evaluation.deltaEN}.`,
          progress: 0.2,
          atomStates,
          bondLinesVisible: false,
          orbitalOverlapVisible: false,
          ionsVisible: false,
        },
        {
          stepNumber: 2,
          title: 'Interacción de Electrones de Valencia',
          subtitle: evaluation.bondClassification === 'ionic' ? 'Transferencia Electrónica' : 'Compartición de Pares de Enlace',
          explanation: evaluation.octetStatus,
          scientificDetail: evaluation.scientificFeedback,
          progress: 0.6,
          atomStates: atomStates.map((st, i) => ({
            ...st,
            position: [st.position[0] * 0.7, st.position[1], st.position[2]] as [number, number, number],
            highlightValence: true,
          })),
          bondLinesVisible: true,
          orbitalOverlapVisible: true,
          ionsVisible: evaluation.bondClassification === 'ionic',
        },
        {
          stepNumber: 3,
          title: 'Estructura Molecular Consolidada',
          subtitle: `${evaluation.compoundName} (${evaluation.geometryName})`,
          explanation: `Formación final del enlace: ${evaluation.bondClassificationName}. ${evaluation.scientificFeedback}`,
          scientificDetail: `Geometría molecular estimada: ${evaluation.geometryName}. Estabilidad: ${evaluation.stability}.`,
          progress: 1.0,
          atomStates: atomStates.map((st, i) => ({
            ...st,
            position: [st.position[0] * 0.55, st.position[1], st.position[2]] as [number, number, number],
            highlightValence: false,
          })),
          bondLinesVisible: true,
          orbitalOverlapVisible: false,
          ionsVisible: evaluation.bondClassification === 'ionic',
        },
      ],
    };
  }, [stagedSymbols, evaluation]);

  // Handler to load a pre-set molecule
  const handleLoadPreset = (preset: MoleculeRecipe) => {
    const list: string[] = [];
    preset.atoms.forEach((a) => {
      for (let i = 0; i < a.count; i++) {
        list.push(a.symbol);
      }
    });
    setStagedSymbols(list);
    const firstEl = ELEMENTS_118.find((e) => e.symbol === list[0]);
    if (firstEl) setSelectedAtomFor3D(firstEl);
  };

  // Add an atom to the staging area
  const handleAddSymbol = (sym: string) => {
    if (stagedSymbols.length >= 6) return;
    setStagedSymbols((prev) => [...prev, sym]);
    const el = ELEMENTS_118.find((e) => e.symbol === sym);
    if (el) setSelectedAtomFor3D(el);
  };

  // Remove an atom from staging area
  const handleRemoveIndex = (idx: number) => {
    setStagedSymbols((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearStaging = () => {
    setStagedSymbols([]);
  };

  // Filter elements palette
  const filteredElements = useMemo(() => {
    return ELEMENTS_118.filter((el) => {
      if (elementCategoryFilter !== 'all' && el.category !== elementCategoryFilter) return false;
      if (searchElementQuery.trim()) {
        const q = searchElementQuery.toLowerCase();
        return (
          el.name.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          el.number.toString() === q
        );
      }
      return true;
    });
  }, [elementCategoryFilter, searchElementQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner with Rich Visual Atomic Lattice & Quantum Bonds Artwork */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 min-h-[160px] flex flex-col justify-end p-5 md:p-6 shadow-2xl">
        <img
          src="/src/assets/images/atomic_molecular_bonds_1794361273278.jpg"
          alt="Estructura Atómica y Enlaces Moleculares Cuánticos"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/75 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Simulador Atómico 3D & Enlaces
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                Tamara Villada Valencia & Adriana Isabel Martinez
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              Laboratorio de Enlaces Químicos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Construye moléculas en 3D combinando átomos de los 118 elementos químicos. Visualiza orbitales electrónicos, enlaces iónicos, covalentes y metálicos.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-2 rounded-xl">
            <button
              onClick={() => setCurrentScreen('periodic')}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Atom className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tabla 118</span>
            </button>
            <button
              onClick={() => setCurrentScreen('lab')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Flask className="w-3.5 h-3.5" />
              <span>Ir al Crisol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0b101d] border border-slate-800 rounded-2xl shadow-lg">
        <button
          onClick={() => setScreenMode('workshop')}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            screenMode === 'workshop'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Taller & Examen de Enlaces</span>
        </button>

        <button
          onClick={() => {
            setScreenMode('formation3d');
            setActiveTab('formation3d');
          }}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            screenMode === 'formation3d'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Animación 3D de Formación</span>
        </button>

        <button
          onClick={() => {
            setScreenMode('atom3d');
            setActiveTab('atom3d');
          }}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            screenMode === 'atom3d'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>Modelos Atómicos 3D (118)</span>
        </button>
      </div>

      {screenMode === 'workshop' ? (
        <BondExamWorkshop />
      ) : (
        <>
          {/* Preset Molecules Bar (Quick 1-Click Load) */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Moléculas y Enlaces de Ejemplo (Carga Inmediata):
              </span>
          <span className="text-[11px] text-slate-500">Pulsa cualquier compuesto para simular</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {PRESET_MOLECULES.map((preset) => {
            const isActive = activePresetRecipe.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="font-mono font-bold text-emerald-400">{preset.formula}</span>
                <span className="text-slate-300">{preset.name}</span>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    preset.bondClassification === 'ionic'
                      ? 'bg-amber-500/20 text-amber-300'
                      : preset.polarity === 'Polar'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {preset.bondClassification === 'ionic' ? 'Iónico' : preset.polarity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Workbench & 3D Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): 3D Simulation & Visualization */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Visualizer Mode Tabs */}
          <div className="flex items-center justify-between p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('formation3d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'formation3d'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Animación de Enlace 3D</span>
              </button>
              <button
                onClick={() => setActiveTab('atom3d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'atom3d'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>Modelo Atómico 3D</span>
              </button>
              <button
                onClick={() => setActiveTab('lewis')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'lewis'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Estructura de Lewis</span>
              </button>
            </div>

            {activeTab === 'atom3d' && (
              <span className="text-[11px] font-mono text-slate-400 pr-2">
                Átomo: <strong className="text-emerald-400">{selectedAtomFor3D.name}</strong>
              </span>
            )}
          </div>

          {/* 3D Viewport Render */}
          {activeTab === 'formation3d' && (
            <BondFormation3D recipe={activePresetRecipe} height={460} />
          )}

          {activeTab === 'atom3d' && (
            <AtomViewer3D element={selectedAtomFor3D} height={460} showCardDetails={true} />
          )}

          {activeTab === 'lewis' && (
            <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      Diagrama de Lewis & Geometría VSEPR
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Distribución de pares electrónicos enlazantes y solitarios según la regla del octeto.
                    </p>
                  </div>
                  <span className="font-mono font-bold text-lg text-emerald-400">
                    {evaluation.formula}
                  </span>
                </div>

                {/* Lewis Visual Representation Box */}
                <div className="my-8 p-6 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
                  <div className="font-mono text-xl sm:text-2xl text-emerald-300 font-bold tracking-widest whitespace-pre-line text-center bg-slate-900/90 px-8 py-6 rounded-2xl border border-slate-800 shadow-inner">
                    {activePresetRecipe.lewisStructureDescription}
                  </div>
                </div>

                {/* Educational concepts list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Tipo de Enlace</span>
                    <div className="font-bold text-white mt-1">{evaluation.bondClassificationName}</div>
                    <p className="text-[11px] text-slate-400 mt-1">{evaluation.multiplicityName}</p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Geometría Molecular</span>
                    <div className="font-bold text-white mt-1">{evaluation.geometryName}</div>
                    <p className="text-[11px] text-slate-400 mt-1">Ángulo de enlace: {activePresetRecipe.bondAngle}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {evaluation.octetStatus}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Workspace & Element Selector */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Staging Workbench Area */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Espacio de Trabajo</span>
                  <span className="text-xs text-slate-400 font-normal">({stagedSymbols.length}/6 átomos)</span>
                </h3>
              </div>
              {stagedSymbols.length > 0 && (
                <button
                  onClick={handleClearStaging}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Vaciar
                </button>
              )}
            </div>

            {/* Staged Atom Chips Container */}
            <div className="min-h-[72px] p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center flex-wrap gap-2">
              {stagedSymbols.length === 0 ? (
                <div className="w-full text-center py-3 text-xs text-slate-500">
                  Selecciona elementos de la lista inferior para agregarlos al espacio de trabajo.
                </div>
              ) : (
                stagedSymbols.map((sym, idx) => {
                  const el = ELEMENTS_118.find((e) => e.symbol === sym);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 shadow-sm"
                    >
                      <button
                        onClick={() => el && setSelectedAtomFor3D(el)}
                        className="font-bold font-mono text-sm text-emerald-400 hover:underline"
                        title="Ver este átomo en 3D"
                      >
                        {sym}
                      </button>
                      <span className="text-[10px] text-slate-400">{el?.name}</span>
                      <button
                        onClick={() => handleRemoveIndex(idx)}
                        className="text-slate-500 hover:text-rose-400 ml-1 transition-colors"
                        title="Quitar átomo"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Scientific Diagnostics & Warnings */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Fórmula Resultante:</span>
                <span className="font-mono font-bold text-white text-base">{evaluation.formula}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Compuesto / Especie:</span>
                <span className="font-semibold text-emerald-400 text-xs text-right truncate max-w-[200px]">
                  {evaluation.compoundName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Tipo de Enlace:</span>
                <span className="font-semibold text-slate-200 text-xs">{evaluation.bondClassificationName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Diferencia de Electronegatividad:</span>
                <span className="font-mono font-bold text-amber-400 text-xs">ΔEN = {evaluation.deltaEN}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Estabilidad Química:</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    evaluation.stability === 'Estable'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {evaluation.stability}
                </span>
              </div>

              {evaluation.warning && (
                <div className="mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{evaluation.warning}</span>
                </div>
              )}
            </div>
          </div>

          {/* 118 Elements Palette Selector Drawer */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col min-h-[380px]">
            <div className="space-y-2 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Catálogo de Elementos (118)</h3>
                <span className="text-xs text-slate-400">Toca para agregar (+)</span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchElementQuery}
                  onChange={(e) => setSearchElementQuery(e.target.value)}
                  placeholder="Buscar por símbolo (H, Na, Cl, Fe), nombre o Z..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Category Quick Filter */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setElementCategoryFilter('all')}
                  className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    elementCategoryFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Todos (118)
                </button>
                <button
                  onClick={() => setElementCategoryFilter('no-metal')}
                  className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    elementCategoryFilter === 'no-metal'
                      ? 'bg-slate-800 text-cyan-300'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  No metales
                </button>
                <button
                  onClick={() => setElementCategoryFilter('metal-alcalino')}
                  className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    elementCategoryFilter === 'metal-alcalino'
                      ? 'bg-slate-800 text-rose-300'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Alcalinos
                </button>
                <button
                  onClick={() => setElementCategoryFilter('halogeno')}
                  className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    elementCategoryFilter === 'halogeno'
                      ? 'bg-slate-800 text-amber-300'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Halógenos
                </button>
                <button
                  onClick={() => setElementCategoryFilter('gas-noble')}
                  className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    elementCategoryFilter === 'gas-noble'
                      ? 'bg-slate-800 text-purple-300'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Gases Nobles
                </button>
              </div>
            </div>

            {/* Elements Scrollable Grid */}
            <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-1.5 mt-3 scrollbar-thin">
              {filteredElements.map((el) => {
                const isSelectedFor3D = selectedAtomFor3D.symbol === el.symbol;
                return (
                  <div
                    key={el.number}
                    className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                      isSelectedFor3D
                        ? 'bg-slate-800/90 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedAtomFor3D(el)}
                      className="flex items-center gap-2.5 text-left min-w-0 flex-1"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 border"
                        style={{ backgroundColor: el.color + '30', borderColor: el.color }}
                      >
                        {el.symbol}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate">{el.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">Z={el.number}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Val: <strong className="text-emerald-400">{el.valenceElectrons}e⁻</strong> · EN: {el.electronegativity ?? '—'}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedAtomFor3D(el);
                          setActiveTab('atom3d');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                        title="Inspeccionar en 3D"
                      >
                        <Atom className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAddSymbol(el.symbol)}
                        disabled={stagedSymbols.length >= 6}
                        className={`p-1.5 rounded-lg transition ${
                          stagedSymbols.length >= 6
                            ? 'text-slate-600 cursor-not-allowed'
                            : 'text-emerald-400 hover:bg-emerald-500/20 active:scale-95'
                        }`}
                        title="Añadir átomo a la mezcla"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
