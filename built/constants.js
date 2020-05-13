'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// Source    RQ
// -------------
// Schreiner 0.8
// US Navy   0.9
// Buhlmann  1.0
// schreiner's RQ is the most conservative
var RESPIRATORY_QUOTIENT = 0.9;
exports.RESPIRATORY_QUOTIENT = RESPIRATORY_QUOTIENT;
// American standard, average atmospheric pressure at sea level (bar)
var ATA = 1.01325;
exports.ATA = ATA;
// The meters betweem deco stops / steps
var DECO_STEP_SIZE = 3;
exports.DECO_STEP_SIZE = DECO_STEP_SIZE;
// U.S. Navy and the Journal of Underseaand Hyperbaric Medicine standard
// bar per meter sea water
// 3.28084 / 33.08
var MSW = 0.09917896009;
exports.MSW = MSW;
// constant vapor pressure at 37°C (47 mmHg converted to bar)
var ALVEOLAR_WATER_VAPOR_PRESSURE = 0.0626615233;
exports.ALVEOLAR_WATER_VAPOR_PRESSURE = ALVEOLAR_WATER_VAPOR_PRESSURE;
// 40 mmHg converted to bar
var ALVEOLAR_C02_PRESSURE = 0.053328956;
exports.ALVEOLAR_C02_PRESSURE = ALVEOLAR_C02_PRESSURE;
// 10 meters per minute (Buhlmann) m/min
var MAX_ASCENT_RATE = 10;
exports.MAX_ASCENT_RATE = MAX_ASCENT_RATE;
// ascent rate between deco stops m/min
var DECO_ASCENT_RATE = 3;
exports.DECO_ASCENT_RATE = DECO_ASCENT_RATE;
// end of deco to surface ascent rate m/min
var SURFACE_ASCENT_RATE = 1;
exports.SURFACE_ASCENT_RATE = SURFACE_ASCENT_RATE;
