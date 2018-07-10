import monthCountFromTibetan from '../month-count-from-tibetan';
import { simpleMonthMock, leapMonthMock, mainMonthMock } from '../../__mocks__';

describe('monthCountFromTibetan()', () => {
  it('should return the correct month count for non leap month', () => {
    expect(monthCountFromTibetan(simpleMonthMock.info)).toEqual(simpleMonthMock.monthCount);
  });
  it('should return the correct month count for leap month', () => {
    expect(monthCountFromTibetan(leapMonthMock.info)).toEqual(leapMonthMock.monthCount);
  });
  it('should return the correct month count for not leap month that has a leap', () => {
    expect(monthCountFromTibetan(mainMonthMock.info)).toEqual(mainMonthMock.monthCount);
  });
});
