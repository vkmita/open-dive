import {
  ALVEOLAR_C02_PRESSURE,
  RESPIRATORY_QUOTIENT,
  ALVEOLAR_WATER_VAPOR_PRESSURE,
} from '../constants';

type AlveolarPressureArgs = {
  ambiantPressure: number,
  gasRatio: number,
};

// "alveolar ventilation equation"
// calculates the partial pressure of the inert gas in the
// alvioli before it enters tissues
export default ({ ambiantPressure, gasRatio }: AlveolarPressureArgs): number =>
  (ambiantPressure -
    ALVEOLAR_WATER_VAPOR_PRESSURE +
    (1 - RESPIRATORY_QUOTIENT) * ALVEOLAR_C02_PRESSURE) *
  gasRatio;
