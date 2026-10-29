import { SUBSTANCES, Substance } from './chemistryData';
import { ELEMENTS_118, ChemicalElement } from './elements118';

export type TemperatureLevel = 'ambient' | 'moderate' | 'extreme'; // 25°C, 450°C (Bunsen), 900°C+ (Crisol/Calcinación)
export type PressureLevel = 'standard' | 'high'; // 1 atm vs 200 atm
export type CatalystType = 'none' | 'Pt' | 'Fe' | 'MnO2' | 'Ni' | 'V2O5';
export type ElectricalState = 'none' | 'spark' | 'electrolysis';
export type ConcentrationLevel = 'normal' | 'concentrated';

export interface ExperimentalConditions {
  temperature: TemperatureLevel;
  pressure: PressureLevel;
  catalyst: CatalystType;
  electricity: ElectricalState;
  concentration: ConcentrationLevel;
}

export interface AdvancedReaction {
  id: string;
  reactants: string[]; // Element symbols or Substance IDs
  products: string[];
  balancedEquation: string;
  reactionType:
    | 'Síntesis (Combinación)'
    | 'Descomposición'
    | 'Desplazamiento Simple'
    | 'Doble Desplazamiento (Neutralización)'
    | 'Doble Desplazamiento (Precipitación)'
    | 'Combustión'
    | 'Redox'
    | 'Complejación / Disolución Ácida'
    | 'Deflagración / Reacción Explosiva';
  // Required conditions
  minTemperature?: TemperatureLevel;
  requiredPressure?: PressureLevel;
  requiredCatalyst?: CatalystType;
  requiredElectricity?: ElectricalState;
  requiredConcentration?: ConcentrationLevel;

  conditionDescription: string;
  explanation: string;
  discoveryXp: number;
  visualEffect: 'steam' | 'spark' | 'fire' | 'crystals' | 'fizz' | 'bubbles' | 'plasma' | 'explosion';
}

