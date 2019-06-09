import getCalendarForMonth from '../get-calendar-for-month';

describe('getCalendarForMonth()', () => {
  it('should return the correct month object for a simple month', () => {
    const month = getCalendarForMonth(2145, 3, false);
    expect(month).toMatchSnapshot();
  });
  it('should return the correct month object for a leap month', () => {
    const month = getCalendarForMonth(2140, 8, true);
    expect(month).toMatchSnapshot();
  });
  it('should return the correct month object for a main month that has a leap', () => {
    const month = getCalendarForMonth(2140, 8, false);
    expect(month).toMatchSnapshot();
  });
});
