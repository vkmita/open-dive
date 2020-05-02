import type GasCompartment from './GasCompartment';
import {
  ascentCeiling,
  ascentCeilingSolvedForPComp,
} from './equations/ceiling';
import schreiner, {
  solvedForTime as schreinerSolvedForTime,
} from './equations/schreiner';
import noDecompressionLimit from './equations/noDecompressionLimit';
import { ambientPressureDepth, ambientPressure } from './equations/pressure';
import GasMix from './GasMix';
import { MAX_ASCENT_RATE } from './constants';

import type { GradientFactor } from './Dive';

// associated with a Sample
export default class SampleTissue {
  depth: number;
  gasMix: GasMix;
  gasCompartment: GasCompartment; // GasCompartment
  gradientFactor: GradientFactor;
  gfLowDepth: number;
  pressure: number;

  constructor({
    startTissuePressure, // bar
    gasMix, // 0 - 1, ex: .79
    gradientFactor,
    startDepth, // meters
    endDepth, // meters
    intervalTime, // minutes
    gasCompartment, // GasCompartment
    gfLowDepth,
    pressure,
  }: {
    startTissuePressure?: number; // bar
    gasMix: GasMix;
    startDepth?: number;
    endDepth: number;
    intervalTime?: number;
    gasCompartment: GasCompartment;
    gradientFactor: GradientFactor;
    gfLowDepth?: number;
    pressure?: number;
  }) {
    Object.assign(this, {
      depth: endDepth,
      gasMix,
      gasCompartment,
      gfLowDepth,
      gradientFactor,
      pressure,
    });

    // pressure can be 0, !pressure is no bueno
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

  noStopTime = (): number => {
    const { k, m0, inertGas } = this.gasCompartment;
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
  };

  maxGradientFactor = (): number => {
    const { a, b } = this.gasCompartment;
    const pComp = this.pressure;
    const { gradientFactor } = this;

    const gfLowDepth =
      this.gfLowDepth ||
      this.depth -
        (this.depth - ambientPressureDepth(ascentCeiling({ a, b, pComp }))) *
          gradientFactor.low;

    // 0 or NaN
    if (!gfLowDepth) return gradientFactor.high;

    return (
      gradientFactor.high -
      ((gradientFactor.high - gradientFactor.low) / gfLowDepth) * this.depth
    );
  };

  ascentCeiling = (): number => {
    const { a, b } = this.gasCompartment;
    const pComp = this.pressure;

    const gradientFactor = this.maxGradientFactor();

    const maxAscentPressure = ascentCeiling({ a, b, pComp, gradientFactor });

    if (!maxAscentPressure) return 0;

    // we need to round here after adding gradient factors :/
    // TODO: figure out the math that's causing this
    return Number(ambientPressureDepth(maxAscentPressure).toFixed(4));
  };

  // time needed to wait at current depth to ascend without exceeding mvalues
  stopTime = ({ targetDepth }: { targetDepth: number }): number => {
    const { a, b, inertGas, k } = this.gasCompartment;
    const targetDepthPressure = ambientPressure(targetDepth);
    const gas = this.gasMix[inertGas];

    const pComp = ascentCeilingSolvedForPComp({
      a,
      b,
      pAmbTol: targetDepthPressure,
      gradientFactor: this.maxGradientFactor(),
    });

    return schreinerSolvedForTime({
      k,
      ptt: pComp,
      p0: this.pressure,
      pAlv: gas.alveolarPressure({ depth: this.depth }),
    });
  };
}
