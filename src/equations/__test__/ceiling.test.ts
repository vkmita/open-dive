import { ascentCeiling } from '../ceiling';
import ZHL16B from '../../ZHL16B';

test('ascentCeiling', () => {
  const tissuePressure = 0.912248948856579;
  const { a, b } = ZHL16B[2]['n2'];

  const ascentCeilingPressure = ascentCeiling({ pComp: tissuePressure, a, b });
  expect(ascentCeilingPressure).toEqual(-0.057161034714824414);
});
