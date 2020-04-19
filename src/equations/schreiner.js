// Schreiner equation for saturation level
// Pt(t) = pAlv + R * (t - 1/k) - (pAlv - p0 - R/k) * e^(-k * t)
//
// returns pressure in tissue compartment
//
// p0: initial pressure of inert gas in tissue (bar)
// pAlv: initial pressure of inert gas in the lungs (bar)
// t: interval time (minutes)
// R: rate of pressure change (bar/minute)
// k: gas decay constant (log(2) / halfTime)
export default ({ p0, pAlv, R, k, t }) =>
  pAlv + R * (t - 1 / k) - (pAlv - p0 - R / k) * Math.exp(-k * t);

// The Shreiner equation solved for time with R being zero, meaning there is no
// pressure change
export const solvedForTime = ({ ptt, p0, pAlv0, k }) =>
  -Math.log((ptt - pAlv0) / (-pAlv0 + p0)) / k;
