import AIR from '../../Air';
import ZHL16B from '../../ZHL16B';
import { alveolarPressure, ambientPressure } from '../pressure';
import noDecompressionLimit from '../noDecompressionLimit';

describe('noDecompressionLimit', () => {
  it('returns time until cannot ascend', () => {
    const gasCompartment = ZHL16B[4];

    const m0 = gasCompartment.m0;
    const pAlv0 = alveolarPressure({
      ambientPressure: ambientPressure(40),
      gasRatio: AIR.n2,
    });
    const R = AIR.R({ startDepth: 40, endDepth: 0, time: 2, gas: 'n2' });
    const k = gasCompartment.k;
    const tAsc = 4;

    const ndl = noDecompressionLimit({
      m0,
      pAlv0,
      R,
      k,
      tAsc,
    });

    expect(ndl).toEqual(3.3760474238392);
  });
});
