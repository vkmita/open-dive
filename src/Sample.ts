import { 
  alveolarPressure,
  ambientPressure, 
  ambientPressureDepth,
} from './equations/pressure';
import ZHL16B from './ZHL16B';

import type Gas from './Gas';
import type GasCompartment from './GasCompartment';
import SampleTissue from './SampleTissue';

type Tissues = { [compartment: string]: { he: SampleTissue, n2: SampleTissue }};

type NDL = { 
  value: number, 
  gasCompartment: GasCompartment,
};

type AscentCeiling = {
  pressure: number,
  depth: number,
  gasCompartment: GasCompartment,
};

type SampleArgs = { 
  depth: number, 
  gasMix: Gas, 
  time: number, 
  gasSwitch?: Gas, 
  tissues?: Tissues, 
  ndl?: NDL, 
  ascentCeiling?: AscentCeiling,
};
  
export default class Sample {
  depth: number;
  gasMix: Gas;
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
    const gasMix = this.gasSwitch || this.gasMix

    // the sample ndl and ceiling
    let ndl: NDL, ceiling: AscentCeiling;
    const nextTissues = {};
    ZHL16B.forEach(gasCompartment => {
      const { compartment, gas } = gasCompartment;

      const sampleTissue = new SampleTissue({
        startTissuePressure: this.tissues[compartment][gas].pressure,
        gas: gasMix,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        gasCompartment,
      });
  
      const noStopTime = sampleTissue.noStopTime();

      if (!ndl || noStopTime < ndl.value) {
        ndl = { value: noStopTime, gasCompartment };
      }

      const ascentCeiling = sampleTissue.ascentCeiling();

      if (!ceiling || ascentCeiling > ceiling.pressure) {
        ceiling = { 
          pressure: ascentCeiling,
          depth: ambientPressureDepth(ascentCeiling),
          gasCompartment,
        };
      }

      nextTissues[gasCompartment.compartment][gasCompartment.gas];
    });

    return new Sample({ 
      depth,
      gasMix,
      gasSwitch,
      time: this.time + intervalTime,
      tissues: nextTissues,
      ndl,
      ascentCeiling: ceiling,
    });
  }
}
