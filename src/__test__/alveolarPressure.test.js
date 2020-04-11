import alveolarPressure from '../alveolarPressure';

test('alveolarPressure', () => {
  const helium = 0.45;
  const heliumInAlveoli = alveolarPressure(1, helium);

  console.log(heliumInAlveoli);
});
