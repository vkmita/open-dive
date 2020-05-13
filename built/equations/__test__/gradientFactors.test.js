'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var gradientFactors_1 = require('../gradientFactors');
describe('maxGradientFactor', function () {
  describe('100/100', function () {
    it('should be 100', function () {
      var highGF = 100;
      var lowGF = 100;
      var currentDepth = 30;
      var lowGFDepth = 30;
      var maxGF = gradientFactors_1.maxGradientFactor({
        highGF: highGF,
        lowGF: lowGF,
        currentDepth: currentDepth,
        lowGFDepth: lowGFDepth,
      });
      expect(maxGF).toEqual(100);
    });
    describe('0/0', function () {
      it('should be 0', function () {
        var highGF = 0;
        var lowGF = 0;
        var currentDepth = 30;
        var lowGFDepth = 30;
        var maxGF = gradientFactors_1.maxGradientFactor({
          highGF: highGF,
          lowGF: lowGF,
          currentDepth: currentDepth,
          lowGFDepth: lowGFDepth,
        });
        expect(maxGF).toEqual(0);
      });
    });
    describe('40/80', function () {
      it('should be 0', function () {
        var highGF = 80;
        var lowGF = 40;
        var lowGFDepth = 40;
        var maxGF = gradientFactors_1.maxGradientFactor({
          highGF: highGF,
          lowGF: lowGF,
          currentDepth: 40,
          lowGFDepth: lowGFDepth,
        });
        expect(maxGF).toEqual(40);
        maxGF = gradientFactors_1.maxGradientFactor({
          highGF: highGF,
          lowGF: lowGF,
          currentDepth: 20,
          lowGFDepth: lowGFDepth,
        });
        expect(maxGF).toEqual(60);
        maxGF = gradientFactors_1.maxGradientFactor({
          highGF: highGF,
          lowGF: lowGF,
          currentDepth: 0,
          lowGFDepth: lowGFDepth,
        });
        expect(maxGF).toEqual(80);
      });
    });
  });
});
