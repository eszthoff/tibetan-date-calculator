import getMonthFromTibetan from '../get-month-from-tibetan';
import { simpleMonthMock, leapMonthMock, mainMonthMock } from '../../__mocks__';


describe('getMonthFromTibetan()', () => {
  it('should give the correct info for simple month', () => {
    const result = getMonthFromTibetan(
      simpleMonthMock.info.year,
      simpleMonthMock.info.month,
      simpleMonthMock.info.isLeapMonth
    );
    expect(result).toEqual(simpleMonthMock.fullInfo);
  });
  it('should give the correct info for simple month when leap is wrongly indicated', () => {
    const result = getMonthFromTibetan(
      simpleMonthMock.info.year,
      simpleMonthMock.info.month,
      true
    );
    expect(result).toEqual(simpleMonthMock.fullInfo);
  });
  it('should give the correct info for a leap month', () => {
    const result = getMonthFromTibetan(
      leapMonthMock.info.year,
      leapMonthMock.info.month,
      leapMonthMock.info.isLeapMonth
    );
    expect(result).toEqual(leapMonthMock.fullInfo);
  });
  it('should give the correct info for a main month that has leap', () => {
    const result = getMonthFromTibetan(
      mainMonthMock.info.year,
      mainMonthMock.info.month,
      mainMonthMock.info.isLeapMonth
    );
    expect(result).toEqual(mainMonthMock.fullInfo);
  });
});
