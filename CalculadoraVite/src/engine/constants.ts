export interface ScientificConstant {
  code: string; // '01'..'40'
  symbol: string;
  nameEs: string;
  value: number;
  unit: string;
}

export interface UnitConversion {
  code: string; // '01'..'40'
  label: string; // e.g. 'in▸cm'
  nameEs: string;
  factor?: number;
  custom?: (val: number) => number;
}

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  { code: '01', symbol: 'mp', nameEs: 'Masa del protón', value: 1.672621777e-27, unit: 'kg' },
  { code: '02', symbol: 'mn', nameEs: 'Masa del neutrón', value: 1.674927351e-27, unit: 'kg' },
  { code: '03', symbol: 'me', nameEs: 'Masa del electrón', value: 9.10938291e-31, unit: 'kg' },
  { code: '04', symbol: 'mμ', nameEs: 'Masa del muón', value: 1.883531475e-28, unit: 'kg' },
  { code: '05', symbol: 'a0', nameEs: 'Radio de Bohr', value: 5.2917721092e-11, unit: 'm' },
  { code: '06', symbol: 'h', nameEs: 'Constante de Planck', value: 6.62606957e-34, unit: 'J·s' },
  { code: '07', symbol: 'μN', nameEs: 'Magnetón nuclear', value: 5.05078353e-27, unit: 'J/T' },
  { code: '08', symbol: 'μB', nameEs: 'Magnetón de Bohr', value: 9.27400968e-24, unit: 'J/T' },
  { code: '09', symbol: 'ħ', nameEs: 'Constante reducida de Planck', value: 1.054571726e-34, unit: 'J·s' },
  { code: '10', symbol: 'α', nameEs: 'Constante de estructura fina', value: 7.2973525698e-3, unit: '' },
  { code: '11', symbol: 're', nameEs: 'Radio clásico del electrón', value: 2.8179403267e-15, unit: 'm' },
  { code: '12', symbol: 'λc', nameEs: 'Longitud de onda Compton', value: 2.4263102389e-12, unit: 'm' },
  { code: '13', symbol: 'γp', nameEs: 'Razón giromagnética del protón', value: 2.675222005e8, unit: 's⁻¹T⁻¹' },
  { code: '14', symbol: 'λcp', nameEs: 'Long. Compton del protón', value: 1.32140985623e-15, unit: 'm' },
  { code: '15', symbol: 'λcn', nameEs: 'Long. Compton del neutrón', value: 1.3195909068e-15, unit: 'm' },
  { code: '16', symbol: 'R∞', nameEs: 'Constante de Rydberg', value: 1.0973731568539e7, unit: 'm⁻¹' },
  { code: '17', symbol: 'u', nameEs: 'Unidad de masa atómica', value: 1.660538921e-27, unit: 'kg' },
  { code: '18', symbol: 'μp', nameEs: 'Momento magnético del protón', value: 1.410606743e-26, unit: 'J/T' },
  { code: '19', symbol: 'μe', nameEs: 'Momento magnético del electrón', value: -9.28476430e-24, unit: 'J/T' },
  { code: '20', symbol: 'μn', nameEs: 'Momento magnético del neutrón', value: -9.6623647e-27, unit: 'J/T' },
  { code: '21', symbol: 'μμ', nameEs: 'Momento magnético del muón', value: -4.49044807e-26, unit: 'J/T' },
  { code: '22', symbol: 'F', nameEs: 'Constante de Faraday', value: 9.64853365e4, unit: 'C/mol' },
  { code: '23', symbol: 'e', nameEs: 'Carga elemental', value: 1.602176565e-19, unit: 'C' },
  { code: '24', symbol: 'NA', nameEs: 'Constante de Avogadro', value: 6.02214129e23, unit: 'mol⁻¹' },
  { code: '25', symbol: 'k', nameEs: 'Constante de Boltzmann', value: 1.3806488e-23, unit: 'J/K' },
  { code: '26', symbol: 'Vm', nameEs: 'Volumen molar gas ideal', value: 2.2413968e-2, unit: 'm³/mol' },
  { code: '27', symbol: 'R', nameEs: 'Constante molar de los gases', value: 8.3144621, unit: 'J/(mol·K)' },
  { code: '28', symbol: 'c0', nameEs: 'Velocidad de la luz en vacío', value: 299792458, unit: 'm/s' },
  { code: '29', symbol: 'C1', nameEs: 'Primera constante de radiación', value: 3.74177153e-16, unit: 'W·m²' },
  { code: '30', symbol: 'C2', nameEs: 'Segunda constante de radiación', value: 1.4387770e-2, unit: 'm·K' },
  { code: '31', symbol: 'σ', nameEs: 'Constante Stefan-Boltzmann', value: 5.670373e-8, unit: 'W/(m²·K⁴)' },
  { code: '32', symbol: 'ε0', nameEs: 'Permitividad eléctrica vacío', value: 8.854187817e-12, unit: 'F/m' },
  { code: '33', symbol: 'μ0', nameEs: 'Permeabilidad magnética vacío', value: 1.2566370614e-6, unit: 'N/A²' },
  { code: '34', symbol: 'Φ0', nameEs: 'Cuanto de flujo magnético', value: 2.067833758e-15, unit: 'Wb' },
  { code: '35', symbol: 'g', nameEs: 'Aceleración estándar gravedad', value: 9.80665, unit: 'm/s²' },
  { code: '36', symbol: 'G0', nameEs: 'Cuanto de conductancia', value: 7.7480917346e-5, unit: 'S' },
  { code: '37', symbol: 'Z0', nameEs: 'Impedancia característica vacío', value: 376.730313461, unit: 'Ω' },
  { code: '38', symbol: 't', nameEs: 'Temperatura Celsius (0 °C)', value: 273.15, unit: 'K' },
  { code: '39', symbol: 'G', nameEs: 'Constante de gravitación', value: 6.67384e-11, unit: 'm³/(kg·s²)' },
  { code: '40', symbol: 'atm', nameEs: 'Atmósfera estándar', value: 101325, unit: 'Pa' },
];

