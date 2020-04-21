import Sample from './Sample';
import Gas, { Air } from './Gas';

type DiveArgs = {
  surfaceInterval?: number,
  gases: Array<Gas>,
  lastSample?: Sample,
  samples?: Array<Sample>,
}

export default class Dive {
  surfaceInterval?: number;
  gases: Array<Gas>;
  lastSample: Sample;
  samples: Array<Sample>;

  // TODO please add TypeScript
  constructor(args: DiveArgs) {
    Object.assign(this, args);

    // for now just use the first gas
    // TODO: gas switches
    if (!this.surfaceInterval) {
      const { gases: [initialGas] } = this;
      this.lastSample = new Sample({ 
        depth: 0, 
        gas: Air,
        time: 0,
        gasSwitch: initialGas,
      }),
      this.samples = [this.lastSample];
    }
  }

  createNextDive = (
    { surfaceInterval, gases }: 
    { surfaceInterval: number, gases: Array<Gas> }
  ): Dive => {
    const numberOfSamples = this.samples.length;
    
    if (numberOfSamples === 1) {
      throw new Error('The dive needs to end')
    }

    const { lastSample } = this;
    if (lastSample.depth !== 0) {
      throw new Error('The dive needs to end');
    }

    const { gases: [initialGas] } = this;

    const initialSample = lastSample.createNextSample({
      depth: 0,
      intervalTime: surfaceInterval,
      gasSwitch: initialGas,
    });

    return new Dive({
      surfaceInterval,
      gases,
      lastSample: initialSample,
      samples: [initialSample],
    })
  }

  addSample = (
    { depth, intervalTime, gasSwitch }:
    { depth: number, intervalTime: number, gasSwitch?: Gas }
  ): void => {
    const nextSample = this.lastSample.createNextSample({
      depth, 
      intervalTime, 
      gasSwitch,
    });
    this.lastSample = nextSample;
    this.samples.push(nextSample);
  }
}
