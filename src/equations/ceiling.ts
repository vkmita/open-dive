import { DECO_STEP_SIZE } from '../constants';
// import { solvedForTime as schreinerSolvedForTime } from './schreiner';

// an ascent ceiling pressure for a compartment at a particular tissue pressure
// pAmbTol = (pComp - a) * b
export const ascentCeiling = ({
  pComp,
  a,
  b,
}: {
  pComp: number;
  a: number;
  b: number;
}) => (pComp - a) * b;

// ascent ceiling solved for pComp
// we can use this along with Schreiner equation to determine how long to stay
// at a certain depth to
// pComp = (pAmbTol / b) + a
// export const ceilingStepTime = (
//   { a, b, p0, pAmbTol }:
//   { a: number, b: number, p0: number, pAmbTol: number }
// ) => {
//   const pComp = (pAmbTol / b) + a;

//   return schreinerSolvedForTime({ ptt: pComp, p0, pAlv0, k })
// }

// ascent ceiling depth rounded to the greater step of 3 meters
export const ceilingStep = (depth: number) =>
  Math.ceil(depth / DECO_STEP_SIZE) * DECO_STEP_SIZE;

export default ascentCeiling;
