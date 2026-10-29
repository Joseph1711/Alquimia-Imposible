export interface Mission {
  id: string;
  order: number;
  title: string;
  category: 'Reparación' | 'Identificación' | 'Energía' | 'Síntesis Avanzada' | 'Seguridad';
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  storyPrompt: string;
  chemicalObjective: string;
  targetProductIds: string[]; // Substance IDs required to complete
  requiredReactionType?: string;
  hint: string;
  educationalConcept: string;
  rewardXp: number;
  rewardTitle: string;
  isUnlockedByDefault: boolean;
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission_1_lost_material',
    order: 1,
    title: 'El Material Perdido',
    category: 'Reparación',
    difficulty: 'Básico',
    storyPrompt:
      'Un generador de refrigeración experimental sufrió una fuga catastrófica. La cuadrilla de mantenimiento necesita con urgencia sintetizar Agua pura (H₂O) para el circuito de refrigeración primaria.',
    chemicalObjective: 'Sintetiza Agua Pura (H₂O) combinando Hidrógeno (H₂) y Oxígeno (O₂) con el Mechero Bunsen encendido.',
    targetProductIds: ['H2O'],
    hint: 'El hidrógeno y el oxígeno diatómicos reaccionan de manera fuertemente exotérmica cuando reciben calor para superar la energía de activación.',
    educationalConcept: 'Reacción de Síntesis / Enlaces covalentes polares y estequiometría 2:1.',
    rewardXp: 150,
    rewardTitle: 'Fontanero Molecular',
    isUnlockedByDefault: true,
  },
  {
    id: 'mission_2_crystal_salt',
    order: 2,
    title: 'Cristales de la Red Iónica',
    category: 'Síntesis Avanzada',
    difficulty: 'Básico',
    storyPrompt:
      'Las computadoras iónicas del laboratorio necesitan una solución salina conductora. Debes sintetizar Cloruro de Sodio (NaCl) a partir de un metal reactivo y un gas halógeno.',
    chemicalObjective: 'Combina Sodio Metálico (Na) y Gas Cloro (Cl₂) a temperatura ambiente.',
    targetProductIds: ['NaCl'],
    hint: 'El sodio es un metal alcalino del Grupo 1 deseoso de ceder 1 electrón, mientras que el cloro es un halógeno del Grupo 17 que lo atrapa con avidez.',
    educationalConcept: 'Enlace Iónico: transferencia de electrones entre metales y no metales.',
    rewardXp: 180,
    rewardTitle: 'Cristalógrafo Iniciado',
    isUnlockedByDefault: true,
  },
  {
    id: 'mission_3_power_restoration',
    order: 3,
    title: 'El Laboratorio sin Energía',
    category: 'Energía',
    difficulty: 'Intermedio',
    storyPrompt:
      '¡Falla de la red eléctrica principal! Los acumuladores térmicos del complejo requieren una reacción de combustión limpia y potente para activar las turbinas auxiliares.',
    chemicalObjective: 'Sintetiza Dióxido de Carbono (CO₂) mediante combustión completa de Carbono (C) con Oxígeno (O₂) usando calor.',
    targetProductIds: ['CO2'],
    hint: 'El carbono sólido al entrar en ignición reacciona con el comburente oxígeno molecular liberando 393 kJ/mol de calor.',
    educationalConcept: 'Reacciones de Combustión y conservación de la masa (Lavoisier).',
    rewardXp: 200,
    rewardTitle: 'Termoquímico Calificado',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_4_mysterious_limestone',
    order: 4,
    title: 'La Sustancia Misteriosa',
    category: 'Identificación',
    difficulty: 'Intermedio',
    storyPrompt:
      'Un contenedor sellado contiene caliza ancestral. Mediante calor intenso en crisol, debes descomponerla en un óxido básico corrosivo conocido como Cal Viva (CaO).',
    chemicalObjective: 'Descompón Carbonato de Calcio (CaCO₃) o sintetiza Óxido de Calcio (CaO) calentando Calcio (Ca) con Oxígeno (O₂).',
    targetProductIds: ['CaO'],
    hint: 'Los óxidos metálicos básicos se forman cuando un metal alcalinotérreo como el calcio reacciona vigorosamente con el oxígeno bajo llama.',
    educationalConcept: 'Óxidos Metálicos Básicos vs Óxidos Ácidos No Metálicos.',
    rewardXp: 220,
    rewardTitle: 'Analista de Minerales',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_5_critical_neutralization',
    order: 5,
    title: 'Neutralización Crítica',
    category: 'Seguridad',
    difficulty: 'Intermedio',
    storyPrompt:
      '¡Alerta biológica en el sector de drenaje! Se ha detectado una fuga de Ácido Clorhídrico (HCl). Para evitar que corroa las instalaciones, debes neutralizarlo de inmediato con Hidróxido de Sodio (NaOH).',
    chemicalObjective: 'Mezcla Ácido Clorhídrico (HCl) con Hidróxido de Sodio (NaOH) para producir sal neutra inocua (NaCl) y agua.',
    targetProductIds: ['NaCl', 'H2O'],
    requiredReactionType: 'Doble Desplazamiento (Neutralización)',
    hint: 'Ácido + Base ➔ Sal + Agua. Los protones H⁺ y los iones hidroxilo OH⁻ se neutralizan cancelando la acidez.',
    educationalConcept: 'Teoría Ácido-Base de Arrhenius y pH neutral (7.0).',
    rewardXp: 260,
    rewardTitle: 'Especialista en Seguridad Química',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_6_the_perfect_compound',
    order: 6,
    title: 'El Compuesto Perfecto: Ácido Sulfúrico',
    category: 'Síntesis Avanzada',
    difficulty: 'Avanzado',
    storyPrompt:
      'El centro de investigación aeroespacial necesita el producto químico industrial más demandado del planeta: Ácido Sulfúrico concentrado (H₂SO₄). Requiere una cadena de síntesis escalonada.',
    chemicalObjective: 'Sintetiza Ácido Sulfúrico (H₂SO₄) hidratando Trióxido de Azufre (SO₃) con Agua (H₂O).',
    targetProductIds: ['H2SO4'],
    hint: 'Primero sintetiza SO₂ oxidando azufre, luego usa catalizador para llegar a SO₃, y finalmente mézclalo con agua pura.',
    educationalConcept: 'El Método de Contacto y los Oxoácidos industriales.',
    rewardXp: 350,
    rewardTitle: 'Maestro de la Síntesis Sulfúrica',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_7_green_fuel',
    order: 7,
    title: 'Combustible Verde: Metano',
    category: 'Energía',
    difficulty: 'Avanzado',
    storyPrompt:
      'Para abastecer la flota de drones no tripulados, sintetiza hidrocarburo gaseoso simple Metano (CH₄) combinando carbono e hidrógeno con asistencia catalítica.',
    chemicalObjective: 'Sintetiza Metano (CH₄) combinando Carbono (C) e Hidrógeno (H₂) con el catalizador activo.',
    targetProductIds: ['CH4'],
    hint: 'El carbono adopta una configuración tetraédrica con 4 hidrógenos compartiendo electrones covalentes.',
    educationalConcept: 'Química Orgánica: Hidrocarburos e hibridación orbital sp³.',
    rewardXp: 320,
    rewardTitle: 'Ingeniero de Biocombustibles',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_8_redox_displacement',
    order: 8,
    title: 'La Pila de Desplazamiento',
    category: 'Síntesis Avanzada',
    difficulty: 'Avanzado',
    storyPrompt:
      'Demuestra la serie galvánica de los metales sumergiendo Hierro (Fe) en una solución cristalina de Sulfato de Cobre (CuSO₄) para recuperar cobre puro.',
    chemicalObjective: 'Produce Cobre elemental (Cu) mediante desplazamiento simple entre Hierro (Fe) y Sulfato de Cobre (CuSO₄).',
    targetProductIds: ['Cu'],
    hint: 'El hierro metálico es más reactivo y cede sus electrones al ion cobre Cu²⁺, forzándolo a precipitar como metal.',
    educationalConcept: 'Reacciones Redox y Serie de Reactividad de los Metales.',
    rewardXp: 380,
    rewardTitle: 'Alquimista Metalúrgico',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_9_knallgas_detonation',
    order: 9,
    title: 'La Chispa del Knallgas',
    category: 'Seguridad',
    difficulty: 'Intermedio',
    storyPrompt:
      '¡Prueba de propulsión hipersónica! El equipo de cohetería necesita calibrar la ignición rápida de oxihidrógeno estequiométrico en el matraz blindado.',
    chemicalObjective: 'Detona Hidrógeno (H₂) y Oxígeno (O₂) activando el electrodo de chispa de alta tensión.',
    targetProductIds: ['H2O'],
    requiredReactionType: 'Deflagración / Reacción Explosiva',
    hint: 'Coloca Hidrógeno y Oxígeno en el recipiente y activa el switch de Chispa Eléctrica para inducir la propagación supersónica de radicales libres.',
    educationalConcept: 'Cinética de Reacciones en Cadena y Límites de Explosividad (LEL/UEL).',
    rewardXp: 300,
    rewardTitle: 'Artillero Molecular',
    isUnlockedByDefault: false,
  },
  {
    id: 'mission_10_black_powder',
    order: 10,
    title: 'El Secreto de la Pólvora Negra',
    category: 'Síntesis Avanzada',
    difficulty: 'Avanzado',
    storyPrompt:
      'Descifra el manuscrito alquímico del siglo IX: combina carbón reductor, azufre y potasio/salitre para provocar una deflagración termodinámica con expansión gaseosa instantánea.',
    chemicalObjective: 'Combina Potasio (K), Azufre (S) y Carbono (C) con calor del Mechero Bunsen para desencadenar la deflagración pirotécnica.',
    targetProductIds: ['K2S', 'CO2'],
    requiredReactionType: 'Deflagración / Reacción Explosiva',
    hint: 'El azufre baja la temperatura de ignición, el carbón actúa como combustible reductor y el agente oxidante proporciona la rápida expansión de gases calientes.',
    educationalConcept: 'Termodinámica de Deflagración y Expansión Rápida de Gases.',
    rewardXp: 400,
    rewardTitle: 'Maestro Pirotécnico',
    isUnlockedByDefault: false,
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_bond',
    title: 'Primer Enlace',
    description: 'Completa con éxito tu primera reacción química en el laboratorio.',
    iconName: 'FlaskConical',
    unlocked: false,
  },
  {
    id: 'ach_fire_lord',
    title: 'Señor de la Llama',
    description: 'Usa el Mechero Bunsen para activar una reacción con calor.',
    iconName: 'Flame',
    unlocked: false,
  },
  {
    id: 'ach_spark_master',
    title: 'Chispa Cuántica',
    description: 'Utiliza el electrodo de chispa eléctrica para inducir una reacción o descomposición.',
    iconName: 'Zap',
    unlocked: false,
  },
  {
    id: 'ach_catalyst_guru',
    title: 'Alquimia Acelerada',
    description: 'Emplea un catalizador para reducir la energía de activación.',
    iconName: 'Activity',
    unlocked: false,
  },
  {
    id: 'ach_neutralizer',
    title: 'Neutralización Perfecta',
    description: 'Combina un ácido y una base para obtener sal y agua a pH neutro.',
    iconName: 'ShieldCheck',
    unlocked: false,
  },
  {
    id: 'ach_noble_lesson',
    title: 'Lección del Gas Noble',
    description: 'Comprende por qué el Helio no reacciona debido a su capa de valencia completa.',
    iconName: 'Atom',
    unlocked: false,
  },
  {
    id: 'ach_discoverer_5',
    title: 'Investigador Prometedor',
    description: 'Descubre y desbloquea 5 compuestos químicos en el catálogo.',
    iconName: 'BookOpen',
    unlocked: false,
  },
  {
    id: 'ach_discoverer_15',
    title: 'Doctor en Alquimia',
    description: 'Descubre y desbloquea 15 sustancias en la enciclopedia.',
    iconName: 'Award',
    unlocked: false,
  },
  {
    id: 'ach_mission_hero',
    title: 'Solucionador de Misiones',
    description: 'Completa al menos 3 misiones de laboratorio.',
    iconName: 'CheckCircle2',
    unlocked: false,
  },
  {
    id: 'ach_grand_alchemist',
    title: 'Gran Alquimista Supremo',
    description: 'Alcanza el Nivel 5 de Alquimista y domina la química experimental.',
    iconName: 'Crown',
    unlocked: false,
  },
  {
    id: 'ach_pyro_master',
    title: '¡Onda de Choque!',
    description: 'Detona una reacción explosiva o deflagración controlada en el matraz blindado.',
    iconName: 'Sparkles',
    unlocked: false,
  },
  {
    id: 'ach_recipe_master',
    title: 'Grimorio de Alquimia',
    description: 'Explora y carga recetas de síntesis química en tu mesa de trabajo.',
    iconName: 'BookMarked',
    unlocked: false,
  },
];
