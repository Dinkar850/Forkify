declare module 'fractional' {
  export class Fraction {
    constructor(numerator: number, denominator: number);
    numerator: number;
    denominator: number;
    toString(): string;
  }
}
