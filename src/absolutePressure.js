// absolute pressure (bar) at depth (meters)
const absolutePressure = depth =>
  (depth * MSW) + ATA;

export default absolutePressure;