export const ADVANCED_REACTIONS: AdvancedReaction[] = [
  // 1. Agua: 2H2 + O2 -> 2H2O
  {
    id: 'rx_water_synthesis',
    reactants: ['H', 'O'],
    products: ['H2O'],
    balancedEquation: '2H₂ (g) + O₂ (g) ➔ 2H₂O (l)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'Requiere calor (Mechero Bunsen) o chispa de activación.',
    explanation: 'Reacción fuertemente exotérmica donde los enlaces H-H y O=O se rompen y se reorganizan en enlaces polares O-H liberando abundante calor y vapor.',
    discoveryXp: 100,
    visualEffect: 'steam',
  },
  // 2. Sal Común: 2Na + Cl2 -> 2NaCl
  {
    id: 'rx_nacl_synthesis',
    reactants: ['Na', 'Cl'],
    products: ['NaCl'],
    balancedEquation: '2Na (s) + Cl₂ (g) ➔ 2NaCl (s)',
    reactionType: 'Síntesis (Combinación)',
    conditionDescription: 'Espontánea a temperatura ambiente con viva llama amarilla.',
    explanation: 'Transferencia electrónica redox completa: el sodio cede su único electrón 3s al cloro, formando la red iónica cúbica centrada en las caras de NaCl.',
    discoveryXp: 120,
    visualEffect: 'crystals',
  },
  // 3. Herrumbre: 4Fe + 3O2 -> 2Fe2O3
  {
    id: 'rx_rust_synthesis',
    reactants: ['Fe', 'O'],
    products: ['Fe2O3'],
    balancedEquation: '4Fe (s) + 3O₂ (g) ➔ 2Fe₂O₃ (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'Acelerada por calor de llama.',
    explanation: 'Oxidación del hierro metálico a óxido de hierro (III) rojizo. El hierro pasa a estado de oxidación +3 cediendo electrones al oxígeno.',
    discoveryXp: 110,
    visualEffect: 'spark',
  },
  // 4. Combustión de Carbono: C + O2 -> CO2
  {
    id: 'rx_co2_synthesis',
    reactants: ['C', 'O'],
    products: ['CO2'],
    balancedEquation: 'C (s) + O₂ (g) ➔ CO₂ (g)',
    reactionType: 'Combustión',
    minTemperature: 'moderate',
    conditionDescription: 'Requiere calor para iniciar la ignición.',
    explanation: 'Combustión completa del carbono formando dióxido de carbono gaseoso con geometría lineal y enlaces dobles O=C=O.',
    discoveryXp: 100,
    visualEffect: 'fire',
  },
  // 5. Monóxido de Carbono (combustión incompleta a alta temp)
  {
    id: 'rx_co_synthesis',
    reactants: ['C', 'CO2'],
    products: ['CO'],
    balancedEquation: 'C (s) + CO₂ (g) ➔ 2CO (g)',
    reactionType: 'Redox',
    minTemperature: 'extreme',
    conditionDescription: 'Requiere calcinación extrema a más de 900 °C (Reacción de Boudouard).',
    explanation: 'Equilibrio de Boudouard endotérmico: el carbono reduce al CO₂ a monóxido de carbono tóxico a temperaturas de alto horno.',
    discoveryXp: 150,
    visualEffect: 'fire',
  },
  // 6. Ácido Clorhídrico: H2 + Cl2 -> 2HCl
  {
    id: 'rx_hcl_synthesis',
    reactants: ['H', 'Cl'],
    products: ['HCl'],
    balancedEquation: 'H₂ (g) + Cl₂ (g) ➔ 2HCl (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredElectricity: 'spark',
    conditionDescription: 'Requiere chispa o luz ultravioleta para iniciar la disociación radicalaria.',
    explanation: 'Reacción en cadena iniciada por la rotura homolítica fotolítica del enlace Cl-Cl, seguida por la propagación de radicales Cl• con H₂.',
    discoveryXp: 130,
    visualEffect: 'spark',
  },
  // 7. Haber-Bosch: N2 + 3H2 -> 2NH3 (Requiere Alta Presión + Catalizador + Calor)
  {
    id: 'rx_haber_bosch',
    reactants: ['N', 'H'],
    products: ['NH3'],
    balancedEquation: 'N₂ (g) + 3H₂ (g) ⇄ 2NH₃ (g)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    requiredPressure: 'high',
    requiredCatalyst: 'Fe',
    conditionDescription: 'Proceso Haber-Bosch: requiere calor (450 °C), alta presión (200 atm) y catalizador de hierro (Fe).',
    explanation: 'El triple enlace N≡N (945 kJ/mol) es inerte; el catalizador de Fe activado absorbe y disocia el nitrógeno molecular bajo 200 atm de presión.',
    discoveryXp: 220,
    visualEffect: 'spark',
  },
  // 8. Síntesis de Metano: C + 2H2 -> CH4
  {
    id: 'rx_methane_synthesis',
    reactants: ['C', 'H'],
    products: ['CH4'],
    balancedEquation: 'C (s) + 2H₂ (g) ➔ CH₄ (g)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    requiredCatalyst: 'Ni',
    conditionDescription: 'Requiere calor del mechero y catalizador de Níquel (Ni).',
    explanation: 'Metanación catalítica: el carbono sólido se hidrogena en superficie de níquel formando el hidrocarburo tetraédrico más simple.',
    discoveryXp: 170,
    visualEffect: 'spark',
  },
  // 9. Dióxido de Azufre: S + O2 -> SO2
  {
    id: 'rx_so2_synthesis',
    reactants: ['S', 'O'],
    products: ['SO2'],
    balancedEquation: 'S (s) + O₂ (g) ➔ SO₂ (g)',
    reactionType: 'Combustión',
    minTemperature: 'moderate',
    conditionDescription: 'El azufre funde y arde con llama azul al aplicar calor.',
    explanation: 'Combustión directa del azufre sólido originando dióxido de azufre gas irritante.',
    discoveryXp: 110,
    visualEffect: 'fire',
  },
  // 10. Trióxido de Azufre: 2SO2 + O2 -> 2SO3 (Método de contacto con V2O5)
  {
    id: 'rx_so3_contact',
    reactants: ['SO2', 'O2'],
    products: ['SO3'],
    balancedEquation: '2SO₂ (g) + O₂ (g) ➔ 2SO₃ (g)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    requiredCatalyst: 'V2O5',
    conditionDescription: 'Método de contacto industrial: requiere calor y catalizador de Pentóxido de Vanadio (V₂O₅).',
    explanation: 'El V₂O₅ facilita la transferencia de oxígeno oxidando catalíticamente el SO₂ al anhídrido sulfúrico SO₃.',
    discoveryXp: 190,
    visualEffect: 'steam',
  },
  // 11. Ácido Sulfúrico: SO3 + H2O -> H2SO4
  {
    id: 'rx_h2so4_hydration',
    reactants: ['SO3', 'H2O'],
    products: ['H2SO4'],
    balancedEquation: 'SO₃ (g) + H₂O (l) ➔ H₂SO₄ (ac)',
    reactionType: 'Síntesis (Combinación)',
    conditionDescription: 'Reacción fuertemente exotérmica y espontánea con agua.',
    explanation: 'Hidratación directa del trióxido de azufre para producir el oxoácido fuerte diprótico ácido sulfúrico.',
    discoveryXp: 180,
    visualEffect: 'steam',
  },
  // 12. Sodio + Agua -> NaOH + H2
  {
    id: 'rx_na_water',
    reactants: ['Na', 'H2O'],
    products: ['NaOH', 'H'],
    balancedEquation: '2Na (s) + 2H₂O (l) ➔ 2NaOH (ac) + H₂ (g)↑',
    reactionType: 'Desplazamiento Simple',
    conditionDescription: 'Reacción extraordinariamente vigorosa y exotérmica a temperatura ambiente.',
    explanation: 'El sodio metálico reduce los protones del agua desprendiendo hidrógeno gas e hidroxilo alcalino.',
    discoveryXp: 140,
    visualEffect: 'fizz',
  },
  // 13. Neutralización: HCl + NaOH -> NaCl + H2O
  {
    id: 'rx_neutralization',
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H2O'],
    balancedEquation: 'HCl (ac) + NaOH (ac) ➔ NaCl (ac) + H₂O (l)',
    reactionType: 'Doble Desplazamiento (Neutralización)',
    conditionDescription: 'Espontánea e instantánea a temperatura ambiente.',
    explanation: 'Neutralización estequiométrica: H⁺ + OH⁻ ➔ H₂O liberando calor de neutralización y sal neutra disuelta.',
    discoveryXp: 150,
    visualEffect: 'bubbles',
  },
  // 14. Cal Viva: 2Ca + O2 -> 2CaO
  {
    id: 'rx_cao_synthesis',
    reactants: ['Ca', 'O'],
    products: ['CaO'],
    balancedEquation: '2Ca (s) + O₂ (g) ➔ 2CaO (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'El calcio arde con viva llama rojo-naranja bajo calor.',
    explanation: 'Oxidación directa del calcio alcalinotérreo formando el óxido básico cal viva CaO.',
    discoveryXp: 130,
    visualEffect: 'fire',
  },
  // 15. Apagado de Cal: CaO + H2O -> Ca(OH)2
  {
    id: 'rx_caoh2_slaking',
    reactants: ['CaO', 'H2O'],
    products: ['CaOH2'],
    balancedEquation: 'CaO (s) + H₂O (l) ➔ Ca(OH)₂ (s)',
    reactionType: 'Síntesis (Combinación)',
    conditionDescription: 'Reacción de hidratación espontánea muy exotérmica ("apagado de cal").',
    explanation: 'El óxido de calcio reacciona con agua hirviendo localmente para formar hidróxido de calcio.',
    discoveryXp: 140,
    visualEffect: 'steam',
  },
  // 16. Detección de CO2: Ca(OH)2 + CO2 -> CaCO3 + H2O
  {
    id: 'rx_caco3_limewater',
    reactants: ['CaOH2', 'CO2'],
    products: ['CaCO3', 'H2O'],
    balancedEquation: 'Ca(OH)₂ (ac) + CO₂ (g) ➔ CaCO₃ (s)↓ + H₂O (l)',
    reactionType: 'Doble Desplazamiento (Precipitación)',
    conditionDescription: 'Ocurre a temperatura ambiente enturbiando la disolución lechosa.',
    explanation: 'Precipitación de cristales insolubles de carbonato de calcio blanco lechoso (prueba química del agua de cal).',
    discoveryXp: 160,
    visualEffect: 'crystals',
  },
  // 17. Calcinación de Caliza: CaCO3 -> CaO + CO2
  {
    id: 'rx_caco3_calcination',
    reactants: ['CaCO3'],
    products: ['CaO', 'CO2'],
    balancedEquation: 'CaCO₃ (s) ➔ CaO (s) + CO₂ (g)↑',
    reactionType: 'Descomposición',
    minTemperature: 'extreme',
    conditionDescription: 'Requiere calcinación intensa en crisol a más de 850 °C.',
    explanation: 'Descomposición térmica endotérmica: el anión carbonato CO₃²⁻ se descompone en óxido y gas CO₂.',
    discoveryXp: 150,
    visualEffect: 'fire',
  },
  // 18. Electrólisis del Agua: 2H2O -> 2H2 + O2
  {
    id: 'rx_water_electrolysis',
    reactants: ['H2O'],
    products: ['H', 'O'],
    balancedEquation: '2H₂O (l) ➔ 2H₂ (g)↑ + O₂ (g)↑',
    reactionType: 'Descomposición',
    requiredElectricity: 'electrolysis',
    conditionDescription: 'Requiere electrólisis por corriente eléctrica continua.',
    explanation: 'Descomposición electroquímica: reducción de protones a gas hidrógeno en el cátodo y oxidación de oxígeno en el ánodo.',
    discoveryXp: 180,
    visualEffect: 'bubbles',
  },
  // 19. Descomposición de Agua Oxigenada: 2H2O2 -> 2H2O + O2 (con MnO2)
  {
    id: 'rx_h2o2_decomp',
    reactants: ['H2O2'],
    products: ['H2O', 'O'],
    balancedEquation: '2H₂O₂ (ac) ➔ 2H₂O (l) + O₂ (g)↑',
    reactionType: 'Descomposición',
    requiredCatalyst: 'MnO2',
    conditionDescription: 'Requiere catalizador de Dióxido de Manganeso (MnO₂).',
    explanation: 'El MnO₂ cataliza instantáneamente la dismutación redox del enlace peróxido O-O desprendiendo una columna de vapor y oxígeno.',
    discoveryXp: 140,
    visualEffect: 'fizz',
  },
  // 20. Desplazamiento Redox de Cobre: Fe + CuSO4 -> FeSO4 + Cu
  {
    id: 'rx_fe_cuso4',
    reactants: ['Fe', 'CuSO4'],
    products: ['Cu'],
    balancedEquation: 'Fe (s) + CuSO₄ (ac) ➔ FeSO₄ (ac) + Cu (s)↓',
    reactionType: 'Desplazamiento Simple',
    conditionDescription: 'Espontánea a temperatura ambiente sumergiendo hierro en solución azul.',
    explanation: 'El hierro es más electropositivo que el cobre según la serie galvánica; el Fe se oxida a Fe²⁺ y precipita cobre metálico rojizo.',
    discoveryXp: 160,
    visualEffect: 'crystals',
  },
  // 21. Sulfuro de Hierro: Fe + S -> FeS
  {
    id: 'rx_fes',
    reactants: ['Fe', 'S'],
    products: ['FeS'],
    balancedEquation: 'Fe (s) + S (s) ➔ FeS (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'Requiere calor inicial del Mechero Bunsen.',
    explanation: 'Reacción en estado sólido fuertemente exotérmica que produce sulfuro de hierro (II) gris-negro.',
    discoveryXp: 120,
    visualEffect: 'spark',
  },
  // 22. Cloruro de Cobre: Cu + Cl2 -> CuCl2
  {
    id: 'rx_cucl2',
    reactants: ['Cu', 'Cl'],
    products: ['CuCl2'],
    balancedEquation: 'Cu (s) + Cl₂ (g) ➔ CuCl₂ (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'Calentamiento de cobre en gas cloro ardiendo con llama verde.',
    explanation: 'Oxidación del cobre metálico por gas halógeno a cloruro de cobre (II) esmeralda.',
    discoveryXp: 140,
    visualEffect: 'spark',
  },
  // 23. Óxido de Cobre: 2Cu + O2 -> 2CuO
  {
    id: 'rx_cuo',
    reactants: ['Cu', 'O'],
    products: ['CuO'],
    balancedEquation: '2Cu (s) + O₂ (g) ➔ 2CuO (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'Calentamiento al rojo vivo.',
    explanation: 'Oxidación térmica del cobre lustroso al óxido negro de cobre (II).',
    discoveryXp: 120,
    visualEffect: 'spark',
  },
  // 24. Ozono: 3O2 -> 2O3 (Descarga eléctrica)
  {
    id: 'rx_ozone',
    reactants: ['O'],
    products: ['O3'],
    balancedEquation: '3O₂ (g) ➔ 2O₃ (g)',
    reactionType: 'Síntesis (Combinación)',
    requiredElectricity: 'spark',
    conditionDescription: 'Requiere arco eléctrico o descarga de chispa de alta tensión.',
    explanation: 'Descarga eléctrica rompe enlaces de O₂ en átomos reactivos que colisionan formando el alótropo resonante ozono.',
    discoveryXp: 160,
    visualEffect: 'spark',
  },
  // 25. Xenón con Flúor: Xe + 2F2 -> XeF4 (Gas noble forzado bajo calor y presión)
  {
    id: 'rx_xenon_fluoride',
    reactants: ['Xe', 'F'],
    products: ['XeF4'],
    balancedEquation: 'Xe (g) + 2F₂ (g) ➔ XeF₄ (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    requiredPressure: 'high',
    conditionDescription: 'Gas noble reactivo: requiere calor (400 °C) y alta presión con gas flúor concentrado.',
    explanation: 'Hito histórico de Neil Bartlett (1962): el xenón pierde electrones ante el flúor (el elemento más electronegativo) expandiendo su octeto a geometría plana cuadrada.',
    discoveryXp: 250,
    visualEffect: 'crystals',
  },
  // 26. Disolución de Oro en Agua Regia: Au + HNO3 + 4HCl -> HAuCl4
  {
    id: 'rx_aqua_regia_gold',
    reactants: ['Au', 'HNO3', 'HCl'],
    products: ['HAuCl4'],
    balancedEquation: 'Au (s) + 3HNO₃ (ac) + 4HCl (ac) ➔ HAuCl₄ (ac) + 3NO₂ (g)↑ + 3H₂O (l)',
    reactionType: 'Complejación / Disolución Ácida',
    requiredConcentration: 'concentrated',
    conditionDescription: 'Agua Regia: requiere ácidos concentrados (ácido nítrico + ácido clorhídrico 1:3).',
    explanation: 'Acción sinérgica de la alquimia histórica: el ácido nítrico oxida una traza de Au a Au³⁺, y los iones cloruro desplazan el equilibrio formando el complejo soluble tetracloroaurato [AuCl₄]⁻.',
    discoveryXp: 300,
    visualEffect: 'fizz',
  },
  // 27. Magnesio con Oxígeno: 2Mg + O2 -> 2MgO
  {
    id: 'rx_magnesium_combustion',
    reactants: ['Mg', 'O'],
    products: ['MgO'],
    balancedEquation: '2Mg (s) + O₂ (g) ➔ 2MgO (s)',
    reactionType: 'Combustión',
    minTemperature: 'moderate',
    conditionDescription: 'Requiere calor para iniciar la ignición.',
    explanation: 'Combustión deslumbrante del magnesio emitiendo una luz blanca incandescente cegadora con alta emisión UV y polvo blanco de MgO.',
    discoveryXp: 130,
    visualEffect: 'fire',
  },
  // 28. Zinc con Ácido Clorhídrico: Zn + 2HCl -> ZnCl2 + H2
  {
    id: 'rx_zinc_acid',
    reactants: ['Zn', 'HCl'],
    products: ['ZnCl2', 'H'],
    balancedEquation: 'Zn (s) + 2HCl (ac) ➔ ZnCl₂ (ac) + H₂ (g)↑',
    reactionType: 'Desplazamiento Simple',
    conditionDescription: 'Ocurre a temperatura ambiente con efervescencia activa.',
    explanation: 'El zinc desplaza los protones del ácido clorhídrico oxidándose a Zn²⁺ y desprendiendo gas hidrógeno.',
    discoveryXp: 130,
    visualEffect: 'fizz',
  },
  // 29. Aluminio con Yodo: 2Al + 3I2 -> 2AlI3
  {
    id: 'rx_aluminum_iodine',
    reactants: ['Al', 'I'],
    products: ['AlI3'],
    balancedEquation: '2Al (s) + 3I₂ (s) ➔ 2AlI₃ (s)',
    reactionType: 'Síntesis (Combinación)',
    minTemperature: 'moderate',
    conditionDescription: 'Se activa con calor o unas gotas de agua catalizadora liberando densos vapores violetas de yodo.',
    explanation: 'Reacción fuertemente exotérmica donde el calor generado sublima el exceso de yodo en nubes violetas espectaculares.',
    discoveryXp: 160,
    visualEffect: 'steam',
  },
  // 30. Termita: 2Al + Fe2O3 -> Al2O3 + 2Fe
  {
    id: 'rx_thermite',
    reactants: ['Al', 'Fe2O3'],
    products: ['Al2O3', 'Fe'],
    balancedEquation: '2Al (s) + Fe₂O₃ (s) ➔ Al₂O₃ (s) + 2Fe (l)',
    reactionType: 'Deflagración / Reacción Explosiva',
    minTemperature: 'extreme',
    conditionDescription: 'Reacción de Termita: requiere calor extremo para iniciar (más de 1000 °C).',
    explanation:
      'Aluminotermia colosal: la enorme afinidad del aluminio por el oxígeno reduce el óxido de hierro desprendiendo hierro fundido a más de 2500 °C con lluvia cegadora de chispas.',
    discoveryXp: 280,
    visualEffect: 'explosion',
  },
  // 31. Oxihidrógeno Explosivo (Gas Detonante / Knallgas)
  {
    id: 'rx_knallgas_explosion',
    reactants: ['H', 'O'],
    products: ['H2O'],
    balancedEquation: '2H₂ (g) + O₂ (g) ➔ 2H₂O (g) + 484 kJ (¡Onda de Choque!)',
    reactionType: 'Deflagración / Reacción Explosiva',
    requiredElectricity: 'spark',
    conditionDescription: '¡DETONACIÓN!: Una chispa eléctrica inicia la combustión supersónica de oxihidrógeno.',
    explanation:
      'Reacción en cadena colosalmente violenta y exotérmica. Los radicales H• y O• se propagan a velocidad supersónica (2800 m/s), liberando una tremenda onda de sobrepresión acústica y vapor de agua a más de 3000 °C.',
    discoveryXp: 260,
    visualEffect: 'explosion',
  },
  // 32. Potasio con Agua (Explosión Alcalina Violenta)
  {
    id: 'rx_potassium_water_explosion',
    reactants: ['K', 'H2O'],
    products: ['KOH', 'H2'],
    balancedEquation: '2K (s) + 2H₂O (l) ➔ 2KOH (ac) + H₂ (g)↑ + ¡ESTALLIDO VIOLETA!',
    reactionType: 'Deflagración / Reacción Explosiva',
    conditionDescription: '¡REACCIÓN ESPONTÁNEA EXPLOSIVA!: El potasio metálico se inflama al instante sobre el agua.',
    explanation:
      'Inestabilidad coulombiana extrema: el potasio cede electrones tan velozmente a los protones del agua que la carga positiva acumulada en el metal produce una explosión por repulsión electrostática de Coulomb e inflama el hidrógeno desprendido con llama violeta brillante.',
    discoveryXp: 280,
    visualEffect: 'explosion',
  },
  // 33. Pólvora Negra Deflagrante (Salitre + Azufre + Carbón)
  {
    id: 'rx_black_powder',
    reactants: ['K', 'S', 'C'],
    products: ['K2S', 'CO2'],
    balancedEquation: '2KNO₃ (s) + S (s) + 3C (s) ➔ K₂S (s) + N₂ (g)↑ + 3CO₂ (g)↑ + ¡DEFLAGRACIÓN!',
    reactionType: 'Deflagración / Reacción Explosiva',
    minTemperature: 'moderate',
    conditionDescription: 'Requiere calor del mechero o mecha para la deflagración rápida de pólvora.',
    explanation:
      'La formulación clásica alquímica (salitre oxidante, azufre reductor y carbón combustible). Al alcanzar la temperatura crítica genera una colosal expansión de volumen (más de 3000 veces el volumen sólido en forma de gases N₂ y CO₂ hirvientes).',
    discoveryXp: 300,
    visualEffect: 'explosion',
  },
  // 34. Síntesis de Nitrato de Potasio (Salitre)
  {
    id: 'rx_kno3_synthesis',
    reactants: ['KOH', 'HNO3'],
    products: ['KNO3', 'H2O'],
    balancedEquation: 'KOH (ac) + HNO₃ (ac) ➔ KNO₃ (ac) + H₂O (l)',
    reactionType: 'Doble Desplazamiento (Neutralización)',
    conditionDescription: 'Neutralización exotérmica espontánea que cristaliza salitre puro al enfriar.',
    explanation:
      'El catión potasio K⁺ y el anión nitrato NO₃⁻ forman una sal cristalina neutra muy pura con potente poder oxidante.',
    discoveryXp: 220,
    visualEffect: 'crystals',
  },
  // 35. Detonación de Metano en atmósfera rica en Oxígeno
  {
    id: 'rx_methane_shockwave',
    reactants: ['CH4', 'O'],
    products: ['CO2', 'H2O'],
    balancedEquation: 'CH₄ (g) + 2O₂ (g) ➔ CO₂ (g) + 2H₂O (g) + ¡DETONACIÓN!',
    reactionType: 'Deflagración / Reacción Explosiva',
    requiredElectricity: 'spark',
    conditionDescription: 'Mezcla estequiométrica de metano y oxígeno activada por arco eléctrico.',
    explanation:
      'La rotura simultánea de cuatro enlaces C-H y dos dobles enlaces O=O produce una onda de detonación térmica de 891 kJ/mol en cámaras confinadas.',
    discoveryXp: 240,
    visualEffect: 'explosion',
  },
];

