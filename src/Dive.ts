import { AIR } from './GasMix';
import Sample from './Sample';
import GasMix from './GasMix';

/**
 * A type representing a gradient factor
 * @typedef GradientFactor
 * @property high - The gradient factor high value
 * @property low - The gradient factor low value
 */
export type GradientFactor = {
  high: number;
  low: number;
};

/** Class representing a dive */
export default class Dive {
  surfaceInterval?: number;
  gases: Array<GasMix>;
  samples: Array<Sample>;

  /**
   * Create a dive
   * @param surfaceInterval - The time since the previous dive in minutes
   *   (optional)
   * @param gases - The gases available during the dive
   * @param gradientFactor - An object containing the high and low gradient
   *   factor values
   */
  constructor({
    surfaceInterval,
    gases,
    samples,
    gradientFactor = {
      high: 1,
      low: 1,
    },
  }: {
    surfaceInterval?: number;
    gases: Array<GasMix>;
    samples?: Array<Sample>;
    gradientFactor?: GradientFactor;
  }) {
    Object.assign(this, {
      surfaceInterval,
      gradientFactor,
      gases,
      samples,
    });

    // for now just use the first gas
    // TODO: gas switches
    if (!this.surfaceInterval) {
      const {
        gases: [initialGas],
      } = this;
      this.samples = [
        new Sample({
          depth: 0,
          gasMix: AIR,
          time: 0,
          gasSwitch: initialGas,
          gradientFactor,
        }),
      ];
    }
  }

  /**
   * Creates a sample and adds it to the current array of samples on the dive
   * @param intervalTime - The time since the previous sample in minutes
   * @param gaseSwitch - The gas that is switched to at the moment of the sample
   * @param depth - the depth of the smple
   */
  addSample = ({
    depth,
    intervalTime,
    gasSwitch,
  }: {
    depth: number;
    intervalTime: number;
    gasSwitch?: GasMix;
  }): void => {
    const nextSample = this.lastSample().createNextSample({
      depth,
      intervalTime,
      gasSwitch,
    });
    this.samples.push(nextSample);
  };

  /**
   * Creates a next dive taking into account the end tissue pressures from the
   *   previous dive
   * @param surfaceInterval - The time since the previous dive in minutes
   * @param gases - The gases available during the next dive
   * @param gradientFactor - An object containing the high and low gradient
   *   factor values for the next dive
   * @return - The newly created dive
   */
  createNextDive = ({
    surfaceInterval,
    gases,
    gradientFactor,
  }: {
    surfaceInterval: number;
    gases: Array<GasMix>;
    gradientFactor: GradientFactor;
  }): Dive => {
    const numberOfSamples = this.samples.length;

    if (numberOfSamples === 1) {
      throw new Error('The dive needs to end');
    }

    const lastSample = this.lastSample();
    if (lastSample.depth !== 0) {
      throw new Error('The dive needs to end');
    }

    const [initialGas] = gases;

    const initialSample = lastSample.createNextSample({
      depth: 0,
      intervalTime: surfaceInterval,
      gasSwitch: initialGas,
      gradientFactor,
    });

    return new Dive({
      surfaceInterval,
      gases,
      samples: [initialSample],
    });
  };

  /**
   * @return - The last (most recent) sample
   */
  lastSample = (): Sample => this.samples[this.samples.length - 1];
}
