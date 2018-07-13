import getCalendarForYear from '../get-calendar-for-year';
import { year2018, year2013 } from '../../__mocks__';


describe('getCalendarForYear()', () => {
  it('should return the correct object for a year', () => {
    expect(getCalendarForYear(2145)).toEqual(year2018);
  });
  it('should return the correct object for a year', () => {
    expect(getCalendarForYear(2140)).toEqual(year2013);
  });
});
