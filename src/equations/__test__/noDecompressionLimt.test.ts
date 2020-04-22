import { AIR } from '../../GasMix';
import ZHL16B from '../../ZHL16B';
import noDecompressionLimit from '../noDecompressionLimit';

describe('noDecompressionLimit', () => {
  it('returns time until cannot ascend', () => {
    const gasCompartment = ZHL16B[4];

    const m0 = gasCompartment.m0;
    const pAlv = AIR.n2.alveolarPressure({ depth: 40 });
    const R = AIR.n2.R({ startDepth: 40, endDepth: 0, time: 2 });
    const k = gasCompartment.k;
    const tAsc = 4;

    const ndl = noDecompressionLimit({
      m0,
      pAlv,
      R,
      k,
      tAsc,
    });

    expect(ndl).toEqual(3.3760474238392);
  });
});
