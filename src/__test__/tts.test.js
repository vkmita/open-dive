import { addSample, initializeDive } from '../dive';
import tts from '../tts';

test('tts', () => {
  const dive = initializeDive({
    heRatio: 0,
    n2Ratio: 0.79,
  });
  
  const diveTo40 = addSample({
    depth: 40,
    dive,
    time: dive.startedAt + 2 * 60 * 1000,
  });

  let prevSample = diveTo40.samples[1];

  // no deco stright ascent to surface
  expect(tts(prevSample)).toEqual(4);

  const thirtyMinutesAt40 = addSample({
    depth: 40,
    dive: diveTo40,
    time: dive.startedAt + 30 * 60 * 1000,
  });

  prevSample = thirtyMinutesAt40.samples[2];

  expect(tts(prevSample)).toEqual(27);
});