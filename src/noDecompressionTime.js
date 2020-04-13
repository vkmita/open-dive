// def ndl( Palv = 0.7451, M0 = 2.9624, t = 0, R = 0, k = 0.1386, verbose = False ) :

// # (M0 - Palv - R * (t - 1/k)) * math.e ** (k * t) + Palv - R / k
//     assert float( k ) != 0.0
//     x1 = float( M0 ) - float( Palv ) - float( R ) * (float( t ) - 1.0 / float( k ))
//     x2 = math.e ** (float( k ) * float( t ))
//     rc = x1 * x2 + float( Palv ) - float( R ) / float( k )
//     if verbose : sys.stdout.write( "x1: %f, x2: %f, rc: %f\n" % (x1, x2, rc,) )
//     return round( rc, 4 )

import absolutePressure from './absolutePressure';
import alveolarPressure from './alveolarPressure';

// the number of minutes a tissue can stay at a certain depth without needing to
// do any decompression stops

export default (
  compartment, // { a: number, b: number, halfTime: number }
  gasRatio,
  // tissuePressure, // bar
  depth, // meters
) => {
  const { a, b, halfTime } = compartment;

  // calculate m0 from a and b values
  const m0 = a + absolutePressure(0)/ b;
  // k in the Shreiner equation
  const k = Math.LN2 / halfTime;
  // time needed to ascend to the surface
  const tAsc = depth / MAX_ASCENT_RATE;
  // R in the Shreiner equation
  const R = pressureChange(depth, 0, tAsc) * gasRatio;
  // alveolar pressure at the surface
  const pAlvo0 = alveolarPressure(0, gasRatio)

  // max partial pressure of gas the tissue can have at the current depth
  const maxPressureAtDepth = 
    (m0 - pAlvo0 - R(tAsc - 1/k)) * Math.exp(-k * tAsc) + pAlvo - R/k;
}
