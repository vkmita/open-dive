import Gas from './Gas';

export default class GasMix {
  he: Gas;
  n2: Gas;
  o2: Gas;

  constructor({ he, o2 }: { he?: number; o2: number }) {
    Object.assign(this, {
      he: new Gas({ gas: 'he', ratio: he || 0 }),
      o2: new Gas({ gas: 'o2', ratio: o2 }),
      n2: new Gas({ gas: 'n2', ratio: 1 - he - o2 }),
    });
  }
}
