import { ATA, MSW } from './constants';

// absolute pressure (bar) at depth (meters)
export default depth => (depth * MSW) + ATA;
