import { RQ } from './constants';

// there is ~750 mmHg per bar
const mmHgToBar = mmHg => mmHg / 750.06156130264;

// constant vapor pressure of 37°C (47 mmHg)
const WATER_VAPOR_PRESSURE = mmHgToBar(47)
const C02_PRESSURE = mmHgToBar(40);

console.log('WATER_VAPOR_PRESSURE', WATER_VAPOR_PRESSURE)
console.log('C02_PRESSURE', C02_PRESSURE);

// the alveolar ventilation equation
// calculates the partial pressure of the inert gas
const alveolarGasPressure = (ambiantPressure, gasRatio) =>
  (ambiantPressure - (WATER_VAPOR_PRESSURE + ((1 - RQ) * C02_PRESSURE))) * gasRatio;

export default alveolarGasPressure;