/**
 * Standardize an item symbol/id into normalized key
 */
function normalizeSymbol(id: string): string {
  // If it's H2 or H -> 'H', O2 -> 'O', Cl2 -> 'Cl', N2 -> 'N', S8 -> 'S'
  const mapping: Record<string, string> = {
    H2: 'H',
    O2: 'O',
    Cl2: 'Cl',
    N2: 'N',
    S8: 'S',
  };
  return mapping[id] || id;
}

/**
 * Advanced Reaction Evaluator respecting all 118 elements and experimental parameters
 */
export function evaluateAdvancedReaction(
  reactantIds: string[],
  conditions: ExperimentalConditions
): {
  success: boolean;
  reaction?: AdvancedReaction;
  reason?: string;
  chemicalTip?: string;
} {
  if (reactantIds.length === 0) {
    return {
      success: false,
      reason: 'El recipiente está vacío. Selecciona sustancias de la bandeja o de la Tabla Periódica.',
    };
  }

  // Check Synthetic Superheavy Elements (Z=104-118) and transient radioactive elements
  const superheavyOrTransient = reactantIds.find((id) => {
    const el = ELEMENTS_118.find((e) => e.symbol === id);
    return (
      el &&
      (el.category === 'superpesado-sintetico' ||
        ['Fr', 'At'].includes(el.symbol))
    );
  });

  if (superheavyOrTransient) {
    const el = ELEMENTS_118.find((e) => e.symbol === superheavyOrTransient)!;
    return {
      success: false,
      reason: `Limitación de la Física Nuclear: El ${el.name} (Z=${el.number}) es un elemento superpesado sintético con una vida media extraordinariamente corta (milisegundos a segundos) sintetizado átomo por átomo en aceleradores de iones pesados.`,
      chemicalTip: `Los núcleos de elementos superpesados (Z ≥ 104) sufren desintegración alfa o fisión espontánea casi inmediata, imposibilitando reacciones químicas macroscópicas en fase líquida o sólida en cristalería de laboratorio común.`,
    };
  }

  // Check Inert Noble Gases (He, Ne, Ar, Kr)
  const inertGases = ['He', 'Ne', 'Ar', 'Kr'];
  const hasInertGas = reactantIds.find((id) => inertGases.includes(id));
  if (hasInertGas) {
    const el = ELEMENTS_118.find((e) => e.symbol === hasInertGas);
    return {
      success: false,
      reason: `El ${el?.name || hasInertGas} (${hasInertGas}) es un gas noble con capa de valencia completa (configuración electrónica ${el?.electronConfig}).`,
      chemicalTip: 'Regla del Octeto / Dueto: No gana, cede ni comparte electrones con estos reactivos bajo ninguna condición termodinámica estándar.',
    };
  }

  // Check Xenon exception
  if (reactantIds.includes('Xe') && !reactantIds.includes('F')) {
    return {
      success: false,
      reason: 'El Xenón (Xe) solo reacciona con elementos de extrema electronegatividad como el Flúor (F) o el Oxígeno (O) bajo condiciones severas.',
      chemicalTip: 'Prueba combinar Xenón (Xe) con Flúor (F) a calor moderado y alta presión (200 atm).',
    };
  }

  // Check Gold without Aqua Regia
  if (reactantIds.includes('Au')) {
    const hasAquaRegia =
      (reactantIds.includes('HNO3') && reactantIds.includes('HCl')) ||
      (reactantIds.includes('N') && reactantIds.includes('Cl'));
    if (!hasAquaRegia) {
      return {
        success: false,
        reason: 'El Oro (Au) es un metal noble sumamente resistente a la corrosión con potencial de reducción estándar muy positivo (+1.50 V).',
        chemicalTip: 'El oro no reacciona con ácidos simples o agua. Los alquimistas descubrieron que solo se disuelve en "Agua Regia" (mezcla de ácido nítrico y clorhídrico concentrados).',
      };
    }
  }

  // Normalize inputs
  const normalizedInputs = reactantIds.map(normalizeSymbol).sort();

  // Find candidate reaction
  const candidate = ADVANCED_REACTIONS.find((rx) => {
    const rxReactants = rx.reactants.map(normalizeSymbol).sort();
    if (rxReactants.length !== normalizedInputs.length) return false;
    return rxReactants.every((r, idx) => r === normalizedInputs[idx]);
  });

  if (!candidate) {
    if (reactantIds.length === 1) {
      const singleEl = ELEMENTS_118.find((e) => e.symbol === reactantIds[0]);
      return {
        success: false,
        reason: `${singleEl?.name || reactantIds[0]} es una sustancia elemental pura y estable por sí misma en este recipiente.`,
        chemicalTip: 'Combínalo con otro elemento reactivo (como oxígeno, halógenos, ácidos o metales electropositivos).',
      };
    }

    const names = reactantIds
      .map((id) => {
        const el = ELEMENTS_118.find((e) => e.symbol === id);
        return el ? `${el.name} (${el.symbol})` : SUBSTANCES[id]?.name || id;
      })
      .join(' y ');

    return {
      success: false,
      reason: `No se produce una reacción química espontánea entre ${names} bajo las leyes de afinidad electrónica y termodinámica actuales.`,
      chemicalTip: 'Verifica los estados de oxidación y las diferencias de electronegatividad (ΔEN). Recuerda que dos metales suelen formar aleaciones físicas pero no compuestos estequiométricos simples.',
    };
  }

  // Verify Temperature Condition
  if (candidate.minTemperature) {
    const tempRank: Record<TemperatureLevel, number> = {
      ambient: 1,
      moderate: 2,
      extreme: 3,
    };
    if (tempRank[conditions.temperature] < tempRank[candidate.minTemperature]) {
      const reqName =
        candidate.minTemperature === 'moderate'
          ? 'Calor moderado (Mechero Bunsen a ~450 °C)'
          : 'Calor extremo / Calcinación en crisol (> 850 °C)';
      return {
        success: false,
        reason: `Los reactivos están presentes (${candidate.balancedEquation.split('➔')[0].trim()}), pero la temperatura actual no aporta la energía de activación (Ea) necesaria.`,
        chemicalTip: `Ajusta el control de temperatura del laboratorio a: ${reqName}.`,
      };
    }
  }

  // Verify Pressure Condition
  if (candidate.requiredPressure && conditions.pressure !== candidate.requiredPressure) {
    return {
      success: false,
      reason: `Esta reacción (${candidate.balancedEquation.split('➔')[0].trim()}) está regida por el principio de Le Chatelier y requiere Alta Presión (200 atm).`,
      chemicalTip: 'Activa la cámara de alta presión (200 atm) en el panel de condiciones experimentales.',
    };
  }

  // Verify Catalyst Condition
  if (candidate.requiredCatalyst && conditions.catalyst !== candidate.requiredCatalyst) {
    const catNames: Record<CatalystType, string> = {
      none: 'Ninguno',
      Pt: 'Platino (Pt)',
      Fe: 'Hierro activado (Fe)',
      MnO2: 'Dióxido de Manganeso (MnO₂)',
      Ni: 'Níquel (Ni)',
      V2O5: 'Pentóxido de Vanadio (V₂O₅)',
    };
    return {
      success: false,
      reason: `La barrera energética para romper estos enlaces moleculares es demasiado elevada sin el catalizador específico adecuado.`,
      chemicalTip: `Selecciona el catalizador requerido: ${catNames[candidate.requiredCatalyst]}.`,
    };
  }

  // Verify Electricity Condition
  if (candidate.requiredElectricity && conditions.electricity !== candidate.requiredElectricity) {
    const elecNames: Record<ElectricalState, string> = {
      none: 'Desactivada',
      spark: 'Chispa eléctrica / Descarga de electrodo',
      electrolysis: 'Electrólisis continua',
    };
    return {
      success: false,
      reason: `Los reactivos requieren energía electroquímica externa para inducir la rotura de enlaces o la transferencia de electrones.`,
      chemicalTip: `Activa la fuente de electricidad en modo: ${elecNames[candidate.requiredElectricity]}.`,
    };
  }

  // Verify Concentration Condition
  if (candidate.requiredConcentration && conditions.concentration !== candidate.requiredConcentration) {
    return {
      success: false,
      reason: `Esta disolución no es lo suficientemente reactiva en disolución diluida ordinaria.`,
      chemicalTip: 'Cambia la concentración de reactivos a "Concentrado" en el panel experimental.',
    };
  }

  // All scientific conditions satisfied!
  return {
    success: true,
    reaction: candidate,
  };
}
