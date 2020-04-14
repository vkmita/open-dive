import noStopTime from '../noStopTime';
import ZHL16B from '../ZHL16B';

test('direct decent to 40', () => {
  // direct decent to 40 meters
  const depth = 40.0;
  const gasRatio = 0.79;
  const compartment = ZHL16B[2].n2
  const tissuePressure = 0.912248948856579;

  const ndls = noStopTime({
    compartment,
    depth,
    gasRatio,
    tissuePressure,
  });

  expect(ndls).toEqual(10.489543795972834);
})

  test('direct decent to 45', () => {
  // direct decent to 40 meters
  const depth = 45.0;
  const gasRatio = 0.79;
  const compartment = ZHL16B[2].n2
  const tissuePressure = 1.0670992600725278;

  const ndls = noStopTime({
    compartment,
    depth,
    gasRatio,
    tissuePressure,
  });

  expect(ndls).toEqual(7.672695470139803);
});