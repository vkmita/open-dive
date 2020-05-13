'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var Gas_1 = require('../Gas');
describe('Gas', function () {
  var gas = new Gas_1.default({ ratio: 0.5, gas: 'o2' });
  test('a dumb gas', function () {
    expect(gas.ratio).toEqual(0.5);
    expect(gas.R({ startDepth: 0, endDepth: 1, time: 5 })).toEqual(
      0.009917896008999994,
    );
    expect(gas.alveolarPressure({ depth: 56 })).toEqual(3.25497156867);
  });
});
