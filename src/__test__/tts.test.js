import Dive from '../Dive';
import tts from '../tts';

test('tts', () => {
  const dive = new Dive({
    gases: [{
      he: 0,
      n2: 0.79,
    }],
  });
  
  dive.addSample({
    depth: 40,
    intervalTime: 2,
  });

  let lastSample = dive.lastSample;
  expect(tts(lastSample)).toEqual(4);

  dive.addSample({
    depth: 40,
    intervalTime: 28,
  });

  lastSample = dive.lastSample;
  expect(tts(lastSample)).toEqual(27);
});
