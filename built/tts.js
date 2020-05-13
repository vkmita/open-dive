'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ceiling_1 = require('./equations/ceiling');
var constants_1 = require('./constants');
// return the tts of the sample
var tts = function (_a) {
  var sample = _a.sample,
    totalTime = _a.totalTime;
  var depth = sample.depth;
  var ascentCeiling = sample.ascentCeiling();
  if (!ascentCeiling) {
    var ascentRate_1 =
      totalTime === 0
        ? constants_1.MAX_ASCENT_RATE
        : constants_1.SURFACE_ASCENT_RATE;
    // we can now go to the surface, woot
    return totalTime + sample.depth / ascentRate_1;
  }
  // ceiling stop does not change so stay for another minute
  var ceilingStepDepth = ceiling_1.ceilingStep(ascentCeiling.depth);
  if (ceilingStepDepth === depth) {
    // figure time needed before we can ascend to next step
    var intervalTime = sample.stopTime({
      targetDepth: ceilingStepDepth - constants_1.DECO_STEP_SIZE,
    });
    var nextSample_1 = sample.createNextSample({
      depth: depth,
      intervalTime: intervalTime,
      usePreviousGFLowDepth: true,
    });
    return tts({
      sample: nextSample_1,
      totalTime: totalTime + intervalTime,
    });
  }
  // ascend to ceiling
  var ascentRate =
    totalTime === 0
      ? constants_1.MAX_ASCENT_RATE
      : constants_1.DECO_ASCENT_RATE;
  var timeToAscend = (depth - ceilingStepDepth) / ascentRate;
  var nextSample = sample.createNextSample({
    depth: ceilingStepDepth,
    intervalTime: timeToAscend,
    usePreviousGFLowDepth: true,
  });
  return tts({ sample: nextSample, totalTime: totalTime + timeToAscend });
};
exports.default = tts;
