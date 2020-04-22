import { alveolarPressure, ambientPressure } from './equations/pressure';
import GasMix from './GasMix';

class Air extends GasMix {
  constructor() {
    super({ he: 0, o2: 0.21 });
  }

  surfaceN2AlveolarPressure = () =>
    alveolarPressure({
      ambientPressure: ambientPressure(0),
      gasRatio: this.n2.ratio,
    });
}

export default new Air();
