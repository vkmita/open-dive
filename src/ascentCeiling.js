import { DECO_STEP_SIZE } from './constants';

// an ascent ceiling for a compartment at a particular tissue pressure
const ascentCeiling = (tissuePressure, { a, b }) => (tissuePressure - a) * b;

// ascent ceiling depth rounded to the greater step of 3 meters
export const ceilingStep = depth => 
  Math.ceil(depth / DECO_STEP_SIZE) * DECO_STEP_SIZE;

export default ascentCeiling;
