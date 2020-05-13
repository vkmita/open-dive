'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// no decompression limit equation (no-stop time by Schreiner)
//
// pAlv: pressure of inert gas at depth
// tAsc: ascent time
// R: rate of pressure change
// k: gas decay constant
// m0: surfacing M-value
exports.default = function (_a) {
  var m0 = _a.m0,
    pAlv = _a.pAlv,
    R = _a.R,
    k = _a.k,
    tAsc = _a.tAsc;
  return (m0 - pAlv - R * (tAsc - 1 / k)) * Math.exp(k * tAsc) + pAlv - R / k;
};
