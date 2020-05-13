'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var constants_1 = require('../../constants');
var pressure_1 = require('../pressure');
describe('pressure', function () {
  describe('alveolar', function () {
    it('subtracts from gas partial pressure', function () {
      var alv0 = pressure_1.alveolarPressure({
        ambientPressure: 1,
        gasRatio: 0.79,
      });
      expect(alv0).toEqual(0.744710384117);
    });
  });
  describe('ambient', function () {
    it('ambient pressure at depth', function () {
      expect(pressure_1.ambientPressure(0)).toEqual(constants_1.ATA);
    });
  });
  describe('pressure depth', function () {
    it('depth at an ambient pressure', function () {
      expect(pressure_1.ambientPressureDepth(constants_1.ATA)).toEqual(0);
    });
  });
});
