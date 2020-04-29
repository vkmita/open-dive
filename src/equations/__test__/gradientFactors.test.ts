import { maxGradientFactor } from '../gradientFactors';

describe('maxGradientFactor', () => {
  describe('100/100', () => {
    it('should be 100', () => {
      const highGF = 100;
      const lowGF = 100;
      const currentDepth = 30;
      const lowGFDepth = 30;

      const maxGF = maxGradientFactor({
        highGF,
        lowGF,
        currentDepth,
        lowGFDepth,
      });

      expect(maxGF).toEqual(100);
    });
    describe('0/0', () => {
      it('should be 0', () => {
        const highGF = 0;
        const lowGF = 0;
        const currentDepth = 30;
        const lowGFDepth = 30;

        const maxGF = maxGradientFactor({
          highGF,
          lowGF,
          currentDepth,
          lowGFDepth,
        });

        expect(maxGF).toEqual(0);
      });
    });
    describe('40/80', () => {
      it('should be 0', () => {
        const highGF = 80;
        const lowGF = 40;
        const lowGFDepth = 40;

        let maxGF = maxGradientFactor({
          highGF,
          lowGF,
          currentDepth: 40,
          lowGFDepth,
        });
        expect(maxGF).toEqual(40);

        maxGF = maxGradientFactor({
          highGF,
          lowGF,
          currentDepth: 20,
          lowGFDepth,
        });
        expect(maxGF).toEqual(60);

        maxGF = maxGradientFactor({
          highGF,
          lowGF,
          currentDepth: 0,
          lowGFDepth,
        });
        expect(maxGF).toEqual(80);
      });
    });
  });
});
