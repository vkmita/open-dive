import { forIn } from 'lodash';
import { 
  alveolarPressure,
  ambientPressure, 
  ambientPressureDepth,
} from './equations/pressure';
import { ascentCeiling } from './equations/ceiling';
import ZHL16B, { Compartment } from './ZHL16B';
import tissuePressure from './tissuePressure';
import noStopTime from './noStopTime';

import type Gas from './Gas';

type Tissues = { 
  [compartmentNumber: string]: { he: number, n2: number },
};

type NDL = { 
  gas: 'he' | 'n2', 
  value: number, 
  compartment: string,
};

type AscentCeiling = {
  gas: 'he' | 'n2', 
  pressure: number,
  depth: number,
  compartment: string,
};

type SampleArgs = { 
  depth: number, 
  gas: Gas, 
  time: number, 
  gasSwitch?: Gas, 
  tissues?: Tissues, 
  ndl?: NDL, 
  ascentCeiling?: AscentCeiling,
};
  
export default class Sample {
  depth: number;
  gas: Gas;
  time: number;
  gasSwitch: Gas;
  tissues: Tissues;
  ndl?: NDL;
  ascentCeiling?: AscentCeiling;

  constructor({ time, ...args }: SampleArgs) {
    Object.assign(this, { time, ...args });

    if (time === 0) {
      // all tissues fully saturated with air
      const initalN2Pressure = alveolarPressure({ 
        ambientPressure: ambientPressure(0), 
        gasRatio: 0.79,
      });
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

  createNextSample = (
    { depth, intervalTime, gasSwitch }:
    { depth: number, intervalTime: number, gasSwitch?: Gas }
  ) => {
    const gas = this.gasSwitch || this.gas
    const { n2: n2Ratio, he: heRatio } = gas;

    // the sample ndl and ceiling
    let ndl: NDL, ceiling: AscentCeiling;
    const nextTissues = {};
    forIn(ZHL16B, (compartment: Compartment, compartmentNumber: string) => {
      const { n2, he } = compartment;
  
      const n2Pressure = tissuePressure({
        startTissuePressure: this.tissues[compartmentNumber].n2,
        gasRatio: n2Ratio,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        halfTime: n2.halfTime,
      });
  
      const hePressure = tissuePressure({
        startTissuePressure: this.tissues[compartmentNumber].he,
        gasRatio: heRatio,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        halfTime: he.halfTime,
      });
  
      const n2StopTime = noStopTime({
        gasCompartment: n2,
        gasRatio: n2Ratio,
        tissuePressure: n2Pressure,
        depth,
      });

      if (!ndl || n2StopTime < ndl.value) {
        ndl = { gas: 'n2', value: n2StopTime, compartment: compartmentNumber };
      }

      const n2AscentCeiling = ascentCeiling({ pComp: n2Pressure, a: n2.a, b: n2.b });

      if (!ceiling || n2AscentCeiling > ceiling.pressure) {
        ceiling = { 
          gas: 'n2', 
          pressure: n2AscentCeiling,
          depth: ambientPressureDepth(n2AscentCeiling),
          compartment: compartmentNumber,
        };
      }

      const heStopTime = noStopTime({
        gasCompartment: he,
        gasRatio: heRatio,
        tissuePressure: hePressure,
        depth,
      });
  
      if (!ndl || heStopTime < ndl.value) {
        ndl = { gas: 'he', value: heStopTime, compartment: compartmentNumber };
      }
  
      const heAscentCeiling = ascentCeiling({ pComp: hePressure, a: he.a, b: he.b });
      
      if (!ceiling || heAscentCeiling > ceiling.pressure) {
        ceiling = { 
          gas: 'he', 
          pressure: heAscentCeiling, 
          depth: ambientPressureDepth(heAscentCeiling), 
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
