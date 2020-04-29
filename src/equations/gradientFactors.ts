export const maxGradientFactor = ({
  highGF,
  lowGF,
  currentDepth,
  lowGFDepth,
}: {
  highGF: number;
  lowGF: number;
  currentDepth: number;
  lowGFDepth: number;
}): number => highGF - ((highGF - lowGF) / lowGFDepth) * currentDepth;
