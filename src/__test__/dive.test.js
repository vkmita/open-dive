import { addSample, initializeDive } from '../dive';

const dive = initializeDive({
  heRatio: 0,
  n2Ratio: 0.79,
});

test('iniitializeDive', () => {
  expect(dive.heRatio).toEqual(0);
  expect(dive.n2Ratio).toEqual(0.79);
});

test('addSample', () => {
  const nDive = addSample({
    depth: 40,
    dive,
    time: dive.startedAt + 2 * 1000,
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

  // stay at 40 meters for 30 minutes
  const mDive = addSample({
    depth: 40,
    dive: nDive,
    time: dive.startedAt + 32 * 1000,
  });

  samples = mDive.samples;
  sample = samples[samples.length - 1];

  expect(sample.tissues[4]).toEqual({
    he: 0,
    n2: 2.90798318563608,
  });

  expect(sample.ndl).toEqual({
    compartment: '2',
    gas: 'n2',
    value: -19.902586782634753,
  });
});
