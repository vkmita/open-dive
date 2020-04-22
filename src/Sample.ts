import { ambientPressureDepth } from './equations/pressure';
import ZHL16B from './ZHL16B';
import AIR from './Air';

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
  pressure: number;
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

const EMPTY_TISSUES = () =>
  ZHL16B.reduce(
    (tissues, { compartment }) => (tissues[compartment] = {} && tissues),
    {},
  );

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
}
