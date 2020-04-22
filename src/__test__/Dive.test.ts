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

  dive.addSample({ depth: 0, intervalTime: 4 });
  lastSample = dive.lastSample;

  expect(Object.values(lastSample.tissues).map((t) => t.n2.pressure)).toEqual([
    1.6916082557197374,
    1.3690760311998016,
    1.1896024558572034,
    1.0664343407678096,
    0.9768692204227243,
    0.9154161210823872,
    0.8702126768354503,
    0.8373185889783485,
    0.8137154569410825,
    0.7991153778133366,
    0.7896010200413173,
    0.7821838568099224,
    0.7763842040474742,
    0.7717896921204215,
    0.7682038439335201,
    0.7654037434906513,
    1.5888439593763515,
  ]);
});
