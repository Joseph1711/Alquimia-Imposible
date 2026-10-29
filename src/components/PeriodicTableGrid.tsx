import React, { useState } from 'react';
import {
  Search,
  Filter,
  Info,
  Layers,
  FlaskRound as Flask,
  X,
  ChevronRight,
  Sparkles,
  Lock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { ELEMENTS_118, ChemicalElement, ElementCategory } from '../data/elements118';
import { useGame } from '../context/GameContext';

const CATEGORY_COLORS: Record<ElementCategory, { bg: string; text: string; border: string; label: string }> = {
  'metal-alcalino': { bg: 'bg-rose-950/60', text: 'text-rose-300', border: 'border-rose-500/50', label: 'Metales alcalinos' },
  'metal-alcalinoterreo': { bg: 'bg-orange-950/60', text: 'text-orange-300', border: 'border-orange-500/50', label: 'Alcalinotérreos' },
  'metal-transicion': { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-500/50', label: 'Metales de transición' },
  'lantanido': { bg: 'bg-indigo-950/60', text: 'text-indigo-300', border: 'border-indigo-500/50', label: 'Lantánidos' },
  'actinido': { bg: 'bg-pink-950/60', text: 'text-pink-300', border: 'border-pink-500/50', label: 'Actínidos' },
  'metal-bloque-p': { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-500/50', label: 'Metales del bloque p' },
  'metaloide': { bg: 'bg-teal-950/60', text: 'text-teal-300', border: 'border-teal-500/50', label: 'Metaloides' },
  'no-metal': { bg: 'bg-cyan-950/60', text: 'text-cyan-300', border: 'border-cyan-500/50', label: 'No metales reactivos' },
  'halogeno': { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-500/50', label: 'Halógenos' },
  'gas-noble': { bg: 'bg-purple-950/60', text: 'text-purple-300', border: 'border-purple-500/50', label: 'Gases nobles' },
  'superpesado-sintetico': { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700', label: 'Superpesados sintéticos' },
};

export const PeriodicTableGrid: React.FC = () => {
  const { addReactant, setCurrentScreen, analyzedElementSymbols, analyzeElement } = useGame();
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter elements
  const filteredElements = ELEMENTS_118.filter((el) => {
    if (categoryFilter !== 'all' && el.category !== categoryFilter) return false;
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

  const analyzedCount = analyzedElementSymbols.length;

  const getGridPosition = (el: ChemicalElement) => {
    if (el.number >= 57 && el.number <= 71) {
      return {
        gridRow: 9,
        gridColumn: el.number - 57 + 3,
      };
    }
    if (el.number >= 89 && el.number <= 103) {
      return {
        gridRow: 10,
        gridColumn: el.number - 89 + 3,
      };
    }
    return {
      gridRow: el.period + 1,
      gridColumn: el.group || 3,
    };
  };

  const handleSendToLab = (el: ChemicalElement) => {
    addReactant(el.symbol);
    setCurrentScreen('lab');
  };

  const isAnalyzed = selectedElement ? analyzedElementSymbols.includes(selectedElement.symbol) : false;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Tabla Periódica Completa (118 Elementos IUPAC)
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              118 Disponibles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tienes acceso a todos los elementos. Experimenta en el laboratorio para revelar sus propiedades y reacciones ocultas ({analyzedCount}/118 investigados).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por Z, símbolo o nombre (ej. 79, Au, Fe)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Legend & Filter */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
            categoryFilter === 'all'
              ? 'bg-slate-700 text-white border-slate-500'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          Todos (118)
        </button>
        {Object.entries(CATEGORY_COLORS).map(([catKey, val]) => (
          <button
            key={catKey}
            onClick={() => setCategoryFilter(catKey)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              categoryFilter === catKey
                ? `${val.bg} ${val.text} ${val.border} font-bold shadow-sm`
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full border ${val.border}`}
              style={{ backgroundColor: val.text.replace('text-', '') }}
            />
            {val.label}
          </button>
        ))}
      </div>

      {/* 18-Column Periodic Table Grid */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-1 min-w-[1020px] p-4 bg-[#0b101d] border border-slate-800 rounded-2xl shadow-xl"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(52px, 1fr))',
            gridTemplateRows: '24px repeat(7, 58px) 16px repeat(2, 58px)',
          }}
        >
          {/* Group Numbers Header (1 to 18) */}
          {Array.from({ length: 18 }, (_, i) => i + 1).map((groupNum) => (
            <div
              key={`group-${groupNum}`}
              className="text-[10px] font-mono font-semibold text-slate-500 text-center flex items-center justify-center"
              style={{ gridRow: 1, gridColumn: groupNum }}
            >
              G{groupNum}
            </div>
          ))}

          {/* Render 118 Elements */}
          {ELEMENTS_118.map((el) => {
            const pos = getGridPosition(el);
            const style = CATEGORY_COLORS[el.category] || CATEGORY_COLORS['metal-transicion'];
            const isMatch = filteredElements.some((fe) => fe.number === el.number);
            const analyzed = analyzedElementSymbols.includes(el.symbol);

            return (
              <button
                key={el.number}
                onClick={() => setSelectedElement(el)}
                style={{
                  gridRow: pos.gridRow,
                  gridColumn: pos.gridColumn,
                }}
                className={`p-1 rounded-lg border text-left transition-all relative flex flex-col justify-between group ${
                  style.bg
                } ${style.border} ${
                  isMatch ? 'opacity-100 hover:scale-105 hover:z-20 shadow-md' : 'opacity-25 grayscale'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono leading-none">
                  <span className="font-bold text-slate-400">{el.number}</span>
                  {analyzed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Propiedades analizadas" />
                  )}
                </div>
                <div className={`font-mono font-bold text-sm leading-none text-center ${style.text}`}>
                  {el.symbol}
                </div>
                <div className="text-[8px] text-slate-300 truncate text-center leading-none">
                  {el.name}
                </div>
              </button>
            );
          })}

          {/* Lanthanide / Actinide Indicator Placeholders */}
          <div
            className="rounded-lg border border-indigo-500/40 bg-indigo-950/30 flex items-center justify-center text-[10px] font-mono text-indigo-300 font-bold"
            style={{ gridRow: 7, gridColumn: 3 }}
          >
            57-71
          </div>
          <div
            className="rounded-lg border border-pink-500/40 bg-pink-950/30 flex items-center justify-center text-[10px] font-mono text-pink-300 font-bold"
            style={{ gridRow: 8, gridColumn: 3 }}
          >
            89-103
          </div>

          <div
            className="text-[10px] font-mono font-bold text-indigo-400 flex items-center justify-end pr-2"
            style={{ gridRow: 9, gridColumn: '1 / span 2' }}
          >
            Lantánidos
          </div>
          <div
            className="text-[10px] font-mono font-bold text-pink-400 flex items-center justify-end pr-2"
            style={{ gridRow: 10, gridColumn: '1 / span 2' }}
          >
            Actínidos
          </div>
        </div>
      </div>

      {/* Element Inspector Dossier Modal */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0d1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-950">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 flex flex-col items-center justify-center font-mono shadow-lg">
                  <span className="text-[10px] text-emerald-400 font-bold leading-none">
                    {selectedElement.number}
                  </span>
                  <span className="text-xl font-black text-white leading-none mt-1">
                    {selectedElement.symbol}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    {selectedElement.name}
                    <span className="text-xs font-mono font-normal text-slate-400">
                      ({selectedElement.atomicMass} u)
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-medium">
                      {selectedElement.categoryName}
                    </span>
                    <span>·</span>
                    <span>Periodo {selectedElement.period}</span>
                    {selectedElement.group && <span>· Grupo {selectedElement.group}</span>}
                    <span>·</span>
                    <span className="uppercase text-slate-300">{selectedElement.state}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedElement(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inspector Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Unlocked / Analyzed Status Badge */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isAnalyzed
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isAnalyzed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>
                    {isAnalyzed
                      ? 'Elemento Analizado: Propiedades y reactividad reveladas en tu cuaderno.'
                      : 'Propiedades Químicas Ocultas: Experimenta con él en el laboratorio o analiza su espectro.'}
                  </span>
                </div>

                {!isAnalyzed && (
                  <button
                    onClick={() => analyzeElement(selectedElement.symbol)}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors shrink-0 flex items-center gap-1 shadow-sm text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Analizar (+25 XP)
                  </button>
                )}
              </div>

              {isAnalyzed ? (
                <>
                  {/* Atomic parameters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Configuración Electrónica</span>
                      <span className="font-mono text-xs font-semibold text-slate-200 mt-0.5 block truncate" title={selectedElement.electronConfig}>
                        {selectedElement.electronConfig}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Electrones de Valencia</span>
                      <span className="font-mono text-xs font-semibold text-emerald-400 mt-0.5 block">
                        {selectedElement.valenceElectrons} e⁻
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Electronegatividad</span>
                      <span className="font-mono text-xs font-semibold text-cyan-400 mt-0.5 block">
                        {selectedElement.electronegativity ?? 'Inerte'}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Estados de Oxidación</span>
                      <span className="font-mono text-xs font-semibold text-amber-400 mt-0.5 block">
                        {selectedElement.oxidationStates}
                      </span>
                    </div>
                  </div>

                  {/* Properties */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="font-semibold text-slate-200 block">
                      Propiedades Principales:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedElement.properties}
                    </p>
                  </div>

                  {/* Real World Applications */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="font-semibold text-slate-200 block">
                      Usos Reales en la Vida Diaria e Industria:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedElement.realWorldUses}
                    </p>
                  </div>

                  {/* Chemical Reactivity */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="font-semibold text-slate-200 block">
                      Reactividad Química y Comportamiento:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedElement.reactivity}
                    </p>
                  </div>

                  {/* Notable Compounds */}
                  {selectedElement.notableCompounds && selectedElement.notableCompounds.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-semibold text-slate-300 block">
                        Compuestos Notables:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedElement.notableCompounds.map((comp, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-xs px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Hidden state preview */
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Propiedades y Enlaces Pendientes de Análisis
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Combina este elemento en el laboratorio (por ejemplo, con oxígeno, hidrógeno o halógenos) para observar qué reacciones produce y revelar su configuración de valencia.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleSendToLab(selectedElement)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Flask className="w-3.5 h-3.5" />
                      Llevar al Matraz y Experimentar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Elemento Z={selectedElement.number} ({selectedElement.symbol})
              </span>
              <button
                onClick={() => handleSendToLab(selectedElement)}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Flask className="w-3.5 h-3.5" />
                Cargar al Recipiente de Laboratorio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
