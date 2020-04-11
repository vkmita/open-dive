// constants derived from https://www.ncbi.nlm.nih.gov/books/NBK482268/
// TODO: make these constants configurable
// "approximately 45 mmHg"
const WATER_VAPOR_PRESSURE = 45 / 460;
// "in normal physiological conditions around 40 to 45 mmHg"
const C02_PRESSURE = 42.5 / 460;
/*
  Source    RQ
  -------------
  Schreiner 0.8
  US Navy   0.9
  Buhlmann  1.0
*/
const RQ = 1.0;

// The alveolar ventilation equation
// calculates the partial pressure of the inert gas with respect to ambient pressure
// Calculate the alveolar partial pressure
const lungDilution = (ambiantPressure, inertGasRatio) =>
  (ambiantPressure - WATER_VAPOR_PRESSURE + ((1 - RQ) * C02_PRESSURE)) * inertGasRatio;

export default lungDilution;