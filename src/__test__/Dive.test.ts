import Dive from '../Dive';
import { AIR } from '../GasMix';

test('no previous dive', () => {
  const dive = new Dive({
    gases: [AIR],
  });

  // decend to 40 meters
  dive.addSample({ depth: 40, intervalTime: 2 });

  let { lastSample } = dive;

  // we can stay at 40 meters for ~10 minutes
  expect(lastSample.ndl.value).toEqual(10.097413217365236);

  dive.addSample({ depth: 40, intervalTime: 28 });
  lastSample = dive.lastSample;

  expect(Object.values(lastSample.tissues).map((t) => t.n2.pressure)).toEqual([
    3.8685406396525837,
    3.634892158411683,
    3.2612620221688347,
    2.831628301246117,
    2.4004691474181032,
    2.034862987602392,
    1.7247840922759594,
    1.475231359900914,
    1.2829653894301312,
    1.1582774499345794,
    1.0745866975584772,
    1.0079853660052551,
    0.955068358980804,
    0.9126186131278868,
    0.8791608145548517,
    0.8528336532060483,
    3.832801363442152,
  ]);
});