export const UNIT_CONVERSIONS: UnitConversion[] = [
  { code: '01', label: 'in▸cm', nameEs: 'Pulgadas a centímetros', factor: 2.54 },
  { code: '02', label: 'cm▸in', nameEs: 'Centímetros a pulgadas', factor: 1 / 2.54 },
  { code: '03', label: 'ft▸m', nameEs: 'Pies a metros', factor: 0.3048 },
  { code: '04', label: 'm▸ft', nameEs: 'Metros a pies', factor: 1 / 0.3048 },
  { code: '05', label: 'yd▸m', nameEs: 'Yardas a metros', factor: 0.9144 },
  { code: '06', label: 'm▸yd', nameEs: 'Metros a yardas', factor: 1 / 0.9144 },
  { code: '07', label: 'mile▸km', nameEs: 'Millas a kilómetros', factor: 1.609344 },
  { code: '08', label: 'km▸mile', nameEs: 'Kilómetros a millas', factor: 1 / 1.609344 },
  { code: '09', label: 'n mile▸m', nameEs: 'Millas náuticas a metros', factor: 1852 },
  { code: '10', label: 'm▸n mile', nameEs: 'Metros a millas náuticas', factor: 1 / 1852 },
  { code: '11', label: 'acre▸m²', nameEs: 'Acres a metros cuadrados', factor: 4046.8564224 },
  { code: '12', label: 'm²▸acre', nameEs: 'Metros cuadrados a acres', factor: 1 / 4046.8564224 },
  { code: '13', label: 'gal(US)▸L', nameEs: 'Galones (US) a litros', factor: 3.785411784 },
  { code: '14', label: 'L▸gal(US)', nameEs: 'Litros a galones (US)', factor: 1 / 3.785411784 },
  { code: '15', label: 'gal(UK)▸L', nameEs: 'Galones (UK) a litros', factor: 4.54609 },
  { code: '16', label: 'L▸gal(UK)', nameEs: 'Litros a galones (UK)', factor: 1 / 4.54609 },
  { code: '17', label: 'pc▸km', nameEs: 'Pársecs a kilómetros', factor: 3.08567758149e13 },
  { code: '18', label: 'km▸pc', nameEs: 'Kilómetros a pársecs', factor: 1 / 3.08567758149e13 },
  { code: '19', label: 'km/h▸m/s', nameEs: 'km/h a m/s', factor: 1 / 3.6 },
  { code: '20', label: 'm/s▸km/h', nameEs: 'm/s a km/h', factor: 3.6 },
  { code: '21', label: 'oz▸g', nameEs: 'Onzas a gramos', factor: 28.349523125 },
  { code: '22', label: 'g▸oz', nameEs: 'Gramos a onzas', factor: 1 / 28.349523125 },
  { code: '23', label: 'lb▸kg', nameEs: 'Libras a kilogramos', factor: 0.45359237 },
  { code: '24', label: 'kg▸lb', nameEs: 'Kilogramos a libras', factor: 1 / 0.45359237 },
  { code: '25', label: 'atm▸Pa', nameEs: 'Atmósferas a Pascales', factor: 101325 },
  { code: '26', label: 'Pa▸atm', nameEs: 'Pascales a atmósferas', factor: 1 / 101325 },
  { code: '27', label: 'mmHg▸Pa', nameEs: 'mmHg a Pascales', factor: 133.322387415 },
  { code: '28', label: 'Pa▸mmHg', nameEs: 'Pascales a mmHg', factor: 1 / 133.322387415 },
  { code: '29', label: 'hp▸kW', nameEs: 'Caballos de fuerza a kW', factor: 0.745699871582 },
  { code: '30', label: 'kW▸hp', nameEs: 'kW a caballos de fuerza', factor: 1 / 0.745699871582 },
  { code: '31', label: 'kgf/cm²▸Pa', nameEs: 'kgf/cm² a Pascales', factor: 98066.5 },
  { code: '32', label: 'Pa▸kgf/cm²', nameEs: 'Pascales a kgf/cm²', factor: 1 / 98066.5 },
  { code: '33', label: 'kgf·m▸J', nameEs: 'kgf·m a Julios', factor: 9.80665 },
  { code: '34', label: 'J▸kgf·m', nameEs: 'Julios a kgf·m', factor: 1 / 9.80665 },
  { code: '35', label: 'lbf/in²▸kPa', nameEs: 'psi (lbf/in²) a kPa', factor: 6.89475729317 },
  { code: '36', label: 'kPa▸lbf/in²', nameEs: 'kPa a psi (lbf/in²)', factor: 1 / 6.89475729317 },
  { code: '37', label: '°F▸°C', nameEs: 'Fahrenheit a Celsius', custom: (f) => ((f - 32) * 5) / 9 },
  { code: '38', label: '°C▸°F', nameEs: 'Celsius a Fahrenheit', custom: (c) => (c * 9) / 5 + 32 },
  { code: '39', label: 'J▸cal', nameEs: 'Julios a calorías', factor: 1 / 4.1858 },
  { code: '40', label: 'cal▸J', nameEs: 'Calorías a Julios', factor: 4.1858 },
];
