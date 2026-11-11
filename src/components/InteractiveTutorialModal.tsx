import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Flame,
  Zap,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  Bomb,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Atom,
  Search,
  Scale,
  RotateCw,
  Wind,
  ShieldAlert,
  Lock,
  Unlock,
  Thermometer,
} from 'lucide-react';
import { useGame, VesselType } from '../context/GameContext';
import { ExperimentalConditions } from '../data/reactionsEngine';
import { VESSELS_DATA } from '../data/vesselsData';

interface TutorialMix {
  title: string;
  reactants: string[];
  reactantLabels: string[];
  vessel?: VesselType;
  conditions: Partial<ExperimentalConditions>;
  conditionDescription: string;
  resultFormula: string;
  resultName: string;
  isExplosive: boolean;
  explanation: string;
}

const EXAMPLE_MIXES: TutorialMix[] = [
  {
    title: 'Síntesis de Agua Pura',
    reactants: ['H', 'O'],
    reactantLabels: ['Hidrógeno (H)', 'Oxígeno (O)'],
    vessel: 'erlenmeyer',
    conditions: {
      temperature: 'moderate',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Matraz Erlenmeyer · Requiere Mechero Bunsen encendido (450 °C).',
    resultFormula: 'H₂O',
    resultName: 'Agua Líquida',
    isExplosive: false,
    explanation: 'Reacción clásica de síntesis donde se forman dos enlaces covalentes polares O-H liberando vapor de agua.',
  },
  {
    title: 'Agitación y Neutralización Rápida',
    reactants: ['HCl', 'NaOH'],
    reactantLabels: ['Ácido Clorhídrico (HCl)', 'Hidróxido de Sodio (NaOH)'],
    vessel: 'beaker',
    conditions: {
      temperature: 'ambient',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Vaso de precipitados con Agitador Magnético a 600 RPM · Temperatura ambiente.',
    resultFormula: 'NaCl + H₂O',
    resultName: 'Salmuera a pH 7.0 Neutro',
    isExplosive: false,
    explanation: 'Los iones H⁺ y OH⁻ se combinan instantáneamente bajo el vórtice del agitador magnético, estabilizando el peachímetro en pH 7.0.',
  },
  {
    title: 'Calcinación de Caliza en Crisol',
    reactants: ['Ca', 'C', 'O'],
    reactantLabels: ['Calcio (Ca)', 'Carbono (C)', 'Oxígeno (O)'],
    vessel: 'crucible',
    conditions: {
      temperature: 'extreme',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Crisol de Porcelana Refractaria · Calor extremo de 950 °C (Incandescencia térmica).',
    resultFormula: 'CaO + CO₂',
    resultName: 'Óxido de Calcio (Cal Viva) + Dióxido de Carbono',
    isExplosive: false,
    explanation: 'El calor extremo descompone el carbonato; el crisol refractario soporta 1200 °C y adquiere brillo termocrómico incandescente.',
  },
  {
    title: 'Purificación por Destilación',
    reactants: ['H', 'O', 'Na', 'Cl'],
    reactantLabels: ['Hidrógeno (H)', 'Oxígeno (O)', 'Sodio (Na)', 'Cloro (Cl)'],
    vessel: 'distillation',
    conditions: {
      temperature: 'moderate',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Aparato de Destilación con Refrigerante Liebig · Mechero Bunsen a 450 °C.',
    resultFormula: 'H₂O (Destilada)',
    resultName: 'Agua Pura Condensada',
    isExplosive: false,
    explanation: 'El agua se evapora en el matraz de ebullición, viaja al refrigerante con camisa de agua y gotea condensada en el colector.',
  },
  {
    title: 'Ensayos y Precipitados en Tubo',
    reactants: ['Na', 'Cl'],
    reactantLabels: ['Sodio (Na)', 'Cloro (Cl)'],
    vessel: 'testtube',
    conditions: {
      temperature: 'ambient',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Tubo de Ensayo en pinza · Temperatura ambiente (25 °C).',
    resultFormula: 'NaCl',
    resultName: 'Cristales de Sal Común',
    isExplosive: false,
    explanation: 'Excelente para microanálisis cualitativo y observar la sedimentación de precipitados insolubles en el fondo semiesférico.',
  },
  {
    title: 'Molienda en Mortero y Pólvora',
    reactants: ['K', 'S', 'C'],
    reactantLabels: ['Potasio (K)', 'Azufre (S)', 'Carbono (C)'],
    vessel: 'mortar',
    conditions: {
      temperature: 'moderate',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Mortero de Ágata para micronización sólida · Mechero Bunsen.',
    resultFormula: 'K₂S + CO₂ + ¡DEFLAGRACIÓN!',
    resultName: 'Explosión Pirotécnica Tradicional',
    isExplosive: true,
    explanation: 'Triturar íntimamente los reactivos sólidos secos con el pistilo aumenta el área de contacto, generando una deflagración exotérmica masiva.',
  },
  {
    title: '¡Detonación de Knallgas!',
    reactants: ['H', 'O'],
    reactantLabels: ['Hidrógeno (H)', 'Oxígeno (O)'],
    vessel: 'erlenmeyer',
    conditions: {
      temperature: 'ambient',
      pressure: 'standard',
      catalyst: 'none',
      electricity: 'spark',
      concentration: 'normal',
    },
    conditionDescription: 'Matraz Erlenmeyer · Requiere Chispa Eléctrica de alta tensión activada.',
    resultFormula: 'H₂O + ¡ONDA EXPANSIVA!',
    resultName: 'Deflagración Supersónica de Oxihidrógeno',
    isExplosive: true,
    explanation: 'La chispa inicia una reacción en cadena violenta con retroceso instantáneo de cámara, destello térmico y plasma supersónico.',
  },
  {
    title: 'Amoníaco por Haber-Bosch',
    reactants: ['N', 'H'],
    reactantLabels: ['Nitrógeno (N)', 'Hidrógeno (H)'],
    vessel: 'erlenmeyer',
    conditions: {
      temperature: 'moderate',
      pressure: 'high',
      catalyst: 'Fe',
      electricity: 'none',
      concentration: 'normal',
    },
    conditionDescription: 'Matraz Erlenmeyer sellado · 450 °C, 200 atm y Catalizador de Hierro (Fe).',
    resultFormula: 'NH₃',
    resultName: 'Amoníaco Puro',
    isExplosive: false,
    explanation: 'Ruptura del triple enlace inerte del nitrógeno molecular mediante alta presión hidrostática y catalizador de hierro.',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTutorialModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loadRecipe, setCurrentScreen } = useGame();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const totalSteps = 8;

  const handleTestMix = (mix: TutorialMix) => {
    loadRecipe(mix.reactants, mix.conditions, mix.vessel);
    onClose();
    setCurrentScreen('lab');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0c1222] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/60 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Manual de Laboratorio & Guía Científica
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Paso {currentStep + 1} de {totalSteps}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Tutorial y Manual de Instrumentación Química
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker Indicator */}
        <div className="flex h-1.5 w-full bg-slate-900">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 transition-all duration-300 ${
                idx <= currentStep
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-200">
          {/* STEP 1: Bienvenida y Objetivos */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">
                    Bienvenido a Alquimia Imposible
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Este simulador interactivo te permite experimentar la química con rigor estequiométrico, combinando los 118 elementos oficiales de la tabla periódica IUPAC y compuestos químicos reales bajo condiciones físicas e instrumentos de laboratorio controlados.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div className="font-semibold text-xs text-white">Elige Recipiente & Sondas</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Selecciona entre 7 recipientes especializados (matraz, vaso, crisol, destilador, mortero, tubo, cristalizador) y activa sensores analíticos.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div className="font-semibold text-xs text-white">Mezcla Reactivos & Ajusta Físicas</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Introduce hasta 4 reactivos y calibra Temperatura (Bunsen/Crisol), Presión (200 atm), Catalizadores o Electricidad.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div className="font-semibold text-xs text-white">Observa la Reacción Real</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Visualiza vórtices cinéticos, ebullición, destilación por condensación, incandescencia térmica o deflagraciones con ondas de choque.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Guía Completa de los 7 Recipientes */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    Guía de Recipientes: Para Qué Sirven, Cómo Usarlos y Ejemplos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cada recipiente posee propiedades térmicas, mecánicas y habilidades interactivas específicas:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {/* 1. Matraz Erlenmeyer */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-emerald-400">1. Matraz Erlenmeyer (250 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Borosilicato 3.3 · 500 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Mezclado de líquidos sin salpicaduras y atrapamiento hermético de gases volátiles o reactivos gaseosos.</p>
                    <p><strong>Cómo usarlo:</strong> Utiliza el botón <em>Tapón Sellado / Abierto</em> en el panel para atrapar vapores a presión o despresurizar a la atmósfera.</p>
                    <p className="text-emerald-300/90 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                      <strong>Ejemplo práctico:</strong> Síntesis de Amoníaco ($N_2 + 3H_2 \rightleftharpoons 2NH_3$) a 200 atm con tapón hermético para desplazar el equilibrio.
                    </p>
                  </div>
                </div>

                {/* 2. Vaso de Precipitados */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-cyan-400">2. Vaso de Precipitados (Beaker, 500 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Vidrio Borosilicato · 450 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Disoluciones acuosas, precipitaciones, titulaciones y homogeneización de mezclas mediante agitación forzada.</p>
                    <p><strong>Cómo usarlo:</strong> Activa el <em>Agitador Magnético Vortex</em> y selecciona 300, 600 o 1000 RPM para inducir un vórtice fluido con pastilla de teflón.</p>
                    <p className="text-cyan-300/90 bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                      <strong>Ejemplo práctico:</strong> Titulación de $HCl$ con $NaOH$ bajo agitación constante a 600 RPM para evitar zonas frías y acelerar la neutralización (+25% cinética).
                    </p>
                  </div>
                </div>

                {/* 3. Tubo de Ensayo */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-indigo-400">3. Tubo de Ensayo (30 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Pyrex Clásico · 450 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Ensayos analíticos cualitativos de microescala, pruebas de reactividad rápida y visualización de turbidez.</p>
                    <p><strong>Cómo usarlo:</strong> Montado en pinza de laboratorio. Su fondo semiesférico permite apreciar de inmediato la formación de sedimentos y precipitados insolubles.</p>
                    <p className="text-indigo-300/90 bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-500/20">
                      <strong>Ejemplo práctico:</strong> Formación de precipitado de cristales de $NaCl$ o lluvia de oro insoluble entre sales acuosas.
                    </p>
                  </div>
                </div>

                {/* 4. Crisol Refractario */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-amber-400">4. Crisol de Porcelana (100 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Porcelana Refractaria · 1200 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Calcinación a temperaturas extremas de hasta 1200 °C, pirólisis mineral, fundición de metales y calcinación de sales.</p>
                    <p><strong>Cómo usarlo:</strong> Apóyalo sobre el triángulo de pipa de arcilla y ajusta la temperatura a <em>950 °C</em>; su cuerpo cerámico se tornará incandescente sin romperse.</p>
                    <p className="text-amber-300/90 bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/20">
                      <strong>Ejemplo práctico:</strong> Calcinación de carbonato de calcio ($CaCO_3 \rightarrow CaO + CO_2$) para producir cal viva sin agrietamiento por choque térmico.
                    </p>
                  </div>
                </div>

                {/* 5. Aparato de Destilación */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-sky-400">5. Aparato de Destilación con Refrigerante (250 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Matraz Esférico + Liebig · 450 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Separación física de componentes de una mezcla según sus diferentes puntos de ebullición mediante vaporización y condensación continua.</p>
                    <p><strong>Cómo usarlo:</strong> Aplica calor Bunsen; los vapores ascienden por el brazo lateral, la camisa de agua los enfría y caen gotas de destilado puro en el vaso colector.</p>
                    <p className="text-sky-300/90 bg-sky-950/40 p-1.5 rounded-lg border border-sky-500/20">
                      <strong>Ejemplo práctico:</strong> Purificación de agua salobre ($H_2O + NaCl$): el vapor puro destila a 100 °C hacia el colector mientras la sal no volátil permanece en el matraz.
                    </p>
                  </div>
                </div>

                {/* 6. Mortero y Pistilo de Ágata */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-stone-300">6. Mortero y Pistilo de Ágata (150 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Roca Mineral de Ágata · 300 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Trituración mecánica, micronización y homogeneización íntima de reactivos sólidos secos no higroscópicos.</p>
                    <p><strong>Cómo usarlo:</strong> Selecciona reactivos sólidos; al triturar con el pistilo aumentas exponencialmente la superficie específica de contacto de los cristales.</p>
                    <p className="text-stone-300/90 bg-stone-900/60 p-1.5 rounded-lg border border-slate-700">
                      <strong>Ejemplo práctico:</strong> Molienda fina de nitrato de potasio, carbón vegetal y azufre antes de una deflagración pirotécnica de pólvora.
                    </p>
                  </div>
                </div>

                {/* 7. Vidrio de Reloj / Cristalizador */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-teal-400">7. Vidrio de Reloj / Cristalizador (50 mL)</div>
                    <span className="text-[10px] font-mono text-slate-400">Vidrio de Reloj Cóncavo · 300 °C</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Evaporación rápida de solventes en película delgada y observación de cristalización dendrítica en los bordes perimetrales.</p>
                    <p><strong>Cómo usarlo:</strong> Vierte la solución concentrada y déjala a temperatura ambiente; su amplia superficie expuesta a la atmósfera acelera la formación de agujas cristalinas.</p>
                    <p className="text-teal-300/90 bg-teal-950/40 p-1.5 rounded-lg border border-teal-500/20">
                      <strong>Ejemplo práctico:</strong> Cristalización dendrítica de sulfatos o salmuera saturada para recolectar microcristales geométricos puros.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Sondas e Instrumentos Analíticos Activos */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Sondas e Instrumentos Analíticos en Tiempo Real
                  </h3>
                  <p className="text-xs text-slate-400">
                    Las 5 herramientas científicas activas que monitorean y potencian tus experimentos:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {/* 1. Peachímetro */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      Peachímetro & Tira de Tornasol
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Escala pH 0.8 - 13.8</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Mide cuantitativamente la concentración de iones hidronio $[H^+]$ y clasifica la solución en ácida, neutra o básica.</p>
                    <p><strong>Cómo usarlo:</strong> Observa la aguja sobre la tira de tornasol de colores; se desliza dinámicamente según agregues ácidos (rojo) o bases cáusticas (púrpura).</p>
                    <p className="text-emerald-300/90 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                      <strong>Ejemplo práctico:</strong> Vierte $HCl$ (pH baja a 1.0 en rojo corrosivo); añade $NaOH$ y verás la aguja centrarse en pH 7.0 verde neutro exacto.
                    </p>
                  </div>
                </div>

                {/* 2. Sonda Pt100 */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                      Sonda Térmica Pt100 & Alerta de Choque
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">°C y Kelvin (K)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Lectura termométrica precisa y alerta automática de choque térmico para evitar la ruptura de la cristalería.</p>
                    <p><strong>Cómo usarlo:</strong> Si la temperatura seleccionada excede el límite del recipiente (ej. 950 °C en vidrio), la sonda desplegará una advertencia de riesgo.</p>
                    <p className="text-amber-300/90 bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/20">
                      <strong>Ejemplo práctico:</strong> Al calentar caliza a 950 °C, el sistema te alertará que el borosilicato no resiste, guiándote a usar el Crisol refractario de 1200 °C.
                    </p>
                  </div>
                </div>

                {/* 3. Balanza Analítica */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-purple-400 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-purple-400" />
                      Balanza Analítica de Precisión
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">g/mol y masa de muestra (g)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Calcula la masa molecular total en g/mol y masa de muestra con base en los pesos atómicos exactos de la tabla periódica IUPAC.</p>
                    <p><strong>Cómo usarlo:</strong> Consulta la balanza a medida que introduzcas reactivos; te permite planificar la estequiometría de la reacción.</p>
                    <p className="text-purple-300/90 bg-purple-950/40 p-1.5 rounded-lg border border-purple-500/20">
                      <strong>Ejemplo práctico:</strong> Al colocar H y O, la balanza indica 18.02 g/mol; con Na y Cl, registra 58.44 g/mol de cloruro sódico.
                    </p>
                  </div>
                </div>

                {/* 4. Agitador Magnético */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                      Agitador Magnético Vortex
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">300, 600, 1000 RPM</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Acelera la velocidad de difusión y colisión molecular aportando un +25% de cinética en soluciones líquidas.</p>
                    <p><strong>Cómo usarlo:</strong> Con el vaso de precipitados activo, presiona los selectores de RPM; verás la pastilla de teflón girar y el vórtice hundirse en el líquido.</p>
                    <p className="text-cyan-300/90 bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                      <strong>Ejemplo práctico:</strong> Mezclar sales alcalinas a 1000 RPM para lograr disolución instantánea sin sedimentación en el fondo.
                    </p>
                  </div>
                </div>

                {/* 5. Campana Extractora */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-xs text-teal-400 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                      Campana Extractora de Flujo Laminar (Fume Hood)
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Ventilación Forzada ON/OFF</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p><strong>Para qué sirve:</strong> Evacúa gases tóxicos, vapores corrosivos y humos densos generados durante calcinaciones, pirólisis o deflagraciones.</p>
                    <p><strong>Cómo usarlo:</strong> Pulsa el botón <em>Campana ON / OFF</em> en la barra superior; los louvers de ventilación superior succionarán el humo hacia arriba en segundos.</p>
                    <p className="text-teal-300/90 bg-teal-950/40 p-1.5 rounded-lg border border-teal-500/20">
                      <strong>Ejemplo práctico:</strong> Al quemar azufre o calcinar a 950 °C, activa la campana para disipar la nube de humo y mantener la visibilidad del banco de trabajo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Bandeja de Reactivos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Atom className="w-4 h-4 text-emerald-400" />
                Bandeja de Reactivos: 118 Elementos y Compuestos
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El panel derecho del laboratorio te permite seleccionar reactivos reales organizados por familias químicas:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    Tab
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">Compuestos vs 118 Elementos IUPAC</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Cambia de pestaña con un clic. Tienes acceso a los 118 elementos oficiales de la tabla periódica (H, He, Li, Na, Fe, Au...) y a tus compuestos químicos descubiertos.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                    +
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">Añadir y Retirar del Recipiente</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Toca cualquier reactivo para introducirlo al recipiente seleccionado (máximo 4 reactivos a la vez). Para quitarlo, presiona la "×" de su tarjeta o pulsa el botón "Vaciar".
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white">Buscador Rápido</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Escribe el símbolo atómico (ej. "Na", "Fe", "Cu") o la fórmula (ej. "HCl", "H2O") para encontrar al instante cualquier sustancia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Variables Experimentales */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Variables Experimentales Termodinámicas
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Muchas sustancias no reaccionan solas a temperatura ambiente: necesitan que aportes energía de activación o modifiques el entorno:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    Temperatura
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>25 °C (Ambiente)</strong>, <strong>450 °C (Mechero Bunsen)</strong> para síntesis y combustión, o <strong>950 °C (Crisol)</strong> para calcinar carbonatos y fundir metales.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                    <Gauge className="w-3.5 h-3.5" />
                    Presión
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>1 atm (Estándar)</strong> o <strong>200 atm (Cámara sellada)</strong>. Siguiendo la ley de Le Chatelier, la alta presión favorece la síntesis de gases como el amoníaco.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Activity className="w-3.5 h-3.5" />
                    Catalizadores
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Pt, Fe, MnO₂, Ni y V₂O₅. Aceleran reacciones reduciendo la energía de activación sin consumirse en el proceso químico.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                    <Zap className="w-3.5 h-3.5" />
                    Electricidad
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>Chispa de alta tensión</strong> (para detonar oxihidrógeno o metano) o <strong>Electrólisis continua</strong> (para descomponer agua en H₂ y O₂).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Animaciones Cinemáticas y Efectos */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Animaciones Cinemáticas de Reacción
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El laboratorio cuenta con un motor visual dinámico que reacciona a la termodinámica de cada sustancia:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Zoom Cinemático al Iniciar</div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Al pulsar "Experimentar Reacción", la cámara enfoca y hace un <strong>zoom suave hacia el interior del recipiente</strong> mientras la solución entra en ebullición, burbujea o genera vórtices de luz.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/30 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <Bomb className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-red-300">Retroceso Violento y Onda de Choque</div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      En reacciones altamente exotérmicas o pirotécnicas (como el gas Knallgas, el potasio en agua o la pólvora), <strong>la cámara se aleja de golpe</strong> con retroceso y temblor sísmico, desplegando un destello cegador y múltiples anillos de plasma supersónico.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-cyan-300">Síntesis y Cristalización Estable</div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Si la reacción es estable, la cámara se mantiene en el foco para mostrar la condensación de vapor en las paredes de vidrio o la formación de cristales centelleantes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Mezclas y Ensayos Prácticos con 1 Clic */}
          {currentStep === 6 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Ensayos Prácticos con Recipientes Óptimos (1 Clic)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Haz clic en "Cargar y Probar" para configurar automáticamente el recipiente, reactivos y variables en tu mesa de trabajo:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {EXAMPLE_MIXES.map((mix, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      mix.isExplosive
                        ? 'bg-gradient-to-b from-[#180a0a] to-[#0c0505] border-red-900/60 hover:border-red-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white flex items-center gap-1.5">
                          {mix.isExplosive ? <Bomb className="w-3.5 h-3.5 text-red-400" /> : <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />}
                          {mix.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            mix.isExplosive
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {mix.resultFormula}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 flex items-center gap-1 flex-wrap">
                        <strong className="text-slate-400">Reactivos:</strong>
                        {mix.reactantLabels.map((r, i) => (
                          <span
                            key={i}
                            className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-200"
                          >
                            {r}
                          </span>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-400 italic">
                        {mix.conditionDescription}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTestMix(mix)}
                      className={`w-full mt-2.5 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 ${
                        mix.isExplosive
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-950'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950'
                      }`}
                    >
                      <FlaskConical className="w-3 h-3" />
                      <span>Cargar y Probar en Laboratorio</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Progreso, Misiones (100) y Logros */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                100 Misiones en 5 Módulos y 32 Logros
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A medida que experimentes, progresarás en tu carrera de Alquimista desde <em>Iniciado en el Crisol</em> hasta <em>Gran Alquimista Cuántico</em>:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-white">Módulo 1: Fundamentos y Síntesis Elemental</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Misiones 1 a 20 · Formación de enlaces simples, agua, sal y óxidos.</div>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold">20 Retos</span>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-white">Módulo 2: Óxidos Metálicos, Bases e Hidróxidos</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Misiones 21 a 40 · Hidratación alcalina, cal viva y apagada.</div>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 font-bold">20 Retos</span>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-white">Módulo 3: Ácidos, Neutralizaciones y Sales Minerales</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Misiones 41 a 60 · Titulaciones a pH 7.0, lluvia de oro y precipitados.</div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">20 Retos</span>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-white">Módulo 4: Reacciones Redox, Electroquímica y Metalurgia</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Misiones 61 a 80 · Electrólisis, serie galvánica y agua regia.</div>
                  </div>
                  <span className="font-mono text-xs text-indigo-400 font-bold">20 Retos</span>
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-white">Módulo 5: Termodinámica Extrema, Pirotecnia y Alquimia</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Misiones 81 a 100 · Deflagraciones explosivas, fluoruro de xenón y termita.</div>
                  </div>
                  <span className="font-mono text-xs text-red-400 font-bold">20 Retos</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentStep === 0
                ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-6 bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Ir al paso ${i + 1}`}
              />
            ))}
          </div>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                setCurrentScreen('lab');
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Ir al Laboratorio a Experimentar!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
