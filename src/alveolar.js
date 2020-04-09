const WATER_VAPOR_PRESSURE = 0.0627;
const C02_PRESSURE = 0.0534;
const RQ = 1.0;

// Calculate the alveolar pressure, given the inert gas ratio
const ventilation = (ambiantPressure, inertGasRatio) =>
  (ambiantPressure - WATER_VAPOR_PRESSURE + (( 1 - RQ ) * C02_PRESSURE)) * inertGasRatio;

export default ventilation;
