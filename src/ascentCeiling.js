const ascentCeiling = (tissuePressure, compartment) => {
  const { a, b } = compartment;
  const ascentPressureLimit = (tissuePressure - a) * b;

  return ascentPressureLimit
};

export default ascentCeiling;
