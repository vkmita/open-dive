// calculates the pressure of a tissue compartment
// given an initial pressure 

const ATA = 1.01972;

const absolutePressureAtDepth = depth =>
  (depth / 10) + ATA;

// using the "Schreiner" equation
const tissuePressure = (
  beginningAlviolarPressure, // bar
  beginningTissuePressure, // bar
  gasRatio, // ex: 0.79
  startDepth, // meters
  endDepth, // meters
  intervalTime, // minutes
  halfTime, // ex: 1.51 (minutes)
) => {
  // the "k" in the schreiner equation
  const k = Math.LN2 / halfTime;

  // meters / minute
  const rateOfPressureChange = 
    (absolutePressureAtDepth(endDepth) - absolutePressureAtDepth(startDepth)) / intervalTime;

  // "R" in the schreiner equation
  const r = rateOfPressureChange * gasRatio;

  // P = Pio + R(t - 1/k) - [Pio - Po - (R/k)]e^-kt
  return beginningAlviolarPressure
    + (r * (intervalTime - 1/k))
    - (beginningAlviolarPressure - beginningTissuePressure - r/k)
    * Math.exp(-k * intervalTime);
}

export default tissuePressure;
