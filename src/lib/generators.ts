function getRandomUnsignedIntegers(size: number): Uint32Array {
  const randomNumbers = new Uint32Array(size);
  self.crypto.getRandomValues(randomNumbers);
  return randomNumbers;
}

export function getDieRoll(sides: number): number {
  return (getRandomUnsignedIntegers(1)[0] % sides) + 1;
}

export function getDiceResults(diceSides: number[]): Uint32Array {
  const size = diceSides.length;
  return getRandomUnsignedIntegers(size).map((n, index) => {
    const sides = diceSides[index];
    return (n % sides) + 1;
  });
}
