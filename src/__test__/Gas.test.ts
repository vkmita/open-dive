import Gas, { Air } from '../Gas';

describe('Gas', () => {
  it('automatically sets n2 and MaxPP02 and mod', () => {
    const gas = new Gas({ he: 0, o2: .21, type: 'back' });

    expect(gas.n2).toEqual(.79);
    expect(gas.maxPPo2).toEqual(1.4);
    expect(gas.mod).toEqual(6.666666666666666);
  });
});