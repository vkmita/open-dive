import Sample from './Sample';
import { ceilingStep as calcCeilingStep } from './equations/ceiling';
import {
  MAX_ASCENT_RATE,
  DECO_STEP_SIZE,
  DECO_ASCENT_RATE,
  SURFACE_ASCENT_RATE,
} from './constants';

const ascentRate = (totalTime: number) =>
  totalTime === 0 ? MAX_ASCENT_RATE : DECO_ASCENT_RATE;

// return the tts of the sample
const tts = (sample: Sample) => {
  let currentSample = sample;
  let totalTime = 0;

  while (true) {
    const { depth } = currentSample;
    const ascentCeiling = currentSample.ascentCeiling();

    if (!ascentCeiling) {
      const ascentRate =
        totalTime === 0 ? MAX_ASCENT_RATE : SURFACE_ASCENT_RATE;
      // we can now go to the surface, woot
      return totalTime + currentSample.depth / ascentRate;
    }

    // ceiling stop does not change so stay for another minute
    const ceilingStepDepth = calcCeilingStep(ascentCeiling.depth);

    if (ceilingStepDepth === depth) {
      // figure time needed before we can ascend to next step
      const intervalTime = currentSample.stopTime({
        targetDepth: ceilingStepDepth - DECO_STEP_SIZE,
      });

      currentSample = currentSample.createNextSample({
        depth,
        intervalTime,
        usePreviousGFLowDepth: true,
      });
      totalTime += intervalTime;
      continue;
    }

    // ascend to ceiling
    const timeToAscend = (depth - ceilingStepDepth) / ascentRate(totalTime);
    currentSample = currentSample.createNextSample({
      depth: ceilingStepDepth,
      intervalTime: timeToAscend,
      usePreviousGFLowDepth: true,
    });
    totalTime += timeToAscend;
  }
};

export default tts;
