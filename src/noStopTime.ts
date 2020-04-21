import { 
  alveolarPressure, 
  ambientPressure, 
  rateOfPressureChange,
} from './equations/pressure';
import noDecompressionLimit from './equations/noDecompressionLimit';
import { MAX_ASCENT_RATE } from './constants';
import { solvedForTime as schreinerSolvedForTime } from './equations/schreiner';
import type GasCompartment from './GasCompartment';

// number of minutes a tissue can remain at depth before needing decompression
export default (
  { gasCompartment, gasRatio, tissuePressure, depth }: 
  { 
    gasCompartment: GasCompartment, 
    gasRatio: number, 
    tissuePressure: number, 
    depth: number,
  }
) => {
  const { a, b, k } = gasCompartment;

  const surfacePressure = ambientPressure(0);
  const depthPressure = ambientPressure(depth);

  // alveolar pressure at the surface
  const pAlv0 = alveolarPressure({ ambientPressure: depthPressure, gasRatio });
  // time needed to ascend to the surface
  const tAsc = depth / MAX_ASCENT_RATE;

  // the no decompression limit equation
  // max partial pressure of gas the tissue can have at the current depth
  const maxPressureAtDepth = noDecompressionLimit({
    k,
    m0: a + surfacePressure / b,
    R: rateOfPressureChange({ 
      startDepth: depth, 
      endDepth: 0, 
      time: tAsc,
    }) * gasRatio,
    pAlv0,
    tAsc: depth / MAX_ASCENT_RATE,
  });

  // we never hit a no stop time
  if (maxPressureAtDepth > pAlv0 * gasRatio) return 99;

  return schreinerSolvedForTime({
    k,
    ptt: maxPressureAtDepth,
    p0: tissuePressure,
    pAlv0,
  });
};
