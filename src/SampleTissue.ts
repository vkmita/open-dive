import type GasCompartment from './GasCompartment';
import { ATA } from './constants';
import { ascentCeiling } from './equations/ceiling';
import schreiner, {
  solvedForTime as schreinerSolvedForTime,
} from './equations/schreiner';
import noDecompressionLimit from './equations/noDecompressionLimit';
import { ambientPressureDepth } from './equations/pressure';
import GasMix from './GasMix';
import { MAX_ASCENT_RATE } from './constants';

// associated with a Sample
export default class SampleTissue {
  depth: number;
  gasMix: GasMix;
  gasCompartment: GasCompartment; // GasCompartment
  pressure: number;

  constructor({
    startTissuePressure, // bar
    gasMix, // 0 - 1, ex: .79
    startDepth, // meters
    endDepth, // meters
    intervalTime, // minutes
    gasCompartment, // GasCompartment
    pressure,
  }: {
    startTissuePressure?: number; // bar
    gasMix: GasMix;
    startDepth?: number;
    endDepth: number;
    intervalTime?: number;
    gasCompartment: GasCompartment;
    pressure?: number;
  }) {
    Object.assign(this, { depth: endDepth, gasMix, gasCompartment, pressure });

    // pressure an be 0, !pressure is no bueno
    if (pressure == null) {
      const { inertGas } = gasCompartment;
      const gas = gasMix[inertGas];

      const R = gas.R({ startDepth, endDepth, time: intervalTime });
      // meters / minute
      const startAlviolarPressure = gas.alveolarPressure({ depth: startDepth });

      this.pressure = schreiner({
        pAlv: startAlviolarPressure,
        R,
        p0: startTissuePressure,
        k: gasCompartment.k,
        t: intervalTime,
      });
    }
  }

  noStopTime() {
    const { k, m0, inertGas, compartment } = this.gasCompartment;
    const gas = this.gasMix[inertGas];

    // alveolar pressure at the surface
    const pAlv = gas.alveolarPressure({ depth: this.depth });
    // time needed to ascend to the surface
    const tAsc = this.depth / MAX_ASCENT_RATE;

    // the no decompression limit equation
    // max partial pressure of gas the tissue can have at the current depth
    const maxPressureAtDepth = noDecompressionLimit({
      k,
      m0,
      R: gas.R({
        startDepth: this.depth,
        endDepth: 0,
        time: tAsc,
      }),
      pAlv,
      tAsc: this.depth / MAX_ASCENT_RATE,
    });

    // we never hit a no stop time
    if (maxPressureAtDepth > pAlv) return Number.MAX_VALUE;

    const noStopTime = schreinerSolvedForTime({
      k,
      ptt: maxPressureAtDepth,
      p0: this.pressure,
      pAlv,
    });

    return noStopTime < 0 ? 0 : noStopTime;
  }

  ascentCeiling() {
    const { a, b } = this.gasCompartment;
    const pComp = this.pressure;

    const maxAscentPressure = ascentCeiling({ a, b, pComp });

    if (maxAscentPressure < ATA) return 0;
    return ambientPressureDepth(maxAscentPressure);
  }
}
