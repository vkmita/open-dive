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

/**
 * A class representing a tissue's relationship with an inert gas at the
 * moment of a sample
 */
export default class SampleTissue {
  depth: number;
  gasMix: GasMix;
  gasCompartment: GasCompartment;
  gradientFactor: GradientFactor;
  gfLowDepth: number;
  pressure: number;

  /**
   * Create a sample tissue
   * @constructor
   * @param endDepth The depth at the moment of the sample
   * @param gasCompartment The gas compartment associated with the tissue
   * @param gasMix The gas mix being breathed
   * @param gfLowDepth The low depth to use for gradient factor calculations
   * @param gradientFactor The gradient factors set for the dive
   * @param intervalTime The time since the last sample
   * @param pressure The pressure of the tissue
   * @param startDepth The depth at the moment of the last sample
   * @param startTissuePressure The pressure at the moment of the last sample
   */
  constructor({
    endDepth,
    gasCompartment,
    gasMix,
    gfLowDepth,
    gradientFactor,
    intervalTime,
    pressure,
    startDepth,
    startTissuePressure,
  }: {
    endDepth: number;
    gasCompartment: GasCompartment;
    gasMix: GasMix;
    gfLowDepth?: number;
    gradientFactor: GradientFactor;
    intervalTime?: number;
    startDepth?: number;
    startTissuePressure?: number;
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

    if (pressure == null) {
      const { inertGas } = gasCompartment;
      const gas = gasMix[inertGas];

      const R = gas.R({ startDepth, endDepth, time: intervalTime });
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

  /**
   * The time one can stay at the current depth until needing to ascend without
   *   breaking M-values
   * @returns number in minutes
   */
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

  /**
   * The max gradient factor for the current depth and tissue
   * @returns A gradient factor for the current depth
   */
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

  /**
   * The depth in which one can ascend to without breaking M-values
   * @returns The depth in meters
   */
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

  /**
   * Calculate time needed to wait at current depth to ascend to the target
   *   depth without exceeding mvalues
   * @returns The time in minutes
   */
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
