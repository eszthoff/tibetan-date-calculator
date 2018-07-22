import getCalendarForYear from '../get-calendar-for-year';
import { year2018, year2013 } from '../../__mocks__';


describe('getCalendarForYear()', () => {
  it('should return the correct object for a year', () => {
    const year = getCalendarForYear(2145);
    expect(year).toEqual(year2018);
  });
  it('should return the correct object for a year when the western date is given', () => {
    const year = getCalendarForYear(2013, false);
    expect(year).toEqual(year2013);
  });
});
