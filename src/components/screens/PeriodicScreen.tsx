import React, { useState } from 'react';
import { Atom, Zap, Layers, Sparkles } from 'lucide-react';
import { PeriodicTableGrid } from '../PeriodicTableGrid';

export const PeriodicScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table118' | 'bonds' | 'reactions'>('table118');

  return (
    <div className="space-y-6">
      {/* Header and Tab Selector */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Tabla Periódica Completa & Teoría de Enlaces
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Los 118 elementos químicos oficiales de la IUPAC, configuración electrónica y mecanismos de reacción de 10.º grado.
          </p>
        </div>

        {/* Tab switch */}
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
            Tabla 118 Elementos
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

      {/* Tab 1: Full 118 Elements Periodic Table Grid */}
      {activeTab === 'table118' && <PeriodicTableGrid />}

      {/* Tab 2: Chemical Bonds Theory */}
      {activeTab === 'bonds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              1. Enlace Iónico (Transferencia Total de Electrones)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ocurre entre un <strong>metal electropositivo</strong> (Grupos 1 y 2) y un <strong>no metal electronegativo</strong> (Grupos 16 y 17) con una diferencia de electronegatividad superior o igual a 1.7. El metal cede electrones formando un catión y el no metal los acepta formando un anión. La atracción electrostática pura ensambla redes cristalinas tridimensionales duras pero frágiles con altos puntos de fusión.
            </p>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300">
              {'2Na + Cl₂ ➔ 2NaCl  (ΔEN = 3.16 - 0.93 = 2.23)'}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Atom className="w-4 h-4" />
              2. Enlace Covalente Polar (Compartición Asimétrica)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ocurre entre no metales con diferencia de electronegatividad moderada (0.4 &lt; ΔEN &lt; 1.7). Los pares de electrones de valencia se comparten, pero son atraídos con mayor densidad hacia el átomo más electronegativo, originando momentos dipolares permanentes (δ+ y δ-).
            </p>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-sky-300">
              {'H₂O: Geometría angular de 104.5° con dipolos enlazantes permanentes'}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              3. Enlace Covalente No Polar (Compartición Simétrica)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ocurre entre átomos no metálicos con electronegatividades iguales o casi idénticas (ΔEN &le; 0.4). La nube electrónica se distribuye uniformemente entre ambos núcleos, sin polos eléctricos permanentes.
            </p>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
              {'Moléculas diatómicas gaseosas: H₂, O₂, N₂, Cl₂'}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              4. Enlace Metálico y Regla del Octeto
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modelo del "mar de electrones": los cationes metálicos se ordenan en una red cristalina compacta rodeada por electrones de valencia completamente deslocalizados y libres, lo que explica la conductividad eléctrica, conductividad térmica, ductilidad y brillo especular de metales como Au, Ag, Cu y Fe.
            </p>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
              {'Regla del Octeto: Los átomos buscan 8 electrones en su capa de valencia (ns² np⁶)'}
            </div>
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
