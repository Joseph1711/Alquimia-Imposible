export type StateOfMatter = 'gas' | 'líquido' | 'sólido' | 'acuoso';

export type SubstanceCategory =
  | 'Elemento No Metálico'
  | 'Elemento Metálico'
  | 'Gas Noble'
  | 'Óxido Básico'
  | 'Óxido Ácido'
  | 'Hidróxido (Base)'
  | 'Ácido (Hidrácido / Oxoácido)'
  | 'Sal Neutra / Binaria'
  | 'Hidrocarburo'
  | 'Compuesto Orgánico';

export type BondType =
  | 'Covalente polar'
  | 'Covalente no polar'
  | 'Iónico'
  | 'Metálico'
  | 'Inerte (Capa completa)';

export interface Substance {
  id: string;
  name: string;
  formula: string;
  category: SubstanceCategory;
  state: StateOfMatter;
  elements: string[];
  color: string;
  glowColor: string;
  atomicMass: string;
  bondType: BondType;
  properties: string;
  applications: string;
  isUnlockedByDefault: boolean;
  dangerLevel: 1 | 2 | 3 | 4;
}

export type ReactionCondition = 'ambient' | 'heat' | 'spark' | 'catalyst';

export interface Reaction {
  id: string;
  reactants: string[]; // Substance IDs required
  products: string[]; // Substance IDs produced
  balancedEquation: string;
  reactionType:
    | 'Síntesis (Combinación)'
    | 'Descomposición'
    | 'Desplazamiento Simple'
    | 'Doble Desplazamiento (Neutralización)'
    | 'Doble Desplazamiento (Precipitación)'
    | 'Combustión'
    | 'Redox';
  requiredCondition: ReactionCondition;
  conditionDescription: string;
  explanation: string;
  discoveryXp: number;
  visualEffect: 'steam' | 'spark' | 'fire' | 'crystals' | 'fizz' | 'bubbles';
}

