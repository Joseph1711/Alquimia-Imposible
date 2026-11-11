import { ELEMENTS_118, ChemicalElement } from './elements118';

export type BondClassification =
  | 'ionic'
  | 'covalent_polar'
  | 'covalent_nonpolar'
  | 'metallic'
  | 'coordinate'
  | 'hydrogen_bond';

export type BondMultiplicity = 'simple' | 'double' | 'triple' | 'coordinado' | 'red_ionica' | 'metalica';

export type MolecularGeometry =
  | 'lineal'
  | 'angular'
  | 'trigonal_plana'
  | 'piramidal_trigonal'
  | 'tetraedrica'
  | 'bipiramidal_trigonal'
  | 'octaedrica'
  | 'red_cristalina'
  | 'mar_electrones';

export interface AnimationStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  explanation: string;
  scientificDetail: string;
  // Progress 0.0 to 1.0 within the animation
  progress: number;
  atomStates: {
    symbol: string;
    charge: string; // e.g. "0", "+1", "-1", "δ+", "δ-"
    position: [number, number, number];
    scale: number;
    highlightValence: boolean;
    lossElectrons?: number;
    gainedElectrons?: number;
    sharedElectrons?: number;
  }[];
  electronTransfers?: {
    fromAtomIndex: number;
    toAtomIndex: number;
    count: number;
    isShared: boolean;
  }[];
  bondLinesVisible: boolean;
  orbitalOverlapVisible: boolean;
  ionsVisible: boolean;
}

export interface MoleculeRecipe {
  id: string;
  formula: string;
  name: string;
  iupacName: string;
  atoms: { symbol: string; count: number }[];
  bondClassification: BondClassification;
  bondClassificationName: string;
  multiplicity: BondMultiplicity;
  multiplicityName: string;
  geometry: MolecularGeometry;
  geometryName: string;
  bondAngle: string;
  deltaEN: number;
  polarity: 'Polar' | 'No Polar' | 'Iónico (Sal)' | 'Metálico';
  stability: 'Estable' | 'Inestable' | 'Reactiva';
  octetRuleExplanation: string;
  educationalSummary: string;
  lewisStructureDescription: string;
  realWorldApplication: string;
  animationSteps: AnimationStep[];
}

