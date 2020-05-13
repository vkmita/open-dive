'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var constants_1 = require('../constants');
// an ascent ceiling pressure for a compartment at a particular tissue pressure
// pAmbTol = (pComp - a * GF) / ( b
exports.ascentCeiling = function (_a) {
  var pComp = _a.pComp,
    a = _a.a,
    b = _a.b,
    _b = _a.gradientFactor,
    gradientFactor = _b === void 0 ? 1.0 : _b;
  return (
    (pComp - a * gradientFactor) / (gradientFactor / b + 1.0 - gradientFactor)
  );
};
exports.ascentCeilingSolvedForPComp = function (_a) {
  var a = _a.a,
    b = _a.b,
    pAmbTol = _a.pAmbTol,
    _b = _a.gradientFactor,
    gradientFactor = _b === void 0 ? 1 : _b;
  return (
    pAmbTol * (gradientFactor / b + 1.0 - gradientFactor) + a * gradientFactor
  );
};
// ascent ceiling solved for pComp
// pComp = (pAmbTol / b) + a
// we can use this along with Schreiner equation to determine how long to stay
// at a certain depth to
// export const ceilingStepTime = (
//   { a, b, p0, pAlv, pAmbTol }:
//   { a: number, b: number, p0: number, pAmbTol: number }
// ) => {
//   const pComp =
//   return schreinerSolvedForTime({ ptt: pComp, p0, pAlv, k })
// }
// ascent ceiling depth rounded to the greater step of 3 meters
exports.ceilingStep = function (depth) {
  return (
    Math.ceil(depth / constants_1.DECO_STEP_SIZE) * constants_1.DECO_STEP_SIZE
  );
};
exports.default = exports.ascentCeiling;
