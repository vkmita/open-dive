import absolutePressure from './absolutePressure';

// meters / minute
export default (startDepth, endDepth, time) =>
  (absolutePressure(endDepth) - absolutePressure(startDepth)) / time;
