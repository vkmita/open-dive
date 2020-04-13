import alveolarPressure from '../alveolarPressure';

test('helium', () => {
  const helium = 0.45;
  const heliumInAlveoli = alveolarPressure(1, helium);

  expect(heliumInAlveoli).toEqual(0.424202117535);
});

test('air nitrogen at surface', () => {
  const nitrogen = 0.79;
  const notrogenInAlveoli = alveolarPressure(1, nitrogen);

  expect(notrogenInAlveoli).toEqual(0.744710384117)
});
