import {
  toMonthCount, fromMonthCount, hasLeapMonth, tibetanMonthInfo
} from '../src/month';

const mockMonthNoLeap = {
  year: 2145,
  month: 1,
  isLeapMonth: false
};
const mockMonthNoLeapFull = {
  year: 2145,
  month: 1,
  isLeapMonth: false,
  hasLeapMonth: false,
  startDate: new Date('2018-02-16T12:00:00.000Z'),
  endDate: new Date('2018-03-17T12:00:00.000Z')
};
const mockMonthCountNotLeap = 14990;
const mockMonthIsLeap = {
  year: 2140,
  month: 8,
  isLeapMonth: true
};
const mockMonthIsLeapFull = {
  year: 2140,
  month: 8,
  isLeapMonth: true,
  hasLeapMonth: true,
  startDate: new Date('2013-09-06T12:00:00.000Z'),
  endDate: new Date('2013-10-04T12:00:00.000Z')
};
const mockMonthCountIsLeap = 14935;
const mockMonthHasLeap = {
  year: 2140,
  month: 8,
  isLeapMonth: false
};
const mockMonthHasLeapFull = {
  year: 2140,
  month: 8,
  isLeapMonth: false,
  hasLeapMonth: true,
  startDate: new Date('2013-10-05T12:00:00.000Z'),
  endDate: new Date('2013-11-03T12:00:00.000Z')
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
  it('should return true when there is leap month', () => {
    expect(hasLeapMonth(mockMonthHasLeap.year, mockMonthHasLeap.month)).toBeTruthy();
    expect(hasLeapMonth(2146, 1)).toBeTruthy();
    expect(hasLeapMonth(2151, 6)).toBeTruthy();
  });
});

describe('tibetanMonthInfo()', () => {
  it('should give the correct info for simple month', () => {
    const result = tibetanMonthInfo(mockMonthNoLeap.year, mockMonthNoLeap.month, mockMonthNoLeap.isLeapMonth);
    expect(result).toEqual(mockMonthNoLeapFull);
  });
  it('should give the correct info for simple month when leap is wrongly indicated', () => {
    const result = tibetanMonthInfo(mockMonthNoLeap.year, mockMonthNoLeap.month, true);
    expect(result).toEqual(mockMonthNoLeapFull);
  });
  it('should give the correct info for a leap month', () => {
    const result = tibetanMonthInfo(mockMonthIsLeap.year, mockMonthIsLeap.month, mockMonthIsLeap.isLeapMonth);
    expect(result).toEqual(mockMonthIsLeapFull);
  });
  it('should give the correct info for a main month that has leap', () => {
    const result = tibetanMonthInfo(mockMonthHasLeap.year, mockMonthHasLeap.month, mockMonthHasLeap.isLeapMonth);
    expect(result).toEqual(mockMonthHasLeapFull);
  });
});