export const PRESET_MOLECULES: MoleculeRecipe[] = [
  // 1. NaCl (Iónico clásico)
  {
    id: 'nacl',
    formula: 'NaCl',
    name: 'Cloruro Sódico',
    iupacName: 'Cloruro sódico',
    atoms: [
      { symbol: 'Na', count: 1 },
      { symbol: 'Cl', count: 1 },
    ],
    bondClassification: 'ionic',
    bondClassificationName: 'Enlace Iónico',
    multiplicity: 'red_ionica',
    multiplicityName: 'Atracción Electrostática Iónica',
    geometry: 'red_cristalina',
    geometryName: 'Red Cúbica Centrada en las Caras (FCC)',
    bondAngle: '90° / 180° (En red tridimensional)',
    deltaEN: 2.23, // 3.16 - 0.93 = 2.23 (>= 1.7)
    polarity: 'Iónico (Sal)',
    stability: 'Estable',
    octetRuleExplanation:
      'El sodio (Na, 3s¹) cede su único electrón de valencia quedando con la configuración estable del neón [Ne]. El cloro (Cl, 3s² 3p⁵) lo capta completando el octeto con la configuración del argón [Ar]. Ambos alcanzan configuraciones de gas noble mediante transferencia completa.',
    educationalSummary:
      'Ejemplo paradigmático de enlace iónico entre un metal alcalino electropositivo y un no metal halógeno muy electronegativo. No se comparten electrones: se forman iones con carga opuesta que se atraen fuertemente.',
    lewisStructureDescription:
      '[Na]⁺ + [ :Cl̈: ]⁻  (El catión sodio no muestra electrones en la capa externa; el anión cloruro muestra 8 electrones con corchetes y carga negativa).',
    realWorldApplication:
      'Sal de mesa común, conservante alimentario, electrolito fisiológico indispensable para la transmisión de impulsos nerviosos en el cuerpo humano y materia prima industrial para sosa cáustica y cloro.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Aparición de Átomos Neutros',
        subtitle: 'Átomo de Sodio (Na) y Átomo de Cloro (Cl)',
        explanation: 'Se aproximan un átomo neutro de sodio (Z=11) y un átomo neutro de cloro (Z=17) en fase gaseosa.',
        scientificDetail: 'Na: 1s² 2s² 2p⁶ 3s¹ (1 electrón en capa 3). Cl: 1s² 2s² 2p⁶ 3s² 3p⁵ (7 electrones en capa 3).',
        progress: 0.1,
        atomStates: [
          { symbol: 'Na', charge: '0', position: [-2.8, 0, 0], scale: 1.2, highlightValence: false },
          { symbol: 'Cl', charge: '0', position: [2.8, 0, 0], scale: 1.0, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Estructura Electrónica y Capas',
        subtitle: 'Identificación de orbitales y electrones por nivel cuántico',
        explanation: 'Se visualizan las capas electrónicas concéntricas (K, L, M) alrededor de cada núcleo.',
        scientificDetail: 'El sodio tiene 3 niveles con distribución 2, 8, 1. El cloro tiene 3 niveles con distribución 2, 8, 7.',
        progress: 0.25,
        atomStates: [
          { symbol: 'Na', charge: '0', position: [-2.2, 0, 0], scale: 1.2, highlightValence: false },
          { symbol: 'Cl', charge: '0', position: [2.2, 0, 0], scale: 1.0, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Detección de Electrones de Valencia',
        subtitle: '1 electrón en Na vs 7 electrones en Cl',
        explanation: 'Resaltado del electrón solitario del orbital 3s del sodio y el orbital 3p semilleno del cloro.',
        scientificDetail: 'La baja energía de ionización del sodio (496 kJ/mol) y la alta afinidad electrónica del cloro (-349 kJ/mol) favorecen la transferencia.',
        progress: 0.4,
        atomStates: [
          { symbol: 'Na', charge: '0', position: [-1.8, 0, 0], scale: 1.2, highlightValence: true },
          { symbol: 'Cl', charge: '0', position: [1.8, 0, 0], scale: 1.0, highlightValence: true },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 4,
        title: 'Transferencia del Electrón',
        subtitle: 'El electrón del sodio migra al cloro',
        explanation: 'El electrón 3s¹ abandona el átomo de sodio debido al potente potencial electrostático nuclear del cloro.',
        scientificDetail: 'Diferencia de electronegatividad ΔEN = 3.16 - 0.93 = 2.23. El electrón es capturado completamente por el cloro.',
        progress: 0.55,
        atomStates: [
          { symbol: 'Na', charge: 'δ+', position: [-1.5, 0, 0], scale: 1.1, highlightValence: true, lossElectrons: 1 },
          { symbol: 'Cl', charge: 'δ-', position: [1.5, 0, 0], scale: 1.1, highlightValence: true, gainedElectrons: 1 },
        ],
        electronTransfers: [{ fromAtomIndex: 0, toAtomIndex: 1, count: 1, isShared: false }],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 5,
        title: 'Recepción y Cierre del Octeto',
        subtitle: 'El cloro completa su octeto [Ar]',
        explanation: 'El electrón transferido se empareja en el orbital 3p del cloro, completando su capa M con 8 electrones estables.',
        scientificDetail: 'El cloro adquiere 18 electrones en total (isoelectrónico con el gas noble Argón).',
        progress: 0.7,
        atomStates: [
          { symbol: 'Na', charge: '+1', position: [-1.3, 0, 0], scale: 0.9, highlightValence: false },
          { symbol: 'Cl', charge: '-1', position: [1.3, 0, 0], scale: 1.2, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: true,
      },
      {
        stepNumber: 6,
        title: 'Formación de Iones (Na⁺ y Cl⁻)',
        subtitle: 'Catión sodio (menor radio) y anión cloruro (mayor radio)',
        explanation: 'El sodio se contrae al perder su capa 3s y pasa a ser Na⁺ (radio iónico 102 pm). El cloro se expande por repulsión electrónica a Cl⁻ (radio 181 pm).',
        scientificDetail: 'Na⁺: [Ne] 1s² 2s² 2p⁶. Cl⁻: [Ar] 1s² 2s² 2p⁶ 3s² 3p⁶. Ambos poseen configuración de octeto completo de gas noble.',
        progress: 0.85,
        atomStates: [
          { symbol: 'Na', charge: '+1', position: [-1.1, 0, 0], scale: 0.85, highlightValence: false },
          { symbol: 'Cl', charge: '-1', position: [1.1, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: true,
      },
      {
        stepNumber: 7,
        title: 'Atracción Electrostática Coulombiana',
        subtitle: 'Ley de Coulomb: F = k·(q₁·q₂)/r²',
        explanation: 'Las cargas opuestas (+1 y -1) se aceleran mutuamente hasta alcanzar la distancia de equilibrio interatómica de 282 pm.',
        scientificDetail: 'Energía de red cristalina de Madelung: U = -787 kJ/mol. El proceso libera enorme energía térmica exotérmica.',
        progress: 0.95,
        atomStates: [
          { symbol: 'Na', charge: '+1', position: [-0.9, 0, 0], scale: 0.85, highlightValence: false },
          { symbol: 'Cl', charge: '-1', position: [0.9, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: true,
      },
      {
        stepNumber: 8,
        title: 'Compuesto Iónico Formado (NaCl)',
        subtitle: 'Par iónico neutro estable / Semilla de cristal',
        explanation: 'Se ha formado el enlace iónico del cloruro de sodio. En estado sólido, millones de estos iones se organizan en una red cristalina tridimensional.',
        scientificDetail: 'Punto de fusión: 801 °C. En estado sólido es aislante eléctrico; disuelto o fundido conduce electricidad por iones móviles.',
        progress: 1.0,
        atomStates: [
          { symbol: 'Na', charge: '+1', position: [-0.85, 0, 0], scale: 0.85, highlightValence: false },
          { symbol: 'Cl', charge: '-1', position: [0.85, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: true,
      },
    ],
  },

  // 2. H₂O (Covalente Polar con Geometría Angular)
  {
    id: 'h2o',
    formula: 'H₂O',
    name: 'Agua',
    iupacName: 'Oxidano / Monóxido de dihidrógeno',
    atoms: [
      { symbol: 'H', count: 2 },
      { symbol: 'O', count: 1 },
    ],
    bondClassification: 'covalent_polar',
    bondClassificationName: 'Enlace Covalente Polar',
    multiplicity: 'simple',
    multiplicityName: 'Dos Enlaces Covalentes Simples (σ)',
    geometry: 'angular',
    geometryName: 'Geometría Angular (VSEPR AX₂E₂)',
    bondAngle: '104.5°',
    deltaEN: 1.24, // 3.44 - 2.20 = 1.24 (Covalente Polar)
    polarity: 'Polar',
    stability: 'Estable',
    octetRuleExplanation:
      'El oxígeno (O, 2s² 2p⁴) tiene 6 electrones de valencia y necesita 2 para completar el octeto (8 electrones). Cada hidrógeno (H, 1s¹) aporta 1 electrón para completar su dueto estable (2 electrones, configuración del He). Se comparten 2 pares electrónicos.',
    educationalSummary:
      'Molécula esencial para la vida. La diferencia de electronegatividad (ΔEN=1.24) genera una densidad electrónica desplazada hacia el oxígeno (carga parcial δ-), dejando a los hidrógenos con carga parcial δ+. La repulsión de los 2 pares no enlazantes cierra el ángulo tetraédrico de 109.5° a 104.5°.',
    lewisStructureDescription:
      'H — Ö̈ — H  (El oxígeno central tiene 2 enlaces simples con H y 2 pares solitarios de electrones no enlazantes).',
    realWorldApplication:
      'Solvente universal de la bioquímica terrestre, amortiguador térmico planetario, medio de transporte celular y reactivo en fotosíntesis y respiración.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Aproximación de Átomos Reactivos',
        subtitle: '1 átomo de Oxígeno y 2 átomos de Hidrógeno',
        explanation: 'El átomo central de oxígeno se sitúa entre dos átomos de hidrógeno que se aproximan en ángulo.',
        scientificDetail: 'Oxígeno Z=8 (6 e⁻ valencia). Hidrógeno Z=1 (1 e⁻ valencia). Total = 8 electrones de valencia.',
        progress: 0.1,
        atomStates: [
          { symbol: 'O', charge: '0', position: [0, 0.5, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: '0', position: [-2.6, -1.2, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [2.6, -1.2, 0], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Visualización de Nubes Electrónicas',
        subtitle: 'Orbitales 1s del H y orbitales 2p del Oxígeno',
        explanation: 'El oxígeno presenta 2 orbitales 2p semillenos orientados espacialmente y 2 pares de electrones ya apareados en su capa 2.',
        scientificDetail: 'La hibridación aproximada del oxígeno es sp³, con 4 orbitales híbridos orientados tetraédricamente.',
        progress: 0.25,
        atomStates: [
          { symbol: 'O', charge: '0', position: [0, 0.4, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: '0', position: [-2.0, -0.9, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [2.0, -0.9, 0], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Identificación de Electrones Enlazantes',
        subtitle: 'Regla del Octeto para O y Regla del Dueto para H',
        explanation: 'Se señalan los electrones que van a ser compartidos para alcanzar configuraciones electrónicas estables.',
        scientificDetail: 'Cada H requiere 1 electrón para alcanzar 2 (configuración del helio). El O requiere 2 electrones para alcanzar 8 (neón).',
        progress: 0.4,
        atomStates: [
          { symbol: 'O', charge: '0', position: [0, 0.35, 0], scale: 1.15, highlightValence: true },
          { symbol: 'H', charge: '0', position: [-1.6, -0.7, 0], scale: 0.75, highlightValence: true },
          { symbol: 'H', charge: '0', position: [1.6, -0.7, 0], scale: 0.75, highlightValence: true },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 4,
        title: 'Solapamiento de Orbitales (Compartición)',
        subtitle: 'Solapamiento frontal tipo sigma (σ)',
        explanation: 'Los orbitales 1s de cada hidrógeno se solapan con los orbitales híbridos del oxígeno, compartiendo un par de electrones en cada enlace.',
        scientificDetail: 'A diferencia del enlace iónico, aquí NO hay transferencia total; los electrones pasan tiempo en la región internuclear.',
        progress: 0.6,
        atomStates: [
          { symbol: 'O', charge: '0', position: [0, 0.3, 0], scale: 1.15, highlightValence: true, sharedElectrons: 4 },
          { symbol: 'H', charge: '0', position: [-1.2, -0.5, 0], scale: 0.75, highlightValence: true, sharedElectrons: 2 },
          { symbol: 'H', charge: '0', position: [1.2, -0.5, 0], scale: 0.75, highlightValence: true, sharedElectrons: 2 },
        ],
        electronTransfers: [
          { fromAtomIndex: 1, toAtomIndex: 0, count: 1, isShared: true },
          { fromAtomIndex: 2, toAtomIndex: 0, count: 1, isShared: true },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 5,
        title: 'Polarización del Enlace y Cargas Parciales',
        subtitle: 'Generación del dipolo eléctrico permanente',
        explanation: 'Como el oxígeno es mucho más electronegativo (EN=3.44) que el hidrógeno (EN=2.20), atrae con más fuerza la nube electrónica compartida.',
        scientificDetail: 'Se forman cargas parciales: δ- sobre el oxígeno y δ+ sobre cada hidrógeno. Momento dipolar resultante μ = 1.85 Debye.',
        progress: 0.75,
        atomStates: [
          { symbol: 'O', charge: 'δ-', position: [0, 0.25, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [-0.95, -0.4, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [0.95, -0.4, 0], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 6,
        title: 'Repulsión VSEPR de Pares Solitarios',
        subtitle: 'Ajuste del ángulo a 104.5°',
        explanation: 'Los 2 pares de electrones no enlazantes del oxígeno ejercen mayor repulsión que los pares enlazantes, comprimiendo el ángulo de 109.5° a 104.5°.',
        scientificDetail: 'Teoría de Repulsión de Pares Electrónicos de la Capa de Valencia (RPECV/VSEPR): modelo AX₂E₂.',
        progress: 0.9,
        atomStates: [
          { symbol: 'O', charge: 'δ-', position: [0, 0.2, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [-0.85, -0.38, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [0.85, -0.38, 0], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 7,
        title: 'Molécula de Agua Estable (H₂O)',
        subtitle: 'Estructura angular polar completa',
        explanation: 'La molécula final es polar, angular y capaz de formar hasta 4 puentes de hidrógeno con moléculas vecinas.',
        scientificDetail: 'Longitud de enlace O-H: 95.84 pm. Energía de disociación de enlace: 460 kJ/mol por enlace O-H.',
        progress: 1.0,
        atomStates: [
          { symbol: 'O', charge: 'δ-', position: [0, 0.2, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [-0.85, -0.38, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [0.85, -0.38, 0], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
    ],
  },

  // 3. CO₂ (Covalente Polar con Geometría Lineal y Dobles Enlaces)
  {
    id: 'co2',
    formula: 'CO₂',
    name: 'Anhídrido Carbónico',
    iupacName: 'Anhídrido carbónico',
    atoms: [
      { symbol: 'C', count: 1 },
      { symbol: 'O', count: 2 },
    ],
    bondClassification: 'covalent_polar',
    bondClassificationName: 'Enlace Covalente Polar (Molécula Apolar por Simetría)',
    multiplicity: 'double',
    multiplicityName: 'Dos Enlaces Covalentes Dobles (O=C=O)',
    geometry: 'lineal',
    geometryName: 'Geometría Lineal (VSEPR AX₂)',
    bondAngle: '180°',
    deltaEN: 0.89, // 3.44 - 2.55 = 0.89
    polarity: 'No Polar',
    stability: 'Estable',
    octetRuleExplanation:
      'El carbono central (2s² 2p²) tiene 4 electrones de valencia y necesita 4 más. Cada oxígeno (2s² 2p⁴) tiene 6 electrones y necesita 2. El carbono forma un enlace doble (4 electrones compartidos: 1σ + 1π) con cada oxígeno. Los 3 átomos completan simultáneamente el octeto.',
    educationalSummary:
      'Aunque cada enlace C=O es fuertemente polar debido al oxígeno más electronegativo, los dos vectores dipolares apuntan en direcciones exactamente opuestas (180°) y se anulan vectorialmente (μ=0), haciendo que el CO₂ sea una molécula globalmente apolar.',
    lewisStructureDescription:
      ':Ö = C = Ö:  (El carbono central comparte 2 pares de electrones con cada oxígeno; cada oxígeno conserva 2 pares solitarios).',
    realWorldApplication:
      'Gas de efecto invernadero regulador de la temperatura terrestre, reactivo esencial en la fotosíntesis vegetal, gas de carbonatación en bebidas e insumo para extintores.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Alineación de Reactivos',
        subtitle: '1 átomo de Carbono y 2 átomos de Oxígeno',
        explanation: 'El átomo de carbono se coloca en el centro flanqueado simétricamente por los dos oxígenos.',
        scientificDetail: 'C: [He] 2s² 2p² (4 e⁻ valencia). O: [He] 2s² 2p⁴ (6 e⁻ valencia). Total = 16 electrones de valencia.',
        progress: 0.1,
        atomStates: [
          { symbol: 'O', charge: '0', position: [-3.0, 0, 0], scale: 1.05, highlightValence: false },
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.0, highlightValence: false },
          { symbol: 'O', charge: '0', position: [3.0, 0, 0], scale: 1.05, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Hibridación sp del Carbono',
        subtitle: '2 orbitales híbridos sp a 180° y 2 orbitales p puros',
        explanation: 'El carbono hibrida un orbital 2s y un orbital 2p para formar 2 orbitales sp colineales a 180°.',
        scientificDetail: 'Los 2 orbitales p no hibridados (2py y 2pz) quedan perpendiculares para formar los enlaces pi (π).',
        progress: 0.3,
        atomStates: [
          { symbol: 'O', charge: '0', position: [-2.2, 0, 0], scale: 1.05, highlightValence: false },
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.0, highlightValence: true },
          { symbol: 'O', charge: '0', position: [2.2, 0, 0], scale: 1.05, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Formación de Enlaces Simples Sigma (σ)',
        subtitle: 'Solapamiento frontal C-O',
        explanation: 'Se forman primero los dos enlaces axiales sigma compartiendo un par de electrones con cada oxígeno.',
        scientificDetail: 'En este estado intermedio el carbono tiene 6 electrones y aún no cumple el octeto.',
        progress: 0.5,
        atomStates: [
          { symbol: 'O', charge: '0', position: [-1.6, 0, 0], scale: 1.05, highlightValence: true },
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.0, highlightValence: true },
          { symbol: 'O', charge: '0', position: [1.6, 0, 0], scale: 1.05, highlightValence: true },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 4,
        title: 'Solapamiento Lateral de Enlaces Pi (π)',
        subtitle: 'Formación de los dobles enlaces O=C=O',
        explanation: 'Los orbitales p perpendiculares se solapan lateralmente formando 2 enlaces π adicionales: un doble enlace en cada flanco.',
        scientificDetail: 'Cada enlace doble C=O consta de 1 enlace σ y 1 enlace π. Longitud de enlace C=O: 116.3 pm (muy corto y fuerte).',
        progress: 0.75,
        atomStates: [
          { symbol: 'O', charge: 'δ-', position: [-1.3, 0, 0], scale: 1.05, highlightValence: false },
          { symbol: 'C', charge: '2δ+', position: [0, 0, 0], scale: 1.0, highlightValence: false },
          { symbol: 'O', charge: 'δ-', position: [1.3, 0, 0], scale: 1.05, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 5,
        title: 'Geometría Lineal y Cancelación Dipolar',
        subtitle: 'Ángulo exacto de 180° y momento dipolar neto μ = 0',
        explanation: 'Al no tener pares libres en el carbono central (AX₂), la repulsión electrónica fuerza una geometría perfectamente lineal.',
        scientificDetail: 'Los dipolos C→O se cancelan vectorialmente: μ_total = μ₁ + μ₂ = 0 D. Molécula apolar con enlaces polares.',
        progress: 1.0,
        atomStates: [
          { symbol: 'O', charge: 'δ-', position: [-1.2, 0, 0], scale: 1.05, highlightValence: false },
          { symbol: 'C', charge: '2δ+', position: [0, 0, 0], scale: 1.0, highlightValence: false },
          { symbol: 'O', charge: 'δ-', position: [1.2, 0, 0], scale: 1.05, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
    ],
  },

  // 4. CH₄ (Metano - Covalente Tetraédrico)
  {
    id: 'ch4',
    formula: 'CH₄',
    name: 'Metano',
    iupacName: 'Metano',
    atoms: [
      { symbol: 'C', count: 1 },
      { symbol: 'H', count: 4 },
    ],
    bondClassification: 'covalent_nonpolar',
    bondClassificationName: 'Enlace Covalente No Polar',
    multiplicity: 'simple',
    multiplicityName: 'Cuatro Enlaces Covalentes Simples (σ)',
    geometry: 'tetraedrica',
    geometryName: 'Geometría Tetraédrica Regular (VSEPR AX₄)',
    bondAngle: '109.5°',
    deltaEN: 0.35, // 2.55 - 2.20 = 0.35 (No Polar)
    polarity: 'No Polar',
    stability: 'Estable',
    octetRuleExplanation:
      'El carbono promociona un electrón del 2s al 2p y se hibrida en cuatro orbitales sp³. Cada orbital híbrido se solapa con el 1s de un hidrógeno. El carbono completa su octeto (8 electrones) y los 4 hidrógenos completan su dueto (2 electrones cada uno).',
    educationalSummary:
      'El hidrocarburo más simple. La mínima repulsión entre los 4 pares de electrones enlazantes en el espacio tridimensional determina un ángulo de enlace idéntico de 109.5° en una geometría tetraédrica perfecta.',
    lewisStructureDescription:
      'H\n|\nH — C — H\n|\nH  (El carbono central está unido a 4 átomos de hidrógeno mediante 4 enlaces simples sin pares solitarios).',
    realWorldApplication:
      'Componente principal del gas natural (85-95%), combustible doméstico e industrial limpio, fuente primaria para la producción de gas de síntesis e hidrógeno.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Carbono Central y 4 Hidrógenos',
        subtitle: 'Distribución espacial previa',
        explanation: 'Un átomo de carbono en el origen y cuatro hidrógenos distribuidos en los vértices de un tetraedro imaginario.',
        scientificDetail: 'C: 4 electrones de valencia. Cada H: 1 electrón de valencia. Total = 8 electrones de valencia.',
        progress: 0.15,
        atomStates: [
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.1, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0, 2.2, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [2.0, -0.7, 0.8], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [-2.0, -0.7, 0.8], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0, -0.7, -2.1], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Hibridación sp³ del Carbono',
        subtitle: 'Fusión de 1 orbital 2s y 3 orbitales 2p',
        explanation: 'El carbono combina sus funciones de onda atómicas generando 4 orbitales degenerados equivalentes dirigidos hacia los vértices de un tetraedro.',
        scientificDetail: 'La hibridación sp³ minimiza la energía del sistema al separar al máximo los pares electrónicos a 109.47°.',
        progress: 0.45,
        atomStates: [
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.1, highlightValence: true },
          { symbol: 'H', charge: '0', position: [0, 1.6, 0], scale: 0.75, highlightValence: true },
          { symbol: 'H', charge: '0', position: [1.4, -0.5, 0.6], scale: 0.75, highlightValence: true },
          { symbol: 'H', charge: '0', position: [-1.4, -0.5, 0.6], scale: 0.75, highlightValence: true },
          { symbol: 'H', charge: '0', position: [0, -0.5, -1.5], scale: 0.75, highlightValence: true },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Solapamiento y 4 Enlaces Sigma (σ)',
        subtitle: 'Compartición de 8 electrones totales',
        explanation: 'Cada hidrógeno aporta su electrón 1s emparejándose con un electrón híbrido sp³ del carbono.',
        scientificDetail: 'Energía de enlace C-H: 414 kJ/mol. Longitud de enlace C-H: 108.7 pm.',
        progress: 0.75,
        atomStates: [
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.1, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0, 1.1, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [1.0, -0.35, 0.4], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [-1.0, -0.35, 0.4], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 4,
        title: 'Molécula de Metano Tetraédrica Completa',
        subtitle: 'Simetría perfecta Td y apolaridad absoluta',
        explanation: 'Los 4 enlaces son equivalentes en fuerza, longitud y ángulo. La molécula es químicamente estable a temperatura ambiente.',
        scientificDetail: 'Punto de ebullición: -161.5 °C. Requiere chispa de ignición o alta temperatura para reaccionar con oxígeno.',
        progress: 1.0,
        atomStates: [
          { symbol: 'C', charge: '0', position: [0, 0, 0], scale: 1.1, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0, 1.05, 0], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0.98, -0.34, 0.35], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [-0.98, -0.34, 0.35], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0, -0.34, -1.02], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
    ],
  },

  // 5. NH₃ (Amoníaco - Covalente Piramidal Trigonal)
  {
    id: 'nh3',
    formula: 'NH₃',
    name: 'Amoníaco',
    iupacName: 'Azano / Amoníaco',
    atoms: [
      { symbol: 'N', count: 1 },
      { symbol: 'H', count: 3 },
    ],
    bondClassification: 'covalent_polar',
    bondClassificationName: 'Enlace Covalente Polar',
    multiplicity: 'simple',
    multiplicityName: 'Tres Enlaces Covalentes Simples (σ) y 1 Par Solitario',
    geometry: 'piramidal_trigonal',
    geometryName: 'Geometría Piramidal Trigonal (VSEPR AX₃E)',
    bondAngle: '107°',
    deltaEN: 0.84, // 3.04 - 2.20 = 0.84
    polarity: 'Polar',
    stability: 'Estable',
    octetRuleExplanation:
      'El nitrógeno central (2s² 2p³) tiene 5 electrones de valencia. Comparte 3 electrones con tres hidrógenos para completar el octeto (8 electrones). El par libre no enlazante en el ápice confiere a la molécula un fuerte carácter de base de Lewis y dipolar.',
    educationalSummary:
      'El par de electrones no enlazante ocupa un orbital híbrido sp³ más voluminoso y empuja a los tres enlaces N-H hacia abajo, reduciendo el ángulo tetraédrico de 109.5° a 107°.',
    lewisStructureDescription:
      ':N(H)₃  (El nitrógeno central tiene 1 par de electrones libre en la parte superior y 3 enlaces simples con hidrógeno en base piramidal).',
    realWorldApplication:
      'Fabricación de fertilizantes agrícolas nitrogenados (urea, nitrato amónico), síntesis de plásticos, explosivos industriales y productos de limpieza.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Nitrógeno Central y 3 Hidrógenos',
        subtitle: 'Identificación de valencias iniciales',
        explanation: 'El nitrógeno tiene 5 electrones de valencia y los hidrógenos aportan 1 electrón cada uno.',
        scientificDetail: 'N: [He] 2s² 2p³. H: 1s¹. Total = 8 electrones de valencia.',
        progress: 0.2,
        atomStates: [
          { symbol: 'N', charge: '0', position: [0, 0.4, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: '0', position: [-2.0, -0.8, 0.5], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [2.0, -0.8, 0.5], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: '0', position: [0, -0.8, -1.8], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Compartición de 3 Pares de Electrones',
        subtitle: 'Solapamiento de orbitales para formar 3 enlaces sigma',
        explanation: 'Se forman 3 enlaces covalentes simples N-H. El cuarto orbital híbrido aloja el par de electrones libre.',
        scientificDetail: 'Hibridación sp³ del nitrógeno. El par libre ejerce fuerte repulsión sobre los 3 pares enlazantes.',
        progress: 0.6,
        atomStates: [
          { symbol: 'N', charge: '0', position: [0, 0.3, 0], scale: 1.15, highlightValence: true },
          { symbol: 'H', charge: '0', position: [-1.2, -0.5, 0.4], scale: 0.75, highlightValence: true },
          { symbol: 'H', charge: '0', position: [1.2, -0.5, 0.4], scale: 0.75, highlightValence: true },
          { symbol: 'H', charge: '0', position: [0, -0.5, -1.2], scale: 0.75, highlightValence: true },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Piramidalización Trigonal (107°)',
        subtitle: 'Estructura piramidal polar con par de electrones solitario',
        explanation: 'La molécula adopta su geometría final piramidal trigonal con un marcado momento dipolar neto hacia el nitrógeno.',
        scientificDetail: 'Momento dipolar μ = 1.47 D. Es una excelente base de Lewis capaz de donar su par solitario.',
        progress: 1.0,
        atomStates: [
          { symbol: 'N', charge: 'δ-', position: [0, 0.25, 0], scale: 1.15, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [-0.9, -0.35, 0.3], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [0.9, -0.35, 0.3], scale: 0.75, highlightValence: false },
          { symbol: 'H', charge: 'δ+', position: [0, -0.35, -0.95], scale: 0.75, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
    ],
  },

  // 6. O₂ (Oxígeno Molecular - Doble Enlace Covalente No Polar)
  {
    id: 'o2',
    formula: 'O₂',
    name: 'Oxígeno Molecular',
    iupacName: 'Dioxígeno',
    atoms: [{ symbol: 'O', count: 2 }],
    bondClassification: 'covalent_nonpolar',
    bondClassificationName: 'Enlace Covalente No Polar',
    multiplicity: 'double',
    multiplicityName: 'Enlace Covalente Doble (O=O: 1σ + 1π)',
    geometry: 'lineal',
    geometryName: 'Geometría Lineal Diatómica',
    bondAngle: '180°',
    deltaEN: 0.0,
    polarity: 'No Polar',
    stability: 'Estable',
    octetRuleExplanation:
      'Cada átomo de oxígeno tiene 6 electrones de valencia (2s² 2p⁴) y necesita 2 electrones para el octeto. Al compartir dos pares de electrones entre sí (4 electrones compartidos en total), ambos alcanzan la configuración del gas noble neón [Ne].',
    educationalSummary:
      'El doble enlace diatómico O=O consta de un enlace sigma frontal y un enlace pi lateral. Posee una energía de disociación de 498 kJ/mol y una longitud de enlace de 121 pm.',
    lewisStructureDescription:
      ':Ö = Ö:  (Dos átomos de oxígeno unidos por un doble enlace central; cada uno conserva dos pares de electrones no enlazantes).',
    realWorldApplication:
      'Gas comburente vital para la respiración aeróbica de la mayoría de seres vivos de la biosfera terrestre y oxidante en combustión industrial y aeroespacial.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Dos Átomos Neutros de Oxígeno',
        subtitle: 'O (Z=8) con 6 electrones de valencia cada uno',
        explanation: 'Dos átomos idénticos de oxígeno se aproximan en el eje horizontal.',
        scientificDetail: 'Configuración: 1s² 2s² 2p⁴. Cada átomo posee 2 electrones desparejados en orbitales 2p.',
        progress: 0.2,
        atomStates: [
          { symbol: 'O', charge: '0', position: [-2.2, 0, 0], scale: 1.1, highlightValence: false },
          { symbol: 'O', charge: '0', position: [2.2, 0, 0], scale: 1.1, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Solapamiento de Orbitales 2p',
        subtitle: 'Formación secuencial de enlace sigma y enlace pi',
        explanation: 'Primero se solapan frontalmente los orbitales 2px (enlace σ) y luego lateralmente los orbitales 2py (enlace π).',
        scientificDetail: 'Se comparten 4 electrones en total (2 pares electrónicos).',
        progress: 0.6,
        atomStates: [
          { symbol: 'O', charge: '0', position: [-1.4, 0, 0], scale: 1.1, highlightValence: true },
          { symbol: 'O', charge: '0', position: [1.4, 0, 0], scale: 1.1, highlightValence: true },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Molécula de Dioxígeno O=O Estable',
        subtitle: 'Octeto completo para ambos átomos',
        explanation: 'Ambos átomos completan 8 electrones en su capa de valencia. El enlace es no polar porque la diferencia de electronegatividad es exactamente cero.',
        scientificDetail: 'Longitud de enlace: 120.8 pm. De acuerdo a la teoría de orbitales moleculares (TOM), posee carácter paramagnético.',
        progress: 1.0,
        atomStates: [
          { symbol: 'O', charge: '0', position: [-0.9, 0, 0], scale: 1.1, highlightValence: false },
          { symbol: 'O', charge: '0', position: [0.9, 0, 0], scale: 1.1, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
    ],
  },

  // 7. HCl (Ácido Clorhídrico - Covalente Polar)
  {
    id: 'hcl',
    formula: 'HCl',
    name: 'Ácido Clorhídrico',
    iupacName: 'Ácido clorhídrico',
    atoms: [
      { symbol: 'H', count: 1 },
      { symbol: 'Cl', count: 1 },
    ],
    bondClassification: 'covalent_polar',
    bondClassificationName: 'Enlace Covalente Polar',
    multiplicity: 'simple',
    multiplicityName: 'Enlace Covalente Simple Polar (σ)',
    geometry: 'lineal',
    geometryName: 'Geometría Lineal Diatómica',
    bondAngle: '180°',
    deltaEN: 0.96, // 3.16 - 2.20 = 0.96
    polarity: 'Polar',
    stability: 'Estable',
    octetRuleExplanation:
      'El hidrógeno (1s¹) aporta 1 electrón para su dueto estable; el cloro (3s² 3p⁵) aporta 1 electrón de su orbital 3p semilleno completando el octeto con 8 electrones. Aunque es covalente en fase gaseosa, en agua se disocia completamente en iones H⁺ y Cl⁻.',
    educationalSummary:
      'La diferencia de electronegatividad de 0.96 genera una asimetría de carga notable: el cloro atrae fuertemente el par compartido, creando un dipolo molecular pronunciado.',
    lewisStructureDescription:
      'H — Cl̈:  (Un enlace simple entre H y Cl, y 3 pares de electrones solitarios rodeando al átomo de cloro).',
    realWorldApplication:
      'Ácido clorhídrico en disolución acuosa, ácido digestivo estomacal, decapado de metales y reactivo fundamental en química analítica y síntesis orgánica.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Átomo de Hidrógeno y Átomo de Cloro',
        subtitle: 'Aproximación en fase gaseosa',
        explanation: 'El pequeño átomo de H (Z=1) se aproxima al voluminoso átomo de Cl (Z=17).',
        scientificDetail: 'H: 1s¹. Cl: [Ne] 3s² 3p⁵.',
        progress: 0.25,
        atomStates: [
          { symbol: 'H', charge: '0', position: [-2.0, 0, 0], scale: 0.75, highlightValence: false },
          { symbol: 'Cl', charge: '0', position: [1.8, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Solapamiento 1s - 3pz',
        subtitle: 'Compartición desigual de electrones',
        explanation: 'El orbital 1s del H se fusiona con el lóbulo del orbital 3pz del cloro.',
        scientificDetail: 'ΔEN = 0.96. Densidad electrónica concentrada hacia el cloro.',
        progress: 0.65,
        atomStates: [
          { symbol: 'H', charge: 'δ+', position: [-1.1, 0, 0], scale: 0.75, highlightValence: true },
          { symbol: 'Cl', charge: 'δ-', position: [0.9, 0, 0], scale: 1.25, highlightValence: true },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: true,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Dipolo HCl Formado',
        subtitle: 'Momento dipolar permanente μ = 1.08 Debye',
        explanation: 'El enlace covalente polar está consolidado con el hidrógeno con deficiencia electrónica y el cloro enriquecido.',
        scientificDetail: 'Longitud de enlace: 127.4 pm. Energía de enlace: 431 kJ/mol.',
        progress: 1.0,
        atomStates: [
          { symbol: 'H', charge: 'δ+', position: [-0.95, 0, 0], scale: 0.75, highlightValence: false },
          { symbol: 'Cl', charge: 'δ-', position: [0.8, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
    ],
  },

  // 8. CaCl₂ (Cloruro Cálcico - Iónico 1:2)
  {
    id: 'cacl2',
    formula: 'CaCl₂',
    name: 'Cloruro Cálcico',
    iupacName: 'Cloruro cálcico',
    atoms: [
      { symbol: 'Ca', count: 1 },
      { symbol: 'Cl', count: 2 },
    ],
    bondClassification: 'ionic',
    bondClassificationName: 'Enlace Iónico (Sal Binaria)',
    multiplicity: 'red_ionica',
    multiplicityName: 'Red Iónica Tridimensional Ca²⁺ + 2 Cl⁻',
    geometry: 'red_cristalina',
    geometryName: 'Red Cristalina Tipo Rutilo Deformado',
    bondAngle: '180° / 90°',
    deltaEN: 2.16, // 3.16 - 1.00 = 2.16 (Iónico)
    polarity: 'Iónico (Sal)',
    stability: 'Estable',
    octetRuleExplanation:
      'El calcio (Ca, [Ar] 4s²) cede sus dos electrones de la capa 4s. Cada uno de los dos átomos de cloro (Cl, [Ne] 3s² 3p⁵) recibe exactamente un electrón. El calcio se transforma en el catión dipositivo Ca²⁺ y los cloros en dos aniones Cl⁻, todos con configuración electrónica estable de argón [Ar].',
    educationalSummary:
      'Sal higroscópica de estequiometría 1:2. La elevada energía reticular estabiliza la red cristalina gracias a la doble carga del catión Ca²⁺.',
    lewisStructureDescription:
      '[ :Cl̈: ]⁻  [Ca]²⁺  [ :Cl̈: ]⁻  (Un catión calcio central desprovisto de electrones de valencia y dos aniones cloruro con octetos completos).',
    realWorldApplication:
      'Agente anticongelante y descongelante en carreteras de climas fríos, desecante en laboratorios y aditivo alimentario en queserías.',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Calcio Central y 2 Átomos de Cloro',
        subtitle: 'Ca (4s²) flanqueado por dos Cl (3s² 3p⁵)',
        explanation: 'El metal alcalinotérreo calcio dispone de dos electrones de valencia para transferir.',
        scientificDetail: 'Ca: [Ar] 4s². Cl: [Ne] 3s² 3p⁵. Relación estequiométrica 1 Ca por cada 2 Cl.',
        progress: 0.2,
        atomStates: [
          { symbol: 'Cl', charge: '0', position: [-2.6, 0, 0], scale: 1.15, highlightValence: false },
          { symbol: 'Ca', charge: '0', position: [0, 0, 0], scale: 1.35, highlightValence: false },
          { symbol: 'Cl', charge: '0', position: [2.6, 0, 0], scale: 1.15, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Transferencia Simultánea de Dos Electrones',
        subtitle: 'Un electrón viaja a cada átomo de cloro',
        explanation: 'El calcio pierde simultáneamente sus dos electrones 4s debido a la enorme afinidad electrónica de los dos cloros.',
        scientificDetail: 'Primera energía de ionización: 590 kJ/mol; Segunda: 1145 kJ/mol.',
        progress: 0.6,
        atomStates: [
          { symbol: 'Cl', charge: 'δ-', position: [-1.9, 0, 0], scale: 1.2, highlightValence: true, gainedElectrons: 1 },
          { symbol: 'Ca', charge: '2δ+', position: [0, 0, 0], scale: 1.2, highlightValence: true, lossElectrons: 2 },
          { symbol: 'Cl', charge: 'δ-', position: [1.9, 0, 0], scale: 1.2, highlightValence: true, gainedElectrons: 1 },
        ],
        electronTransfers: [
          { fromAtomIndex: 1, toAtomIndex: 0, count: 1, isShared: false },
          { fromAtomIndex: 1, toAtomIndex: 2, count: 1, isShared: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Formación de Ca²⁺ y 2 Cl⁻',
        subtitle: 'Atracción electrostática de red iónica',
        explanation: 'Se consolida el trío iónico con el catión central divalente Ca²⁺ atrayendo fuertemente a los dos aniones cloruro.',
        scientificDetail: 'Energía de red reticular: U = -2258 kJ/mol (casi tres veces la del NaCl por la carga +2 del calcio).',
        progress: 1.0,
        atomStates: [
          { symbol: 'Cl', charge: '-1', position: [-1.3, 0, 0], scale: 1.25, highlightValence: false },
          { symbol: 'Ca', charge: '+2', position: [0, 0, 0], scale: 0.95, highlightValence: false },
          { symbol: 'Cl', charge: '-1', position: [1.3, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: true,
      },
    ],
  },

  // 9. MgO (Óxido Magnésico - Iónico Doble Carga)
  {
    id: 'mgo',
    formula: 'MgO',
    name: 'Óxido Magnésico',
    iupacName: 'Óxido magnésico',
    atoms: [
      { symbol: 'Mg', count: 1 },
      { symbol: 'O', count: 1 },
    ],
    bondClassification: 'ionic',
    bondClassificationName: 'Enlace Iónico de Doble Carga (Mg²⁺ O²⁻)',
    multiplicity: 'red_ionica',
    multiplicityName: 'Red Iónica Refractaria Mg²⁺ + O²⁻',
    geometry: 'red_cristalina',
    geometryName: 'Red Cristalina Tipo Halita (Cúbica FCC)',
    bondAngle: '90° / 180°',
    deltaEN: 2.13, // 3.44 - 1.31 = 2.13 (Iónico)
    polarity: 'Iónico (Sal)',
    stability: 'Estable',
    octetRuleExplanation:
      'El magnesio (Mg, [Ne] 3s²) transfiere completamente sus 2 electrones de valencia al átomo de oxígeno (O, [He] 2s² 2p⁴). Se forman los iones Mg²⁺ y O²⁻, ambos con configuración electrónica isoelectrónica con el gas noble neón [Ne] (1s² 2s² 2p⁶).',
    educationalSummary:
      'Debido a las dobles cargas de los iones (+2 y -2), la fuerza de atracción coulombiana es cuatro veces mayor que en el NaCl. Esto le confiere una energía de red de -3791 kJ/mol y un punto de fusión altísimo de 2852 °C.',
    lewisStructureDescription:
      '[Mg]²⁺  [ :Ö: ]²⁻  (Catión magnesio sin electrones de valencia y anión óxido con 8 electrones rodeados de corchetes y carga 2-).',
    realWorldApplication:
      'Ladrillos refractarios para hornos siderúrgicos a más de 2000 °C, suplemento dietético de magnesio y antiácido farmacéutico (magnesia).',
    animationSteps: [
      {
        stepNumber: 1,
        title: 'Magnesio Neutro y Oxígeno Neutro',
        subtitle: 'Mg (3s²) y O (2s² 2p⁴)',
        explanation: 'El metal magnesio tiene 2 electrones de valencia y el no metal oxígeno necesita 2 para su octeto.',
        scientificDetail: 'Mg: Z=12. O: Z=8. Ambos se aproximan con energía cinética de activación.',
        progress: 0.2,
        atomStates: [
          { symbol: 'Mg', charge: '0', position: [-2.2, 0, 0], scale: 1.25, highlightValence: false },
          { symbol: 'O', charge: '0', position: [2.0, 0, 0], scale: 1.05, highlightValence: false },
        ],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 2,
        title: 'Transferencia de Dos Electrones (2e⁻)',
        subtitle: 'Ionización divalente completa',
        explanation: 'Los 2 electrones 3s del magnesio saltan al orbital 2p del oxígeno liberando intensa luz blanca.',
        scientificDetail: 'Reacción muy exotérmica: formación de la combustión luminosa de la cinta de magnesio.',
        progress: 0.6,
        atomStates: [
          { symbol: 'Mg', charge: '2δ+', position: [-1.4, 0, 0], scale: 1.1, highlightValence: true, lossElectrons: 2 },
          { symbol: 'O', charge: '2δ-', position: [1.3, 0, 0], scale: 1.15, highlightValence: true, gainedElectrons: 2 },
        ],
        electronTransfers: [{ fromAtomIndex: 0, toAtomIndex: 1, count: 2, isShared: false }],
        bondLinesVisible: false,
        orbitalOverlapVisible: false,
        ionsVisible: false,
      },
      {
        stepNumber: 3,
        title: 'Par Iónico Refractario Mg²⁺ O²⁻',
        subtitle: 'Atracción cuadrúple q₁·q₂ = (+2)·(-2) = -4',
        explanation: 'Fuerte atracción entre iones divalentes que da lugar a una red cristalina extremadamente resistente al calor.',
        scientificDetail: 'Punto de fusión: 2852 °C. Energía de red: -3791 kJ/mol.',
        progress: 1.0,
        atomStates: [
          { symbol: 'Mg', charge: '+2', position: [-0.85, 0, 0], scale: 0.85, highlightValence: false },
          { symbol: 'O', charge: '-2', position: [0.85, 0, 0], scale: 1.25, highlightValence: false },
        ],
        bondLinesVisible: true,
        orbitalOverlapVisible: false,
        ionsVisible: true,
      },
    ],
  },
];

/**
 * Dynamic chemical combination evaluator.
 * Determines if user-selected elements can form a viable chemical bond,
 * calculates electronegativity difference, predicts bond type, geometry and stability.
 */
export interface EvaluationResult {
  isPossible: boolean;
  stability: 'Estable' | 'Inestable' | 'No respaldada' | 'Reactiva';
  formula: string;
  compoundName: string;
  bondClassification: BondClassification;
  bondClassificationName: string;
  multiplicityName: string;
  geometry: MolecularGeometry;
  geometryName: string;
  deltaEN: number;
  octetStatus: string;
  scientificFeedback: string;
  warning?: string;
}

export function evaluateCustomCombination(selectedSymbols: string[]): EvaluationResult {
  if (selectedSymbols.length === 0) {
    return {
      isPossible: false,
      stability: 'No respaldada',
      formula: '—',
      compoundName: 'Selecciona al menos 2 átomos',
      bondClassification: 'covalent_nonpolar',
      bondClassificationName: 'Sin Enlace',
      multiplicityName: '—',
      geometry: 'lineal',
      geometryName: '—',
      deltaEN: 0,
      octetStatus: 'Elige elementos para comenzar la simulación de enlaces.',
      scientificFeedback: 'Coloca átomos en el crisol de enlaces para evaluar su afinidad electrónica y electronegatividad.',
    };
  }

  // Count occurrences of each symbol
  const counts: Record<string, number> = {};
  for (const sym of selectedSymbols) {
    counts[sym] = (counts[sym] || 0) + 1;
  }

  // Check matching pre-set molecule first
  for (const preset of PRESET_MOLECULES) {
    const presetAtomMap: Record<string, number> = {};
    for (const a of preset.atoms) {
      presetAtomMap[a.symbol] = a.count;
    }

    const keysA = Object.keys(counts).sort();
    const keysB = Object.keys(presetAtomMap).sort();

    if (keysA.length === keysB.length && keysA.every((k, idx) => k === keysB[idx])) {
      const match = keysA.every((k) => counts[k] === presetAtomMap[k]);
      if (match) {
        return {
          isPossible: true,
          stability: preset.stability,
          formula: preset.formula,
          compoundName: preset.name,
          bondClassification: preset.bondClassification,
          bondClassificationName: preset.bondClassificationName,
          multiplicityName: preset.multiplicityName,
          geometry: preset.geometry,
          geometryName: preset.geometryName,
          deltaEN: preset.deltaEN,
          octetStatus: preset.octetRuleExplanation,
          scientificFeedback: preset.educationalSummary,
        };
      }
    }
  }

  // Generic dynamic calculation for any combination
  const elements = selectedSymbols
    .map((s) => ELEMENTS_118.find((e) => e.symbol === s))
    .filter((e): e is ChemicalElement => e !== undefined);

  if (elements.length < 2) {
    const el = elements[0];
    return {
      isPossible: false,
      stability: 'Inestable',
      formula: el ? el.symbol : '—',
      compoundName: el ? `Átomo aislado de ${el.name}` : 'Elemento desconocido',
      bondClassification: 'covalent_nonpolar',
      bondClassificationName: 'Átomo Monatómico Libre',
      multiplicityName: 'Ninguno',
      geometry: 'lineal',
      geometryName: 'Esférica Atómica',
      deltaEN: 0,
      octetStatus: el?.category === 'gas-noble' ? 'Octeto completo natural.' : `Tiene ${el?.valenceElectrons} electrones de valencia; requiere enlazarse.`,
      scientificFeedback: 'Añade un segundo átomo para formar un enlace químico.',
    };
  }

  // Check for noble gas combinations
  const hasNobleGas = elements.some((e) => e.category === 'gas-noble');
  const hasFluorineOrOxygen = elements.some((e) => e.symbol === 'F' || e.symbol === 'O');

  if (hasNobleGas && !hasFluorineOrOxygen) {
    const noble = elements.find((e) => e.category === 'gas-noble')!;
    return {
      isPossible: false,
      stability: 'No respaldada',
      formula: selectedSymbols.join(''),
      compoundName: 'Combinación Químicamente Inerte',
      bondClassification: 'covalent_nonpolar',
      bondClassificationName: 'Sin Enlace Químico',
      multiplicityName: 'Ninguno',
      geometry: 'lineal',
      geometryName: 'Átomos no enlazados',
      deltaEN: 0,
      octetStatus: `El gas noble ${noble.name} (${noble.symbol}) ya posee un octeto completo (8 e⁻) y no forma enlaces en estas condiciones.`,
      scientificFeedback: 'Los gases nobles poseen máxima estabilidad electrónica natural. Solo reaccionan en condiciones extremas con elementos hiper-electronegativos como el flúor o el oxígeno.',
      warning: 'Combinación no permitida: el gas noble no cede ni comparte electrones.',
    };
  }

  // Check if all elements are metals
  const allMetals = elements.every((e) =>
    ['metal-alcalino', 'metal-alcalinoterreo', 'metal-transicion', 'lantanido', 'actinido', 'metal-bloque-p'].includes(e.category)
  );

  if (allMetals) {
    return {
      isPossible: true,
      stability: 'Estable',
      formula: selectedSymbols.sort().join(''),
      compoundName: 'Aleación o Enlace Metálico',
      bondClassification: 'metallic',
      bondClassificationName: 'Enlace Metálico',
      multiplicityName: 'Mar de Electrones Deslocalizados',
      geometry: 'mar_electrones',
      geometryName: 'Red Metálica Cristalina Compacta',
      deltaEN: Math.abs((elements[0].electronegativity || 1.5) - (elements[1].electronegativity || 1.5)),
      octetStatus: 'Los metales ceden sus electrones de valencia a un mar deslocalizado compartido que mantiene unidos a los cationes.',
      scientificFeedback: 'Los orbitales atómicos de valencia se solapan en bandas continuas de conducción (teoría de bandas). Conducen calor y electricidad con alta maleabilidad y ductilidad.',
    };
  }

  // Calculate Delta EN between the two most distinct elements
  const ens = elements.map((e) => e.electronegativity).filter((v): v is number => v !== null);
  const minEN = ens.length > 0 ? Math.min(...ens) : 1.0;
  const maxEN = ens.length > 0 ? Math.max(...ens) : 2.5;
  const deltaEN = parseFloat((maxEN - minEN).toFixed(2));

  // Build formula string
  const sortedSymbols = Object.keys(counts).sort((a, b) => {
    // Hill system: C first, then H, then alphabetical, or electropositive first
    const elA = elements.find((e) => e.symbol === a);
    const elB = elements.find((e) => e.symbol === b);
    return (elA?.electronegativity || 2.0) - (elB?.electronegativity || 2.0);
  });

  const formula = sortedSymbols
    .map((s) => `${s}${counts[s] > 1 ? counts[s] : ''}`)
    .join('');

  if (deltaEN >= 1.7) {
    return {
      isPossible: true,
      stability: 'Estable',
      formula,
      compoundName: `Compuesto Iónico (${formula})`,
      bondClassification: 'ionic',
      bondClassificationName: 'Enlace Iónico',
      multiplicityName: 'Red Iónica Electroestática',
      geometry: 'red_cristalina',
      geometryName: 'Red Cristalina Iónica',
      deltaEN,
      octetStatus: `ΔEN = ${deltaEN} (≥ 1.7). Gran diferencia de electronegatividad: se produce transferencia completa de electrones del metal al no metal.`,
      scientificFeedback: 'El elemento más electropositivo forma cationes y el más electronegativo aniones. En estado sólido forman redes cristalinas duras y quebradizas con altos puntos de fusión.',
    };
  } else if (deltaEN > 0.4) {
    return {
      isPossible: true,
      stability: 'Estable',
      formula,
      compoundName: `Molécula Covalente Polar (${formula})`,
      bondClassification: 'covalent_polar',
      bondClassificationName: 'Enlace Covalente Polar',
      multiplicityName: 'Enlaces Sigma (σ) y Pi (π) Polares',
      geometry: elements.length === 2 ? 'lineal' : 'angular',
      geometryName: elements.length === 2 ? 'Lineal Diatómica' : 'Geometría Angular / Poliatómica',
      deltaEN,
      octetStatus: `ΔEN = ${deltaEN} (entre 0.4 y 1.7). Los electrones se comparten con densidad asimétrica hacia el átomo más electronegativo.`,
      scientificFeedback: 'Se generan polos eléctricos parciales (δ+ y δ-). La molécula tiene momento dipolar y puede experimentar fuerzas de atracción dipolo-dipolo.',
    };
  } else {
    return {
      isPossible: true,
      stability: 'Estable',
      formula,
      compoundName: `Molécula Covalente No Polar (${formula})`,
      bondClassification: 'covalent_nonpolar',
      bondClassificationName: 'Enlace Covalente No Polar',
      multiplicityName: 'Enlaces Covalentes Homogéneos',
      geometry: 'lineal',
      geometryName: 'Geometría Simétrica',
      deltaEN,
      octetStatus: `ΔEN = ${deltaEN} (≤ 0.4). La diferencia de electronegatividad es mínima o nula; los electrones se comparten de manera equitativa.`,
      scientificFeedback: 'La nube electrónica se distribuye uniformemente entre los núcleos, sin polos permanentes. Solo interactúan mediante débiles fuerzas de dispersión de London.',
    };
  }
}
