import { transform } from 'lodash';
import ZHL16B from './ZHL16B';
import { AIR } from './GasMix';

import type GasMix from './GasMix';
import type GasCompartment from './GasCompartment';
import SampleTissue from './SampleTissue';

type Tissues = {
  [compartment: string]: { he: SampleTissue; n2: SampleTissue };
};

type NDL = {
  value: number;
  gasCompartment: GasCompartment;
};

type AscentCeiling = {
  depth: number;
  gasCompartment: GasCompartment;
};

type SampleArgs = {
  depth: number;
  gasMix: GasMix;
  time: number;
  gasSwitch?: GasMix;
  tissues?: Tissues;
  ndl?: NDL;
  ascentCeiling?: AscentCeiling;
};

export default class Sample {
  depth: number;
  gasMix: GasMix;
  time: number;
  gasSwitch: GasMix;
  tissues: Tissues;
  ndl?: NDL;
  ascentCeiling?: AscentCeiling;

  constructor({ time, gasMix, ...args }: SampleArgs) {
    Object.assign(this, { time, gasMix, ...args });

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
          endDepth: 0,
        });
        return tissues;
      }, {});
    }
  }

  createNextSample = ({
    depth,
    intervalTime,
    gasSwitch,
  }: {
    depth: number;
    intervalTime: number;
    gasSwitch?: GasMix;
  }) => {
    const gasMix = this.gasSwitch || this.gasMix;

    // the sample ndl and ceiling
    let ndl: NDL, ceiling: AscentCeiling;
    const nextTissues = ZHL16B.reduce((tissues, gasCompartment) => {
      const { compartment, inertGas } = gasCompartment;
      tissues[compartment] = tissues[compartment] || {};

      const sampleTissue = new SampleTissue({
        startTissuePressure: this.tissues[compartment][inertGas].pressure,
        gasMix,
        startDepth: this.depth,
        endDepth: depth,
        intervalTime,
        gasCompartment,
      });

      const ascentCeiling = sampleTissue.ascentCeiling();

      // only calculate no stop time if there is no ascent ceiling
      if (ascentCeiling === 0) {
        const noStopTime = sampleTissue.noStopTime();

        if (noStopTime !== 0 && (!ndl || noStopTime < ndl.value)) {
          ndl = { value: noStopTime, gasCompartment };
        }
      } else if (!ceiling || ascentCeiling > ceiling.depth) {
        ceiling = {
          depth: ascentCeiling,
          gasCompartment,
        };
      }

      tissues[compartment][inertGas] = sampleTissue;
      return tissues;
    }, {});

    return new Sample({
      depth,
      gasMix,
      gasSwitch,
      time: this.time + intervalTime,
      tissues: nextTissues,
      ndl,
      ascentCeiling: ceiling,
    });
  };

  // time needed to wait at current depth to ascend without exceeding mvalues
  stopTime = ({ targetDepth }: { targetDepth: number }) =>
    ZHL16B.reduce((maxStopTime, { compartment, inertGas }) => {
      const sampleTissue = this.tissues[compartment][inertGas];
      const stopTime = sampleTissue.stopTime({ targetDepth });

      return maxStopTime < stopTime ? stopTime : maxStopTime;
    }, 0);
}
