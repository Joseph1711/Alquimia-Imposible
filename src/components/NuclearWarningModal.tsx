import React, { useState, useMemo } from 'react';
import {
  Radiation,
  AlertOctagon,
  X,
  Zap,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Sliders,
  Layers,
  Atom,
  Flame,
  Activity,
  Plus,
  Trash2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

interface NuclearMaterial {
  id: string;
  name: string;
  symbol: string;
  isotope: string;
  type: 'fissile' | 'fertile' | 'fusion' | 'moderator' | 'reflector' | 'absorber';
  atomicNumber: number;
  atomicMass: number;
  fissionCrossSectionBarns: number; // in barns
  description: string;
  color: string;
  energyYieldMeV: number;
}

const NUCLEAR_MATERIALS: NuclearMaterial[] = [
  {
    id: 'U-235',
    name: 'Uranio-235 Enriquecido',
    symbol: 'U',
    isotope: '²³⁵U',
    type: 'fissile',
    atomicNumber: 92,
    atomicMass: 235.0439,
    fissionCrossSectionBarns: 585,
    description: 'Isótopo fisionable por neutrones térmicos. Emite ~2.4 neutrones por fisión.',
    color: '#34d399',
    energyYieldMeV: 202.5,
  },
  {
    id: 'Th-232',
    name: 'Torio-232 Fértil',
    symbol: 'Th',
    isotope: '²³²Th',
    type: 'fertile',
    atomicNumber: 90,
    atomicMass: 232.0381,
    fissionCrossSectionBarns: 7.4,
    description: 'Material fértil que captura neutrones lentos para transmutar en U-233.',
    color: '#38bdf8',
    energyYieldMeV: 198.0,
  },
  {
    id: 'H-2',
    name: 'Deuterio (Hidrógeno Pesado)',
    symbol: 'D',
    isotope: '²H',
    type: 'fusion',
    atomicNumber: 1,
    atomicMass: 2.0141,
    fissionCrossSectionBarns: 0.0005,
    description: 'Isótopo estable con 1 protón y 1 neutrón. Moderador y combustible de fusión.',
    color: '#60a5fa',
    energyYieldMeV: 3.27,
  },
  {
    id: 'H-3',
    name: 'Tritio (Hidrógeno Superpesado)',
    symbol: 'T',
    isotope: '³H',
    type: 'fusion',
    atomicNumber: 1,
    atomicMass: 3.0160,
    fissionCrossSectionBarns: 0.001,
    description: 'Radioisótopo beta emisor. Reacciona con deuterio reduciendo la barrera de Coulomb.',
    color: '#a78bfa',
    energyYieldMeV: 17.59,
  },
  {
    id: 'Li-6',
    name: 'Litio-6 Enriquecido',
    symbol: 'Li',
    isotope: '⁶Li',
    type: 'fusion',
    atomicNumber: 3,
    atomicMass: 6.0151,
    fissionCrossSectionBarns: 940,
    description: 'Reacciona exotérmicamente con neutrones produciendo tritio y helio.',
    color: '#f472b6',
    energyYieldMeV: 4.78,
  },
  {
    id: 'C-Graphite',
    name: 'Grafito Nuclear de Alta Pureza',
    symbol: 'C',
    isotope: '¹²C',
    type: 'moderator',
    atomicNumber: 6,
    atomicMass: 12.011,
    fissionCrossSectionBarns: 0.0035,
    description: 'Modera y frena neutrones rápidos haciéndolos térmicos para aumentar la fisión.',
    color: '#94a3b8',
    energyYieldMeV: 0,
  },
  {
    id: 'Be-Reflector',
    name: 'Berilio Reflector & Multiplicador',
    symbol: 'Be',
    isotope: '⁹Be',
    type: 'reflector',
    atomicNumber: 4,
    atomicMass: 9.0122,
    fissionCrossSectionBarns: 0.0076,
    description: 'Refleja neutrones hacia el núcleo y aporta neutrones por reacción (n, 2n).',
    color: '#facc15',
    energyYieldMeV: 0,
  },
  {
    id: 'B-Absorber',
    name: 'Boro-10 Absorbente (Veneno Neutrónico)',
    symbol: 'B',
    isotope: '¹⁰B',
    type: 'absorber',
    atomicNumber: 5,
    atomicMass: 10.811,
    fissionCrossSectionBarns: 3837,
    description: 'Captura masiva de neutrones térmicos sin fisionar, apagando reacciones.',
    color: '#f87171',
    energyYieldMeV: 0,
  },
];

export const NuclearWarningModal: React.FC = () => {
  const {
    isNuclearWarningOpen,
    setIsNuclearWarningOpen,
    triggerNuclearExperiment,
  } = useGame();

  // Interactive Chamber State
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(['U-235', 'Be-Reflector']);
  const [controlRodsPercent, setControlRodsPercent] = useState<number>(30); // 0% withdrawn to 100% fully inserted
  const [reflectorType, setReflectorType] = useState<'none' | 'beryllium' | 'tungsten'>('beryllium');
  const [neutronFlux, setNeutronFlux] = useState<'low' | 'medium' | 'high'>('high');
  const [lastTestOutcome, setLastTestOutcome] = useState<{
    status: 'subcritical' | 'critical' | 'supercritical';
    message: string;
    kEff: number;
    powerMW: number;
  } | null>(null);

  const handleClose = () => {
    sound.playClick();
    setIsNuclearWarningOpen(false);
  };

  const handleAddMaterial = (id: string) => {
    if (selectedMaterialIds.length >= 4) return;
    sound.playGlassClink();
    setSelectedMaterialIds((prev) => [...prev, id]);
  };

  const handleRemoveMaterial = (index: number) => {
    sound.playClick();
    setSelectedMaterialIds((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Physical calculations based on real nuclear engineering formulas ---
  const calculation = useMemo(() => {
    const materials = selectedMaterialIds.map((id) => NUCLEAR_MATERIALS.find((m) => m.id === id)).filter(Boolean) as NuclearMaterial[];

    let baseK = 0.2;
    let fissileCount = 0;
    let moderatorCount = 0;
    let reflectorCount = 0;
    let absorberCount = 0;
    let fusionPair = false;
    let totalMass = 0;
    let theoreticalEnergyMeV = 0;

    materials.forEach((mat) => {
      totalMass += mat.atomicMass;
      if (mat.type === 'fissile') {
        baseK += 0.65;
        fissileCount++;
        theoreticalEnergyMeV += mat.energyYieldMeV;
      } else if (mat.type === 'fertile') {
        baseK += 0.25;
        theoreticalEnergyMeV += mat.energyYieldMeV * 0.4;
      } else if (mat.type === 'moderator') {
        moderatorCount++;
        baseK += 0.35; // thermalizes neutrons, increasing cross section
      } else if (mat.type === 'reflector') {
        reflectorCount++;
        baseK += 0.38; // reduces leakage
      } else if (mat.type === 'absorber') {
        absorberCount++;
        baseK -= 0.65; // parasitic neutron absorption
      } else if (mat.type === 'fusion') {
        theoreticalEnergyMeV += mat.energyYieldMeV;
      }
    });

    // Detect fusion coupling D + T
    if (selectedMaterialIds.includes('H-2') && selectedMaterialIds.includes('H-3')) {
      fusionPair = true;
      baseK += 0.55;
    }

    // Impact of external reflector setting
    if (reflectorType === 'beryllium') baseK += 0.22;
    if (reflectorType === 'tungsten') baseK += 0.30;

    // Impact of control rods insertion (100% inserted = -0.9, 0% inserted = +0.1)
    const rodsDamping = (controlRodsPercent / 100) * 0.95;
    let effectiveK = Math.max(0.1, baseK - rodsDamping);

    // Neutron flux booster
    if (neutronFlux === 'medium') effectiveK *= 1.05;
    if (neutronFlux === 'high') effectiveK *= 1.15;

    effectiveK = Math.round(effectiveK * 100) / 100;

    // Classification
    let stateCategory: 'subcritical' | 'critical' | 'supercritical_slow' | 'supercritical_uncontrolled';
    if (effectiveK < 0.95) {
      stateCategory = 'subcritical';
    } else if (effectiveK <= 1.08) {
      stateCategory = 'critical';
    } else if (effectiveK < 1.35) {
      stateCategory = 'supercritical_slow';
    } else {
      stateCategory = 'supercritical_uncontrolled';
    }

    // Mass defect in atomic mass units and Einstein energy
    const massDefectU = (fissileCount * 0.215) + (fusionPair ? 0.0188 : 0);
    const energyJoules = massDefectU * 1.66054e-27 * Math.pow(299792458, 2);
    const powerOutputMW = Math.round(effectiveK * 850 * (fissileCount + (fusionPair ? 2 : 0)));

    return {
      effectiveK,
      stateCategory,
      materials,
      fissileCount,
      moderatorCount,
      absorberCount,
      fusionPair,
      theoreticalEnergyMeV: Math.round(theoreticalEnergyMeV),
      massDefectU: Math.round(massDefectU * 1000) / 1000,
      energyJoules,
      powerOutputMW,
    };
  }, [selectedMaterialIds, controlRodsPercent, reflectorType, neutronFlux]);

  const handleTestReactorReaction = () => {
    sound.playSpark();

    if (calculation.effectiveK >= 1.35) {
      // Supercritical runaway excursion -> Triggers cataclysmic detonation & devastation!
      setLastTestOutcome({
        status: 'supercritical',
        message: '¡EXCURSIÓN SUPERCRÍTICA INCONTROLADA! El flujo neutrónico sobrepasó el límite térmico.',
        kEff: calculation.effectiveK,
        powerMW: calculation.powerOutputMW,
      });
      // Start full 3D cinematic and devastating explosion
      setTimeout(() => {
        triggerNuclearExperiment();
      }, 700);
    } else if (calculation.effectiveK >= 0.95 && calculation.effectiveK <= 1.08) {
      // Stable critical equilibrium
      sound.playReactorHum();
      setLastTestOutcome({
        status: 'critical',
        message: '¡EQUILIBRIO CRÍTICO ESTACIONARIO (k = 1.0)! Reactor estable produciendo energía limpia continua sin riesgo.',
        kEff: calculation.effectiveK,
        powerMW: calculation.powerOutputMW,
      });
    } else {
      // Subcritical
      sound.playClick();
      setLastTestOutcome({
        status: 'subcritical',
        message: 'ESTADO SUBCRÍTICO (k < 1.0): La absorción de neutrones supera la producción. La reacción se autoextingue de forma segura.',
        kEff: calculation.effectiveK,
        powerMW: calculation.powerOutputMW,
      });
    }
  };

  const handleDirectDetonation = () => {
    // Quick direct nuclear explosion without sirens
    triggerNuclearExperiment();
  };

  if (!isNuclearWarningOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0a0f1d] border-2 border-red-500/60 rounded-2xl shadow-2xl overflow-hidden text-slate-200 my-auto">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-500/40 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Radiation className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="font-mono font-black text-white text-sm sm:text-base tracking-wide flex items-center gap-2">
                <span>SIMULADOR DE FISIÓN & REACCIONES NUCLEARES</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/30">
                  Interactivo 10.º Grado
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mezcla materiales, calibra moderadores neutrónicos y calcula la reactividad teórica (E = mc²)
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Top Live Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className={`p-2.5 rounded-xl border ${
              calculation.effectiveK >= 1.35
                ? 'bg-red-950/60 border-red-500/80 text-red-300'
                : calculation.effectiveK >= 0.95 && calculation.effectiveK <= 1.08
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase">Multiplicación (k_eff)</div>
              <div className="text-lg font-black tracking-tight flex items-baseline gap-1">
                <span>{calculation.effectiveK.toFixed(2)}</span>
                <span className="text-[10px] font-normal">
                  {calculation.effectiveK >= 1.35 ? 'SUPERCRÍTICO' : calculation.effectiveK >= 0.95 ? 'CRÍTICO' : 'SUBCRÍTICO'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Defecto de Masa (Δm)</div>
              <div className="text-lg font-black text-amber-400">
                {calculation.massDefectU} <span className="text-[10px] text-slate-400">u</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Energía Teórica (Q)</div>
              <div className="text-lg font-black text-cyan-400">
                {calculation.theoreticalEnergyMeV} <span className="text-[10px] text-slate-400">MeV</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Potencia Estimada</div>
              <div className="text-lg font-black text-purple-400">
                {calculation.powerOutputMW} <span className="text-[10px] text-slate-400">MWth</span>
              </div>
            </div>
          </div>

          {/* Active Core Assembly Grid */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-emerald-400" />
                <span>Cámara de Confinamiento Activa ({selectedMaterialIds.length}/4 sustancias)</span>
              </span>
              {selectedMaterialIds.length > 0 && (
                <button
                  onClick={() => setSelectedMaterialIds([])}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  Vaciar Cámara
                </button>
              )}
            </div>

            {/* Loaded slots */}
            <div className="min-h-[52px] p-2 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-2 flex-wrap">
              {selectedMaterialIds.length === 0 ? (
                <div className="text-xs text-slate-500 italic px-2">
                  Selecciona elementos o moderadores de la bandeja inferior para introducirlos a la cámara de prueba...
                </div>
              ) : (
                selectedMaterialIds.map((id, index) => {
                  const mat = NUCLEAR_MATERIALS.find((m) => m.id === id);
                  if (!mat) return null;
                  return (
                    <div
                      key={`${id}-${index}`}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-xs shadow-md"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="font-mono font-bold text-white">{mat.isotope}</span>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">{mat.name}</span>
                      <button
                        onClick={() => handleRemoveMaterial(index)}
                        className="text-slate-400 hover:text-red-400 ml-1 font-bold text-sm"
                        title="Retirar material"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tray of Nuclear Substances & Materials */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Bandeja de Sustancias Nucleares & Moderadores</span>
              </span>
              <span className="text-[11px] text-slate-400">Toca para añadir</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {NUCLEAR_MATERIALS.map((mat) => {
                const countInCore = selectedMaterialIds.filter((id) => id === mat.id).length;
                return (
                  <button
                    key={mat.id}
                    onClick={() => handleAddMaterial(mat.id)}
                    disabled={selectedMaterialIds.length >= 4}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group disabled:opacity-40"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: mat.color }}
                        />
                        <span className="font-mono font-bold text-white text-xs">{mat.isotope}</span>
                      </div>
                      {countInCore > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded font-mono font-bold">
                          ×{countInCore}
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-[11px] text-slate-200 truncate">{mat.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                      {mat.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Physics Controls Deck */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Controles de Reactividad & Confinamiento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Control Rods Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">Barras de Control (Boro):</span>
                  <span className="font-mono font-bold text-amber-400">{controlRodsPercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={controlRodsPercent}
                  onChange={(e) => setControlRodsPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>0% (Retiradas)</span>
                  <span>100% (Apagado)</span>
                </div>
              </div>

              {/* Reflector Material Selector */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 block">Reflector de Neutrones:</label>
                <select
                  value={reflectorType}
                  onChange={(e) => setReflectorType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="none">Sin reflector (Fuga alta)</option>
                  <option value="beryllium">Berilio metálico (Be)</option>
                  <option value="tungsten">Carburo de Tungsteno (WC)</option>
                </select>
              </div>

              {/* Neutron Source */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 block">Flujo de Neutrones:</label>
                <select
                  value={neutronFlux}
                  onChange={(e) => setNeutronFlux(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="low">Bajo (Neutrones de fondo)</option>
                  <option value="medium">Medio (Fuente de Berilio)</option>
                  <option value="high">Alto (Generador pulsado)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Test Outcome Feedback Banner */}
          {lastTestOutcome && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              lastTestOutcome.status === 'supercritical'
                ? 'bg-red-950/70 border-red-500 text-red-200 animate-pulse'
                : lastTestOutcome.status === 'critical'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}>
              <Activity className="w-4 h-4 shrink-0 mt-0.5 text-current" />
              <div>
                <div className="font-bold font-mono uppercase tracking-wider">
                  Resultado del Ensayo: {lastTestOutcome.status} (k = {lastTestOutcome.kEff})
                </div>
                <div className="mt-0.5 leading-relaxed">{lastTestOutcome.message}</div>
              </div>
            </div>
          )}

          {/* Scientific Equations and Disclaimer */}
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ecuación Representativa: Fisión de Uranio-235</span>
            </div>
            <p className="font-mono text-emerald-300 text-[10px]">
              ²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 3 ¹₀n + ΔE (~200 MeV)
            </p>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Fines exclusivamente educativos: modelos didácticos de física subatómica y reactores teóricos sin instrucciones operativas ni diseños de manufactura de armas reales.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-400 font-mono">
            {calculation.effectiveK >= 1.35 ? (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                ¡ATENCIÓN: Reacción desbocada provocará detonación!
              </span>
            ) : (
              <span>k = {calculation.effectiveK} · Reactor dentro de límites de contención</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>

            {/* Direct detonation button for instant destruction testing */}
            <button
              onClick={handleDirectDetonation}
              className="px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 bg-red-950/70 hover:bg-red-900 border border-red-500/50 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Disparar detonación inmediata y cinemática"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Detonación Inmediata</span>
              <span className="sm:hidden">Detonar</span>
            </button>

            {/* Test Interactive Reaction CTA */}
            <button
              onClick={handleTestReactorReaction}
              disabled={selectedMaterialIds.length === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                calculation.effectiveK >= 1.35
                  ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white animate-pulse shadow-red-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {calculation.effectiveK >= 1.35
                  ? '¡INICIAR FISIÓN SUPERCRÍTICA!'
                  : 'PROBAR REACCIÓN & CONFINAMIENTO'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
