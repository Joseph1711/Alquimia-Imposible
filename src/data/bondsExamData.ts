import { ELEMENTS_118, ChemicalElement } from './elements118';

export type BondExamType =
  | 'simple'       // Enlace covalente simple (1 par compartido = 2 e⁻)
  | 'double'       // Enlace covalente doble (2 pares compartidos = 4 e⁻)
  | 'triple'       // Enlace covalente triple (3 pares compartidos = 6 e⁻)
  | 'coordinate'   // Enlace covalente coordinado o dativo (par aportado por un solo átomo)
  | 'ionic';       // Enlace iónico (transferencia completa de electrones catión + anión)

export interface UserBond {
  fromAtomIndex: number;
  toAtomIndex: number;
  type: BondExamType;
}

export interface ExamAtomDefinition {
  symbol: string;
  valenceElectrons: number;
  octetTarget: number; // 8 for most, 2 for H
  electronegativity: number;
  role: 'central' | 'terminal' | 'metal' | 'no-metal';
  initialX: number;
  initialY: number;
}

export interface BondExamCompound {
  id: string;
  formula: string;
  traditionalName: string; // Exclusivamente Nomenclatura Tradicional
  category: 'covalente_simple' | 'covalente_multiple' | 'oxido_anhidrido' | 'sal_ionica' | 'acido' | 'dativo';
  categoryLabel: string;
  difficulty: 'Principiante (Nivel 1)' | 'Intermedio (Nivel 2)' | 'Avanzado (Nivel 3)' | 'Maestro Alquimista (Nivel 4)';
  levelNumber: 1 | 2 | 3 | 4;
  atoms: ExamAtomDefinition[];
  targetBonds: {
    from: number;
    to: number;
    type: BondExamType;
  }[];
  expectedBondClassification: 'covalente_no_polar' | 'covalente_polar' | 'ionico' | 'coordinado';
  expectedClassificationName: string;
  geometryName: string;
  deltaEN: number;
  scientificExplanation: string;
  octetRuleExplanation: string;
  pedagogicalHint: string;
}

