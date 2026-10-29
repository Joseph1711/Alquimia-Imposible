import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Lock,
  Sparkles,
  Atom,
  Flame,
  Shield,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SUBSTANCES, Substance, REACTIONS, Reaction } from '../../data/chemistryData';

export const CatalogScreen: React.FC = () => {
  const { unlockedSubstanceIds, setCurrentScreen } = useGame();
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const allSubstancesList = Object.values(SUBSTANCES);
  const totalCount = allSubstancesList.length;
  const discoveredCount = unlockedSubstanceIds.length;
  const progressPercent = Math.round((discoveredCount / totalCount) * 100);

  // Filtered list
  const filteredSubstances = allSubstancesList.filter((sub) => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'elementos' && !sub.category.includes('Elemento') && sub.category !== 'Gas Noble') return false;
      if (activeCategory === 'oxidos' && !sub.category.includes('Óxido')) return false;
      if (activeCategory === 'acidos' && !sub.category.includes('Ácido')) return false;
      if (activeCategory === 'hidroxidos' && !sub.category.includes('Hidróxido')) return false;
      if (activeCategory === 'sales' && !sub.category.includes('Sal')) return false;
      if (activeCategory === 'organicos' && !sub.category.includes('Orgánico') && !sub.category.includes('Hidrocarburo')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.formula.toLowerCase().includes(q) ||
        sub.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Find reactions involving the selected substance
  const getInvolvedReactions = (subId: string): Reaction[] => {
    return REACTIONS.filter(
      (rx) => rx.reactants.includes(subId) || rx.products.includes(subId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Catalog Progress Bar */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Enciclopedia Química del Alquimista
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compendio de sustancias, estructuras atómicas, enlaces químicos y aplicaciones de 10.º grado.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <div className="text-xs font-mono text-slate-300">
            Descubrimientos: <span className="text-emerald-400 font-bold">{discoveredCount}</span> / {totalCount} ({progressPercent}%)
          </div>
          <div className="w-full sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({allSubstancesList.length})
          </button>
          <button
            onClick={() => setActiveCategory('elementos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'elementos'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Elementos
          </button>
          <button
            onClick={() => setActiveCategory('oxidos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'oxidos'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Óxidos
          </button>
          <button
            onClick={() => setActiveCategory('acidos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'acidos'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ácidos
          </button>
          <button
            onClick={() => setActiveCategory('hidroxidos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'hidroxidos'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hidróxidos
          </button>
          <button
            onClick={() => setActiveCategory('sales')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'sales'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveCategory('organicos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'organicos'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orgánicos
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por fórmula o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Substances */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredSubstances.map((sub) => {
          const isUnlocked = unlockedSubstanceIds.includes(sub.id);

          if (!isUnlocked) {
            return (
              <div
                key={sub.id}
                className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex flex-col items-center justify-center text-center opacity-70 group hover:opacity-100 transition-opacity"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="font-mono text-xs font-semibold text-slate-400">???</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{sub.category}</div>
                <div className="text-[10px] text-slate-600 mt-2 font-mono">Por descubrir</div>
              </div>
            );
          }

          return (
            <div
              key={sub.id}
              onClick={() => setSelectedSubstance(sub)}
              className="bg-[#0b101d] border border-slate-800 rounded-xl p-3.5 hover:border-emerald-500/50 hover:bg-slate-900/90 cursor-pointer transition-all flex flex-col justify-between group shadow-md active:scale-[0.98]"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm text-white shrink-0 border shadow-inner"
                    style={{
                      backgroundColor: sub.color + '25',
                      borderColor: sub.color + '60',
                    }}
                  >
                    {sub.formula}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {sub.state}
                  </span>
                </div>

                <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {sub.name}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sub.category}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">{sub.atomicMass}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Substance Dossier Modal */}
      {selectedSubstance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0d1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-950">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shrink-0 border"
                  style={{
                    backgroundColor: selectedSubstance.color + '30',
                    borderColor: selectedSubstance.color,
                  }}
                >
                  {selectedSubstance.formula}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedSubstance.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{selectedSubstance.category}</span>
                    <span>·</span>
                    <span className="uppercase">{selectedSubstance.state}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubstance(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Chemical Identity Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-400">Masa Molecular</div>
                  <div className="font-mono text-sm font-semibold text-white mt-0.5">
                    {selectedSubstance.atomicMass}
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-400">Tipo de Enlace</div>
                  <div className="font-medium text-xs text-emerald-400 mt-0.5">
                    {selectedSubstance.bondType}
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-400">Elementos Clave</div>
                  <div className="font-mono text-sm font-semibold text-white mt-0.5">
                    {selectedSubstance.elements.join(', ')}
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-400">Nivel de Reactividad</div>
                  <div className="font-mono text-sm font-semibold text-amber-400 mt-0.5">
                    Nivel {selectedSubstance.dangerLevel}/4
                  </div>
                </div>
              </div>

              {/* Physical & Chemical Properties */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-slate-200">
                  Propiedades Físicas y Químicas:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedSubstance.properties}
                </p>
              </div>

              {/* Real World Applications */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-slate-200">
                  Aplicaciones en la Vida Real e Industria:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedSubstance.applications}
                </p>
              </div>

              {/* Reactions in which this substance participates */}
              <div className="space-y-2 pt-1">
                <div className="font-semibold text-slate-300">
                  Reacciones Vinculadas ({getInvolvedReactions(selectedSubstance.id).length}):
                </div>
                <div className="space-y-2">
                  {getInvolvedReactions(selectedSubstance.id).map((rx) => {
                    const isAsProduct = rx.products.includes(selectedSubstance.id);
                    return (
                      <div
                        key={rx.id}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">
                            {rx.balancedEquation}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {rx.reactionType} · {isAsProduct ? 'Producido' : 'Reactivo'}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded-md">
                          +{rx.discoveryXp} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Enciclopedia Oficial de 10.º Grado
              </span>
              <button
                onClick={() => {
                  setSelectedSubstance(null);
                  setCurrentScreen('lab');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Llevar al Laboratorio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
