import Gas from './Gas';

export default class GasMix {
  he: Gas;
  n2: Gas;
  o2: Gas;

  constructor({ he, o2 }: { he?: number; o2: number }) {
    const heRatio = he || 0;
    Object.assign(this, {
      he: new Gas({ gas: 'he', ratio: heRatio }),
      // o2 should always exist if you want to live
      o2: new Gas({ gas: 'o2', ratio: o2 }),
      n2: new Gas({ gas: 'n2', ratio: 1 - heRatio - o2 }),
    });
  }
}

export const AIR = new GasMix({ o2: 0.21 });
