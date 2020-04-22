import {
  alveolarPressure,
  ambientPressure,
  rateOfPressureChange,
} from './equations/pressure';

export default class Gas {
  ratio: number;
  gas: 'he' | 'n2' | 'o2';

  constructor({ ratio, gas }: { ratio: number; gas: 'he' | 'n2' | 'o2' }) {
    Object.assign(this, { ratio, gas });
  }

  alveolarPressure({ depth }) {
    return alveolarPressure({
      ambientPressure: ambientPressure(depth),
      gasRatio: this.ratio,
    });
  }

  R({
    startDepth,
    endDepth,
    time,
  }: {
    startDepth: number;
    endDepth: number;
    time: number;
  }): number {
    const pressureChange = rateOfPressureChange({
      startDepth,
      endDepth,
      time,
    });

    // "R" in the schreiner equation
    return pressureChange * this.ratio;
  }
}
