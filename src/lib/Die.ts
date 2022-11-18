export class Die {
  result: number;
  readonly sides: number;

  constructor(sides: number, result: number) {
    if (sides < 1) {
      throw new Error('Die sides must be non-zero, positive');
    } else if (sides < 2) {
      throw new Error('A die must have at least 2 sides');
    }

    this.sides = sides;
    this.result = result;
  }
}
