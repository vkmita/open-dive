import { ATA } from '../../constants';
import { 
  alveolarPressure, 
  ambientPressure, 
  ambientPressureDepth,
} from '../pressure';

describe('pressure', () => {
  describe('alveolar', () => {
    it('subtracts from gas partial pressure', () => {
      const alv0 = alveolarPressure({
        ambientPressure: 1, 
        gasRatio: 0.79,
      });
    
      expect(alv0).toEqual(0.744710384117);
    });
  });

  describe('ambient', () => {
    it('ambient pressure at depth', () => {
      expect(ambientPressure(0)).toEqual(ATA);
    });
  });

  describe('pressure depth', () => {
    it('depth at an ambient pressure', () => {
      expect(ambientPressureDepth(ATA)).toEqual(0);
    });
  });
});
