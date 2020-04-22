import { AIR } from '../../GasMix';
import ZHL16B from '../../ZHL16B';
import schreiner, { solvedForTime } from '../schreiner';

describe('schreiner', () => {
  it('returns a new tissue pressure', () => {
    const gas = AIR.n2;
    const gasCompartment = ZHL16B[4];

    let p0 = gas.ratio;
    let pAlv = gas.alveolarPressure({ depth: 0 });
    let R = gas.R({ startDepth: 0, endDepth: 40, time: 2 });
    let k = gasCompartment.k;
    let t = 2;

    let ptt = schreiner({
      p0,
      pAlv,
      R,
      k,
      t,
    });

    expect(ptt).toEqual(1.040976414487826);

    p0 = 1.040976414487826;
    pAlv = gas.alveolarPressure({ depth: 40 });
    R = gas.R({ startDepth: 40, endDepth: 40, time: 28 });
    t = 28;

    ptt = schreiner({
      p0,
      pAlv,
      R,
      k,
      t,
    });

    expect(ptt).toEqual(3.637480327659653);
  });

  describe('solvedForTime', () => {
    it('returns time needed to get to a ptt pressure', () => {
      const p0 = 1.040976414487826;
      const pAlv = AIR.n2.alveolarPressure({ depth: 40 });
      const k = ZHL16B[4].k;
      const ptt = 3.637480327659653;

      const t = solvedForTime({
        ptt,
        p0,
        pAlv,
        k,
      });

      expect(t).toEqual(28);
    });

    it('helps with tts', () => {
      const p0 = 1.040976414487826;
      const pAlv = AIR.n2.alveolarPressure({ depth: 40 });
      const k = ZHL16B[4].k;
      const ptt = 3.637480327659653;

      const t = solvedForTime({
        ptt,
        p0,
        pAlv,
        k,
      });

      expect(t).toEqual(28);
    });
  });
});
