import Gas from './Gas';

/**
 * A class representing a mix of gases
 */
export default class GasMix {
  he: Gas;
  n2: Gas;
  o2: Gas;

  /**
   * Create a gas mix
   * @constructor
   * @param he The ratio of helium in the mix
   * @param o2 The ratio of oxygen in the mix
   */
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
