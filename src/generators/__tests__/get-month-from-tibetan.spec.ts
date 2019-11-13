import getMonthFromTibetan from '../get-month-from-tibetan';
import { simpleMonthMock, leapMonthMock, mainMonthMock } from '../../__mocks__';


describe('getMonthFromTibetan()', () => {
  it('should give the correct info for simple month', () => {
    const result = getMonthFromTibetan({
      year: simpleMonthMock.info.year,
      month: simpleMonthMock.info.month,
      isLeapMonth: simpleMonthMock.info.isLeapMonth
    });
    expect(result).toEqual(simpleMonthMock.fullInfo);
  });
  it('should give the correct info for simple month when leap is wrongly indicated', () => {
    const result = getMonthFromTibetan({
      year: simpleMonthMock.info.year,
      month: simpleMonthMock.info.month,
      isLeapMonth: true
    });
    expect(result).toEqual(simpleMonthMock.fullInfo);
  });
  it('should give the correct info for a leap month', () => {
    const result = getMonthFromTibetan({
      year: leapMonthMock.info.year,
      month: leapMonthMock.info.month,
      isLeapMonth: leapMonthMock.info.isLeapMonth
    });
    expect(result).toEqual(leapMonthMock.fullInfo);
  });
  it('should give the correct info for a main month that has leap', () => {
    const result = getMonthFromTibetan({
      year: mainMonthMock.info.year,
      month: mainMonthMock.info.month,
      isLeapMonth: mainMonthMock.info.isLeapMonth
    });
    expect(result).toEqual(mainMonthMock.fullInfo);
  });
});
