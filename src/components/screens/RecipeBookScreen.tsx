import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Flame,
  Zap,
  Gauge,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
  AlertTriangle,
  FlaskConical,
  Info,
  Bomb,
  Radiation,
  Atom,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SUBSTANCES } from '../../data/chemistryData';
import { ELEMENTS_118 } from '../../data/elements118';
import {
  ADVANCED_REACTIONS,
  AdvancedReaction,
  TemperatureLevel,
  PressureLevel,
  CatalystType,
  ElectricalState,
  ConcentrationLevel,
} from '../../data/reactionsEngine';
import { NuclearWarningModal } from '../NuclearWarningModal';

type CategoryFilter = 'all' | 'nuclear' | 'explosive' | 'synthesis' | 'acid_base' | 'industrial' | 'redox';

export const RecipeBookScreen: React.FC = () => {
  const {
    unlockedSubstanceIds,
    analyzedElementSymbols,
    loadRecipe,
    loadAndDetonateNuclearReaction,
    setIsNuclearWarningOpen,
    setCurrentScreen,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'discovered' | 'undiscovered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  // Helper to resolve reactant display details
  const getSubstanceOrElement = (id: string) => {
    const el = ELEMENTS_118.find((e) => e.symbol === id);
    if (el) {
      return {
        id: el.symbol,
        name: el.name,
        formula: el.symbol,
        color: el.color,
        isElement: true,
        isUnlocked: true, // all 118 elements available from start
        isAnalyzed: analyzedElementSymbols.includes(el.symbol),
      };
    }
    const sub = SUBSTANCES[id];
    if (sub) {
      return {
        id: sub.id,
        name: sub.name,
        formula: sub.formula,
        color: sub.color,
        isElement: false,
        isUnlocked: unlockedSubstanceIds.includes(sub.id),
        isAnalyzed: true,
      };
    }
    return {
      id,
      name: id,
      formula: id,
      color: '#38bdf8',
      isElement: false,
      isUnlocked: unlockedSubstanceIds.includes(id),
      isAnalyzed: false,
    };
  };

  // Helper to classify recipe into category tabs
  const getRecipeCategory = (rx: AdvancedReaction): CategoryFilter => {
    if (rx.id === 'rx_nuclear_critical_excursion' || rx.id.startsWith('rx_nuclear_') || rx.reactants.includes('U')) {
      return 'nuclear';
    }
    if (rx.visualEffect === 'explosion' || rx.reactionType === 'Reacción Explosiva') {
      return 'explosive';
    }
    if (
      rx.reactionType === 'Doble Desplazamiento (Neutralización)' ||
      rx.reactants.includes('HCl') ||
      rx.reactants.includes('NaOH') ||
      rx.reactants.includes('HNO3')
    ) {
      return 'acid_base';
    }
    if (
      rx.requiredPressure === 'high' ||
      rx.requiredCatalyst ||
      rx.id.includes('haber') ||
      rx.id.includes('sulfur') ||
      rx.id.includes('aqua_regia')
    ) {
      return 'industrial';
    }
    if (rx.reactionType === 'Desplazamiento Simple' || rx.reactionType === 'Redox') {
      return 'redox';
    }
    return 'synthesis';
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return ADVANCED_REACTIONS.filter((rx) => {
      const isNuclear =
        rx.id === 'rx_nuclear_critical_excursion' ||
        rx.id.startsWith('rx_nuclear_') ||
        (rx.reactants.includes('U') && rx.reactants.includes('Be'));

      // Category filter
      if (selectedCategory === 'nuclear') {
        if (!isNuclear) return false;
      } else if (selectedCategory === 'explosive') {
        if (!isNuclear && rx.visualEffect !== 'explosion' && rx.reactionType !== 'Reacción Explosiva') {
          return false;
        }
      } else if (selectedCategory !== 'all') {
        const cat = getRecipeCategory(rx);
        if (cat !== selectedCategory) return false;
      }

      // Status filter
      const isDiscovered = rx.products.every((p) => unlockedSubstanceIds.includes(p));
      if (statusFilter === 'discovered' && !isDiscovered) return false;
      if (statusFilter === 'undiscovered' && isDiscovered) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEq = rx.balancedEquation.toLowerCase().includes(q);
        const matchesExplanation = rx.explanation.toLowerCase().includes(q);
        const matchesReactants = rx.reactants.some((r) => {
          const item = getSubstanceOrElement(r);
          return item.name.toLowerCase().includes(q) || item.formula.toLowerCase().includes(q);
        });
        const matchesProducts = rx.products.some((p) => {
          const item = getSubstanceOrElement(p);
          return item.name.toLowerCase().includes(q) || item.formula.toLowerCase().includes(q);
        });
        return matchesEq || matchesExplanation || matchesReactants || matchesProducts;
      }

      return true;
    });
  }, [selectedCategory, statusFilter, searchQuery, unlockedSubstanceIds, analyzedElementSymbols]);

  // Overall statistics
  const totalRecipes = ADVANCED_REACTIONS.length;
  const discoveredRecipesCount = ADVANCED_REACTIONS.filter((rx) =>
    rx.products.every((p) => unlockedSubstanceIds.includes(p))
  ).length;
  const explosiveCount = ADVANCED_REACTIONS.filter(
    (rx) => rx.visualEffect === 'explosion' || rx.reactionType === 'Reacción Explosiva'
  ).length;

  // Handle Load into Vessel
  const handleLoadRecipe = (rx: AdvancedReaction) => {
    loadRecipe(rx.reactants, {
      temperature: rx.minTemperature || 'ambient',
      pressure: rx.requiredPressure || 'standard',
      catalyst: rx.requiredCatalyst || 'none',
      electricity: rx.requiredElectricity || 'none',
      concentration: rx.requiredConcentration || 'normal',
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner with Rich Visual Reaction Bench Artwork */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 min-h-[170px] flex flex-col justify-end p-5 sm:p-7 shadow-2xl">
        <img
          src="/src/assets/images/chemistry_reaction_bench_1794361260664.jpg"
          alt="Mesa de Síntesis y Reacciones Químicas"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/75 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/40 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Grimorio de Reacciones
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                Tamara Villada Valencia & Adriana Isabel Martinez
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 text-xs font-semibold border border-red-500/40 flex items-center gap-1">
                <Bomb className="w-3 h-3 text-red-400" />
                {explosiveCount} Explosivas
              </span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-950/60 text-yellow-300 text-xs font-semibold border border-yellow-500/40 flex items-center gap-1">
                <Radiation className="w-3 h-3 text-yellow-400" />
                Fisión Nuclear
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
              Recetario Químico & Fórmulas de Síntesis
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consulta fórmulas empíricas, reactivos necesarios y condiciones termodinámicas (Bunsen, alta presión, arcos de chispa) para sintetizar compuestos reales y desencadenar deflagraciones controladas.
            </p>
          </div>

          {/* Quick Counter Box */}
          <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl shrink-0 shadow-lg">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Descubiertas</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {discoveredRecipesCount} / {totalRecipes}
              </div>
            </div>
            <div className="w-px h-9 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Efectividad</div>
              <div className="text-xl font-mono font-bold text-amber-400">
                {Math.round((discoveredRecipesCount / totalRecipes) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Special Nuclear Fission Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-[#1a0a0a] to-slate-950 border-2 border-red-500/60 p-5 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-900/60 text-amber-300 text-xs font-mono font-bold tracking-wider border border-red-500/70 flex items-center gap-1.5 shadow-sm shadow-red-950">
                <Radiation className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                REACCIÓN DE FISIÓN NUCLEAR EN CADENA
              </span>
              <span className="text-xs font-mono text-red-300 font-semibold bg-black/40 px-2 py-0.5 rounded border border-red-900/60">
                ²³⁵U + ⁹Be (Reflector) ➔ ¹⁴¹Ba + ⁹²Kr + 3n⁰ (200 MeV)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              Fórmula de Detonación Nuclear Didáctica
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Combina <strong>Uranio-235 metálico (U)</strong> con reflector neutrónico de <strong>Berilio (Be)</strong> en cámara presurizada a <strong>200 atm</strong> y chispa de excitación. Desencadena una <strong>explosión masiva en el laboratorio</strong> con onda expansiva tridimensional, destello térmico, hongo de humo y devastación del banco de trabajo con protocolo de descontaminación posterior.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={loadAndDetonateNuclearReaction}
              className="px-4 py-2.5 rounded-xl font-black font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-xl shadow-red-950/80 flex items-center gap-2 active:scale-95 transition-all"
              title="Cargar reactivos y detonar la explosión nuclear masiva en el laboratorio"
            >
              <Radiation className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Detonar Fisión en Laboratorio</span>
            </button>
            <button
              onClick={() => setIsNuclearWarningOpen(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 transition-all flex items-center gap-1.5 shadow-md"
              title="Ajustar barras de control de boro, moderador y sección eficaz en la cámara interactiva"
            >
              <Atom className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cámara de Criticidad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        {/* Search bar + Status Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por sustancia, fórmula (H₂O, NaCl, U, Be, KNO₃), reactivo o concepto..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas ({totalRecipes})
            </button>
            <button
              onClick={() => setStatusFilter('discovered')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'discovered'
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Descubiertas ({discoveredRecipesCount})
            </button>
            <button
              onClick={() => setStatusFilter('undiscovered')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'undiscovered'
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Por Descubrir ({totalRecipes - discoveredRecipesCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Categoría:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todas las Fórmulas
          </button>
          <button
            onClick={() => setSelectedCategory('nuclear')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'nuclear'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                : 'bg-slate-900 text-red-400 hover:text-red-300 border border-red-900/60'
            }`}
          >
            <Radiation className="w-3.5 h-3.5" />
            Fisión Nuclear
          </button>
          <button
            onClick={() => setSelectedCategory('explosive')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'explosive'
                ? 'bg-red-900/80 text-red-200 border border-red-500/60 shadow-lg shadow-red-950/50'
                : 'bg-slate-900 text-red-400 hover:text-red-300 border border-red-900/40'
            }`}
          >
            <Bomb className="w-3.5 h-3.5" />
            Explosivas y Pirotecnia
          </button>
          <button
            onClick={() => setSelectedCategory('synthesis')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'synthesis'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Síntesis Clásica y Enlaces
          </button>
          <button
            onClick={() => setSelectedCategory('acid_base')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'acid_base'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Ácidos, Bases y Sales
          </button>
          <button
            onClick={() => setSelectedCategory('industrial')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'industrial'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            Procesos Industriales y Alta Presión
          </button>
          <button
            onClick={() => setSelectedCategory('redox')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'redox'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Redox y Desplazamiento
          </button>
        </div>
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.map((rx) => {
          const isDiscovered = rx.products.every((p) => unlockedSubstanceIds.includes(p));
          const isNuclear =
            rx.id === 'rx_nuclear_critical_excursion' ||
            rx.id.startsWith('rx_nuclear_') ||
            (rx.reactants.includes('U') && rx.reactants.includes('Be'));
          const isExplosive =
            isNuclear ||
            rx.visualEffect === 'explosion' ||
            rx.reactionType === 'Reacción Explosiva';

          return (
            <div
              key={rx.id}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg ${
                isNuclear
                  ? 'bg-gradient-to-b from-[#240a0a] via-[#120505] to-[#0a0303] border-red-500/80 shadow-red-950/70 hover:border-red-400 ring-1 ring-red-500/30'
                  : isExplosive
                  ? 'bg-gradient-to-b from-[#180a0a] to-[#0c0505] border-red-900/60 hover:border-red-500/50'
                  : isDiscovered
                  ? 'bg-[#0d1424] border-slate-800 hover:border-emerald-500/40'
                  : 'bg-[#0b101d] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Card Header: Type Badge & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                        isNuclear
                          ? 'bg-red-600 text-white font-bold flex items-center gap-1 shadow-md shadow-red-950'
                          : isExplosive
                          ? 'bg-red-950/80 text-red-300 border border-red-600/50 flex items-center gap-1 shadow-sm shadow-red-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isNuclear ? (
                        <Radiation className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                      ) : (
                        isExplosive && <Bomb className="w-3 h-3 text-red-400 animate-pulse" />
                      )}
                      {isNuclear ? 'Deflagración Nuclear (Fisión)' : rx.reactionType}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400/90 font-medium bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                      +{rx.discoveryXp} XP
                    </span>
                  </div>

                  {isDiscovered ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Descubierta
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-full shrink-0 border border-slate-800">
                      <Lock className="w-3 h-3 text-slate-500" />
                      Por Sintetizar
                    </span>
                  )}
                </div>

                {/* Balanced Chemical Equation Box */}
                <div
                  className={`p-3 rounded-xl border font-mono text-sm sm:text-base font-bold tracking-tight text-center overflow-x-auto ${
                    isNuclear
                      ? 'bg-red-950/70 border-red-500/70 text-yellow-300 shadow-inner'
                      : isExplosive
                      ? 'bg-red-950/30 border-red-800/50 text-red-100 shadow-inner'
                      : 'bg-slate-900/90 border-slate-800 text-emerald-300'
                  }`}
                >
                  {rx.balancedEquation}
                </div>

                {/* Reactants Required */}
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                    <span>Reactivos a introducir en el recipiente:</span>
                    <span className="text-slate-500 font-mono text-[11px]">{rx.reactants.length} componente(s)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rx.reactants.map((rId) => {
                      const item = getSubstanceOrElement(rId);
                      return (
                        <div
                          key={rId}
                          className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-bold text-white">{item.formula}</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">({item.name})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Required Environmental Conditions */}
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-400 font-semibold">Condiciones Requeridas:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
                    {/* Temperature */}
                    <div
                      className={`p-2 rounded-lg border flex flex-col justify-between ${
                        rx.minTemperature === 'extreme'
                          ? 'bg-red-950/40 border-red-700/60 text-red-300'
                          : rx.minTemperature === 'moderate'
                          ? 'bg-amber-950/40 border-amber-700/50 text-amber-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                        <Flame className="w-3 h-3 text-amber-400" />
                        Temp
                      </div>
                      <span className="font-semibold text-xs mt-0.5">
                        {rx.minTemperature === 'extreme'
                          ? '950 °C (Crisol)'
                          : rx.minTemperature === 'moderate'
                          ? '450 °C (Bunsen)'
                          : 'Ambiente (25 °C)'}
                      </span>
                    </div>

                    {/* Pressure */}
                    <div
                      className={`p-2 rounded-lg border flex flex-col justify-between ${
                        rx.requiredPressure === 'high'
                          ? 'bg-purple-950/40 border-purple-700/50 text-purple-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                        <Gauge className="w-3 h-3 text-purple-400" />
                        Presión
                      </div>
                      <span className="font-semibold text-xs mt-0.5">
                        {rx.requiredPressure === 'high' ? '200 atm (Alta)' : '1 atm (Estándar)'}
                      </span>
                    </div>

                    {/* Spark / Electricity */}
                    <div
                      className={`p-2 rounded-lg border flex flex-col justify-between ${
                        rx.requiredElectricity === 'spark'
                          ? 'bg-sky-950/50 border-sky-600/60 text-sky-300'
                          : rx.requiredElectricity === 'electrolysis'
                          ? 'bg-blue-950/50 border-blue-600/60 text-blue-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                        <Zap className="w-3 h-3 text-sky-400" />
                        Electricidad
                      </div>
                      <span className="font-semibold text-xs mt-0.5">
                        {rx.requiredElectricity === 'spark'
                          ? 'Chispa Arco'
                          : rx.requiredElectricity === 'electrolysis'
                          ? 'Electrólisis'
                          : 'Ninguna'}
                      </span>
                    </div>

                    {/* Catalyst */}
                    <div
                      className={`p-2 rounded-lg border flex flex-col justify-between ${
                        rx.requiredCatalyst
                          ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        Catalizador
                      </div>
                      <span className="font-semibold text-xs mt-0.5">
                        {rx.requiredCatalyst || 'Sin Catalizador'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Products */}
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-semibold">Productos generados:</div>
                  <div className="flex flex-wrap gap-2">
                    {rx.products.map((pId) => {
                      const item = getSubstanceOrElement(pId);
                      return (
                        <div
                          key={pId}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center gap-1.5"
                        >
                          <span className="font-mono font-bold text-emerald-300">{item.formula}</span>
                          <span className="text-emerald-400/80 text-[11px]">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation text */}
                <div className="pt-1 border-t border-slate-800/80">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {rx.explanation}
                  </p>
                  {isExplosive && (
                    <div className="mt-2 p-2.5 rounded-lg bg-red-950/60 border border-red-600/40 text-[11px] text-red-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Riesgo de deflagración:</strong> {isNuclear
                          ? 'Produce una violenta fisión en cadena no confinada que desata una colosal onda expansiva, destello blanco y la devastación temporal del laboratorio experimental.'
                          : 'Desprende una onda expansiva térmica con rápida expansión molar de gases calientes y choque acústico.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 sm:px-5 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                <span className="text-[11px] text-slate-400 italic">
                  {rx.conditionDescription}
                </span>

                <div className="flex items-center gap-2">
                  {isNuclear ? (
                    <>
                      <button
                        onClick={() => handleLoadRecipe(rx)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 transition-colors"
                        title="Cargar reactivos al matraz para mezclarlos manualmente"
                      >
                        Cargar en Matraz
                      </button>
                      <button
                        onClick={loadAndDetonateNuclearReaction}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/70 flex items-center gap-1.5 active:scale-95 transition-all"
                        title="Detonar la explosión nuclear masiva en el laboratorio"
                      >
                        <Radiation className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Detonar Fisión</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLoadRecipe(rx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 active:scale-95 ${
                        isExplosive
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-950'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950'
                      }`}
                      title="Carga los reactivos y las condiciones exactas en el matraz"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Cargar en el Matraz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="p-12 text-center bg-[#0b101d] border border-slate-800 rounded-2xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No se encontraron recetas con los filtros actuales</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Prueba a restablecer la búsqueda o selecciona la categoría "Todas las Fórmulas".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Criticality Chamber Modal mounted here as well */}
      <NuclearWarningModal />
    </div>
  );
};
