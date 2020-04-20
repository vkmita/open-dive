import alveolarGasPressure from '../alveolarPressure';
import absolutePressure from '../equations/absolutePressure';
import tissuePressure from '../tissuePressure';
import ZH_L16B from '../ZHL16B';

test('helium', () => {
  const gasRatio = 0.45;
  const startTissuePressure = 0;

  const startDepth = 0;
  const endDepth = 26.7716711766;
  const intervalTime = 2;
  const halfTime = ZH_L16B[1].he.halfTime;

  const endTissuePressure = tissuePressure({
    startTissuePressure,
    gasRatio,
    startDepth,
    endDepth,
    intervalTime,
    halfTime,
  });

  expect(endTissuePressure).toEqual(0.6714383659133543);
});

test('n2 after descending to 40', () => {
  const gasRatio = 0.79;
  const startTissuePressure = alveolarGasPressure(
    absolutePressure(0),
    gasRatio,
  );

  const startDepth = 0;
  const endDepth = 40;
  const intervalTime = 2;
  const halfTime = ZH_L16B[3].n2.halfTime;

  const endTissuePressure = tissuePressure({
    startTissuePressure,
    gasRatio,
    startDepth,
    endDepth,
    intervalTime,
    halfTime,
  });

  expect(endTissuePressure).toEqual(0.9227164488565798);
});
