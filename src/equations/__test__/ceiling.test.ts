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
  expect(ascentCeilingPressure).toEqual(1.7328914724103326);

  // with a gradient factor

  describe('with a gradient factor', () => {
    const gfCeilingPressure = ascentCeiling({
      pComp: tissuePressure,
      a,
      b,
      gradientFactor: 0.4,
    });
    // ~15 meters
    expect(gfCeilingPressure).toEqual(2.5276324202111216);
  });

  describe('ascentCeilingSolvedForPComp', () => {
    it('should equal tissue pressure', () => {
      const pComp = ascentCeilingSolvedForPComp({
        pAmbTol,
        a,
        b,
      });

      expect(pComp).toEqual(3.261262022168834);
    });
  });
});

describe('help with tts', () => {
  const pAmbTol = ambientPressure(9 - 3);

  const pComp = ascentCeilingSolvedForPComp({
    pAmbTol,
    a,
    b,
  });

  expect(pComp).toEqual(3.0887783446967596);
});
