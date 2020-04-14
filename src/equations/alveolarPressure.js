import {
  ALVEOLAR_C02_PRESSURE,
  RESPIRATORY_QUOTIENT,
  ALVEOLAR_WATER_VAPOR_PRESSURE,
} from '../constants';

// "alveolar ventilation equation"
// calculates the partial pressure of the inert gas in the
// alvioli before it enters tissues
export default (pAmb, Q) =>
  (pAmb - ALVEOLAR_WATER_VAPOR_PRESSURE 
    + ((1 - RESPIRATORY_QUOTIENT) * ALVEOLAR_C02_PRESSURE)) 
    * Q;
