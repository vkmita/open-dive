'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var GasMix_1 = require('../GasMix');
var Dive_1 = require('../Dive');
var tts_1 = require('../tts');
describe('tts', function () {
  it('changes at depth over time', function () {
    var dive = new Dive_1.default({
      gases: [GasMix_1.AIR],
    });
    dive.addSample({
      depth: 40,
      intervalTime: 2,
    });
    var lastSample = dive.lastSample();
    expect(tts_1.default({ sample: lastSample, totalTime: 0 })).toEqual(4);
    dive.addSample({
      depth: 40,
      intervalTime: 28,
    });
    lastSample = dive.lastSample();
    expect(tts_1.default({ sample: lastSample, totalTime: 0 })).toEqual(
      28.85601093908624,
    );
  });
});
