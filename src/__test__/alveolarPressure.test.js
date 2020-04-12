import alveolarPressure from '../alveolarPressure';

test('alveolarPressure', () => {
  const helium = 0.45;
  const heliumInAlveoli = alveolarPressure(1, helium);

  expect(heliumInAlveoli).toEqual(0.41700270847500004)
});
