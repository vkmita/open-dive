import { forIn } from 'lodash';
import alveolarPressure from './alveolarPressure';
import absolutePressure, { depthPressure } from './absolutePressure';
import tissuePressure from './tissuePressure';
import noStopTime from './noStopTime';
import ascentCeiling from './ascentCeiling';
import ZHL16B from './ZHL16B';

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

class Sample {
  constructor({ depth, gas, time, gasSwitch, tissues, ndl, ascentCeiling }) {
    Object.assign(this, { depth, gas, time, gasSwitch, tissues, ndl, ascentCeiling });

    if (time === 0) {
      // all tissues fully saturated with air
      const initalN2Pressure = alveolarPressure(absolutePressure(0), 0.79);
      const initialHePressure = 0;

      this.tissues = Object.keys(ZHL16B).reduce(
        (tissues, compartmentNumber) => {
          tissues[compartmentNumber] = {
            n2: initalN2Pressure,
            he: initialHePressure,
          }
          return tissues;
        },
      {});
    }
  }

  createNextSample = ({ depth, intervalTime, gasSwitch }) => {
    const nextTissues = {};
    
    const gas = this.gasSwitch || this.gas
    const { n2: n2Ratio, he: heRatio } = gas;

    // the sample ndl and ceiling
    let ndl, ceiling;

    forIn(ZHL16B, (compartment, compartmentNumber) => {
      const {
        n2,
        n2: { halfTime: n2Halftime },
        he,
        he: { halfTime: heHalfTime },
      } = compartment;
  
      const n2Pressure = tissuePressure({
        startTissuePressure: this.tissues[compartmentNumber].n2,
        gasRatio: n2Ratio,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        halfTime: n2Halftime,
      });
  
      const hePressure = tissuePressure({
        startTissuePressure: this.tissues[compartmentNumber].he,
        gasRatio: heRatio,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        halfTime: heHalfTime,
      });
  
      const n2StopTime = noStopTime({
        compartment: n2,
        gasRatio: n2Ratio,
        tissuePressure: n2Pressure,
        depth,
      });
      if (!ndl || n2StopTime < ndl.value) {
        ndl = { gas: 'n2', value: n2StopTime, compartment: compartmentNumber };
      }
      const n2AscentCeiling = ascentCeiling(n2Pressure, n2);
      if (!ceiling || n2AscentCeiling > ceiling.pressure) {
        ceiling = { 
          gas: 'n2', 
          pressure: n2AscentCeiling,
          depth: depthPressure(n2AscentCeiling),
          compartment: compartmentNumber,
        };
      }
      const heStopTime = noStopTime({
        compartment: he,
        gasRatio: heRatio,
        tissuePressure: hePressure,
        depth,
      });
  
      if (!ndl || heStopTime < ndl.value) {
        ndl = { gas: 'he', value: heStopTime, compartment: compartmentNumber };
      }
  
      const heAscentCeiling = ascentCeiling(n2Pressure, he);
      if (!ceiling || heAscentCeiling > ceiling.pressure) {
        ceiling = { 
          gas: 'he', 
          pressure: heAscentCeiling, 
          depth: depthPressure(heAscentCeiling), 
          compartment: compartmentNumber,
        };
      }
  
      nextTissues[compartmentNumber] = {
        n2: n2Pressure,
        he: hePressure,
      };
    });

    return new Sample({ 
      depth,
      gas,
      gasSwitch,
      time: this.time + intervalTime,
      tissues: nextTissues,
      ndl,
      ascentCeiling: ceiling,
    });
  }
}