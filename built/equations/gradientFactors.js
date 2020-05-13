'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.maxGradientFactor = function (_a) {
  var highGF = _a.highGF,
    lowGF = _a.lowGF,
    currentDepth = _a.currentDepth,
    lowGFDepth = _a.lowGFDepth;
  return highGF - ((highGF - lowGF) / lowGFDepth) * currentDepth;
};
