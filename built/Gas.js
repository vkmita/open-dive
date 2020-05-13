'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var pressure_1 = require('./equations/pressure');
/**
 * A class representing an individual gas in a mix
 */
var Gas = /** @class */ (function () {
  /**
   * Create a gas
   * @constructor
   * @param ratio The ratio of gas
   * @param gas The type of gas
   */
  function Gas(_a) {
    var _this = this;
    var ratio = _a.ratio,
      gas = _a.gas;
    /**
     * The alveolar pressure of the gas at a certain depth
     * @param depth The depth in meters
     * @returns The alveolar pressure at the depth
     */
    this.alveolarPressure = function (_a) {
      var depth = _a.depth;
      return pressure_1.alveolarPressure({
        ambientPressure: pressure_1.ambientPressure(depth),
        gasRatio: _this.ratio,
      });
    };
    /**
     * Methos to ralculate the R in the Schreiner equation
     * @param startDepth The start depth in meters
     * @param endDepth The end depth in meters
     * @param time The time of the interval
     * @returns The R value of the Schreiner equation
     */
    this.R = function (_a) {
      var startDepth = _a.startDepth,
        endDepth = _a.endDepth,
        time = _a.time;
      return (
        pressure_1.rateOfPressureChange({
          startDepth: startDepth,
          endDepth: endDepth,
          time: time,
        }) * _this.ratio
      );
    };
    Object.assign(this, { ratio: ratio, gas: gas });
  }
  return Gas;
})();
exports.default = Gas;
