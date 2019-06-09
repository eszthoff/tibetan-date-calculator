import getCalendarForMonth from '../get-calendar-for-month';

describe('getCalendarForMonth()', () => {
  it('should return the correct month object for a simple month', () => {
    const month = getCalendarForMonth({ year: 2145, month: 3 });
    expect(month).toMatchSnapshot();
  });
  it('should return the correct month object for a leap month', () => {
    const month = getCalendarForMonth({ year: 2140, month: 8, isLeapMonth: true });
    expect(month).toMatchSnapshot();
  });
  it('should return the correct month object for a main month that has a leap', () => {
    const month = getCalendarForMonth({ year: 2140, month: 8 });
    expect(month).toMatchSnapshot();
  });
});
