import { MAX_ASCENT_RATE } from './constants';
import { createNextSample } from './dive';
import { ceilingStep } from './ascentCeiling';

// return the tts of the sample
const tts = (sample, totalTime = 0) => {
  const { ascentCeiling } = sample;
  const ceilingDepth = ascentCeiling.depth;

  if (ceilingDepth === 0) {
    // we can now go to the surface
    return totalTime + (sample.depth / MAX_ASCENT_RATE);
  }

  // ceiling stop does not change so stay for another minute
  const nextCeilingStep = ceilingStep(ceilingDepth);
  if (nextCeilingStep === sample.depth) {
    const inOneMinute = sample.timestamp + 1000 * 60;
    const nextSample = createNextSample({ depth: nextCeilingStep, prevSample: sample, time: inOneMinute });
    return tts(nextSample, totalTime + 1);
  } 
  
  // ascend to ceiling
  const timeToAscend = (sample.depth - nextCeilingStep) / MAX_ASCENT_RATE;
  const time = sample.timestamp + (timeToAscend * 1000 * 60);
  const nextSample = createNextSample({ depth: nextCeilingStep, prevSample: sample, time });

  return tts(nextSample, totalTime + timeToAscend);
}

export default tts;