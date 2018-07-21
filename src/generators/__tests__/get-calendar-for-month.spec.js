import getCalendarForMonth from '../get-calendar-for-month';
import { month214502, month214008leap, month214008main } from '../../__mocks__';

describe('getCalendarForMonth()', () => {
  it('should return the correct month object for a simple month', () => {
    const month = getCalendarForMonth(2145, 3, false);
    expect(month).toEqual(month214502);
  });
  it('should return the correct month object for a leap month', () => {
    const month = getCalendarForMonth(2140, 8, true);
    expect(month).toEqual(month214008leap);
  });
  it('should return the correct month object for a main month that has a leap', () => {
    const month = getCalendarForMonth(2140, 8, false);
    expect(month).toEqual(month214008main);
  });
});
