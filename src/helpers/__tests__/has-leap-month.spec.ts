import isDoubledMonth from '../is-doubled-month';
import { simpleMonthMock, mainMonthMock } from '../../__mocks__';

describe('isDoubledMonth()', () => {
  it('should return false when there is no leap month', () => {
    expect(isDoubledMonth(simpleMonthMock.info.year, simpleMonthMock.info.month)).toBeFalsy();
    expect(isDoubledMonth(2146, 2)).toBeFalsy();
    expect(isDoubledMonth(2151, 5)).toBeFalsy();
  });
  it('should return true when there is leap month', () => {
    expect(isDoubledMonth(mainMonthMock.info.year, mainMonthMock.info.month)).toBeTruthy();
    expect(isDoubledMonth(2146, 1)).toBeTruthy();
    expect(isDoubledMonth(2151, 6)).toBeTruthy();
  });
});
