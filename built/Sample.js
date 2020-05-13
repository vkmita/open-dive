'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ZHL16B_1 = require('./ZHL16B');
var GasMix_1 = require('./GasMix');
var SampleTissue_1 = require('./SampleTissue');
var tts_1 = require('./tts');
/** A class representing a sample (a moment in time) during a dive */
var Sample = /** @class */ (function () {
  /**
   * Create a sample
   * @constructor
   * @param depth - The depth associated with the sample
   * @param gasMix - The gas mix used during the interval ending in this sample
   * @param gradientFactor - An object containing the high and low gradient
   *   factor values
   * @param time - The total elapsed time within the dive scope
   * @param tissues - (optional) the pre-calculated tissues for this sample
   */
  function Sample(_a) {
    var _this = this;
    var depth = _a.depth,
      gradientFactor = _a.gradientFactor,
      gasMix = _a.gasMix,
      gasSwitch = _a.gasSwitch,
      time = _a.time,
      tissues = _a.tissues;
    /**
     * The max ascent ceiling at the time of the sample
     * @return An ascent ceiling object containg the depth and gas compartment or
     *   null
     */
    this.ascentCeiling = function () {
      var ascentCeiling = ZHL16B_1.default.reduce(
        function (maxAscentCeiling, gasCompartment) {
          var compartment = gasCompartment.compartment,
            inertGas = gasCompartment.inertGas;
          var sampleTissue = _this.tissues[compartment][inertGas];
          var ascentCeiling = sampleTissue.ascentCeiling();
          return maxAscentCeiling.depth < ascentCeiling
            ? { depth: ascentCeiling, gasCompartment: gasCompartment }
            : maxAscentCeiling;
        },
        { depth: 0, gasCompartment: null },
      );
      return ascentCeiling.depth === 0 ? null : ascentCeiling;
    };
    /**
     * Creates a new sample using the current sample as the previous sample
     * @param depth - The depth associated with the next sample
     * @param intervalTime - The time elapsed since this sample's time
     * @param gasSwitch - The gasMix to switch to at the moment of the next sample
     * @param usePreviousGFLowDepth - Whether to use a previously defined gradient
     *   factor low depth, like when calculating decompression stups
     * @param gradientFactor - An object containing the high and low gradient
     *   factor values
     */
    this.createNextSample = function (_a) {
      var depth = _a.depth,
        intervalTime = _a.intervalTime,
        gasSwitch = _a.gasSwitch,
        usePreviousGFLowDepth = _a.usePreviousGFLowDepth,
        gradientFactor = _a.gradientFactor;
      var gasMix = _this.gasSwitch || _this.gasMix;
      var nextTissues = ZHL16B_1.default.reduce(function (
        tissues,
        gasCompartment,
      ) {
        var compartment = gasCompartment.compartment,
          inertGas = gasCompartment.inertGas;
        tissues[compartment] = tissues[compartment] || {};
        var previousSampleTissue = _this.tissues[compartment][inertGas];
        tissues[compartment][inertGas] = new SampleTissue_1.default({
          startTissuePressure: previousSampleTissue.pressure,
          gasMix: gasMix,
          startDepth: _this.depth,
          endDepth: depth,
          intervalTime: intervalTime,
          gasCompartment: gasCompartment,
          gradientFactor: gradientFactor || _this.gradientFactor,
          gfLowDepth: usePreviousGFLowDepth && previousSampleTissue.gfLowDepth,
        });
        return tissues;
      },
      {});
      return new Sample({
        depth: depth,
        gasMix: gasMix,
        gasSwitch: gasSwitch,
        time: _this.time + intervalTime,
        tissues: nextTissues,
        gradientFactor: gradientFactor || _this.gradientFactor,
      });
    };
    /**
     * Time one can wait at current depth before needing to ascend to surface
     *   safely (without exceeding M-values)
     * @return object including that value and the leading gas compartment
     */
    this.noStopTime = function () {
      var noStopTime = ZHL16B_1.default.reduce(
        function (minNoStopTime, gasCompartment) {
          var compartment = gasCompartment.compartment,
            inertGas = gasCompartment.inertGas;
          var sampleTissue = _this.tissues[compartment][inertGas];
          var noStopTime = sampleTissue.noStopTime();
          return minNoStopTime.value > noStopTime
            ? { value: noStopTime, gasCompartment: gasCompartment }
            : minNoStopTime;
        },
        { value: Infinity, gasCompartment: null },
      );
      return noStopTime.value === Infinity ? null : noStopTime;
    };
    /**
     * Time needed to wait at current depth in order to ascend to target depth
     *   safely (without exceeding M-values)
     * @param targetDepth - next target depth
     * @return time in minutes
     */
    this.stopTime = function (_a) {
      var targetDepth = _a.targetDepth;
      return ZHL16B_1.default.reduce(function (maxStopTime, _a) {
        var compartment = _a.compartment,
          inertGas = _a.inertGas;
        var sampleTissue = _this.tissues[compartment][inertGas];
        var stopTime = sampleTissue.stopTime({ targetDepth: targetDepth });
        return maxStopTime < stopTime ? stopTime : maxStopTime;
      }, 0);
    };
    /**
     * Time needed to ascend to the surface using the most effecient
     *   decompression stops if at all necessary
     * @param targetDepth - next target depth
     * @return time in minutes
     */
    this.tts = function () {
      return tts_1.default({ sample: _this, totalTime: 0 });
    };
    Object.assign(this, {
      depth: depth,
      gasMix: gasMix,
      gasSwitch: gasSwitch,
      gradientFactor: gradientFactor,
      tissues: tissues,
    });
    if (time === 0) {
      // all tissues fully saturated with air
      var initalN2Pressure_1 = GasMix_1.AIR.n2.alveolarPressure({ depth: 0 });
      this.tissues = ZHL16B_1.default.reduce(function (
        tissues,
        gasCompartment,
      ) {
        var inertGas = gasCompartment.inertGas,
          compartment = gasCompartment.compartment;
        tissues[compartment] = tissues[compartment] || {};
        var initialPressure = inertGas === 'he' ? 0 : initalN2Pressure_1;
        tissues[compartment][inertGas] = new SampleTissue_1.default({
          pressure: initialPressure,
          gasMix: gasMix,
          gasCompartment: gasCompartment,
          gradientFactor: gradientFactor,
          endDepth: 0,
        });
        return tissues;
      },
      {});
    }
  }
  return Sample;
})();
exports.default = Sample;
