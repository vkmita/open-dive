import type GasCompartment from './GasCompartment';
import schreiner from './equations/schreiner';
import { 
  alveolarPressure, 
  ambientPressure, 
  rateOfPressureChange,
} from './equations/pressure';

export default class SampleTissue {
  // startTissuePressure: number; // bar
  // gasRatio: number; // 0 - 1, ex: .79
  // startDepth: number; // meters
  // endDepth: number; // meters
  // intervalTime: number; // minutes
  gasCompartment: GasCompartment; // GasCompartment
  pressure: number;

  constructor({
    startTissuePressure, // bar
    gasRatio, // 0 - 1, ex: .79
    startDepth, // meters
    endDepth, // meters
    intervalTime, // minutes
    gasCompartment, // GasCompartment
    pressure,
  }: {
    startTissuePressure?: number, // bar
    gasRatio?: number, // 0 - 1, ex: .79
    startDepth?: number, // meters
    endDepth?: number, // meters
    intervalTime?: number, // minutes
    gasCompartment: GasCompartment, // GasCompartment)
    pressure?: number,
  }) {
    Object.assign(this, { gasCompartment, pressure });

    if (!pressure) {
      // meters / minute
      const pressureChange = rateOfPressureChange({
        startDepth,
        endDepth,
        time: intervalTime,
      });

      // "R" in the schreiner equation
      const R = pressureChange * gasRatio;

      const startAlviolarPressure = alveolarPressure({
        ambientPressure: ambientPressure(startDepth),
        gasRatio,
      });

      this.pressure = schreiner({
        pAlv: startAlviolarPressure,
        R,
        p0: startTissuePressure,
        k: gasCompartment.k,
        t: intervalTime,
      });
    }
  }
}