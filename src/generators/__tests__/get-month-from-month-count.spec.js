import getMonthFromMonthCount from '../get-month-from-month-count';
import { simpleMonthMock, leapMonthMock, mainMonthMock } from '../../__mocks__';

describe('getMonthFromMonthCount()', () => {
  it('should return the correct month', () => {
    expect(getMonthFromMonthCount(simpleMonthMock.monthCount)).toEqual(simpleMonthMock.info);
  });
  it('should return the correct leap month', () => {
    expect(getMonthFromMonthCount(leapMonthMock.monthCount)).toEqual(leapMonthMock.info);
  });
  it('should return the correct month for not leap month that has a leap', () => {
    expect(getMonthFromMonthCount(mainMonthMock.monthCount)).toEqual(mainMonthMock.info);
  });
});
