import { frac, amod } from '../math';

describe('Frac(a)', () => {
  it('should return 0 if integer is give', () => {
    expect(frac(7)).toEqual(0);
  });
  it('should return the fractional part of 1.1', () => {
    // correct for JS handling of fractions
    const result = Math.trunc(frac(1.1) * 10000) / 10000;
    expect(result).toEqual(0.1);
  });
});

describe('amod(a,b)', () => {
  it('should return the correct modulo of 2 numbers', () => {
    expect(amod(9, 2)).toEqual(1);
  });
  it('should return b instead of 0', () => {
    expect(amod(9, 9)).toEqual(9);
  });
});
