import { ascentCeiling } from '../ceiling';
import ZHL16B from '../../ZHL16B';

test('ascentCeiling', () => {
  const tissuePressure = 0.912248948856579;
  const gasCompartment = ZHL16B[4];

  const ascentCeilingPressure = ascentCeiling({
    pComp: tissuePressure,
    a: gasCompartment.a,
    b: gasCompartment.b,
  });
  expect(ascentCeilingPressure).toEqual(-0.057161034714824414);
});
