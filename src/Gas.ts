// might be able to add transit or somehting later
type GasType = 'back' | 'deco';

type GasArgs = {
  he: number,
  o2: number,
  type: GasType,
};

export default class Gas {
  he: number;
  maxPPo2: 1.4 | 1.6;
  mod: number;
  n2: number;
  o2: number;
  type: GasType;

  constructor({ he, o2, type }: GasArgs) {
    Object.assign(this, { he, o2, type });
    this.n2 = 1 - he - o2;
    this.maxPPo2 = this.calcMaxPPo2();
    this.mod = this.calcMod();
  }

  // TODO: make configurable
  calcMaxPPo2 = (): 1.4 | 1.6 => this.type === 'back' ? 1.4 : 1.6;

  calcMod = (): number => this.maxPPo2 / this.o2;
}

export const Air = new Gas({ he: 0, o2: .21, type: 'back' });
