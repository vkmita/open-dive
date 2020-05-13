'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var GasMix_1 = require('../../GasMix');
var ZHL16B_1 = require('../../ZHL16B');
var noDecompressionLimit_1 = require('../noDecompressionLimit');
describe('noDecompressionLimit', function () {
  it('returns time until cannot ascend', function () {
    var gasCompartment = ZHL16B_1.default[4];
    var m0 = gasCompartment.m0;
    var pAlv = GasMix_1.AIR.n2.alveolarPressure({ depth: 40 });
    var R = GasMix_1.AIR.n2.R({ startDepth: 40, endDepth: 0, time: 2 });
    var k = gasCompartment.k;
    var tAsc = 4;
    var ndl = noDecompressionLimit_1.default({
      m0: m0,
      pAlv: pAlv,
      R: R,
      k: k,
      tAsc: tAsc,
    });
    expect(ndl).toEqual(3.3760474238392);
  });
});
