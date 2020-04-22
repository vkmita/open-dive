import GasMix from '../GasMix';

describe('GasMix', () => {
  it('automatically creates n2, he, and o2 gases', () => {
    const gasMix = new GasMix({ he: 0, o2: 0.21 });

    console.log(gasMix.he);

    expect(gasMix.he.ratio).toEqual(0);
    expect(gasMix.n2.ratio).toEqual(0.79);
    expect(gasMix.o2.ratio).toEqual(0.21);
  });
});
