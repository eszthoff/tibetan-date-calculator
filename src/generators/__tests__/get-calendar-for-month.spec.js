import getCalendarForMonth from '../get-calendar-for-month';
import { month214502 } from '../../__mocks__';

describe('getCalendarForMonth()', () => {
  it('should return the correct month object', () => {
    expect(getCalendarForMonth(2145, 2, false)).toEqual(month214502);
  });
});
