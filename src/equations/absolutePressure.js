import { ATA, MSW } from '../constants';

// absolute pressure (bar) at depth (meters)
export default (depth) => depth * MSW + ATA;

// depth in meters given an absolute pressure
export const depthPressure = (absolutePressure) =>
  absolutePressure < ATA ? 0 : (absolutePressure - ATA) / MSW;
