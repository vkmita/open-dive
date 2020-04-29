import { DECO_STEP_SIZE } from '../constants';

// an ascent ceiling pressure for a compartment at a particular tissue pressure
// pAmbTol = (pComp - a * GF) / ( b
export const ascentCeiling = ({
  pComp,
  a,
  b,
  gradientFactor = 1.0,
}: {
  pComp: number;
  a: number;
  b: number;
  gradientFactor?: number;
}) =>
  (pComp - a * gradientFactor) / (gradientFactor / b + 1.0 - gradientFactor);

export const ascentCeilingSolvedForPComp = ({
  a,
  b,
  pAmbTol,
  gradientFactor = 1,
}: {
  a: number;
  b: number;
  pAmbTol: number;
  gradientFactor?: number;
}) =>
  pAmbTol * (gradientFactor / b + 1.0 - gradientFactor) + a * gradientFactor;

// ascent ceiling solved for pComp
// pComp = (pAmbTol / b) + a

// we can use this along with Schreiner equation to determine how long to stay
// at a certain depth to
// export const ceilingStepTime = (
//   { a, b, p0, pAlv, pAmbTol }:
//   { a: number, b: number, p0: number, pAmbTol: number }
// ) => {
//   const pComp =

//   return schreinerSolvedForTime({ ptt: pComp, p0, pAlv, k })
// }

// ascent ceiling depth rounded to the greater step of 3 meters
export const ceilingStep = (depth: number) =>
  Math.ceil(depth / DECO_STEP_SIZE) * DECO_STEP_SIZE;

export default ascentCeiling;
