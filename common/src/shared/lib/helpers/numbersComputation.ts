export const getNumberWithPrecision = (n: number, precisionLength: number) => {
  const { 0: leftPart, 1: rightPart } = n.toString().split('.');

  if (!leftPart) return 0;
  if (!rightPart) return +leftPart;

  return +`${leftPart}.${rightPart.slice(0, precisionLength)}`;
};

export const multiplyPrecisionNumber = (n: number, multiplier: number) => {
  const { 0: leftPart, 1: rightPart } = n.toString().split('.');

  if (!leftPart) return 0;
  if (!rightPart) return +leftPart * +`1e${multiplier}`;

  const result = +`${leftPart}${rightPart.slice(0, multiplier)}`;
  const multiplierRemainder = multiplier - rightPart.length;

  if (multiplierRemainder <= 0) return result;

  return result * +`1e${multiplierRemainder}`;
};

export const precisionNumbersProcess = (n: number, m: number, sign: '+' | '-') => {
  switch (sign) {
    case '+':
      return n + m;
    case '-':
      return n - m;
  }
};

export const calcNumbersPrecisionLength = (n: number) => n.toString().split('.')[1]?.length ?? 0;
export const calcNumbersMultiplier = (n: number, precisionLength: number) => {
  const nPrecisionLength = calcNumbersPrecisionLength(n);

  return nPrecisionLength >= precisionLength ? precisionLength : nPrecisionLength;
};

export const computePrecisionNumbers = (n: number, m: number, sign: '+' | '-', precisionLength: number) => {
  const multiplier = Math.max(calcNumbersMultiplier(n, precisionLength), calcNumbersMultiplier(m, precisionLength));

  return (
    precisionNumbersProcess(
      multiplyPrecisionNumber(getNumberWithPrecision(n, precisionLength), multiplier),
      multiplyPrecisionNumber(getNumberWithPrecision(m, precisionLength), multiplier),
      sign
    ) / +`1e${multiplier}`
  );
};
