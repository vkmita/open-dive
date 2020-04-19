

// an ascent ceiling for a compartment at a particular tissue pressure
const ascentCeiling = (tissuePressure, { a, b }) => (tissuePressure - a) * b;

export default ascentCeiling;
