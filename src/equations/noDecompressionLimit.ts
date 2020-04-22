// no decompression limit equation (no-stop time by Schreiner)
//
// pAlv: pressure of inert gas at depth
// tAsc: ascent time
// R: rate of pressure change
// k: gas decay constant
// m0: surfacing M-value
export default ({
  m0,
  pAlv,
  R,
  k,
  tAsc,
}: {
  m0: number;
  pAlv: number;
  R: number;
  k: number;
  tAsc: number;
}): number =>
  (m0 - pAlv - R * (tAsc - 1 / k)) * Math.exp(k * tAsc) + pAlv - R / k;
