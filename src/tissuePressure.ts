import schreiner from './equations/schreiner';
import {
  alveolarPressure,
  ambientPressure,
  rateOfPressureChange,
} from './equations/pressure';

// calculates the pressure of a tissue compartment
// given an initial pressure

// using the "Schreiner" equation
// returns the tissue pressure after the dive interval
export default ({
  startTissuePressure, // bar
  gasRatio, // 0 - 1, ex: .79
  startDepth, // meters
  endDepth, // meters
  intervalTime, // minutes
  gasCompartment, // GasCompartment
}) => {
  // meters / minute
  const pressureChange = rateOfPressureChange({
    startDepth,
    endDepth,
    time: intervalTime,
  });

  // "R" in the schreiner equation
  const R = pressureChange * gasRatio;

  const startAlviolarPressure = alveolarPressure({
    ambientPressure: ambientPressure(startDepth),
    gasRatio,
  });

  // P = Pio + R(t - 1/k) - [Pio - Po - (R/k)]e^-kt
  return schreiner({
    pAlv: startAlviolarPressure,
    R,
    p0: startTissuePressure,
    k: gasCompartment.k,
    t: intervalTime,
  });
};
