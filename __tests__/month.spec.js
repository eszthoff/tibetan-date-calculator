import { toMonthCount, fromMonthCount, hasLeapMonth } from '../src/month';

const mockMonthNoLeap = {
  year: 2145,
  month: 1,
  isLeapMonth: false
};
const mockMonthCountNotLeap = 14990;
const mockMonthIsLeap = {
  year: 2140,
  month: 8,
  isLeapMonth: true
};
const mockMonthCountIsLeap = 14935;
const mockMonthHasLeap = {
  year: 2140,
  month: 8,
  isLeapMonth: false
};
const mockMonthCountHasLeap = 14936;

describe('toMonthCount()', () => {
  it('should return the correct month count for non leap month', () => {
    expect(toMonthCount(mockMonthNoLeap)).toEqual(mockMonthCountNotLeap);
  });
  it('should return the correct month count for leap month', () => {
    expect(toMonthCount(mockMonthIsLeap)).toEqual(mockMonthCountIsLeap);
  });
  it('should return the correct month count for not leap month that has a leap', () => {
    expect(toMonthCount(mockMonthHasLeap)).toEqual(mockMonthCountHasLeap);
  });
});

describe('fromMonthCount()', () => {
  it('should return the correct month', () => {
    expect(fromMonthCount(mockMonthCountNotLeap)).toEqual(mockMonthNoLeap);
  });
  it('should return the correct leap month', () => {
    expect(fromMonthCount(mockMonthCountIsLeap)).toEqual(mockMonthIsLeap);
  });
  it('should return the correct month for not leap month that has a leap', () => {
    expect(fromMonthCount(mockMonthCountHasLeap)).toEqual(mockMonthHasLeap);
  });
});

describe('hasLeapMonth()', () => {
  it('should return false when there is no leap month', () => {
    expect(hasLeapMonth(mockMonthNoLeap.year, mockMonthNoLeap.month)).toBeFalsy();
    expect(hasLeapMonth(2146, 2)).toBeFalsy();
    expect(hasLeapMonth(2151, 5)).toBeFalsy();
  });
  it('should return true when there is no leap month', () => {
    expect(hasLeapMonth(mockMonthHasLeap.year, mockMonthHasLeap.month)).toBeTruthy();
    expect(hasLeapMonth(2146, 1)).toBeTruthy();
    expect(hasLeapMonth(2151, 6)).toBeTruthy();
  });
});
