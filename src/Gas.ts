import {
  alveolarPressure,
  ambientPressure,
  rateOfPressureChange,
} from './equations/pressure';

/**
 * A class representing an individual gas in a mix
 */
export default class Gas {
  ratio: number;
  gas: 'he' | 'n2' | 'o2';

  /**
   * Create a gas
   * @constructor
   * @param ratio The ratio of gas
   * @param gas The type of gas
   */
  constructor({ ratio, gas }: { ratio: number; gas: 'he' | 'n2' | 'o2' }) {
    Object.assign(this, { ratio, gas });
  }

  /**
   * The alveolar pressure of the gas at a certain depth
   * @param depth The depth in meters
   * @returns The alveolar pressure at the depth
   */
  alveolarPressure = ({ depth }): number =>
    alveolarPressure({
      ambientPressure: ambientPressure(depth),
      gasRatio: this.ratio,
    });

  /**
   * Methos to ralculate the R in the Schreiner equation
   * @param startDepth The start depth in meters
   * @param endDepth The end depth in meters
   * @param time The time of the interval
   * @returns The R value of the Schreiner equation
   */
  R = ({
    startDepth,
    endDepth,
    time,
  }: {
    startDepth: number;
    endDepth: number;
    time: number;
  }): number =>
    rateOfPressureChange({
      startDepth,
      endDepth,
      time,
    }) * this.ratio;
}
