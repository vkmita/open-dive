import { 
  ALVEOLAR_C02_PRESSURE, 
  RESPIRATORY_QUOTIENT, 
  ALVEOLAR_WATER_VAPOR_PRESSURE,
} from './constants';

// "alveolar ventilation equation"
// calculates the partial pressure of the inert gas in the 
// alvioli before it enters tissues
const alveolarPressure = (ambiantPressure, gasRatio) => {
  // gas in the alveoli not coming from the gas mix
  const alveolarGas =
    ALVEOLAR_WATER_VAPOR_PRESSURE 
    + ((1 - RESPIRATORY_QUOTIENT) * ALVEOLAR_C02_PRESSURE);

  return (ambiantPressure - alveolarGas) * gasRatio;
}
  
export default alveolarPressure;
