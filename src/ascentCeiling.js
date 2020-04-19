// an ascent ceiling for a compartment at a particular tissue pressure
const ascentCeiling = (tissuePressure, { a, b }) => (tissuePressure - a) * b;

// ascent ceiling depth rounded to the greater step of 3 meters
export const ceilingStep = depth => Math.ceil(depth / 3) * 3;

export default ascentCeiling;
