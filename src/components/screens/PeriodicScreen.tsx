import React, { useState } from 'react';
import { Atom, Zap, Layers, Sparkles } from 'lucide-react';
import { PeriodicTableGrid } from '../PeriodicTableGrid';
import { useGame } from '../../context/GameContext';

export const PeriodicScreen: React.FC = () => {
  const { setCurrentScreen } = useGame();
  const [activeTab, setActiveTab] = useState<'table118' | 'bonds' | 'reactions'>('table118');

  return (
    <div className="space-y-6">
      {/* Header and Tab Selector */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Tabla Periódica Completa & Teoría de Enlaces
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              118 Elementos IUPAC
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-semibold">
              Tamara Villada Valencia & Adriana Isabel Martinez
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Estructuras atómicas 3D, configuración electrónica real, capas K-Q y mecanismos de enlace de 10.º grado.
          </p>
        </div>

        {/* Tab switch & Direct 3D Bond Lab CTA */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentScreen('bondlab')}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Laboratorio de Enlaces 3D</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('table118')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'table118'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              Tabla 118
            </button>
            <button
              onClick={() => setActiveTab('bonds')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'bonds'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Tipos de Enlace
            </button>
            <button
              onClick={() => setActiveTab('reactions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'reactions'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Tipos de Reacción
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Full 118 Elements Periodic Table Grid */}
      {activeTab === 'table118' && <PeriodicTableGrid />}

      {/* Tab 2: Chemical Bonds Theory */}
      {activeTab === 'bonds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                1. Enlace Iónico (Transferencia Total de Electrones)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ocurre entre un <strong>metal electropositivo</strong> (Grupos 1 y 2) y un <strong>no metal electronegativo</strong> (Grupos 16 y 17) con una diferencia de electronegatividad superior o igual a 1.7. El metal cede electrones formando un catión y el no metal los acepta formando un anión. La atracción electrostática pura ensambla redes cristalinas tridimensionales duras pero frágiles con altos puntos de fusión.
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300">
                {'2Na + Cl₂ ➔ 2NaCl  (ΔEN = 3.16 - 0.93 = 2.23)'}
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('bondlab')}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Simular NaCl en 3D</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Atom className="w-4 h-4" />
                2. Enlace Covalente Polar (Compartición Asimétrica)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ocurre entre no metales con diferencia de electronegatividad moderada (0.4 &lt; ΔEN &lt; 1.7). Los pares de electrones de valencia se comparten, pero son atraídos con mayor densidad hacia el átomo más electronegativo, originando momentos dipolares permanentes (δ+ y δ-).
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-sky-300">
                {'H₂O: Geometría angular de 104.5° con dipolos enlazantes permanentes'}
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('bondlab')}
              className="mt-2 text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              <span>Simular H₂O en 3D</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                3. Enlace Covalente No Polar (Compartición Simétrica)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ocurre entre átomos no metálicos con electronegatividades iguales o casi idénticas (ΔEN &le; 0.4). La nube electrónica se distribuye uniformemente entre ambos núcleos, sin polos eléctricos permanentes.
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                {'Moléculas diatómicas gaseosas: H₂, O₂, N₂, Cl₂'}
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('bondlab')}
              className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Simular O₂ en 3D</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                4. Enlace Covalente Simple, Doble y Triple
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Los enlaces simples comparten 1 par de electrones (1 enlace σ frontal); los dobles comparten 2 pares (1σ + 1π, ej. O=C=O, O=O); y los triples comparten 3 pares (1σ + 2π, ej. N≡N), presentando longitudes de enlace progresivamente más cortas y energías de disociación muy elevadas.
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
                {'N₂: Enlace triple N≡N con energía de disociación récord de 945 kJ/mol'}
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('bondlab')}
              className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Simular CO₂ en 3D</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Atom className="w-4 h-4" />
                5. Enlace Covalente Coordinado o Dativo
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tipo especial de enlace covalente donde el par de electrones enlazante es aportado por uno solo de los átomos participantes (donante con par libre, base de Lewis) a un átomo o catión con un orbital desocupado (aceptor, ácido de Lewis).
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300">
                {'NH₃ + H⁺ ➔ NH₄⁺ (Ion amonio) · H₂O + H⁺ ➔ H₃O⁺ (Ion hidronio)'}
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('bondlab')}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Simular NH₃ en 3D</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                6. Puentes de Hidrógeno & Enlace Metálico
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                El <strong>enlace metálico</strong> une cationes en un "mar de electrones" móviles deslocalizados. Los <strong>puentes de hidrógeno</strong> son interacciones intermoleculares dipolares intensas entre un hidrógeno unido a F, O o N y el par libre de otro átomo electronegativo contiguo.
              </p>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-rose-300">
                {'H₂O...H₂O (Estructura hexagonal del hielo y alto punto de ebullición del agua)'}
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('bondlab')}
              className="mt-2 text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>Abrir Laboratorio de Enlaces</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Reaction Types Theory */}
      {activeTab === 'reactions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
            <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wide">
              1. Síntesis (Combinación Directa)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dos o más reactivos simples reaccionan químicamente para formar un único compuesto más complejo: <code>A + B ➔ AB</code>.
            </p>
            <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {'2H₂ (g) + O₂ (g) ➔ 2H₂O (l)'}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
            <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wide">
              2. Descomposición
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un único compuesto se escinde en dos o más sustancias más sencillas por calor (termólisis), electricidad (electrólisis) o catalizador: <code>AB ➔ A + B</code>.
            </p>
            <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {'CaCO₃ (s) ➔ CaO (s) + CO₂ (g)↑ (≥ 850 °C)'}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
            <h4 className="font-bold text-xs text-cyan-400 uppercase tracking-wide">
              3. Desplazamiento Simple (Redox)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un elemento libre más reactivo sustituye a otro elemento en un compuesto químico debido a su mayor electropositividad o afinidad: <code>A + BC ➔ AC + B</code>.
            </p>
            <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {'Fe (s) + CuSO₄ (ac) ➔ FeSO₄ (ac) + Cu (s)↓'}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
            <h4 className="font-bold text-xs text-purple-400 uppercase tracking-wide">
              4. Doble Desplazamiento (Neutralización Ácido-Base)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dos compuestos intercambian iones formando un precipitado insoluble o una sal neutra con agua: <code>AB + CD ➔ AD + CB</code>.
            </p>
            <div className="font-mono text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {'HCl (ac) + NaOH (ac) ➔ NaCl (ac) + H₂O (l)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
