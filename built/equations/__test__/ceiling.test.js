'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var pressure_1 = require('../pressure');
var ceiling_1 = require('../ceiling');
var ZHL16B_1 = require('../../ZHL16B');
var _a = ZHL16B_1.default[6],
  a = _a.a,
  b = _a.b;
describe('ascentCeiling', function () {
  var tissuePressure = 3.2612620221688347;
  var pAmbTol = 1.7328914724103321;
  // descent to 40, with 28 minutes at bottom
  var ascentCeilingPressure = ceiling_1.ascentCeiling({
    pComp: tissuePressure,
    a: a,
    b: b,
  });
  // ~7 meters
  expect(ascentCeilingPressure).toEqual(1.7328914724103326);
  // with a gradient factor
  describe('with a gradient factor', function () {
    var gfCeilingPressure = ceiling_1.ascentCeiling({
      pComp: tissuePressure,
      a: a,
      b: b,
      gradientFactor: 0.4,
    });
    // ~15 meters
    expect(gfCeilingPressure).toEqual(2.5276324202111216);
  });
  describe('ascentCeilingSolvedForPComp', function () {
    it('should equal tissue pressure', function () {
      var pComp = ceiling_1.ascentCeilingSolvedForPComp({
        pAmbTol: pAmbTol,
        a: a,
        b: b,
      });
      expect(pComp).toEqual(3.261262022168834);
    });
  });
});
describe('help with tts', function () {
  var pAmbTol = pressure_1.ambientPressure(9 - 3);
  var pComp = ceiling_1.ascentCeilingSolvedForPComp({
    pAmbTol: pAmbTol,
    a: a,
    b: b,
  });
  expect(pComp).toEqual(3.0887783446967596);
});
