import GasCompartment from '../GasCompartment';

describe('GasCompartment', () => {
  // compartment 3
  const gasCompartment = new GasCompartment({
    compartment: '3',
    inertGas: 'n2',
    halfTime: 12.5,
    a: 0.8618,
    b: 0.7222,
  });

  it('is a compartment with good calcs', () => {
    expect(gasCompartment).toEqual({
      a: 0.8618,
      b: 0.7222,
      compartment: '3',
      halfTime: 12.5,
      inertGas: 'n2',
      k: 0.055451774444795626,
      m0: 2.2648047078371643,
    });
  });
});
