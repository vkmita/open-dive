'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ceiling_1 = require('./equations/ceiling');
var schreiner_1 = require('./equations/schreiner');
var noDecompressionLimit_1 = require('./equations/noDecompressionLimit');
var pressure_1 = require('./equations/pressure');
var constants_1 = require('./constants');
/**
 * A class representing a tissue's relationship with an inert gas at the
 * moment of a sample
 */
var SampleTissue = /** @class */ (function () {
  /**
   * Create a sample tissue
   * @constructor
   * @param endDepth The depth at the moment of the sample
   * @param gasCompartment The gas compartment associated with the tissue
   * @param gasMix The gas mix being breathed
   * @param gfLowDepth The low depth to use for gradient factor calculations
   * @param gradientFactor The gradient factors set for the dive
   * @param intervalTime The time since the last sample
   * @param pressure The pressure of the tissue
   * @param startDepth The depth at the moment of the last sample
   * @param startTissuePressure The pressure at the moment of the last sample
   */
  function SampleTissue(_a) {
    var _this = this;
    var endDepth = _a.endDepth,
      gasCompartment = _a.gasCompartment,
      gasMix = _a.gasMix,
      gfLowDepth = _a.gfLowDepth,
      gradientFactor = _a.gradientFactor,
      intervalTime = _a.intervalTime,
      pressure = _a.pressure,
      startDepth = _a.startDepth,
      startTissuePressure = _a.startTissuePressure;
    /**
     * The time one can stay at the current depth until needing to ascend without
     *   breaking M-values
     * @returns number in minutes
     */
    this.noStopTime = function () {
      var _a = _this.gasCompartment,
        k = _a.k,
        m0 = _a.m0,
        inertGas = _a.inertGas;
      var gas = _this.gasMix[inertGas];
      // alveolar pressure at the surface
      var pAlv = gas.alveolarPressure({ depth: _this.depth });
      // time needed to ascend to the surface
      var tAsc = _this.depth / constants_1.MAX_ASCENT_RATE;
      // the no decompression limit equation
      // max partial pressure of gas the tissue can have at the current depth
      var maxPressureAtDepth = noDecompressionLimit_1.default({
        k: k,
        m0: m0,
        R: gas.R({
          startDepth: _this.depth,
          endDepth: 0,
          time: tAsc,
        }),
        pAlv: pAlv,
        tAsc: _this.depth / constants_1.MAX_ASCENT_RATE,
      });
      // we never hit a no stop time
      if (maxPressureAtDepth > pAlv) return Number.MAX_VALUE;
      var noStopTime = schreiner_1.solvedForTime({
        k: k,
        ptt: maxPressureAtDepth,
        p0: _this.pressure,
        pAlv: pAlv,
      });
      return noStopTime < 0 ? 0 : noStopTime;
    };
    /**
     * The max gradient factor for the current depth and tissue
     * @returns A gradient factor for the current depth
     */
    this.maxGradientFactor = function () {
      var _a = _this.gasCompartment,
        a = _a.a,
        b = _a.b;
      var pComp = _this.pressure;
      var gradientFactor = _this.gradientFactor;
      var gfLowDepth =
        _this.gfLowDepth ||
        _this.depth -
          (_this.depth -
            pressure_1.ambientPressureDepth(
              ceiling_1.ascentCeiling({ a: a, b: b, pComp: pComp }),
            )) *
            gradientFactor.low;
      // 0 or NaN
      if (!gfLowDepth) return gradientFactor.high;
      return (
        gradientFactor.high -
        ((gradientFactor.high - gradientFactor.low) / gfLowDepth) * _this.depth
      );
    };
    /**
     * The depth in which one can ascend to without breaking M-values
     * @returns The depth in meters
     */
    this.ascentCeiling = function () {
      var _a = _this.gasCompartment,
        a = _a.a,
        b = _a.b;
      var pComp = _this.pressure;
      var gradientFactor = _this.maxGradientFactor();
      var maxAscentPressure = ceiling_1.ascentCeiling({
        a: a,
        b: b,
        pComp: pComp,
        gradientFactor: gradientFactor,
      });
      if (!maxAscentPressure) return 0;
      // we need to round here after adding gradient factors :/
      // TODO: figure out the math that's causing this
      return Number(
        pressure_1.ambientPressureDepth(maxAscentPressure).toFixed(4),
      );
    };
    /**
     * Calculate time needed to wait at current depth to ascend to the target
     *   depth without exceeding mvalues
     * @returns The time in minutes
     */
    this.stopTime = function (_a) {
      var targetDepth = _a.targetDepth;
      var _b = _this.gasCompartment,
        a = _b.a,
        b = _b.b,
        inertGas = _b.inertGas,
        k = _b.k;
      var targetDepthPressure = pressure_1.ambientPressure(targetDepth);
      var gas = _this.gasMix[inertGas];
      var pComp = ceiling_1.ascentCeilingSolvedForPComp({
        a: a,
        b: b,
        pAmbTol: targetDepthPressure,
        gradientFactor: _this.maxGradientFactor(),
      });
      return schreiner_1.solvedForTime({
        k: k,
        ptt: pComp,
        p0: _this.pressure,
        pAlv: gas.alveolarPressure({ depth: _this.depth }),
      });
    };
    Object.assign(this, {
      depth: endDepth,
      gasMix: gasMix,
      gasCompartment: gasCompartment,
      gfLowDepth: gfLowDepth,
      gradientFactor: gradientFactor,
      pressure: pressure,
    });
    if (pressure == null) {
      var inertGas = gasCompartment.inertGas;
      var gas = gasMix[inertGas];
      var R = gas.R({
        startDepth: startDepth,
        endDepth: endDepth,
        time: intervalTime,
      });
      var startAlviolarPressure = gas.alveolarPressure({ depth: startDepth });
      this.pressure = schreiner_1.default({
        pAlv: startAlviolarPressure,
        R: R,
        p0: startTissuePressure,
        k: gasCompartment.k,
        t: intervalTime,
      });
    }
  }
  return SampleTissue;
})();
exports.default = SampleTissue;
