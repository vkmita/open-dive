import Dive from '../Dive';
import { Air } from '../Gas';

test('no previous dive', () => {
  const dive = new Dive({
    gases: [Air],
  });

  // decend to 40 meters
  dive.addSample({ depth: 40, intervalTime: 2 });

  let { lastSample } = dive;
  
  // we can stay at 40 meters for ~10 minutes
  expect(lastSample.ndl).toEqual({
    compartment: '2',
    gas: 'n2',
    value: 10.097413217365236,
  });

  dive.addSample({ depth: 0, intervalTime: 4 });
  lastSample = dive.lastSample;

  expect(lastSample.tissues).toEqual({
    '1': { n2: 1.6916082557197374, he: 0 },
    '2': { n2: 1.3690760311998016, he: 0 },
    '3': { n2: 1.1896024558572034, he: 0 },
    '4': { n2: 1.0664343407678096, he: 0 },
    '5': { n2: 0.9768692204227243, he: 0 },
    '6': { n2: 0.9154161210823872, he: 0 },
    '7': { n2: 0.8702126768354503, he: 0 },
    '8': { n2: 0.8373185889783485, he: 0 },
    '9': { n2: 0.8137154569410825, he: 0 },
    '10': { n2: 0.7991153778133366, he: 0 },
    '11': { n2: 0.7896010200413173, he: 0 },
    '12': { n2: 0.7821838568099224, he: 0 },
    '13': { n2: 0.7763842040474742, he: 0 },
    '14': { n2: 0.7717896921204215, he: 0 },
    '15': { n2: 0.7682038439335201, he: 0 },
    '16': { n2: 0.7654037434906513, he: 0 },
    '1b': { n2: 1.5888439593763515, he: 0 },
  });
});