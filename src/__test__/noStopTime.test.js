import noStopTime from '../noStopTime';
import ZHL16B from '../ZH-L16B';

test('noStopTime', () => {
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