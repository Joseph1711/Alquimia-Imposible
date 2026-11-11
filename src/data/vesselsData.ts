import { VesselType } from '../context/GameContext';

export interface VesselProperty {
  id: VesselType;
  name: string;
  traditionalName: string;
  capacity: string;
  material: string;
  maxTemperature: number;
  gasTight: boolean;
  recommendedUse: string;
  bestFor: string[];
  thermalShockResistance: 'baja' | 'moderada' | 'alta' | 'extrema';
  specialAbility: string;
  iconName: string;
}

export const VESSELS_DATA: Record<VesselType, VesselProperty> = {
  erlenmeyer: {
    id: 'erlenmeyer',
    name: 'Matraz Erlenmeyer',
    traditionalName: 'Frasco Cónico de Valoración',
    capacity: '250 mL',
    material: 'Vidrio de Borosilicato 3.3',
    maxTemperature: 500,
    gasTight: true,
    recommendedUse: 'Titulaciones, síntesis con efervescencia y reflujo de vapores condensables.',
    bestFor: ['Neutralizaciones', 'Síntesis de ácidos', 'Reacciones efervescentes'],
    thermalShockResistance: 'alta',
    specialAbility: 'Cuello cónico antiesparcimiento con opción de tapón hermético para retener gases.',
    iconName: 'FlaskConical',
  },
  beaker: {
    id: 'beaker',
    name: 'Vaso de Precipitados',
    traditionalName: 'Vaso Griffin de Precipitación',
    capacity: '500 mL',
    material: 'Borosilicato con serigrafía graduada',
    maxTemperature: 450,
    gasTight: false,
    recommendedUse: 'Disoluciones rápidas, mezclas líquidas copiosas y agitación con varilla o imán.',
    bestFor: ['Disolución de sales', 'Precipitados coloidales', 'Agitación magnética'],
    thermalShockResistance: 'moderada',
    specialAbility: 'Agitador magnético integrado con vórtice que acelera la cinética de mezcla homogénea.',
    iconName: 'CupSoda',
  },
  testtube: {
    id: 'testtube',
    name: 'Tubo de Ensayo',
    traditionalName: 'Tubo de Reacción Cualitativa',
    capacity: '25 mL',
    material: 'Vidrio neutro analítico delgado',
    maxTemperature: 400,
    gasTight: false,
    recommendedUse: 'Microanálisis cualitativo rápido, ensayos a la llama y observación de turbidez.',
    bestFor: ['Ensayos a la llama', 'Detección cualitativa', 'Microvolúmenes'],
    thermalShockResistance: 'moderada',
    specialAbility: 'Detección ultrasensible con microvolúmenes y prueba directa de llama o astilla incandescente.',
    iconName: 'TestTube',
  },
  crucible: {
    id: 'crucible',
    name: 'Crisol de Porcelana',
    traditionalName: 'Crisol Refractario de Calcinación',
    capacity: '50 mL',
    material: 'Cerámica de Porcelana Refractaria Pura',
    maxTemperature: 1200,
    gasTight: false,
    recommendedUse: 'Calcinación extrema (>900 °C), fundición de metales, pirólisis y descomposición de carbonatos.',
    bestFor: ['Calcinación de caliza (CaCO₃)', 'Síntesis de óxidos refractarios', 'Fundición térmica'],
    thermalShockResistance: 'extrema',
    specialAbility: 'Incandescencia cerámica al rojo vivo: soporta calor extremo (>950 °C) sin sufrir choque térmico.',
    iconName: 'Flame',
  },
  distillation: {
    id: 'distillation',
    name: 'Balón de Destilación',
    traditionalName: 'Alambique con Refrigerante Liebig',
    capacity: '250 mL',
    material: 'Borosilicato con camisa concéntrica de agua',
    maxTemperature: 480,
    gasTight: true,
    recommendedUse: 'Separación y purificación de líquidos volátiles por puntos de ebullición.',
    bestFor: ['Destilación fraccionada', 'Purificación de ácidos', 'Separación de disolventes'],
    thermalShockResistance: 'alta',
    specialAbility: 'Condensación fraccionada por contracorriente de agua fría, aislando líquidos puros.',
    iconName: 'Pipette',
  },
  mortar: {
    id: 'mortar',
    name: 'Mortero y Pistilo',
    traditionalName: 'Mortero de Ágata y Molienda',
    capacity: '100 g sólidos',
    material: 'Ágata Natural Compacta',
    maxTemperature: 150,
    gasTight: false,
    recommendedUse: 'Micronización, trituración íntima y pulverización de mezclas en estado sólido.',
    bestFor: ['Pólvora negra (KNO₃ + S + C)', 'Termita pirotécnica (Al + Fe₂O₃)', 'Molienda de sales'],
    thermalShockResistance: 'baja',
    specialAbility: 'Aumento radical del área superficial de contacto interfacial para reactivos sólidos.',
    iconName: 'Disc',
  },
  watchglass: {
    id: 'watchglass',
    name: 'Vidrio de Reloj',
    traditionalName: 'Cristalizador Superficial de Laboratorio',
    capacity: '35 mL',
    material: 'Vidrio prensado cóncavo de sílice',
    maxTemperature: 280,
    gasTight: false,
    recommendedUse: 'Evaporación superficial suave, secado de precipitados y cristalización lenta de sales.',
    bestFor: ['Cristalización de cloruro sódico', 'Sublimación de yodo', 'Secado de sales'],
    thermalShockResistance: 'moderada',
    specialAbility: 'Evaporación laminar superficial abierta que promueve el crecimiento de cristales ordenados.',
    iconName: 'CircleDot',
  },
};
