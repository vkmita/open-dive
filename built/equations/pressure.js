'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var constants_1 = require('../constants');
// "alveolar ventilation equation"
// calculates the partial pressure of the inert gas in the
// alvioli before it enters tissues
exports.alveolarPressure = function (_a) {
  var ambientPressure = _a.ambientPressure,
    gasRatio = _a.gasRatio;
  return (
    (ambientPressure -
      constants_1.ALVEOLAR_WATER_VAPOR_PRESSURE +
      (1 - constants_1.RESPIRATORY_QUOTIENT) *
        constants_1.ALVEOLAR_C02_PRESSURE) *
    gasRatio
  );
};
// ambient pressure (bar) at depth (meters)
exports.ambientPressure = function (depth) {
  return depth * constants_1.MSW + constants_1.ATA;
};
// depth given an ambient pressure
exports.ambientPressureDepth = function (ambientPressure) {
  return ambientPressure < constants_1.ATA
    ? 0
    : (ambientPressure - constants_1.ATA) / constants_1.MSW;
};
// meters / minute
exports.rateOfPressureChange = function (_a) {
  var endDepth = _a.endDepth,
    startDepth = _a.startDepth,
    time = _a.time;
  return (
    (exports.ambientPressure(endDepth) - exports.ambientPressure(startDepth)) /
    time
  );
};
