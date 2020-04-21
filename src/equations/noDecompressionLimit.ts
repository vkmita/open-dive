// no decompression limit equation (no-stop time by Schreiner)
//
// pAlv0: pressure of inert gas in the lungs at the surface
// tAsc: ascent time
// R: rate of pressure change
// k: gas decay constant
// m0: surfacing M-value
export default ({
  m0,
  pAlv0,
  R,
  k,
  tAsc,
}: {
  m0: number;
  pAlv0: number;
  R: number;
  k: number;
  tAsc: number;
}): number =>
  (m0 - pAlv0 - R * (tAsc - 1 / k)) * Math.exp(k * tAsc) + pAlv0 - R / k;
