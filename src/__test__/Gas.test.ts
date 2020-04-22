import Gas from '../Gas';

describe('Gas', () => {
  const gas = new Gas({ ratio: 0.5, gas: 'o2' });
  test('a dumb gas', () => {
    expect(gas.ratio).toEqual(0.5);

    expect(gas.R({ startDepth: 0, endDepth: 1, time: 5 })).toEqual(
      0.009917896008999994,
    );

    expect(gas.alveolarPressure({ depth: 56 })).toEqual(3.25497156867);
  });
});
