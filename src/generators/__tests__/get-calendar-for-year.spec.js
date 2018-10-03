import getCalendarForYear from '../get-calendar-for-year';


describe('getCalendarForYear()', () => {
  it('should return the correct object for a year', () => {
    const year = getCalendarForYear(2145);
    expect(year).toMatchSnapshot();
  });
  it('should return the correct object for a year when the western date is given', () => {
    const year = getCalendarForYear(2013, false);
    expect(year).toMatchSnapshot();
  });
});
