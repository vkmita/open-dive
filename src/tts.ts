import Sample from './Sample';
import { ceilingStep as calcCeilingStep } from './equations/ceiling';
import {
  MAX_ASCENT_RATE,
  DECO_STEP_SIZE,
  DECO_ASCENT_RATE,
  SURFACE_ASCENT_RATE,
} from './constants';

// return the tts of the sample
const tts = ({ sample, totalTime }: { sample: Sample; totalTime: number }) => {
  const { ascentCeiling, depth } = sample;

  if (!ascentCeiling) {
    const ascentRate = totalTime === 0 ? MAX_ASCENT_RATE : SURFACE_ASCENT_RATE;
    // we can now go to the surface, woot
    return totalTime + sample.depth / ascentRate;
  }

  // ceiling stop does not change so stay for another minute
  const ceilingStepDepth = calcCeilingStep(ascentCeiling.depth);

  if (ceilingStepDepth === depth) {
    // figure time needed before we can ascend to next step
    const intervalTime = sample.stopTime({
      targetDepth: ceilingStepDepth - DECO_STEP_SIZE,
    });

    const nextSample = sample.createNextSample({
      depth,
      intervalTime,
      usePreviousGFLowDepth: true,
    });
    return tts({
      sample: nextSample,
      totalTime: totalTime + intervalTime,
    });
  }

  // ascend to ceiling
  const ascentRate = totalTime === 0 ? MAX_ASCENT_RATE : DECO_ASCENT_RATE;
  const timeToAscend = (depth - ceilingStepDepth) / ascentRate;
  const nextSample = sample.createNextSample({
    depth: ceilingStepDepth,
    intervalTime: timeToAscend,
    usePreviousGFLowDepth: true,
  });

  return tts({ sample: nextSample, totalTime: totalTime + timeToAscend });
};

export default tts;