export const SUBSTANCES: Record<string, Substance> = {
  // --- ELEMENTOS INICIALES (DESBLOQUEADOS) ---
  H2: {
    id: 'H2',
    name: 'Hidrógeno Molecular',
    formula: 'H₂',
    category: 'Elemento No Metálico',
    state: 'gas',
    elements: ['H'],
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    atomicMass: '2.016 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Gas diatómico incoloro, inodoro y altamente inflamable. Elemento más ligero del universo con 1 protón y 1 electrón por átomo.',
    applications: 'Combustible de cohetes espaciales, producción de celdas de combustible de hidrógeno limpio, refinación de petróleo.',
    isUnlockedByDefault: true,
    dangerLevel: 3,
  },
  O2: {
    id: 'O2',
    name: 'Oxígeno Molecular',
    formula: 'O₂',
    category: 'Elemento No Metálico',
    state: 'gas',
    elements: ['O'],
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    atomicMass: '32.00 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Gas comburente vital para la respiración celular y la combustión. Posee enlace doble O=O y gran electronegatividad (3.44 Pauling).',
    applications: 'Soporte vital médico, tratamiento de aguas, propulsión aerospacial y corte por oxiacetileno.',
    isUnlockedByDefault: true,
    dangerLevel: 2,
  },
  Na: {
    id: 'Na',
    name: 'Sodio Metálico',
    formula: 'Na',
    category: 'Elemento Metálico',
    state: 'sólido',
    elements: ['Na'],
    color: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.5)',
    atomicMass: '22.99 g/mol',
    bondType: 'Metálico',
    properties: 'Metal alcalino blando del Grupo 1. Extremadamente electropositivo (cede su único electrón de valencia rápidamente) y reactivo con agua.',
    applications: 'Lámparas de vapor de sodio para autopistas, refrigerante en reactores nucleares, fabricación de aleaciones.',
    isUnlockedByDefault: true,
    dangerLevel: 4,
  },
  Cl2: {
    id: 'Cl2',
    name: 'Cloro Gas',
    formula: 'Cl₂',
    category: 'Elemento No Metálico',
    state: 'gas',
    elements: ['Cl'],
    color: '#a3e635',
    glowColor: 'rgba(163, 230, 53, 0.6)',
    atomicMass: '70.90 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Gas halógeno verde-amarillento del Grupo 17. Fuerte oxidante con 7 electrones de valencia; gran avidez por capturar 1 electrón.',
    applications: 'Desinfección de agua potable, elaboración de PVC, síntesis de blanqueadores y compuestos farmacéuticos.',
    isUnlockedByDefault: true,
    dangerLevel: 4,
  },
  Fe: {
    id: 'Fe',
    name: 'Hierro',
    formula: 'Fe',
    category: 'Elemento Metálico',
    state: 'sólido',
    elements: ['Fe'],
    color: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.5)',
    atomicMass: '55.85 g/mol',
    bondType: 'Metálico',
    properties: 'Metal de transición ferromagnético, maleable y dúctil. Se oxida con facilidad en presencia de humedad y oxígeno.',
    applications: 'Eje estructural de la civilización moderna (acero), núcleo de transformadores eléctricos y hemoglobina sanguínea.',
    isUnlockedByDefault: true,
    dangerLevel: 1,
  },
  C: {
    id: 'C',
    name: 'Carbono (Grafito)',
    formula: 'C',
    category: 'Elemento No Metálico',
    state: 'sólido',
    elements: ['C'],
    color: '#475569',
    glowColor: 'rgba(71, 85, 105, 0.5)',
    atomicMass: '12.01 g/mol',
    bondType: 'Covalente no polar',
    properties: 'No metal tetravalente con 4 electrones de valencia capaz de formar largas cadenas estables (catenación). Base de la química orgánica.',
    applications: 'Electrodos para baterías de iones de litio, fibras de carbono de alta resistencia, lápices y nanotecnología.',
    isUnlockedByDefault: true,
    dangerLevel: 1,
  },
  S8: {
    id: 'S8',
    name: 'Azufre Elemental',
    formula: 'S',
    category: 'Elemento No Metálico',
    state: 'sólido',
    elements: ['S'],
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    atomicMass: '32.06 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Sólido amarillo cristalino quebradizo. Forma anillos octatómicos S₈. Arde con una hermosa y característica llama azul.',
    applications: 'Vulcanización del caucho para neumáticos, fertilizantes de sulfato, fabricación de pólvora y ácido sulfúrico.',
    isUnlockedByDefault: true,
    dangerLevel: 2,
  },
  N2: {
    id: 'N2',
    name: 'Nitrógeno Molecular',
    formula: 'N₂',
    category: 'Elemento No Metálico',
    state: 'gas',
    elements: ['N'],
    color: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.5)',
    atomicMass: '28.01 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Constituye el 78% del aire terrestre. Posee un enlace triple N≡N extremadamente fuerte que lo vuelve químicamente inerte a baja temperatura.',
    applications: 'Atmósferas inertes para empaques de alimentos, criogenia líquida, fabricación de amoníaco y fertilizantes.',
    isUnlockedByDefault: true,
    dangerLevel: 1,
  },
  Cu: {
    id: 'Cu',
    name: 'Cobre Metálico',
    formula: 'Cu',
    category: 'Elemento Metálico',
    state: 'sólido',
    elements: ['Cu'],
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    atomicMass: '63.55 g/mol',
    bondType: 'Metálico',
    properties: 'Metal rojizo brillante de excelente conductividad eléctrica y térmica. Resistente a la corrosión atmosférica mediante pátina.',
    applications: 'Cableado eléctrico global, microcircuitos electrónicos, monedas y tuberías antimicrobianas.',
    isUnlockedByDefault: true,
    dangerLevel: 1,
  },
  Ca: {
    id: 'Ca',
    name: 'Calcio Metálico',
    formula: 'Ca',
    category: 'Elemento Metálico',
    state: 'sólido',
    elements: ['Ca'],
    color: '#e2e8f0',
    glowColor: 'rgba(226, 232, 240, 0.6)',
    atomicMass: '40.08 g/mol',
    bondType: 'Metálico',
    properties: 'Metal alcalinotérreo blanco plateado del Grupo 2. Posee 2 electrones de valencia que cede fácilmente para formar cationes Ca²⁺.',
    applications: 'Desoxidante en metalurgia, síntesis de aleaciones ligeras y base de los tejidos óseos en biología.',
    isUnlockedByDefault: true,
    dangerLevel: 2,
  },

  // --- GAS NOBLE INERTE (DEMUESTRA LA REGLA DEL OCTETO) ---
  He: {
    id: 'He',
    name: 'Helio',
    formula: 'He',
    category: 'Gas Noble',
    state: 'gas',
    elements: ['He'],
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.6)',
    atomicMass: '4.003 g/mol',
    bondType: 'Inerte (Capa completa)',
    properties: 'Gas noble monoatómico con su capa 1s completa (2 electrones). Energía de ionización máxima; no comparte ni acepta electrones fácilmente.',
    applications: 'Enfriamiento superconductor en resonancias magnéticas (IRM), dirigibles y mezclas de buceo a gran profundidad.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },

  // --- SUSTANCIAS DESCUBRIBLES (COMPUESTOS REALES) ---
  H2O: {
    id: 'H2O',
    name: 'Agua Pura',
    formula: 'H₂O',
    category: 'Compuesto Orgánico', // óxido de hidrógeno
    state: 'líquido',
    elements: ['H', 'O'],
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    atomicMass: '18.02 g/mol',
    bondType: 'Covalente polar',
    properties: 'Disolvente universal. Geometría molecular angular (104.5°) con momento dipolar neto y puentes de hidrógeno intermoleculares.',
    applications: 'Esencial para toda la vida biológica, medio acuoso de reacciones químicas, generación hidroeléctrica y refrigeración industrial.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },
  NaCl: {
    id: 'NaCl',
    name: 'Cloruro de Sodio',
    formula: 'NaCl',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['Na', 'Cl'],
    color: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.8)',
    atomicMass: '58.44 g/mol',
    bondType: 'Iónico',
    properties: 'Cristales cúbicos con red cristalina centrada en las caras (FCC). Enlace iónico entre cationes Na⁺ y aniones Cl⁻. Soluble en agua.',
    applications: 'Consumo humano (sal de mesa), sueros fisiológicos hospitalarios, conservación de alimentos y descongelación vial.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },
  Fe2O3: {
    id: 'Fe2O3',
    name: 'Óxido de Hierro (III)',
    formula: 'Fe₂O₃',
    category: 'Óxido Básico',
    state: 'sólido',
    elements: ['Fe', 'O'],
    color: '#b91c1c',
    glowColor: 'rgba(185, 28, 28, 0.7)',
    atomicMass: '159.69 g/mol',
    bondType: 'Iónico',
    properties: 'Sólido marrón-rojizo comúnmente llamado herrumbre o hematita. Estado de oxidación del hierro +3. Insoluble en agua.',
    applications: 'Pigmento rojo en pinturas y cerámicas, producción de hierro puro en altos hornos, pulido de lentes ópticas.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },
  CO2: {
    id: 'CO2',
    name: 'Dióxido de Carbono',
    formula: 'CO₂',
    category: 'Óxido Ácido',
    state: 'gas',
    elements: ['C', 'O'],
    color: '#a8a29e',
    glowColor: 'rgba(168, 162, 158, 0.5)',
    atomicMass: '44.01 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Gas incoloro con geometría molecular lineal (O=C=O). Aunque los enlaces C=O son polares, sus momentos dipolares se anulan.',
    applications: 'Gas para bebidas carbonatadas, extintores de incendios tipo B/C, refrigeración con hielo seco y fotosíntesis.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },
  CO: {
    id: 'CO',
    name: 'Monóxido de Carbono',
    formula: 'CO',
    category: 'Óxido Ácido',
    state: 'gas',
    elements: ['C', 'O'],
    color: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.5)',
    atomicMass: '28.01 g/mol',
    bondType: 'Covalente polar',
    properties: 'Gas incoloro, inodoro y altamente tóxico producto de la combustión incompleta. Se une fuertemente a la hemoglobina.',
    applications: 'Agente reductor en metalurgia pesada, síntesis de gas de síntesis (Syngas) para producir hidrocarburos líquidos.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  HCl: {
    id: 'HCl',
    name: 'Ácido Clorhídrico',
    formula: 'HCl',
    category: 'Ácido (Hidrácido / Oxoácido)',
    state: 'acuoso',
    elements: ['H', 'Cl'],
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    atomicMass: '36.46 g/mol',
    bondType: 'Covalente polar',
    properties: 'Disolución acuosa del cloruro de hidrógeno. Ácido monoprótico fuerte (pH < 1), altamente corrosivo y humeante.',
    applications: 'Decapado de metales en acerías, digestión de alimentos en el estómago humano, síntesis de cloruros y acidificante.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  NaOH: {
    id: 'NaOH',
    name: 'Hidróxido de Sodio',
    formula: 'NaOH',
    category: 'Hidróxido (Base)',
    state: 'sólido',
    elements: ['Na', 'O', 'H'],
    color: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.7)',
    atomicMass: '40.00 g/mol',
    bondType: 'Iónico',
    properties: 'Conocido como soda o sosa cáustica. Base inorgánica fuerte muy soluble en agua con una disolución fuertemente exotérmica.',
    applications: 'Saponificación de grasas para fabricar jabones, industria del papel kraft, destapador de tuberías y síntesis química.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  SO2: {
    id: 'SO2',
    name: 'Dióxido de Azufre',
    formula: 'SO₂',
    category: 'Óxido Ácido',
    state: 'gas',
    elements: ['S', 'O'],
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    atomicMass: '64.07 g/mol',
    bondType: 'Covalente polar',
    properties: 'Gas asfixiante con olor picante penetrante. Geometría angular. Al hidratarse produce ácido sulfuroso (responsable de lluvia ácida).',
    applications: 'Conservante y antioxidante en enología (vino), agente blanqueador en pasta de madera y precursor de ácido sulfúrico.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  SO3: {
    id: 'SO3',
    name: 'Trióxido de Azufre',
    formula: 'SO₃',
    category: 'Óxido Ácido',
    state: 'gas',
    elements: ['S', 'O'],
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    atomicMass: '80.06 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Óxido ácido anhídrido del ácido sulfúrico con geometría trigonal plana. Reacciona violentamente con agua liberando nieblas ácidas.',
    applications: 'Intermediario clave en el método de contacto industrial para la manufactura masiva de ácido sulfúrico y sulfonación de detergentes.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  H2SO4: {
    id: 'H2SO4',
    name: 'Ácido Sulfúrico',
    formula: 'H₂SO₄',
    category: 'Ácido (Hidrácido / Oxoácido)',
    state: 'líquido',
    elements: ['H', 'S', 'O'],
    color: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.8)',
    atomicMass: '98.08 g/mol',
    bondType: 'Covalente polar',
    properties: 'Líquido viscoso y oleoso ("aceite de vitriolo"). Ácido diprótico muy fuerte, potentísimo deshidratante y agente oxidante.',
    applications: 'El compuesto químico más producido a nivel mundial: fertilizantes fosfatados, baterías de plomo-ácido y refinación química.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  FeS: {
    id: 'FeS',
    name: 'Sulfuro de Hierro (II)',
    formula: 'FeS',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['Fe', 'S'],
    color: '#1e293b',
    glowColor: 'rgba(30, 41, 59, 0.7)',
    atomicMass: '87.91 g/mol',
    bondType: 'Iónico',
    properties: 'Sólido negro insoluble en agua. Se obtiene calentando limaduras de hierro con azufre en polvo mediante una reacción exotérmica.',
    applications: 'Generador de sulfuro de hidrógeno (H₂S) en laboratorios de química analítica, pigmento cerámico y reactivo en geoceldas.',
    isUnlockedByDefault: false,
    dangerLevel: 2,
  },
  NH3: {
    id: 'NH3',
    name: 'Amoníaco',
    formula: 'NH₃',
    category: 'Compuesto Orgánico', // Base de Lewis
    state: 'gas',
    elements: ['N', 'H'],
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.7)',
    atomicMass: '17.03 g/mol',
    bondType: 'Covalente polar',
    properties: 'Gas incoloro con penetrante olor acre. Geometría piramidal trigonal con un par de electrones no enlazantes (base de Lewis).',
    applications: 'Piedra angular de la agricultura moderna vía fertilizantes (nitrato de amonio), productos de limpieza y refrigeración.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  CH4: {
    id: 'CH4',
    name: 'Metano',
    formula: 'CH₄',
    category: 'Hidrocarburo',
    state: 'gas',
    elements: ['C', 'H'],
    color: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.6)',
    atomicMass: '16.04 g/mol',
    bondType: 'Covalente no polar',
    properties: 'Alcano más simple. Geometría tetraédrica perfecta (ángulo de 109.5° con hibridación sp³). Gas inflamable no tóxico pero asfixiante.',
    applications: 'Principal componente del gas natural para calefacción urbana, generación de electricidad limpia y producción de hidrógeno.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  CuSO4: {
    id: 'CuSO4',
    name: 'Sulfato de Cobre (II)',
    formula: 'CuSO₄',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['Cu', 'S', 'O'],
    color: '#2563eb',
    glowColor: 'rgba(37, 99, 235, 0.8)',
    atomicMass: '159.61 g/mol',
    bondType: 'Iónico',
    properties: 'Forma cristales triclínicos de un azul zafiro intenso al hidratarse (CuSO₄·5H₂O). El ion Cu²⁺ confiere su vibrante coloración.',
    applications: 'Fungicida agrícola (caldo bordelés), electrolito en galvanoplastia y refinación de cobre, mordiente textil.',
    isUnlockedByDefault: false,
    dangerLevel: 2,
  },
  CaO: {
    id: 'CaO',
    name: 'Óxido de Calcio (Cal Viva)',
    formula: 'CaO',
    category: 'Óxido Básico',
    state: 'sólido',
    elements: ['Ca', 'O'],
    color: '#f1f5f9',
    glowColor: 'rgba(241, 245, 249, 0.7)',
    atomicMass: '56.08 g/mol',
    bondType: 'Iónico',
    properties: 'Polvo blanco alcalino muy cáustico. Reacciona violentamente con agua desprendiendo una colosal cantidad de calor (apagado de cal).',
    applications: 'Fabricación de mortero y cemento para construcción, tratamiento de lodos ácidos y purificación del acero.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  CaOH2: {
    id: 'CaOH2',
    name: 'Hidróxido de Calcio (Cal Apagada)',
    formula: 'Ca(OH)₂',
    category: 'Hidróxido (Base)',
    state: 'sólido',
    elements: ['Ca', 'O', 'H'],
    color: '#e2e8f0',
    glowColor: 'rgba(226, 232, 240, 0.7)',
    atomicMass: '74.09 g/mol',
    bondType: 'Iónico',
    properties: 'Polvo blanco ligeramente soluble en agua; su disolución saturada se conoce como agua de cal (reactivo para detectar CO₂).',
    applications: 'Nixtamalización tradicional del maíz para tortillas, blanqueado de paredes, estabilización de suelos y odontología.',
    isUnlockedByDefault: false,
    dangerLevel: 2,
  },
  CaCO3: {
    id: 'CaCO3',
    name: 'Carbonato de Calcio',
    formula: 'CaCO₃',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['Ca', 'C', 'O'],
    color: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.7)',
    atomicMass: '100.09 g/mol',
    bondType: 'Iónico',
    properties: 'Mineral abundante en la corteza terrestre (mármol, calcita, tiza). Insoluble en agua neutra pero efervesce con ácidos liberando CO₂.',
    applications: 'Antiácido estomacal, conchas marinas, piedra de construcción, tiza escolar y neutralizador de acidez agrícola.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },
  H2O2: {
    id: 'H2O2',
    name: 'Peróxido de Hidrógeno',
    formula: 'H₂O₂',
    category: 'Compuesto Orgánico',
    state: 'líquido',
    elements: ['H', 'O'],
    color: '#67e8f9',
    glowColor: 'rgba(103, 232, 249, 0.7)',
    atomicMass: '34.01 g/mol',
    bondType: 'Covalente polar',
    properties: 'Líquido incoloro con enlace peróxido O-O inestable. Potente oxidante que se descompone espontáneamente en agua y oxígeno gaseoso.',
    applications: 'Desinfectante antiséptico para heridas, blanqueador dental y textil, combustible propelente secundario.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  O3: {
    id: 'O3',
    name: 'Ozono',
    formula: 'O₃',
    category: 'Elemento No Metálico',
    state: 'gas',
    elements: ['O'],
    color: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.7)',
    atomicMass: '48.00 g/mol',
    bondType: 'Covalente polar',
    properties: 'Forma alotrópica triatómica del oxígeno con estructura resonante. Gas azulado con olor penetrante que filtra la radiación UV solar.',
    applications: 'Capa protectora estratosférica contra rayos ultravioleta, purificación avanzada de aire y esterilización de agua.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  CuO: {
    id: 'CuO',
    name: 'Óxido de Cobre (II)',
    formula: 'CuO',
    category: 'Óxido Básico',
    state: 'sólido',
    elements: ['Cu', 'O'],
    color: '#0f172a',
    glowColor: 'rgba(15, 23, 42, 0.8)',
    atomicMass: '79.55 g/mol',
    bondType: 'Iónico',
    properties: 'Polvo negro semiconductor de tipo p. Resulta del calentamiento prolongado del cobre metálico en presencia de oxígeno.',
    applications: 'Esmalte cerámico para generar tonos azules y verdes, catalizador en química orgánica y celdas fotovoltaicas experimentales.',
    isUnlockedByDefault: false,
    dangerLevel: 2,
  },
  CuCl2: {
    id: 'CuCl2',
    name: 'Cloruro de Cobre (II)',
    formula: 'CuCl₂',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['Cu', 'Cl'],
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    atomicMass: '134.45 g/mol',
    bondType: 'Iónico',
    properties: 'Sólido verde azulado muy higroscópico. En disolución acuosa adquiere una viva tonalidad esmeralda.',
    applications: 'Fuegos artificiales (produce intensas llamas verdes y azules), mordiente en teñido y catalizador químico.',
    isUnlockedByDefault: false,
    dangerLevel: 2,
  },
  NaH: {
    id: 'NaH',
    name: 'Hidruro de Sodio',
    formula: 'NaH',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['Na', 'H'],
    color: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.6)',
    atomicMass: '24.00 g/mol',
    bondType: 'Iónico',
    properties: 'Compuesto iónico inusual donde el hidrógeno actúa como anión hidruro (H⁻) con estado de oxidación -1. Base de Brønsted extremadamente fuerte.',
    applications: 'Base fuerte no nucleofílica en síntesis orgánica y almacenamiento de hidrógeno químico.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  C2H5OH: {
    id: 'C2H5OH',
    name: 'Etanol',
    formula: 'C₂H₅OH',
    category: 'Compuesto Orgánico',
    state: 'líquido',
    elements: ['C', 'H', 'O'],
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    atomicMass: '46.07 g/mol',
    bondType: 'Covalente polar',
    properties: 'Líquido volátil con grupo funcional hidroxilo (-OH). Miscible con agua en todas las proporciones debido a puentes de hidrógeno.',
    applications: 'Desinfectante medicinal al 70%, biocombustible renovable para automóviles y solvente farmacéutico.',
    isUnlockedByDefault: false,
    dangerLevel: 2,
  },
  HNO3: {
    id: 'HNO3',
    name: 'Ácido Nítrico',
    formula: 'HNO₃',
    category: 'Ácido (Hidrácido / Oxoácido)',
    state: 'líquido',
    elements: ['H', 'N', 'O'],
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.8)',
    atomicMass: '63.01 g/mol',
    bondType: 'Covalente polar',
    properties: 'Líquido viscoso y corrosivo ("agua fuerte"). Ácido oxácido fuerte con enorme poder oxidante capaz de disolver metales como plata y cobre.',
    applications: 'Síntesis de fertilizantes nitrogenados, explosivos industriales y grabado de metales en microelectrónica.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  KOH: {
    id: 'KOH',
    name: 'Hidróxido de Potasio (Potasa Cáustica)',
    formula: 'KOH',
    category: 'Hidróxido (Base)',
    state: 'sólido',
    elements: ['K', 'O', 'H'],
    color: '#e0e7ff',
    glowColor: 'rgba(224, 231, 255, 0.7)',
    atomicMass: '56.11 g/mol',
    bondType: 'Iónico',
    properties: 'Base inorgánica extremadamente fuerte y cáustica. Se disuelve vigorosamente en agua de forma fuertemente exotérmica.',
    applications: 'Electrolito en pilas alcalinas, fabricación de jabones potásicos suaves y síntesis de sales de potasio.',
    isUnlockedByDefault: false,
    dangerLevel: 4,
  },
  K2S: {
    id: 'K2S',
    name: 'Sulfuro de Potasio',
    formula: 'K₂S',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['K', 'S'],
    color: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.7)',
    atomicMass: '110.26 g/mol',
    bondType: 'Iónico',
    properties: 'Sólido iónico higroscópico de color amarillo a marrón rojizo. Subproducto clave en la deflagración de la pólvora negra.',
    applications: 'Fuegos artificiales, pirotecnia tradicional, teñido de pieles y grabado fotográfico.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  KNO3: {
    id: 'KNO3',
    name: 'Nitrato de Potasio (Salitre)',
    formula: 'KNO₃',
    category: 'Sal Neutra / Binaria',
    state: 'sólido',
    elements: ['K', 'N', 'O'],
    color: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.8)',
    atomicMass: '101.10 g/mol',
    bondType: 'Iónico',
    properties: 'Sal cristalina blanca con potente capacidad comburente debida al anión nitrato (NO₃⁻). Libera oxígeno libre al calentarse fuertemente.',
    applications: 'Comburente principal de la pólvora negra tradicional, fertilizante agrícola de alta pureza y conservante alimentario.',
    isUnlockedByDefault: false,
    dangerLevel: 3,
  },
  Al2O3: {
    id: 'Al2O3',
    name: 'Óxido de Aluminio (Alúmina / Corindón)',
    formula: 'Al₂O₃',
    category: 'Óxido Básico',
    state: 'sólido',
    elements: ['Al', 'O'],
    color: '#f1f5f9',
    glowColor: 'rgba(241, 245, 249, 0.8)',
    atomicMass: '101.96 g/mol',
    bondType: 'Iónico',
    properties: 'Cerámica ultra-dura y refractaria con punto de fusión superior a 2072 °C. Formada como producto incandescente de la termita.',
    applications: 'Abrasivos industriales, rubíes y zafiros sintéticos, revestimiento cerámico térmico y aislante en microchips.',
    isUnlockedByDefault: false,
    dangerLevel: 1,
  },
};

