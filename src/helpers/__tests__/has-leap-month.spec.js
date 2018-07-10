import hasLeapMonth from '../has-leap-month';
import { simpleMonthMock, mainMonthMock } from '../../__mocks__';

describe('hasLeapMonth()', () => {
  it('should return false when there is no leap month', () => {
    expect(hasLeapMonth(simpleMonthMock.info.year, simpleMonthMock.info.month)).toBeFalsy();
    expect(hasLeapMonth(2146, 2)).toBeFalsy();
    expect(hasLeapMonth(2151, 5)).toBeFalsy();
  });
  it('should return true when there is leap month', () => {
    expect(hasLeapMonth(mainMonthMock.info.year, mainMonthMock.info.month)).toBeTruthy();
    expect(hasLeapMonth(2146, 1)).toBeTruthy();
    expect(hasLeapMonth(2151, 6)).toBeTruthy();
  });
});
