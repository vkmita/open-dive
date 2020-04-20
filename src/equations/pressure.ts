import {
  ALVEOLAR_C02_PRESSURE,
  ALVEOLAR_WATER_VAPOR_PRESSURE,
  ATA,
  MSW,
  RESPIRATORY_QUOTIENT,
} from '../constants';

// "alveolar ventilation equation"
// calculates the partial pressure of the inert gas in the
// alvioli before it enters tissues
export const alveolarPressure = (
  { ambientPressure, gasRatio }: 
  { ambientPressure: number, gasRatio: number },
): number =>
  (ambientPressure -
    ALVEOLAR_WATER_VAPOR_PRESSURE +
    (1 - RESPIRATORY_QUOTIENT) * ALVEOLAR_C02_PRESSURE) *
  gasRatio;

// ambient pressure (bar) at depth (meters)
export const ambientPressure = (depth: number): number => depth * MSW + ATA;

// depth given an ambient pressure
export const ambientPressureDepth = (ambientPressure: number): number =>
  ambientPressure < ATA ? 0 : (ambientPressure - ATA) / MSW;

// meters / minute
export const rateOfPressureChange = (
  { endDepth, startDepth, time }:
  { endDepth: number, startDepth: number, time: number},
): number => (ambientPressure(endDepth) - ambientPressure(startDepth)) / time;

