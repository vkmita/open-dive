import Sample from './Sample';
import { ceilingStep } from './equations/ceiling';
import { MAX_ASCENT_RATE } from './constants';

// return the tts of the sample
const tts = (sample: Sample, totalTime: number = 0) => {
  const { ascentCeiling: { depth: ceilingDepth } } = sample;

  if (ceilingDepth === 0) {
    // we can now go to the surface
    return totalTime + (sample.depth / MAX_ASCENT_RATE);
  }

  // ceiling stop does not change so stay for another minute
  const nextCeilingStep = ceilingStep(ceilingDepth);
  if (nextCeilingStep === sample.depth) {
    const nextSample = sample.createNextSample({ 
      depth: nextCeilingStep, 
      intervalTime: 1,
    });
    return tts(nextSample, totalTime + 1);
  }
  
  // ascend to ceiling
  const timeToAscend = (sample.depth - nextCeilingStep) / MAX_ASCENT_RATE;
  const nextSample = sample.createNextSample({ 
    depth: nextCeilingStep,
    intervalTime: timeToAscend,
  });

  return tts(nextSample, totalTime + timeToAscend);
}

export default tts;