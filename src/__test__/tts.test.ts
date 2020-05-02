import { AIR } from '../GasMix';
import Dive from '../Dive';
import tts from '../tts';

describe('tts', () => {
  it('changes at depth over time', () => {
    const dive = new Dive({
      gases: [AIR],
    });

    dive.addSample({
      depth: 40,
      intervalTime: 2,
    });

    let lastSample = dive.lastSample();

    expect(tts({ sample: lastSample, totalTime: 0 })).toEqual(4);

    dive.addSample({
      depth: 40,
      intervalTime: 28,
    });

    lastSample = dive.lastSample();

    expect(tts({ sample: lastSample, totalTime: 0 })).toEqual(
      28.85601093908624,
    );
  });
});
