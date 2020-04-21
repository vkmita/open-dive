import { rateOfPressureChange } from './equations/pressure';

// might be able to add transit or somehting later
type GasType = 'back' | 'deco';

type GasMixArgs = {
  he: number;
  o2: number;
  type: GasType;
};

export default class GasMix {
  he: number;
  maxPPo2: 1.4 | 1.6;
  mod: number;
  n2: number;
  o2: number;
  type: GasType;

  constructor({ he, o2, type }: GasMixArgs) {
    Object.assign(this, { he, o2, type });

    this.n2 = 1 - he - o2;
    this.maxPPo2 = this.type === 'back' ? 1.4 : 1.6;
    this.mod = this.maxPPo2 / o2;
  }

  R({
    startDepth,
    endDepth,
    time,
    gas,
  }: {
    startDepth: number;
    endDepth: number;
    time: number;
    gas: 'he' | 'n2';
  }): number {
    const pressureChange = rateOfPressureChange({
      startDepth,
      endDepth,
      time,
    });

    // "R" in the schreiner equation
    return pressureChange * this[gas];
  }
}

export const AIR = new GasMix({ he: 0, o2: 0.21, type: 'back' });
