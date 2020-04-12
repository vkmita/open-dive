import alveolarGasPressure from '../alveolarPressure';
import tissuePressure from '../tissuePressure';
import ZH_L16B from '../ZH-L16B';

test('tissuePressure', () => {
  const gasRatio = 0.45;
  const startAlviolarPressure = alveolarGasPressure(1, gasRatio);
  const startTissuePressure = 0;

  const startDepth = 0;
  const endDepth = 26.7716711766;
  const intervalTime = 2;
  const halfTime = ZH_L16B[0].heHalftime;

  const endTissuePressure = tissuePressure(
    startAlviolarPressure,
    startTissuePressure,
    gasRatio,
    startDepth,
    endDepth,
    intervalTime,
    halfTime,
  );

  console.log(endTissuePressure);
});
