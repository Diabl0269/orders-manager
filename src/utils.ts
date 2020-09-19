const createArrayOfLengthWithNumbers = (length: number) =>
  Array.from({ length }, (_, i) => i + 1);

const shouldBeOverridden = (): void => {
  throw new Error('Function should be overriden');
};

export { createArrayOfLengthWithNumbers, shouldBeOverridden };
