import { alveolarPressure, ambientPressure } from '../pressure';
import AIR from '../../Air';
import ZHL16B from '../../ZHL16B';
import schreiner, { solvedForTime } from '../schreiner';

describe('schreiner', () => {
  it('returns a new tissue pressure', () => {
    let p0 = AIR.n2;
    let pAlv = AIR.surfaceN2AlveolarPressure();
    let R = AIR.R({ startDepth: 0, endDepth: 40, time: 2, gas: 'n2' });
    let k = ZHL16B[4].k;
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
    pAlv = alveolarPressure({
      ambientPressure: ambientPressure(40),
      gasRatio: AIR.n2,
    });
    R = AIR.R({ startDepth: 40, endDepth: 40, time: 28, gas: 'n2' });
    k = ZHL16B[4].k;
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
    const p0 = 1.040976414487826;
    const pAlv0 = alveolarPressure({
      ambientPressure: ambientPressure(40),
      gasRatio: AIR.n2,
    });
    const k = ZHL16B[4].k;
    const ptt = 3.637480327659653;

    const t = solvedForTime({
      ptt,
      p0,
      pAlv0,
      k,
    });

    expect(t).toEqual(28);
  });
});
