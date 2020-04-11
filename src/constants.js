// Source    RQ
// -------------
// Schreiner 0.8
// US Navy   0.9
// Buhlmann  1.0

// TODO make configurable
const RESPIRATORY_QUOTIENT = 0.8;

// American standard, average atmospheric pressure at sea level
const ATA = 1.01325;

// U.S. Navy and the Journal of Underseaand Hyperbaric Medicine standard
// bar per meter sea water 
// 3.28084 / 33.08
const MSW = 0.09917896009;

// constant vapor pressure of 37°C (47 mmHg) converted to bar
const WATER_VAPOR_PRESSURE = 0.0626615233;

// 40 mmHg converted to bar
const C02_PRESSURE = 0.053328956;

export { ATA, C02_PRESSURE, MSW, RESPIRATORY_QUOTIENT, WATER_VAPOR_PRESSURE };
