import ZHL16B from './ZHL16B';
import { AIR } from './GasMix';
import SampleTissue from './SampleTissue';
import tts from './tts';

import type GasMix from './GasMix';
import type GasCompartment from './GasCompartment';
import type { GradientFactor } from './Dive';

/**
 * A type representing the ascent ceiling at the moment of the sample
 * @typedef AscentCeiling
 * @property depth - The depth in which one can ascend to before needing a
 *   stop
 * @property gasCompartment - An object representing the leading compartment
 *   responsible for the ascent celing depth
 */
type AscentCeiling = {
  depth: number;
  gasCompartment: GasCompartment;
};

/**
 * A type representing the ndl at the moment of the sample
 * @typedef NDL
 * @property value - The number of seconds one can stay at current depth before
 *   needing to ascend without needing decompression stops
 * @property gasCompartment - An object representing the leading compartment
 *   responsible for the ndl value
 */
type NDL = {
  value: number;
  gasCompartment: GasCompartment;
};

/**
 * A type representing the current state of tissue tension of inert gases in
 *   a compartment
 * @typedef TissueCompartment
 * @property he - An object representing the tissue tension of helium in a
 *   compartment
 * @property n2 - An object representing the tissue tension of nitrogen in a
 *   compartment
 */
type TissueCompartment = {
  he: SampleTissue;
  n2: SampleTissue;
};

/**
 * A type representing a set of tissues keyed by the compartment number
 * @typedef Tissues
 * @property compartment - An object representing the current state of tissue
 *   tension of inert gases in the associated compartment
 */
type Tissues = {
  [compartment: string]: TissueCompartment;
};

/** A class representing a sample (a moment in time) during a dive */
export default class Sample {
  depth: number;
  gasMix: GasMix;
  time: number;
  gasSwitch: GasMix;
  gradientFactor: GradientFactor;
  tissues: Tissues;
  ndl?: NDL;

  /**
   * Create a sample
   * @constructor
   * @param depth - The depth associated with the sample
   * @param gasMix - The gas mix used during the interval ending in this sample
   * @param gradientFactor - An object containing the high and low gradient
   *   factor values
   * @param time - The total elapsed time within the dive scope
   * @param tissues - (optional) the pre-calculated tissues for this sample
   */
  constructor({
    depth,
    gradientFactor,
    gasMix,
    gasSwitch,
    time,
    tissues,
  }: {
    depth: number;
    gasMix: GasMix;
    time: number;
    gasSwitch?: GasMix;
    gradientFactor: GradientFactor;
    tissues?: Tissues;
  }) {
    Object.assign(this, { depth, gasMix, gasSwitch, gradientFactor, tissues });

    if (time === 0) {
      // all tissues fully saturated with air
      const initalN2Pressure = AIR.n2.alveolarPressure({ depth: 0 });

      this.tissues = ZHL16B.reduce((tissues, gasCompartment) => {
        const { inertGas, compartment } = gasCompartment;
        tissues[compartment] = tissues[compartment] || {};

        const initialPressure = inertGas === 'he' ? 0 : initalN2Pressure;

        tissues[compartment][inertGas] = new SampleTissue({
          pressure: initialPressure,
          gasMix,
          gasCompartment,
          gradientFactor,
          endDepth: 0,
        });
        return tissues;
      }, {});
    }
  }

  /**
   * The max ascent ceiling at the time of the sample
   * @return An ascent ceiling object containg the depth and gas compartment or
   *   null
   */
  ascentCeiling = (): AscentCeiling | null => {
    const ascentCeiling = ZHL16B.reduce(
      (maxAscentCeiling, gasCompartment) => {
        const { compartment, inertGas } = gasCompartment;
        const sampleTissue = this.tissues[compartment][inertGas];
        const ascentCeiling = sampleTissue.ascentCeiling();

        return maxAscentCeiling.depth < ascentCeiling
          ? { depth: ascentCeiling, gasCompartment }
          : maxAscentCeiling;
      },
      { depth: 0, gasCompartment: null },
    );
    return ascentCeiling.depth === 0 ? null : ascentCeiling;
  };

  /**
   * Creates a new sample using the current sample as the previous sample
   * @param depth - The depth associated with the next sample
   * @param intervalTime - The time elapsed since this sample's time
   * @param gasSwitch - The gasMix to switch to at the moment of the next sample
   * @param usePreviousGFLowDepth - Whether to use a previously defined gradient
   *   factor low depth, like when calculating decompression stups
   * @param gradientFactor - An object containing the high and low gradient
   *   factor values
   */
  createNextSample = ({
    depth,
    intervalTime,
    gasSwitch,
    usePreviousGFLowDepth,
    gradientFactor,
  }: {
    depth: number;
    intervalTime: number;
    gasSwitch?: GasMix;
    usePreviousGFLowDepth?: true;
    gradientFactor?: GradientFactor;
  }) => {
    const gasMix = this.gasSwitch || this.gasMix;

    const nextTissues = ZHL16B.reduce((tissues, gasCompartment) => {
      const { compartment, inertGas } = gasCompartment;
      tissues[compartment] = tissues[compartment] || {};

      const previousSampleTissue = this.tissues[compartment][inertGas];

      tissues[compartment][inertGas] = new SampleTissue({
        startTissuePressure: previousSampleTissue.pressure,
        gasMix,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        gasCompartment,
        gradientFactor: gradientFactor || this.gradientFactor,
        gfLowDepth: usePreviousGFLowDepth && previousSampleTissue.gfLowDepth,
      });

      return tissues;
    }, {});

    return new Sample({
      depth,
      gasMix,
      gasSwitch,
      time: this.time + intervalTime,
      tissues: nextTissues,
      gradientFactor: gradientFactor || this.gradientFactor,
    });
  };

  /** Time one can wait at current depth before needing to ascend to surface
   *    safely (without exceeding M-values)
   *  @return object including that value and the leading gas compartment
   */
  noStopTime = (): NDL => {
    const noStopTime = ZHL16B.reduce(
      (minNoStopTime, gasCompartment) => {
        const { compartment, inertGas } = gasCompartment;
        const sampleTissue = this.tissues[compartment][inertGas];
        const noStopTime = sampleTissue.noStopTime();

        return minNoStopTime.value > noStopTime
          ? { value: noStopTime, gasCompartment }
          : minNoStopTime;
      },
      { value: Infinity, gasCompartment: null },
    );
    return noStopTime.value === Infinity ? null : noStopTime;
  };

  /** Time needed to wait at current depth in order to ascend to target depth
   *    safely (without exceeding M-values)
   *  @param targetDepth - next target depth
   *  @return time in minutes
   */
  stopTime = ({ targetDepth }: { targetDepth: number }): number =>
    ZHL16B.reduce((maxStopTime, { compartment, inertGas }) => {
      const sampleTissue = this.tissues[compartment][inertGas];
      const stopTime = sampleTissue.stopTime({ targetDepth });

      return maxStopTime < stopTime ? stopTime : maxStopTime;
    }, 0);

  /** Time needed to ascend to the surface using the most effecient
   *    decompression stops if at all necessary
   *  @param targetDepth - next target depth
   *  @return time in minutes
   */
  tts = (): number => tts({ sample: this, totalTime: 0 });
}
