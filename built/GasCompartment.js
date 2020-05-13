'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var pressure_1 = require('./equations/pressure');
/**
 * A class representing am individual inert gas's compartment
 */
var GasCompartment = /** @class */ (function () {
  /**
   * @constructor
   * @param a The compartment's a value
   * @param b The compartment's b value
   * @param compartment The compartment's number
   * @param halfTime The compartment's half time
   */
  function GasCompartment(_a) {
    var a = _a.a,
      b = _a.b,
      compartment = _a.compartment,
      inertGas = _a.inertGas,
      halfTime = _a.halfTime;
    Object.assign(this, {
      a: a,
      b: b,
      compartment: compartment,
      inertGas: inertGas,
      halfTime: halfTime,
    });
    // the k in the schreiner equation
    this.k = Math.LN2 / halfTime;
    // m value at the surface
    this.m0 = a + pressure_1.ambientPressure(0) / b;
  }
  return GasCompartment;
})();
exports.default = GasCompartment;
