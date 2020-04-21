import { Air } from '../Gas';
import Dive from '../Dive';
import tts from '../tts';


describe('tts', () => {
  it('changes at depth over time', () => {
    const dive = new Dive({
      gases: [Air],
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
  })
});