export const BOND_EXAM_COMPOUNDS: BondExamCompound[] = [
  // --- NIVEL 1: ENLACES SIMPLES Y DIATÓMICOS ---
  {
    id: 'h2',
    formula: 'H₂',
    traditionalName: 'Hidrógeno Molecular',
    category: 'covalente_simple',
    categoryLabel: 'Elemento Diatómico',
    difficulty: 'Principiante (Nivel 1)',
    levelNumber: 1,
    atoms: [
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 180, initialY: 170 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'simple' }],
    expectedBondClassification: 'covalente_no_polar',
    expectedClassificationName: 'Enlace Covalente No Polar Simple (H—H)',
    geometryName: 'Lineal Diatómica',
    deltaEN: 0.0,
    scientificExplanation:
      'Cada átomo de hidrógeno dispone de 1 electrón en su orbital 1s. Al unirse mediante un enlace covalente simple (comparten 1 par electrónico = 2 electrones), ambos completan su capa de valencia adquiriendo la configuración electrónica estable del helio (Regla del Dueto).',
    octetRuleExplanation: 'Cumple la Regla del Dueto: 2 electrones en la capa 1s para cada átomo de H.',
    pedagogicalHint: 'Une los dos átomos de hidrógeno con un único enlace covalente simple.',
  },
  {
    id: 'cl2',
    formula: 'Cl₂',
    traditionalName: 'Cloro Gas',
    category: 'covalente_simple',
    categoryLabel: 'Elemento Diatómico Halógeno',
    difficulty: 'Principiante (Nivel 1)',
    levelNumber: 1,
    atoms: [
      { symbol: 'Cl', valenceElectrons: 7, octetTarget: 8, electronegativity: 3.16, role: 'terminal', initialX: 180, initialY: 170 },
      { symbol: 'Cl', valenceElectrons: 7, octetTarget: 8, electronegativity: 3.16, role: 'terminal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'simple' }],
    expectedBondClassification: 'covalente_no_polar',
    expectedClassificationName: 'Enlace Covalente No Polar Simple (Cl—Cl)',
    geometryName: 'Lineal Diatómica',
    deltaEN: 0.0,
    scientificExplanation:
      'Cada átomo de cloro tiene 7 electrones de valencia en la capa M (3s² 3p⁵). Comparten un solo par de electrones formando un enlace simple sigma (Cl—Cl). Así, ambos átomos completan los 8 electrones del octeto (configuración del argón).',
    octetRuleExplanation: 'Ambos cloros alcanzan 8 electrones (1 par enlazante compartido + 3 pares solitarios cada uno).',
    pedagogicalHint: 'Los dos halógenos comparten exactamente 1 par de electrones para completar el octeto.',
  },
  {
    id: 'hcl',
    formula: 'HCl',
    traditionalName: 'Ácido Clorhídrico',
    category: 'acido',
    categoryLabel: 'Hidrácido',
    difficulty: 'Principiante (Nivel 1)',
    levelNumber: 1,
    atoms: [
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 180, initialY: 170 },
      { symbol: 'Cl', valenceElectrons: 7, octetTarget: 8, electronegativity: 3.16, role: 'terminal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'simple' }],
    expectedBondClassification: 'covalente_polar',
    expectedClassificationName: 'Enlace Covalente Polar Simple (H—Cl)',
    geometryName: 'Lineal Polar',
    deltaEN: 0.96,
    scientificExplanation:
      'El cloro es mucho más electronegativo (3.16) que el hidrógeno (2.20). Se forma un enlace covalente simple donde el par electrónico se desplaza hacia el cloro, creando densidades de carga parcial δ+ en H y δ- en Cl.',
    octetRuleExplanation: 'El hidrógeno alcanza 2 electrones (dueto) y el cloro alcanza 8 electrones (octeto).',
    pedagogicalHint: 'Conecta el H y el Cl con un enlace simple.',
  },
  {
    id: 'h2o',
    formula: 'H₂O',
    traditionalName: 'Agua',
    category: 'covalente_simple',
    categoryLabel: 'Hidruro No Metálico / Óxido de Hidrógeno',
    difficulty: 'Principiante (Nivel 1)',
    levelNumber: 1,
    atoms: [
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'central', initialX: 280, initialY: 120 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 160, initialY: 230 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 400, initialY: 230 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'simple' },
      { from: 0, to: 2, type: 'simple' },
    ],
    expectedBondClassification: 'covalente_polar',
    expectedClassificationName: 'Dos Enlaces Covalentes Polares Simples (H—O—H)',
    geometryName: 'Angular (104.5°)',
    deltaEN: 1.24,
    scientificExplanation:
      'El átomo central de oxígeno posee 6 electrones de valencia y forma 2 enlaces covalentes simples, uno con cada hidrógeno. Los dos pares solitarios del oxígeno ejercen repulsión angular cerrando el ángulo a 104.5°.',
    octetRuleExplanation: 'El oxígeno central alcanza 8 electrones (4 de enlace + 4 no enlazantes). Cada hidrógeno alcanza 2 electrones.',
    pedagogicalHint: 'El oxígeno es el átomo central: conecta cada hidrógeno al oxígeno con enlaces simples.',
  },

  // --- NIVEL 2: ENLACES IÓNICOS Y SALES ---
  {
    id: 'nacl',
    formula: 'NaCl',
    traditionalName: 'Cloruro Sódico',
    category: 'sal_ionica',
    categoryLabel: 'Sal Neutra Binaria',
    difficulty: 'Intermedio (Nivel 2)',
    levelNumber: 2,
    atoms: [
      { symbol: 'Na', valenceElectrons: 1, octetTarget: 8, electronegativity: 0.93, role: 'metal', initialX: 180, initialY: 170 },
      { symbol: 'Cl', valenceElectrons: 7, octetTarget: 8, electronegativity: 3.16, role: 'no-metal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'ionic' }],
    expectedBondClassification: 'ionico',
    expectedClassificationName: 'Enlace Iónico con Transferencia Electrónica (Na⁺ Cl⁻)',
    geometryName: 'Red Cúbica Iónica FCC',
    deltaEN: 2.23,
    scientificExplanation:
      'La diferencia de electronegatividad es colosal (ΔEN = 2.23 ≥ 1.7). El sodio metálico no comparte electrones: cede completamente su electrón 3s¹ al cloro, transformándose en el catión Na⁺ y el anión Cl⁻ que se atraen electrostáticamente.',
    octetRuleExplanation: 'Na pierde su capa externa quedando con [Ne] (8 e⁻ internos). Cl capta 1 e⁻ completando [Ar] (8 e⁻).',
    pedagogicalHint: '¡Es una sal! Utiliza la herramienta de Transferencia Iónica para enlazar el metal Na con el no metal Cl.',
  },
  {
    id: 'cao',
    formula: 'CaO',
    traditionalName: 'Óxido Cálcico',
    category: 'oxido_anhidrido',
    categoryLabel: 'Óxido Básico',
    difficulty: 'Intermedio (Nivel 2)',
    levelNumber: 2,
    atoms: [
      { symbol: 'Ca', valenceElectrons: 2, octetTarget: 8, electronegativity: 1.00, role: 'metal', initialX: 180, initialY: 170 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'no-metal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'ionic' }],
    expectedBondClassification: 'ionico',
    expectedClassificationName: 'Enlace Iónico Divalente (Ca²⁺ O²⁻)',
    geometryName: 'Red Cristalina Refractaria',
    deltaEN: 2.44,
    scientificExplanation:
      'En el Óxido Cálcico ("cal viva"), el calcio cede sus 2 electrones 4s al oxígeno. Se generan el catión Ca²⁺ y el anión O²⁻ con fuerza coulombiana cuadrúple debido a las dobles cargas.',
    octetRuleExplanation: 'Ca²⁺ adquiere configuración de argón [Ar]. O²⁻ adquiere configuración de neón [Ne].',
    pedagogicalHint: 'Selecciona Transferencia Iónica para unir el calcio metálico con el oxígeno.',
  },
  {
    id: 'cacl2',
    formula: 'CaCl₂',
    traditionalName: 'Cloruro Cálcico',
    category: 'sal_ionica',
    categoryLabel: 'Sal Neutra Binaria',
    difficulty: 'Intermedio (Nivel 2)',
    levelNumber: 2,
    atoms: [
      { symbol: 'Ca', valenceElectrons: 2, octetTarget: 8, electronegativity: 1.00, role: 'metal', initialX: 280, initialY: 170 },
      { symbol: 'Cl', valenceElectrons: 7, octetTarget: 8, electronegativity: 3.16, role: 'no-metal', initialX: 140, initialY: 170 },
      { symbol: 'Cl', valenceElectrons: 7, octetTarget: 8, electronegativity: 3.16, role: 'no-metal', initialX: 420, initialY: 170 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'ionic' },
      { from: 0, to: 2, type: 'ionic' },
    ],
    expectedBondClassification: 'ionico',
    expectedClassificationName: 'Enlace Iónico 1:2 (Ca²⁺ + 2 Cl⁻)',
    geometryName: 'Red Cristalina Rutilo Deformado',
    deltaEN: 2.16,
    scientificExplanation:
      'El calcio central cede 1 electrón a cada uno de los dos átomos de cloro mediante transferencia iónica, formando Ca²⁺ y 2 aniones Cl⁻.',
    octetRuleExplanation: 'Todos los iones alcanzan el octeto estable del gas noble argón [Ar].',
    pedagogicalHint: 'Conecta cada Cl al catión Ca central mediante enlace iónico.',
  },
  {
    id: 'fes',
    formula: 'FeS',
    traditionalName: 'Sulfuro Ferroso',
    category: 'sal_ionica',
    categoryLabel: 'Sal Neutra',
    difficulty: 'Intermedio (Nivel 2)',
    levelNumber: 2,
    atoms: [
      { symbol: 'Fe', valenceElectrons: 2, octetTarget: 8, electronegativity: 1.83, role: 'metal', initialX: 180, initialY: 170 },
      { symbol: 'S', valenceElectrons: 6, octetTarget: 8, electronegativity: 2.58, role: 'no-metal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'ionic' }],
    expectedBondClassification: 'ionico',
    expectedClassificationName: 'Enlace Iónico / Polar Fuerte (Fe²⁺ S²⁻)',
    geometryName: 'Red Cristalina Tipo Niquelina',
    deltaEN: 0.75,
    scientificExplanation:
      'En el Sulfuro Ferroso, el hierro actúa con su menor valencia (+2) frente al azufre (-2), cediendo electrones para formar una red cristalina densa y opaca.',
    octetRuleExplanation: 'El sulfuro S²⁻ completa su octeto de valencia con 8 electrones.',
    pedagogicalHint: 'Conecta el hierro y el azufre con enlace iónico.',
  },

  // --- NIVEL 3: ENLACES MÚLTIPLES (DOBLES Y TRIPLES) ---
  {
    id: 'o2',
    formula: 'O₂',
    traditionalName: 'Oxígeno Molecular',
    category: 'covalente_multiple',
    categoryLabel: 'Diatómico con Enlace Doble',
    difficulty: 'Avanzado (Nivel 3)',
    levelNumber: 3,
    atoms: [
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 180, initialY: 170 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'double' }],
    expectedBondClassification: 'covalente_no_polar',
    expectedClassificationName: 'Enlace Covalente Doble No Polar (O=O)',
    geometryName: 'Lineal Diatómica',
    deltaEN: 0.0,
    scientificExplanation:
      'Cada átomo de oxígeno necesita 2 electrones para completar el octeto. Al compartir dos pares de electrones (4 electrones en total: 1 enlace σ frontal + 1 enlace π lateral), ambos completan simultáneamente sus 8 electrones.',
    octetRuleExplanation: 'Ambos oxígenos completan 8 electrones (4 enlazantes + 4 solitarios).',
    pedagogicalHint: 'Usa la herramienta de Enlace Doble (=) para conectar ambos átomos de oxígeno.',
  },
  {
    id: 'co2',
    formula: 'CO₂',
    traditionalName: 'Anhídrido Carbónico',
    category: 'oxido_anhidrido',
    categoryLabel: 'Anhídrido (Óxido Ácido)',
    difficulty: 'Avanzado (Nivel 3)',
    levelNumber: 3,
    atoms: [
      { symbol: 'C', valenceElectrons: 4, octetTarget: 8, electronegativity: 2.55, role: 'central', initialX: 280, initialY: 170 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 140, initialY: 170 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 420, initialY: 170 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' },
    ],
    expectedBondClassification: 'covalente_polar',
    expectedClassificationName: 'Dos Enlaces Covalentes Dobles (O=C=O)',
    geometryName: 'Lineal (180°)',
    deltaEN: 0.89,
    scientificExplanation:
      'En el Anhídrido Carbónico (CO₂), el carbono central tiene 4 electrones y necesita 4. Forma un enlace doble con cada oxígeno. Los 3 átomos completan el octeto en una geometría colineal simétrica a 180°.',
    octetRuleExplanation: 'Carbono central: 8 e⁻ (cuatro pares compartidos en 2 dobles enlaces). Cada oxígeno: 8 e⁻.',
    pedagogicalHint: 'El carbono va en el centro: conecta cada oxígeno al carbono con un enlace DOBLE (=).',
  },
  {
    id: 'n2',
    formula: 'N₂',
    traditionalName: 'Nitrógeno Molecular',
    category: 'covalente_multiple',
    categoryLabel: 'Diatómico con Enlace Triple',
    difficulty: 'Avanzado (Nivel 3)',
    levelNumber: 3,
    atoms: [
      { symbol: 'N', valenceElectrons: 5, octetTarget: 8, electronegativity: 3.04, role: 'terminal', initialX: 180, initialY: 170 },
      { symbol: 'N', valenceElectrons: 5, octetTarget: 8, electronegativity: 3.04, role: 'terminal', initialX: 380, initialY: 170 },
    ],
    targetBonds: [{ from: 0, to: 1, type: 'triple' }],
    expectedBondClassification: 'covalente_no_polar',
    expectedClassificationName: 'Enlace Covalente Triple No Polar (N≡N)',
    geometryName: 'Lineal Diatómica',
    deltaEN: 0.0,
    scientificExplanation:
      'Cada nitrógeno tiene 5 electrones de valencia y necesita 3. Comparten 3 pares de electrones (6 electrones en total: 1 enlace σ + 2 enlaces π), originando un enlace triple extraordinariamente fuerte (945 kJ/mol).',
    octetRuleExplanation: 'Ambos átomos de nitrógeno completan el octeto (6 e⁻ compartidos + 2 e⁻ del par solitario).',
    pedagogicalHint: 'Selecciona la herramienta de Enlace Triple (≡) para conectar los dos nitrógenos.',
  },

  // --- NIVEL 4: COMPUESTOS COMPLEJOS Y DATIVOS ---
  {
    id: 'ch4',
    formula: 'CH₄',
    traditionalName: 'Metano',
    category: 'covalente_simple',
    categoryLabel: 'Hidrocarburo Alcano',
    difficulty: 'Maestro Alquimista (Nivel 4)',
    levelNumber: 4,
    atoms: [
      { symbol: 'C', valenceElectrons: 4, octetTarget: 8, electronegativity: 2.55, role: 'central', initialX: 280, initialY: 170 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 280, initialY: 60 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 400, initialY: 170 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 280, initialY: 280 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 160, initialY: 170 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'simple' },
      { from: 0, to: 2, type: 'simple' },
      { from: 0, to: 3, type: 'simple' },
      { from: 0, to: 4, type: 'simple' },
    ],
    expectedBondClassification: 'covalente_no_polar',
    expectedClassificationName: 'Cuatro Enlaces Covalentes Simples Simétricos (sp³)',
    geometryName: 'Tetraédrica Regular (109.5°)',
    deltaEN: 0.35,
    scientificExplanation:
      'El carbono central hibrida sus orbitales en 4 orbitales sp³ equivalentes, enlazando los 4 átomos de hidrógeno mediante 4 enlaces simples.',
    octetRuleExplanation: 'Carbono central alcanza 8 e⁻ (4 pares enlazantes). Cada H alcanza 2 e⁻.',
    pedagogicalHint: 'Conecta cada uno de los 4 hidrógenos al carbono central con un enlace simple.',
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    traditionalName: 'Amoníaco',
    category: 'covalente_simple',
    categoryLabel: 'Hidruro No Metálico / Base de Lewis',
    difficulty: 'Maestro Alquimista (Nivel 4)',
    levelNumber: 4,
    atoms: [
      { symbol: 'N', valenceElectrons: 5, octetTarget: 8, electronegativity: 3.04, role: 'central', initialX: 280, initialY: 120 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 170, initialY: 230 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 280, initialY: 250 },
      { symbol: 'H', valenceElectrons: 1, octetTarget: 2, electronegativity: 2.20, role: 'terminal', initialX: 390, initialY: 230 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'simple' },
      { from: 0, to: 2, type: 'simple' },
      { from: 0, to: 3, type: 'simple' },
    ],
    expectedBondClassification: 'covalente_polar',
    expectedClassificationName: 'Tres Enlaces Covalentes Polares Simples con Par Solitario',
    geometryName: 'Piramidal Trigonal (107°)',
    deltaEN: 0.84,
    scientificExplanation:
      'El nitrógeno central forma 3 enlaces simples con los hidrógenos y conserva un par de electrones solitario en el ápice de la pirámide.',
    octetRuleExplanation: 'Nitrógeno: 8 e⁻ (6 compartidos en 3 enlaces + 2 del par libre). Hidrógenos: 2 e⁻ cada uno.',
    pedagogicalHint: 'Conecta los 3 hidrógenos al nitrógeno central con enlaces simples.',
  },
  {
    id: 'so3',
    formula: 'SO₃',
    traditionalName: 'Anhídrido Sulfúrico',
    category: 'dativo',
    categoryLabel: 'Anhídrido con Enlaces Dativos / Resonantes',
    difficulty: 'Maestro Alquimista (Nivel 4)',
    levelNumber: 4,
    atoms: [
      { symbol: 'S', valenceElectrons: 6, octetTarget: 8, electronegativity: 2.58, role: 'central', initialX: 280, initialY: 170 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 280, initialY: 60 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 160, initialY: 250 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 400, initialY: 250 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'coordinate' },
      { from: 0, to: 3, type: 'coordinate' },
    ],
    expectedBondClassification: 'coordinado',
    expectedClassificationName: 'Un Enlace Doble y Dos Enlaces Coordinados Dativos (S=O y 2 S→O)',
    geometryName: 'Trigonal Plana (120°)',
    deltaEN: 0.86,
    scientificExplanation:
      'En la formulación tradicional del Anhídrido Sulfúrico, el azufre central completa su octeto mediante un enlace doble con un oxígeno, y comparte sus dos pares de electrones libres restantes hacia los otros dos oxígenos mediante enlaces covalentes coordinados o dativos (S→O).',
    octetRuleExplanation: 'Todos los átomos cumplen rigurosamente el octeto de 8 electrones en la estructura de Lewis tradicional.',
    pedagogicalHint: 'El azufre va en el centro: forma un enlace doble con el oxígeno superior y dos enlaces dativos (coordinados) con los oxígenos inferiores.',
  },
  {
    id: 'so2',
    formula: 'SO₂',
    traditionalName: 'Anhídrido Sulfuroso',
    category: 'dativo',
    categoryLabel: 'Anhídrido con Enlace Dativo',
    difficulty: 'Maestro Alquimista (Nivel 4)',
    levelNumber: 4,
    atoms: [
      { symbol: 'S', valenceElectrons: 6, octetTarget: 8, electronegativity: 2.58, role: 'central', initialX: 280, initialY: 130 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 160, initialY: 230 },
      { symbol: 'O', valenceElectrons: 6, octetTarget: 8, electronegativity: 3.44, role: 'terminal', initialX: 400, initialY: 230 },
    ],
    targetBonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'coordinate' },
    ],
    expectedBondClassification: 'coordinado',
    expectedClassificationName: 'Un Enlace Doble y Un Enlace Coordinado Dativo (O=S→O)',
    geometryName: 'Angular (119°)',
    deltaEN: 0.86,
    scientificExplanation:
      'En el Anhídrido Sulfuroso, el azufre central forma un enlace doble con un oxígeno (alcanzando 8 electrones) y cede un par no enlazante en enlace coordinado dativo al segundo oxígeno.',
    octetRuleExplanation: 'Tanto el azufre como los dos oxígenos alcanzan 8 electrones estables.',
    pedagogicalHint: 'Conecta un oxígeno al azufre con enlace doble (=) y el otro con enlace coordinado (➔).',
  },
];

export interface ExamEvaluationCriteria {
  title: string;
  passed: boolean;
  message: string;
}

export interface ExamGradeResult {
  score: number; // 0 to 100
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  isPerfect: boolean;
  isPassed: boolean;
  criteria: ExamEvaluationCriteria[];
  feedbackSummary: string;
  traditionalName: string;
  awardedXp: number;
}

/**
 * Computes electronic state of each atom given current user bonds
 */
export function calculateAtomValenceStates(
  atoms: ExamAtomDefinition[],
  bonds: UserBond[]
) {
  return atoms.map((atom, idx) => {
    let sharedElectrons = 0;
    let gainedIonic = 0;
    let lostIonic = 0;
    let donatedDative = 0;
    let acceptedDative = 0;

    bonds.forEach((b) => {
      const isFrom = b.fromAtomIndex === idx;
      const isTo = b.toAtomIndex === idx;
      if (!isFrom && !isTo) return;

      if (b.type === 'simple') {
        sharedElectrons += 2;
      } else if (b.type === 'double') {
        sharedElectrons += 4;
      } else if (b.type === 'triple') {
        sharedElectrons += 6;
      } else if (b.type === 'coordinate') {
        if (isFrom) {
          // Donor provides both electrons, but counts them as shared
          donatedDative += 2;
          sharedElectrons += 2;
        } else {
          // Acceptor receives the pair to complete octet
          acceptedDative += 2;
          sharedElectrons += 2;
        }
      } else if (b.type === 'ionic') {
        if (atom.role === 'metal' && isFrom) {
          lostIonic += 1;
        } else if (atom.role === 'metal' && isTo) {
          lostIonic += 1;
        } else {
          gainedIonic += 1;
        }
      }
    });

    // Total effective valence electrons seen by the nucleus
    let currentElectrons = atom.valenceElectrons;
    if (bonds.some((b) => b.type === 'ionic' && (b.fromAtomIndex === idx || b.toAtomIndex === idx))) {
      // Ionic model
      currentElectrons = currentElectrons + gainedIonic - lostIonic;
      if (currentElectrons < 0) currentElectrons = 0;
    } else {
      // Covalent model: non-bonding + shared
      const bondPairs = sharedElectrons / 2;
      const nonBonding = Math.max(0, atom.valenceElectrons - bondPairs - donatedDative);
      currentElectrons = nonBonding + sharedElectrons;
    }

    const fulfillsOctet = currentElectrons === atom.octetTarget;
    const isHypervalent = atom.octetTarget === 8 && currentElectrons > 8;

    return {
      atomIndex: idx,
      symbol: atom.symbol,
      currentElectrons,
      targetElectrons: atom.octetTarget,
      fulfillsOctet,
      isHypervalent,
    };
  });
}

/**
 * Rigorously grades a student's bonding exam attempt.
 */
export function evaluateBondExamAttempt(
  compound: BondExamCompound,
  userBonds: UserBond[]
): ExamGradeResult {
  const criteria: ExamEvaluationCriteria[] = [];
  let points = 0;

  // 1. Connection presence & count
  const expectedBondCount = compound.targetBonds.length;
  const userBondCount = userBonds.length;

  if (userBondCount === 0) {
    return {
      score: 0,
      letterGrade: 'F',
      isPerfect: false,
      isPassed: false,
      criteria: [
        {
          title: 'Conexión de Átomos',
          passed: false,
          message: 'No has establecido ningún enlace. Elige una herramienta y conecta los átomos.',
        },
      ],
      feedbackSummary: 'El tablero está vacío. Debes trazar los enlaces químicos correspondientes.',
      traditionalName: compound.traditionalName,
      awardedXp: 0,
    };
  }

  // Check matching topology: does every expected connection pair exist?
  let correctPairsCount = 0;
  let correctTypesCount = 0;

  compound.targetBonds.forEach((expected) => {
    const found = userBonds.find(
      (u) =>
        (u.fromAtomIndex === expected.from && u.toAtomIndex === expected.to) ||
        (u.fromAtomIndex === expected.to && u.toAtomIndex === expected.from)
    );

    if (found) {
      correctPairsCount++;
      // Check type
      if (found.type === expected.type) {
        correctTypesCount++;
      } else if (
        expected.type === 'coordinate' &&
        (found.type === 'simple' || found.type === 'double')
      ) {
        // partial credit for recognizing covalent link
      }
    }
  });

  const topologyPassed = correctPairsCount === expectedBondCount && userBondCount === expectedBondCount;
  if (topologyPassed) {
    points += 35;
    criteria.push({
      title: 'Topología y Conectividad Atómica',
      passed: true,
      message: '¡Excelente! Los átomos correctos están enlazados según la estructura real de la molécula.',
    });
  } else {
    points += Math.round((correctPairsCount / expectedBondCount) * 20);
    criteria.push({
      title: 'Topología y Conectividad Atómica',
      passed: false,
      message: `Conexiones incompletas o erróneas (${correctPairsCount}/${expectedBondCount} pares correctos). Verifica el átomo central.`,
    });
  }

  // 2. Bond multiplicity / order
  const typesPassed = correctTypesCount === expectedBondCount;
  if (typesPassed) {
    points += 35;
    criteria.push({
      title: 'Multiplicidad y Naturaleza de los Enlaces',
      passed: true,
      message: `¡Perfecto! Has utilizado el tipo exacto de enlace (${compound.expectedClassificationName}).`,
    });
  } else {
    points += Math.round((correctTypesCount / expectedBondCount) * 20);
    criteria.push({
      title: 'Multiplicidad y Naturaleza de los Enlaces',
      passed: false,
      message: 'Algunos enlaces tienen un orden incorrecto (revisa si debían ser enlaces dobles, triples o iónicos).',
    });
  }

  // 3. Octet Rule fulfillment
  const atomStates = calculateAtomValenceStates(compound.atoms, userBonds);
  const octetSatisfiedCount = atomStates.filter((a) => a.fulfillsOctet).length;
  const octetPassed = octetSatisfiedCount === compound.atoms.length;

  if (octetPassed) {
    points += 30;
    criteria.push({
      title: 'Regla del Octeto y Estabilidad Cuántica',
      passed: true,
      message: '¡Todos los átomos han completado su octeto (o dueto) de gas noble sin hipervalencia!',
    });
  } else {
    points += Math.round((octetSatisfiedCount / compound.atoms.length) * 15);
    const failedSymbols = atomStates.filter((a) => !a.fulfillsOctet).map((a) => `${a.symbol} (${a.currentElectrons}/${a.targetElectrons} e⁻)`).join(', ');
    criteria.push({
      title: 'Regla del Octeto y Estabilidad Cuántica',
      passed: false,
      message: `Átomos inestables: ${failedSymbols}. Deben completar su capa externa de valencia.`,
    });
  }

  // Cap score between 0 and 100
  const score = Math.min(100, Math.max(0, points));

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'F';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 80) letterGrade = 'A';
  else if (score >= 65) letterGrade = 'B';
  else if (score >= 45) letterGrade = 'C';

  const isPerfect = score === 100;
  const isPassed = score >= 80;

  let feedbackSummary = '';
  let awardedXp = 0;

  if (isPerfect) {
    feedbackSummary = `¡EXAMEN PERFECTO! Has dominado la estructura de ${compound.traditionalName} (${compound.formula}). ${compound.scientificExplanation}`;
    awardedXp = compound.levelNumber * 100;
  } else if (isPassed) {
    feedbackSummary = `¡Aprobado con Notable! Estructura casi exacta para ${compound.traditionalName}. Revisa los detalles de orden de enlace o pares solitarios.`;
    awardedXp = compound.levelNumber * 60;
  } else {
    feedbackSummary = `Estructura incorrecta para ${compound.traditionalName} (${compound.formula}). Pista pedagógica: ${compound.pedagogicalHint}`;
    awardedXp = 10;
  }

  return {
    score,
    letterGrade,
    isPerfect,
    isPassed,
    criteria,
    feedbackSummary,
    traditionalName: compound.traditionalName,
    awardedXp,
  };
}