export const REACTIONS: Reaction[] = [
  // 1. Hidrógeno + Oxígeno -> Agua
  {
    id: 'rx_water_synthesis',
    reactants: ['H2', 'O2'],
    products: ['H2O'],
    balancedEquation: '2H₂ (g) + O₂ (g) ➔ 2H₂O (l)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'Requiere calor del Mechero Bunsen o chispa para superar la energía de activación.',
    explanation:
      'Reacción fuertemente exotérmica. Los enlaces covalentes simples H-H (436 kJ/mol) y dobles O=O (498 kJ/mol) se rompen y se reorganizan en enlaces polares O-H liberando abundante calor y vapor de agua.',
    discoveryXp: 100,
    visualEffect: 'steam',
  },

  // 2. Sodio + Cloro -> Sal común (NaCl)
  {
    id: 'rx_nacl_synthesis',
    reactants: ['Na', 'Cl2'],
    products: ['NaCl'],
    balancedEquation: '2Na (s) + Cl₂ (g) ➔ 2NaCl (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'ambient',
    conditionDescription: 'Ocurre espontáneamente a temperatura ambiente con una intensa emisión lumínica amarilla.',
    explanation:
      'Transferencia electrónica redox completa: el sodio cede su electrón 3s¹ al cloro (altamente electronegativo), originando cationes Na⁺ y aniones Cl⁻ que se ensamblan en una red cristalina iónica tridimensional.',
    discoveryXp: 120,
    visualEffect: 'crystals',
  },

  // 3. Hierro + Oxígeno -> Óxido de Hierro (III)
  {
    id: 'rx_rust_synthesis',
    reactants: ['Fe', 'O2'],
    products: ['Fe2O3'],
    balancedEquation: '4Fe (s) + 3O₂ (g) ➔ 2Fe₂O₃ (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'Acelerada fuertemente con calor del Mechero Bunsen.',
    explanation:
      'Oxidación directa del metal. El hierro pasa de estado de oxidación 0 a +3 donando electrones a los átomos de oxígeno que se reducen a O²⁻, formando una sal de óxido metálico rojizo.',
    discoveryXp: 110,
    visualEffect: 'spark',
  },

  // 4. Carbono + Oxígeno (exceso) -> CO2
  {
    id: 'rx_co2_synthesis',
    reactants: ['C', 'O2'],
    products: ['CO2'],
    balancedEquation: 'C (s) + O₂ (g) ➔ CO₂ (g)',
    reactionType: 'Combustión',
    requiredCondition: 'heat',
    conditionDescription: 'Requiere calor inicial para iniciar la ignición del carbono.',
    explanation:
      'Combustión completa del carbono. Se forman dos enlaces dobles covalentes C=O muy estables, liberando 393.5 kJ/mol de energía en forma de calor y dióxido de carbono gaseoso.',
    discoveryXp: 100,
    visualEffect: 'fire',
  },

  // 5. Hidrógeno + Cloro -> Ácido Clorhídrico (HCl gas/ac)
  {
    id: 'rx_hcl_synthesis',
    reactants: ['H2', 'Cl2'],
    products: ['HCl'],
    balancedEquation: 'H₂ (g) + Cl₂ (g) ➔ 2HCl (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'spark',
    conditionDescription: 'Requiere chispa o luz ultravioleta para iniciar la reacción en cadena de radicales libres.',
    explanation:
      'La luz o chispa disocia fotolíticamente moléculas de Cl₂ en radicales Cl• altamente reactivos que propagan la síntesis de enlaces covalentes polares H-Cl.',
    discoveryXp: 120,
    visualEffect: 'spark',
  },

  // 6. Sodio + Agua -> Hidróxido de Sodio + Hidrógeno
  {
    id: 'rx_na_water_displacement',
    reactants: ['Na', 'H2O'],
    products: ['NaOH', 'H2'],
    balancedEquation: '2Na (s) + 2H₂O (l) ➔ 2NaOH (ac) + H₂ (g)↑',
    reactionType: 'Desplazamiento Simple',
    requiredCondition: 'ambient',
    conditionDescription: 'Reacción espontánea muy vigorosa a temperatura ambiente con burbujeo inmediato.',
    explanation:
      'El sodio reduce los iones de hidrógeno del agua a gas hidrógeno elemental (H₂↑), generando una solución altamente alcalina de iones hidróxido (OH⁻) y sodio (Na⁺).',
    discoveryXp: 140,
    visualEffect: 'fizz',
  },

  // 7. Neutralización: HCl + NaOH -> NaCl + H2O
  {
    id: 'rx_neutralization_basic',
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H2O'],
    balancedEquation: 'HCl (ac) + NaOH (ac) ➔ NaCl (ac) + H₂O (l)',
    reactionType: 'Doble Desplazamiento (Neutralización)',
    requiredCondition: 'ambient',
    conditionDescription: 'Ocurre instantáneamente a temperatura ambiente sin necesidad de mechero.',
    explanation:
      'Neutralización ácido-base clásica de Arrhenius: los protones H⁺ del ácido neutralizan los aniones hidroxilo OH⁻ de la base para generar agua pura y calor de neutralización (ΔH ≈ -57 kJ/mol), dejando sal en solución.',
    discoveryXp: 150,
    visualEffect: 'bubbles',
  },

  // 8. Azufre + Oxígeno -> Dióxido de Azufre
  {
    id: 'rx_so2_synthesis',
    reactants: ['S8', 'O2'],
    products: ['SO2'],
    balancedEquation: 'S (s) + O₂ (g) ➔ SO₂ (g)',
    reactionType: 'Combustión',
    requiredCondition: 'heat',
    conditionDescription: 'El azufre funde y arde con llama azul al aplicar calor del mechero.',
    explanation:
      'Combustión del azufre sólido que produce gas de dióxido de azufre, un gas irritante con enlaces covalentes polares y enlace resonante.',
    discoveryXp: 110,
    visualEffect: 'fire',
  },

  // 9. Dióxido de Azufre + Oxígeno -> Trióxido de Azufre
  {
    id: 'rx_so3_synthesis',
    reactants: ['SO2', 'O2'],
    products: ['SO3'],
    balancedEquation: '2SO₂ (g) + O₂ (g) ➔ 2SO₃ (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'catalyst',
    conditionDescription: 'Requiere catalizador sólido y calor sostenido (como en el método de contacto industrial).',
    explanation:
      'Oxidación catalítica de SO₂ a SO₃. El azufre alcanza su máximo estado de oxidación (+6), preparando el precursor definitivo del ácido sulfúrico.',
    discoveryXp: 160,
    visualEffect: 'spark',
  },

  // 10. Trióxido de Azufre + Agua -> Ácido Sulfúrico
  {
    id: 'rx_h2so4_synthesis',
    reactants: ['SO3', 'H2O'],
    products: ['H2SO4'],
    balancedEquation: 'SO₃ (g) + H₂O (l) ➔ H₂SO₄ (ac)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'ambient',
    conditionDescription: 'Reacción extraordinariamente violenta y exotérmica al contacto con agua.',
    explanation:
      'Hidratación directa del anhídrido sulfúrico formando el oxácido fuerte ácido sulfúrico, donde el azufre está coordinado tetraédricamente con 4 oxígenos.',
    discoveryXp: 180,
    visualEffect: 'steam',
  },

  // 11. Hierro + Azufre -> Sulfuro de Hierro (FeS)
  {
    id: 'rx_fes_synthesis',
    reactants: ['Fe', 'S8'],
    products: ['FeS'],
    balancedEquation: 'Fe (s) + S (s) ➔ FeS (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'Requiere calentar vigorosamente la mezcla sólida con el Mechero Bunsen.',
    explanation:
      'Síntesis mineral de sulfuro de hierro (II). Una vez iniciada con calor, la reacción continúa por sí misma con incandescencia rojiza debido a su calor de formación.',
    discoveryXp: 120,
    visualEffect: 'spark',
  },

  // 12. Nitrógeno + Hidrógeno -> Amoníaco (Haber-Bosch)
  {
    id: 'rx_nh3_synthesis',
    reactants: ['N2', 'H2'],
    products: ['NH3'],
    balancedEquation: 'N₂ (g) + 3H₂ (g) ➔ 2NH₃ (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'catalyst',
    conditionDescription: 'Requiere catalizador metálico y calor para romper el fuertísimo triple enlace del N₂.',
    explanation:
      'El proceso histórico de Haber-Bosch: permite fijar el nitrógeno atmosférico inerte rompiendo su enlace triple N≡N (945 kJ/mol) para sintetizar amoníaco con geometría piramidal trigonal.',
    discoveryXp: 190,
    visualEffect: 'spark',
  },

  // 13. Carbono + Hidrógeno -> Metano
  {
    id: 'rx_methane_synthesis',
    reactants: ['C', 'H2'],
    products: ['CH4'],
    balancedEquation: 'C (s) + 2H₂ (g) ➔ CH₄ (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'catalyst',
    conditionDescription: 'Requiere catalizador y calor para promover la hidrogenación del carbono.',
    explanation:
      'Hidrogenación del carbono sólido. El carbono hibrida sus orbitales a sp³ formando 4 enlaces covalentes idénticos dirigidos a los vértices de un tetraedro regular.',
    discoveryXp: 150,
    visualEffect: 'spark',
  },

  // 14. Calcio + Oxígeno -> Óxido de Calcio (Cal viva)
  {
    id: 'rx_cao_synthesis',
    reactants: ['Ca', 'O2'],
    products: ['CaO'],
    balancedEquation: '2Ca (s) + O₂ (g) ➔ 2CaO (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'El calcio arde con una brillante llama naranja-rojiza bajo calor.',
    explanation:
      'Oxidación del calcio alcalinotérreo formando el óxido básico CaO mediante enlace iónico entre Ca²⁺ y O²⁻ con alta energía de red.',
    discoveryXp: 130,
    visualEffect: 'fire',
  },

  // 15. Óxido de Calcio + Agua -> Hidróxido de Calcio (Cal apagada)
  {
    id: 'rx_caoh2_hydration',
    reactants: ['CaO', 'H2O'],
    products: ['CaOH2'],
    balancedEquation: 'CaO (s) + H₂O (l) ➔ Ca(OH)₂ (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'ambient',
    conditionDescription: 'Reacción de hidratación espontánea y muy caliente al añadir agua.',
    explanation:
      'Conocida históricamente como "apagado de cal". Los iones O²⁻ del óxido reaccionan con el agua formando aniones hidróxido (OH⁻), generando la base hidróxido de calcio.',
    discoveryXp: 140,
    visualEffect: 'steam',
  },

  // 16. Hidróxido de Calcio + Dióxido de Carbono -> Carbonato de Calcio + Agua
  {
    id: 'rx_caco3_precipitation',
    reactants: ['CaOH2', 'CO2'],
    products: ['CaCO3', 'H2O'],
    balancedEquation: 'Ca(OH)₂ (ac) + CO₂ (g) ➔ CaCO₃ (s)↓ + H₂O (l)',
    reactionType: 'Doble Desplazamiento (Precipitación)',
    requiredCondition: 'ambient',
    conditionDescription: 'Enturbiamiento característico del agua de cal a temperatura ambiente.',
    explanation:
      'El CO₂ gaseoso burbujeado en hidróxido de calcio produce carbonato de calcio que precipita como un sólido blanco lechoso insoluble. Esta es la prueba química estándar para detectar dióxido de carbono.',
    discoveryXp: 170,
    visualEffect: 'crystals',
  },

  // 17. Cobre + Oxígeno -> Óxido de Cobre (II)
  {
    id: 'rx_cuo_synthesis',
    reactants: ['Cu', 'O2'],
    products: ['CuO'],
    balancedEquation: '2Cu (s) + O₂ (g) ➔ 2CuO (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'Requiere calentar la chapa o alambre de cobre al rojo vivo.',
    explanation:
      'Oxidación térmica del cobre metálico brillante a óxido de cobre (II) negro mate en estado de oxidación +2.',
    discoveryXp: 120,
    visualEffect: 'spark',
  },

  // 18. Cobre + Cloro -> Cloruro de Cobre (II)
  {
    id: 'rx_cucl2_synthesis',
    reactants: ['Cu', 'Cl2'],
    products: ['CuCl2'],
    balancedEquation: 'Cu (s) + Cl₂ (g) ➔ CuCl₂ (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'Al calentar el cobre en atmósfera de cloro arde con llamas verde-azuladas.',
    explanation:
      'El gas cloro oxida vigorosamente el cobre metálico formando cristales iónicos de cloruro cúprico.',
    discoveryXp: 135,
    visualEffect: 'spark',
  },

  // 19. Desplazamiento Redox: Hierro + Sulfato de Cobre -> Sulfato de Hierro + Cobre
  {
    id: 'rx_fe_cuso4_displacement',
    reactants: ['Fe', 'CuSO4'],
    products: ['Cu'],
    balancedEquation: 'Fe (s) + CuSO₄ (ac) ➔ FeSO₄ (ac) + Cu (s)↓',
    reactionType: 'Desplazamiento Simple',
    requiredCondition: 'ambient',
    conditionDescription: 'Ocurre espontáneamente sumergiendo hierro en solución azul de CuSO₄.',
    explanation:
      'Demostración de la serie electroquímica de actividad de los metales: el hierro es más reactivo y electropositivo que el cobre, por lo que el Fe se oxida a Fe²⁺ disolviéndose mientras deposita cobre metálico rojizo.',
    discoveryXp: 160,
    visualEffect: 'crystals',
  },

  // 20. Descomposición de Peróxido de Hidrógeno: H2O2 -> H2O + O2 (Elefante / catalizador)
  {
    id: 'rx_h2o2_decomposition',
    reactants: ['H2O2'],
    products: ['H2O', 'O2'],
    balancedEquation: '2H₂O₂ (ac) ➔ 2H₂O (l) + O₂ (g)↑',
    reactionType: 'Descomposición',
    requiredCondition: 'catalyst',
    conditionDescription: 'Acelerada instantáneamente con catalizador produciendo abundante espuma de oxígeno.',
    explanation:
      'Dismutación redox del oxígeno: los átomos de oxígeno en estado -1 se oxidan simultáneamente a 0 (en O₂) y se reducen a -2 (en H₂O). El catalizador disminuye dramáticamente la energía de activación.',
    discoveryXp: 140,
    visualEffect: 'fizz',
  },

  // 21. Descomposición de Carbonato de Calcio: CaCO3 -> CaO + CO2 (Calcinación)
  {
    id: 'rx_caco3_thermal_decomp',
    reactants: ['CaCO3'],
    products: ['CaO', 'CO2'],
    balancedEquation: 'CaCO₃ (s) ➔ CaO (s) + CO₂ (g)↑',
    reactionType: 'Descomposición',
    requiredCondition: 'heat',
    conditionDescription: 'Requiere calcinación intensa con el Mechero Bunsen a más de 800 °C.',
    explanation:
      'Descomposición térmica endotérmica: el calor desestabiliza el anión poliatómico carbonato CO₃²⁻, liberando gas CO₂ y dejando el residuo de cal viva CaO.',
    discoveryXp: 150,
    visualEffect: 'fire',
  },

  // 22. Electrólisis del Agua: H2O -> H2 + O2
  {
    id: 'rx_water_electrolysis',
    reactants: ['H2O'],
    products: ['H2', 'O2'],
    balancedEquation: '2H₂O (l) ➔ 2H₂ (g)↑ + O₂ (g)↑',
    reactionType: 'Descomposición',
    requiredCondition: 'spark',
    conditionDescription: 'Requiere corriente eléctrica / chispa de electrodos para romper los enlaces O-H.',
    explanation:
      'Electrólisis del agua: corriente eléctrica directa rompe los enlaces polares H-O. En el cátodo (-) se reduce el hidrógeno (2H⁺ + 2e⁻ ➔ H₂) en doble volumen que el oxígeno liberado en el ánodo (+).',
    discoveryXp: 180,
    visualEffect: 'bubbles',
  },

  // 23. Formación de Ozono: O2 -> O3
  {
    id: 'rx_ozone_formation',
    reactants: ['O2'],
    products: ['O3'],
    balancedEquation: '3O₂ (g) ➔ 2O₃ (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'spark',
    conditionDescription: 'Descarga eléctrica de alto voltaje o chispa ultravioleta.',
    explanation:
      'La chispa eléctrica escinde moléculas de O₂ en átomos de oxígeno libres muy inestables que colisionan con otras moléculas de O₂ formando el gas alotrópico ozono.',
    discoveryXp: 160,
    visualEffect: 'spark',
  },

  // 24. Sodio + Hidrógeno -> Hidruro de Sodio
  {
    id: 'rx_nah_synthesis',
    reactants: ['Na', 'H2'],
    products: ['NaH'],
    balancedEquation: '2Na (s) + H₂ (g) ➔ 2NaH (s)',
    reactionType: 'Síntesis (Combinación)',
    requiredCondition: 'heat',
    conditionDescription: 'Requiere calentamiento sostenido bajo gas hidrógeno seco.',
    explanation:
      'El sodio fuerza al hidrógeno a aceptar un electrón, formándose el anión hidruro H⁻ con configuración electrónica similar al helio (1s²).',
    discoveryXp: 145,
    visualEffect: 'crystals',
  },

  // 25. Combustión del Metano: CH4 + O2 -> CO2 + H2O
  {
    id: 'rx_methane_combustion',
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    balancedEquation: 'CH₄ (g) + 2O₂ (g) ➔ CO₂ (g) + 2H₂O (g)',
    reactionType: 'Combustión',
    requiredCondition: 'heat',
    conditionDescription: 'Chispa o llama del mechero para iniciar la combustión de la mezcla gaseosa.',
    explanation:
      'Combustión limpia del hidrocarburo más simple. Libera 890 kJ/mol de energía limpia en forma de calor y vapor de agua, fundamental en generación energética moderna.',
    discoveryXp: 150,
    visualEffect: 'fire',
  },
];

