import alveolarGasPressure from '../alveolarGasPressure';

test('alveolarGasPressure', () => {
  const helium = 0.45;
  const heliumInAlveoli = alveolarGasPressure(1, helium);

  console.log(heliumInAlveoli);
});
