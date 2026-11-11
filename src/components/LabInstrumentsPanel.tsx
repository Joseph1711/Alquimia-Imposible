import React, { useMemo } from 'react';
import {
  FlaskConical,
  Flame,
  Activity,
  Layers,
  Thermometer,
  Gauge,
  Scale,
  RotateCw,
  Wind,
  ShieldAlert,
  Info,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { useGame, VesselType, AnalyticalToolType } from '../context/GameContext';
import { VESSELS_DATA, VesselProperty } from '../data/vesselsData';
import { ELEMENTS_118 } from '../data/elements118';
import { SUBSTANCES } from '../data/chemistryData';
import { sound } from '../utils/audio';

export const LabInstrumentsPanel: React.FC = () => {
  const {
    selectedVessel,
    setSelectedVessel,
    activeAnalyticalTool,
    setActiveAnalyticalTool,
    isMagneticStirrerActive,
    setIsMagneticStirrerActive,
    stirrerRpm,
    setStirrerRpm,
    isFumeHoodActive,
    setIsFumeHoodActive,
    isVesselSealed,
    setIsVesselSealed,
    selectedReactants,
    conditions,
  } = useGame();

  const currentVesselData = VESSELS_DATA[selectedVessel];

  // Helper to calculate total molar mass of reactants currently in vessel
  const molarMassCalc = useMemo(() => {
    let totalMolarMass = 0;
    const details: { formula: string; mass: number; name: string }[] = [];

    selectedReactants.forEach((id) => {
      const el = ELEMENTS_118.find((e) => e.symbol === id);
      if (el) {
        const mass = parseFloat(el.atomicMass.replace(/[()]/g, '')) || el.number * 2;
        totalMolarMass += mass;
        details.push({ formula: el.symbol, mass, name: el.name });
        return;
      }
      const sub = SUBSTANCES[id];
      if (sub && sub.atomicMass) {
        const mass = parseFloat(sub.atomicMass.replace(/[^0-9.]/g, '')) || 50;
        totalMolarMass += mass;
        details.push({ formula: sub.formula, mass, name: sub.name });
        return;
      }
    });

    return {
      total: Math.round(totalMolarMass * 100) / 100,
      details,
    };
  }, [selectedReactants]);

  // Helper to calculate approximate real pH of current mixture
  const phAnalysis = useMemo(() => {
    if (selectedReactants.length === 0) {
      return {
        ph: 7.0,
        character: 'Neutro (Vessel Vacío)',
        color: '#10b981',
        description: 'Recipiente limpio sin reactivos.',
      };
    }

    let acidityPoints = 0;
    let basicityPoints = 0;

    selectedReactants.forEach((id) => {
      // Strong acids
      if (['HCl', 'HNO3', 'H2SO4'].includes(id)) acidityPoints += 6;
      else if (['H3PO4', 'H2S'].includes(id)) acidityPoints += 3;
      else if (['Cl', 'F', 'Br', 'I', 'S'].includes(id)) acidityPoints += 1.5;

      // Strong bases
      if (['NaOH', 'KOH', 'CaOH2'].includes(id)) basicityPoints += 6;
      else if (['NH3', 'NaHCO3', 'LiOH'].includes(id)) basicityPoints += 4;
      else if (['CaO', 'Na2O', 'K2O'].includes(id)) basicityPoints += 3.5;
      else if (['Na', 'K', 'Li', 'Ca', 'Ba', 'Mg'].includes(id)) basicityPoints += 2.5;
    });

    let ph = 7.0;
    if (acidityPoints > basicityPoints) {
      const netAcid = acidityPoints - basicityPoints;
      ph = Math.max(0.8, 7.0 - netAcid * 1.1);
    } else if (basicityPoints > acidityPoints) {
      const netBase = basicityPoints - acidityPoints;
      ph = Math.min(13.8, 7.0 + netBase * 1.15);
    }

    ph = Math.round(ph * 10) / 10;

    let character = 'Neutro';
    let color = '#10b981';
    let description = 'Solución en equilibrio ácido-base.';

    if (ph < 3.0) {
      character = 'Ácido Fuerte';
      color = '#ef4444';
      description = 'Alta concentración de iones hidronio [H⁺]. pH corrosivo.';
    } else if (ph < 6.5) {
      character = 'Ácido Débil';
      color = '#f97316';
      description = 'Presencia de acidez moderada.';
    } else if (ph <= 7.5) {
      character = 'Neutro';
      color = '#10b981';
      description = 'Concentración equivalente de [H⁺] y [OH⁻] (pH ≈ 7).';
    } else if (ph <= 11.5) {
      character = 'Base Moderada';
      color = '#38bdf8';
      description = 'Medio alcalino con presencia de iones hidroxilo [OH⁻].';
    } else {
      character = 'Base Fuerte';
      color = '#a855f7';
      description = 'Alta concentración de iones [OH⁻]. pH fuertemente cáustico.';
    }

    return { ph, character, color, description };
  }, [selectedReactants]);

  // Temperature numerical mapping
  const currentTempNum = conditions.temperature === 'extreme' ? 950 : conditions.temperature === 'moderate' ? 450 : 25;
  const isThermalShockRisk = currentTempNum > currentVesselData.maxTemperature;

  return (
    <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-3.5 space-y-3.5 shadow-xl text-slate-200">
      {/* Top Header: Vessel Selector with Expanded Laboratory Instruments */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            Recipiente & Instrumento de Reacción:
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {currentVesselData.capacity} · {currentVesselData.material}
          </span>
        </div>

        {/* Vessel Carousel Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-xs">
          {(Object.keys(VESSELS_DATA) as VesselType[]).map((vKey) => {
            const v = VESSELS_DATA[vKey];
            const isSelected = selectedVessel === vKey;

            return (
              <button
                key={vKey}
                onClick={() => {
                  sound.playClick();
                  setSelectedVessel(vKey);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold scale-[1.02]'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
                title={`${v.name}: ${v.recommendedUse}`}
              >
                <span className="text-xs font-semibold leading-tight">{v.name}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {v.capacity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Vessel Properties & Thermal Inspector Badge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{currentVesselData.name}</span>
              <span className="text-[11px] font-normal text-slate-400 font-mono italic">
                ({currentVesselData.traditionalName})
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              <strong>Habilidad específica:</strong> {currentVesselData.specialAbility}
            </p>
          </div>

          {/* Quick Special Controls per Vessel */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedVessel === 'erlenmeyer' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsVesselSealed(!isVesselSealed);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isVesselSealed
                    ? 'bg-purple-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                }`}
                title="Sellar con tapón hermético de borosilicato para atrapar gases generados"
              >
                {isVesselSealed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isVesselSealed ? 'Tapón Sellado' : 'Tapón Abierto'}</span>
              </button>
            )}

            {selectedVessel === 'beaker' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsMagneticStirrerActive(!isMagneticStirrerActive);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isMagneticStirrerActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                }`}
                title="Activar o desactivar imán de agitación magnética en el fondo del vaso"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isMagneticStirrerActive ? 'animate-spin' : ''}`} />
                <span>{isMagneticStirrerActive ? `${stirrerRpm} rpm (Activo)` : 'Agitador Apagado'}</span>
              </button>
            )}

            {selectedVessel === 'crucible' && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-600/60 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Refractario (1200 °C)
              </span>
            )}
          </div>
        </div>

        {/* Thermal Shock Warning if temperature exceeds vessel max */}
        {isThermalShockRisk ? (
          <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/70 text-red-200 text-xs flex items-start gap-2 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong>¡Riesgo de Choque Térmico!</strong> La temperatura actual ({currentTempNum} °C) excede la resistencia máxima de este material ({currentVesselData.maxTemperature} °C).
              <span className="block text-[11px] text-red-300 mt-0.5">
                Para calcinación o fundición a calor extremo, selecciona el <strong>Crisol de Porcelana</strong> refractario.
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300 pt-1">
            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Resistencia Térmica</span>
              <span className="font-bold text-white">{currentVesselData.maxTemperature} °C máx.</span>
            </div>
            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Retención de Gases</span>
              <span className="font-bold text-cyan-400">
                {currentVesselData.gasTight ? (isVesselSealed ? 'Hermético (100%)' : 'Canalizado') : 'Abierto a la atmósfera'}
              </span>
            </div>
            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Choque Térmico</span>
              <span className="font-bold text-emerald-400 uppercase">{currentVesselData.thermalShockResistance}</span>
            </div>
            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Uso Óptimo</span>
              <span className="font-bold text-amber-400 truncate block" title={currentVesselData.bestFor.join(', ')}>
                {currentVesselData.bestFor[0]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Laboratory Analytical Instruments Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Sondas e Instrumentos Analíticos Activos:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsFumeHoodActive(!isFumeHoodActive);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition ${
                isFumeHoodActive
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
              title="Campana extractora de vapores tóxicos y humos"
            >
              <Wind className="w-3 h-3" />
              <span>{isFumeHoodActive ? 'Campana ON' : 'Campana OFF'}</span>
            </button>
          </div>
        </div>

        {/* 4 Multi-Instrument Live Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {/* 1. Peachímetro Digital & Papel Tornasol */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phAnalysis.color }} />
                Peachímetro & Tornasol
              </span>
              <span className="text-sm font-mono font-black" style={{ color: phAnalysis.color }}>
                pH {phAnalysis.ph}
              </span>
            </div>

            {/* Litmus Strip Indicator Bar */}
            <div className="my-1.5">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-emerald-400 to-purple-600 relative overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white border border-black rounded-full shadow-md transform -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${(phAnalysis.ph / 14) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-semibold flex items-center justify-between" style={{ color: phAnalysis.color }}>
              <span>{phAnalysis.character}</span>
              <span className="text-[10px] text-slate-400 font-mono">[H⁺] = 10⁻{Math.floor(phAnalysis.ph)} M</span>
            </div>
          </div>

          {/* 2. Sonda Termométrica Pt100 / Pirómetro */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-400" />
                Sonda Térmica Pt100
              </span>
              <span className="text-sm font-mono font-black text-amber-400">
                {currentTempNum} °C
              </span>
            </div>

            <div className="my-1 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Kelvin:</span>
              <span className="font-bold text-white">{(currentTempNum + 273.15).toFixed(1)} K</span>
            </div>

            <div className="text-[10px] text-slate-400 truncate">
              {conditions.temperature === 'extreme'
                ? 'Calor de Crisol (Pirólisis activa)'
                : conditions.temperature === 'moderate'
                ? 'Mechero Bunsen encendido'
                : 'Temperatura ambiente estándar'}
            </div>
          </div>

          {/* 3. Balanza Analítica de Precisión */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Scale className="w-3 h-3 text-purple-400" />
                Balanza Analítica
              </span>
              <span className="text-sm font-mono font-black text-purple-400">
                {molarMassCalc.total} g/mol
              </span>
            </div>

            <div className="my-1 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Masa muestra aprox:</span>
              <span className="font-bold text-white">
                {(molarMassCalc.total * 0.1).toFixed(2)} g
              </span>
            </div>

            <div className="text-[10px] text-slate-400 truncate">
              {selectedReactants.length} especie(s) pesadas en recipiente
            </div>
          </div>

          {/* 4. Agitador Magnético Vortex */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-cyan-400" />
                Agitación Magnética
              </span>
              <span className={`text-xs font-mono font-bold ${isMagneticStirrerActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                {isMagneticStirrerActive ? `${stirrerRpm} RPM` : 'APAGADO'}
              </span>
            </div>

            <div className="my-1 flex items-center gap-1">
              {[300, 600, 1000].map((rpm) => (
                <button
                  key={rpm}
                  onClick={() => {
                    sound.playClick();
                    setIsMagneticStirrerActive(true);
                    setStirrerRpm(rpm);
                  }}
                  className={`flex-1 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                    isMagneticStirrerActive && stirrerRpm === rpm
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {rpm}
                </button>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Cinética: {isMagneticStirrerActive ? '+25% Homogeneidad' : 'Difusión pasiva'}</span>
              {isMagneticStirrerActive && (
                <button
                  onClick={() => setIsMagneticStirrerActive(false)}
                  className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                >
                  Detener
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