/**
 * Helper to look up a reaction given a set of reactants and conditions
 */
export function evaluateReaction(
  reactantIds: string[],
  currentCondition: ReactionCondition
): {
  success: boolean;
  reaction?: Reaction;
  reason?: string;
  chemicalTip?: string;
} {
  if (reactantIds.length === 0) {
    return {
      success: false,
      reason: 'El recipiente está vacío. Selecciona al menos una sustancia de la bandeja.',
    };
  }

  // Check if Helium or Gold is involved in impossible ways
  if (reactantIds.includes('He')) {
    return {
      success: false,
      reason: 'El Helio (He) es un Gas Noble inerte del Grupo 18. Su capa electrónica 1s² está completamente llena, por lo que no cede, acepta ni comparte electrones en estas condiciones.',
      chemicalTip: 'Regla del Octeto / Dueto: Los átomos con capas de valencia completas poseen máxima estabilidad termodinámica.',
    };
  }

  // Sort reactants for set comparison
  const sortedInput = [...reactantIds].sort();

  // Find candidate reaction that matches the reactants
  const candidate = REACTIONS.find((rx) => {
    const rxReactants = [...rx.reactants].sort();
    if (rxReactants.length !== sortedInput.length) return false;
    return rxReactants.every((id, idx) => id === sortedInput[idx]);
  });

  if (!candidate) {
    // Generate intelligent chemistry failure analysis
    if (reactantIds.length === 1) {
      return {
        success: false,
        reason: `La sustancia ${SUBSTANCES[reactantIds[0]]?.name || 'seleccionada'} es estable por sí misma en este recipiente y no sufre descomposición espontánea.`,
        chemicalTip: 'Intenta combinarla con un reactivo oxidante (como O₂ o Cl₂) o añade otra sustancia compatible.',
      };
    }

    const names = reactantIds.map((id) => SUBSTANCES[id]?.name || id).join(' y ');
    return {
      success: false,
      reason: `No se produce ninguna reacción química observable entre ${names} bajo las leyes de afinidad química habituales.`,
      chemicalTip: 'Revisa los tipos de enlaces: los metales no suelen reaccionar entre sí formando compuestos simples, y dos sales o gases no reactivos necesitan condiciones o afinidades específicas.',
    };
  }

  // Check condition requirement
  if (candidate.requiredCondition !== 'ambient' && candidate.requiredCondition !== currentCondition) {
    const conditionNames: Record<ReactionCondition, string> = {
      ambient: 'Temperatura ambiente',
      heat: 'Calor (Mechero Bunsen)',
      spark: 'Chispa eléctrica / Electrodos',
      catalyst: 'Catalizador químico',
    };

    return {
      success: false,
      reason: `Los reactivos están presentes (${candidate.balancedEquation.split('➔')[0].trim()}), pero la energía de activación no es suficiente.`,
      chemicalTip: `Esta reacción requiere: ${conditionNames[candidate.requiredCondition]}. Activa la herramienta correspondiente en el laboratorio.`,
    };
  }

  // Successful reaction!
  return {
    success: true,
    reaction: candidate,
  };
}
