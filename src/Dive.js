import Sample from './Sample';

export default class Dive {
  // TODO please add TypeScript
  constructor(args) {
    Object.assign(this, args);

    // for now just use the first gas
    // TODO: gas switches
    if (!this.surfaceInterval) {
      const { gases: [initialGas] } = this;
      this.lastSample = new Sample({ 
        depth: 0, 
        gas: { he: 0, n2: .79 },
        time: 0,
        gasSwitch: initialGas,
      }),
      this.samples = [this.lastSample];
    }
  }

  // TODO write a test
  createNextDive = ({ surfaceInterval, gases }) => {
    const numberOfSamples = this.samples.length;
    
    if (numberOfSamples === 1) {
      throw new Error('The dive needs to end')
    } else {
      const { lastSample } = this;
      if (lastSample.depth !== 0) {
        throw new Error('The dive needs to end');
      }

      const { gases: [initialGas] } = this;

      const initialSample = lastSample.createNextSample({
        depth: 0,
        interval: surfaceInterval,
        gasSwitch: initialGas,
      });

      return new Dive({
        surfaceInterval,
        gases,
        lastSample: initialSample,
        samples: [initialSample]
      })
    }
  }

  addSample = ({ depth, intervalTime, gasSwitch }) => {
    const nextSample = this.lastSample.createNextSample({
      depth, 
      intervalTime, 
      gasSwitch,
    });
    this.lastSample = nextSample;
    this.samples.push(nextSample);
  }
}
