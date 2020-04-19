import { addSample, initializeDive } from '../dive';

const dive = initializeDive({
  heRatio: 0,
  n2Ratio: 0.79,
});

test('iniitializeDive', () => {
  const initialSample = dive.samples[0];
  expect(initialSample.heRatio).toEqual(0);
  expect(initialSample.n2Ratio).toEqual(0.79);
});

test('addSample', () => {
  const nDive = addSample({
    depth: 40,
    dive,
    time: dive.startedAt + 2 * 60 * 1000,
  });

  let { samples } = dive;

  // most recent sammple
  let sample = samples[samples.length - 1];

  expect(sample.tissues[4]).toEqual({
    he: 0,
    n2: 0.8697238903873057,
  });

  expect(sample.ndl).toEqual({
    compartment: '2',
    gas: 'n2',
    value: 10.097413217365236,
  });

  // ascent ceiling is still < 1 ATA so no need for a stop
  expect(sample.ascentCeiling).toEqual({
    compartment: '16',
    gas: 'n2',
    depth: 0,
    pressure: 0.5076478312564106,
  });

  // stay at 40 meters for 30 minutes
  const mDive = addSample({
    depth: 40,
    dive: nDive,
    time: dive.startedAt + 32 * 60 * 1000,
  });

  samples = mDive.samples;
  sample = samples[samples.length - 1];

  // way more saturated with n2
  expect(sample.tissues[4]).toEqual({
    he: 0,
    n2: 2.90798318563608,
  });

  // -ndl means you have to go back in time 19 minutes to go below ndls, meaning
  // decompression stops are needed;
  expect(sample.ndl).toEqual({
    compartment: '2',
    gas: 'n2',
    value: -19.902586782634753,
  });

  expect(sample.ascentCeiling).toEqual({
    depth: 7.736013469907749,
    compartment: '3',
    gas: 'n2',
    pressure: 1.780499771187683,
  });
});
