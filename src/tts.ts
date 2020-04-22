import Sample from './Sample';
import { ceilingStep } from './equations/ceiling';
import { MAX_ASCENT_RATE } from './constants';

// return the tts of the sample
const tts = (sample: Sample, totalTime: number = 0) => {
  const { ascentCeiling } = sample;

  if (!ascentCeiling) {
    // we can now go to the surface
    return totalTime + sample.depth / MAX_ASCENT_RATE;
  }

  const { depth } = ascentCeiling;

  // ceiling stop does not change so stay for another minute
  const nextCeilingStep = ceilingStep(depth);
  if (nextCeilingStep === sample.depth) {
    // figure out the exact time we need here

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
};

export default tts;
