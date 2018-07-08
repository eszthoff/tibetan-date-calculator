import {
  frac, amod, getJulianDateFromUnix, getUnixDateFromJulian
} from '../src/helpers';

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

describe('getJulianDateFromUnix(date)', () => {
  it('should return the correct Julian date', () => {
    const date = new Date(Date.UTC(2016, 1, 3, 16, 0, 0));
    expect(getJulianDateFromUnix(date)).toEqual(2457422);
  });
});

describe('getUnixDateFromJulian(jd)', () => {
  it('should return the correct unix date', () => {
    const jd = 2457422;
    const date = new Date(Date.UTC(2016, 1, 3, 12, 0, 0));
    expect(getUnixDateFromJulian(jd)).toEqual(date);
  });
});
