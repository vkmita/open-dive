import Sample from './Sample';

export default class Dive {
  // TODO please add TypeScript
  constructor(args) {
    Object.assign(this, args);

    // for now just use the first gas
    // TODO: gas switches
    if (!this.surfaceInterval) {
      const { gases: [initialGas] } = this;
      this.samples = [
        new Sample({ 
          depth: 0, 
          gas: { he: 0, n2: .79 },
          time: 0,
          gasSwitch: initialGas,
        }),
      ];
    }
  }

  lastSample = () => this.samples[this.samples.length - 1];

  createNextDive = ({ surfaceInterval, gases }) => {
    const numberOfSamples = this.samples.length;
    
    if (numberOfSamples === 1) {
      throw new Error('The dive needs to end')
    } else {
      const lastSample = this.samples[numberOfSamples];
      if (lastSample.depth !== 0) {
        throw new Error('The dive needs to end');
      }

      const { gases: [initialGas] } = this;

      lastSample.createNextDive({
        depth: 0,
        interval: surfaceInterval,
        gasSwitch: initialGas,
      })

      return new Dive({
        surfaceInterval,
        gases,
        samples: [initialSample]
      })
    }
  }

  addSample = ({ depth, intervalTime, gasSwitch }) => {
    const previousSample = this.lastSample();
    const nextSample = previousSample.createNextSample({
      depth, 
      intervalTime, 
      gasSwitch,
    });
    this.samples.push(nextSample);
  }
}
