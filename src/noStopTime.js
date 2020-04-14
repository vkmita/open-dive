import absolutePressure from './absolutePressure';
import alveolarPressure from './equations/alveolarPressure';
import noDecompressionLimit from './equations/noDecompressionLimit';
import rateOfPressureChange from './rateOfPRessureChange';
import { MAX_ASCENT_RATE } from './constants';
import { solvedForTime as schreinerSolvedForTime } from './equations/schreiner';

// number of minutes a tissue can remain at depth before needing decompression
export default ({
  compartment, // { a: number, b: number, halfTime: number }
  gasRatio,
  tissuePressure, // bar
  depth, // meters
}) => {
  const { a, b, halfTime } = compartment;

  const surfacePressure = absolutePressure(0);
  const depthPressure = absolutePressure(depth);

  // k in the Shreiner equation
  const k = Math.LN2 / halfTime;
  // alveolar pressure at the surface
  const pAlv0 = alveolarPressure(depthPressure, gasRatio)
  // time needed to ascend to the surface
  const tAsc = depth / MAX_ASCENT_RATE;

  // the no decompression limit equation
  // max partial pressure of gas the tissue can have at the current depth
  const maxPressureAtDepth = noDecompressionLimit({
    k,
    m0: a + surfacePressure / b, 
    R: rateOfPressureChange(depth, 0, tAsc) * gasRatio, 
    pAlv0,
    tAsc: depth / MAX_ASCENT_RATE, 
  });

  // we never hit a no stop time
  if (maxPressureAtDepth > (pAlv0 * gasRatio)) return 99;

  return schreinerSolvedForTime({
    k,
    ptt: maxPressureAtDepth,
    p0: tissuePressure,
    pAlv0,
  });
}
