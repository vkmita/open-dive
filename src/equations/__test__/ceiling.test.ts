import { ambientPressure } from '../pressure';
import { ascentCeiling, ascentCeilingSolvedForPComp } from '../ceiling';
import ZHL16B from '../../ZHL16B';

const { a, b } = ZHL16B[6];

describe('ascentCeiling', () => {
  const tissuePressure = 3.2612620221688347;
  const pAmbTol = 1.7328914724103321;

  // descent to 40, with 28 minutes at bottom
  const ascentCeilingPressure = ascentCeiling({
    pComp: tissuePressure,
    a,
    b,
  });
  // ~7 meters
  expect(ascentCeilingPressure).toEqual(pAmbTol);

  describe('ascentCeilingSolvedForPComp', () => {
    it('should equal tissue pressure', () => {
      const pComp = ascentCeilingSolvedForPComp({
        pAmbTol,
        a,
        b,
      });

      expect(pComp).toEqual(tissuePressure);
    });
  });
});

describe('help with tts', () => {
  const tissuePressure = 3.1631432796773904;
  const pAmbTol = ambientPressure(9 - 3);

  const pComp = ascentCeilingSolvedForPComp({
    pAmbTol,
    a,
    b,
  });

  expect(pComp).toEqual(3.08877834469676);
});
