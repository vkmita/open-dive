'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var GasMix_1 = require('./GasMix');
var Sample_1 = require('./Sample');
/** Class representing a dive */
var Dive = /** @class */ (function () {
  /**
   * Create a dive
   * @constructor
   * @param surfaceInterval - The time since the previous dive in minutes
   *   (optional)
   * @param gases - The gases available during the dive
   * @param gradientFactor - An object containing the high and low gradient
   *   factor values
   */
  function Dive(_a) {
    var _this = this;
    var surfaceInterval = _a.surfaceInterval,
      gases = _a.gases,
      samples = _a.samples,
      _b = _a.gradientFactor,
      gradientFactor =
        _b === void 0
          ? {
              high: 1,
              low: 1,
            }
          : _b;
    /**
     * Creates a sample and adds it to the current array of samples on the dive
     * @param intervalTime - The time since the previous sample in minutes
     * @param gaseSwitch - The gas that is switched to at the moment of the sample
     * @param depth - the depth of the smple
     */
    this.addSample = function (_a) {
      var depth = _a.depth,
        intervalTime = _a.intervalTime,
        gasSwitch = _a.gasSwitch;
      var nextSample = _this.lastSample().createNextSample({
        depth: depth,
        intervalTime: intervalTime,
        gasSwitch: gasSwitch,
      });
      _this.samples.push(nextSample);
    };
    /**
     * Creates a next dive taking into account the end tissue pressures from the
     *   previous dive
     * @param surfaceInterval - The time since the previous dive in minutes
     * @param gases - The gases available during the next dive
     * @param gradientFactor - An object containing the high and low gradient
     *   factor values for the next dive
     * @return - The newly created dive
     */
    this.createNextDive = function (_a) {
      var surfaceInterval = _a.surfaceInterval,
        gases = _a.gases,
        gradientFactor = _a.gradientFactor;
      var numberOfSamples = _this.samples.length;
      if (numberOfSamples === 1) {
        throw new Error('The dive needs to end');
      }
      var lastSample = _this.lastSample();
      if (lastSample.depth !== 0) {
        throw new Error('The dive needs to end');
      }
      var initialGas = gases[0];
      var initialSample = lastSample.createNextSample({
        depth: 0,
        intervalTime: surfaceInterval,
        gasSwitch: initialGas,
        gradientFactor: gradientFactor,
      });
      return new Dive({
        surfaceInterval: surfaceInterval,
        gases: gases,
        samples: [initialSample],
      });
    };
    /**
     * @return - The last (most recent) sample
     */
    this.lastSample = function () {
      return _this.samples[_this.samples.length - 1];
    };
    Object.assign(this, {
      surfaceInterval: surfaceInterval,
      gradientFactor: gradientFactor,
      gases: gases,
      samples: samples,
    });
    // for now just use the first gas
    // TODO: gas switches
    if (!this.surfaceInterval) {
      var initialGas = this.gases[0];
      this.samples = [
        new Sample_1.default({
          depth: 0,
          gasMix: GasMix_1.AIR,
          time: 0,
          gasSwitch: initialGas,
          gradientFactor: gradientFactor,
        }),
      ];
    }
  }
  return Dive;
})();
exports.default = Dive;
