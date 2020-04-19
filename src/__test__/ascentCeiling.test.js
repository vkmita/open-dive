import ascentCeiling from '../ascentCeiling';
import ZHL16B from '../ZHL16B';

test('ascentCeiling', () => {
  const tissuePressure = 0.912248948856579;
  const compartment = ZHL16B[2]['n2'];

  const ascentCeilingPressure = ascentCeiling(tissuePressure, compartment);
  expect(ascentCeilingPressure).toEqual(-0.057161034714824414);
});
