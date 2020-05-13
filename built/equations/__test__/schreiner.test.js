'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var GasMix_1 = require('../../GasMix');
var ZHL16B_1 = require('../../ZHL16B');
var schreiner_1 = require('../schreiner');
describe('schreiner', function () {
  it('returns a new tissue pressure', function () {
    var gas = GasMix_1.AIR.n2;
    var gasCompartment = ZHL16B_1.default[4];
    var p0 = gas.ratio;
    var pAlv = gas.alveolarPressure({ depth: 0 });
    var R = gas.R({ startDepth: 0, endDepth: 40, time: 2 });
    var k = gasCompartment.k;
    var t = 2;
    var ptt = schreiner_1.default({
      p0: p0,
      pAlv: pAlv,
      R: R,
      k: k,
      t: t,
    });
    expect(ptt).toEqual(1.040976414487826);
    p0 = 1.040976414487826;
    pAlv = gas.alveolarPressure({ depth: 40 });
    R = gas.R({ startDepth: 40, endDepth: 40, time: 28 });
    t = 28;
    ptt = schreiner_1.default({
      p0: p0,
      pAlv: pAlv,
      R: R,
      k: k,
      t: t,
    });
    expect(ptt).toEqual(3.637480327659653);
  });
  describe('solvedForTime', function () {
    it('returns time needed to get to a ptt pressure', function () {
      var p0 = 1.040976414487826;
      var pAlv = GasMix_1.AIR.n2.alveolarPressure({ depth: 40 });
      var k = ZHL16B_1.default[4].k;
      var ptt = 3.637480327659653;
      var t = schreiner_1.solvedForTime({
        ptt: ptt,
        p0: p0,
        pAlv: pAlv,
        k: k,
      });
      expect(t).toEqual(28);
    });
    it('helps with tts', function () {
      var p0 = 1.040976414487826;
      var pAlv = GasMix_1.AIR.n2.alveolarPressure({ depth: 40 });
      var k = ZHL16B_1.default[4].k;
      var ptt = 3.637480327659653;
      var t = schreiner_1.solvedForTime({
        ptt: ptt,
        p0: p0,
        pAlv: pAlv,
        k: k,
      });
      expect(t).toEqual(28);
    });
  });
});
