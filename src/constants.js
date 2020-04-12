// Source    RQ
// -------------
// Schreiner 0.8
// US Navy   0.9
// Buhlmann  1.0
// schreiner's RQ is the most concervative
const RESPIRATORY_QUOTIENT = 0.8;

// American standard, average atmospheric pressure at sea level (bar)
const ATA = 1.01325;

// U.S. Navy and the Journal of Underseaand Hyperbaric Medicine standard
// bar per meter sea water 
// 3.28084 / 33.08
const MSW = 0.09917896009;

// constant vapor pressure at 37°C (47 mmHg converted to bar)
const ALVEOLAR_WATER_VAPOR_PRESSURE = 0.0626615233;

// 40 mmHg converted to bar
const ALVEOLAR_C02_PRESSURE = 0.053328956;

// 10 meters per minute (buhlmann)
const MAX_ASCENT_RATE = 10;

export {
  ALVEOLAR_C02_PRESSURE,
  ALVEOLAR_WATER_VAPOR_PRESSURE,
  ATA, 
  MAX_ASCENT_RATE, 
  MSW, 
  RESPIRATORY_QUOTIENT, 
};
