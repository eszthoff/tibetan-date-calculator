import { hasLeapMonth } from '../helpers';
import getYearFromTibetan from './get-year-from-tibetan';
import getCalendarForMonth from './get-calendar-for-month';

/**
 * Generate a calendar for a whole Tibetan year, given by Tib. year number.
 * @param tibYear
 * @return {Year} - the year's info, including each of the months as an array within .months
 *     Each month includes all the days as an array within .days
 */
const getCalendarForYear = (tibYear) => {
  const year = getYearFromTibetan(tibYear);
  year.months = [];
  for (let m = 1; m <= 12; m++) {
    if (hasLeapMonth(tibYear, m)) {
      year.months.push(getCalendarForMonth(tibYear, m, true));
    }
    year.months.push(getCalendarForMonth(tibYear, m, false));
  }

  return year;
};

export default getCalendarForYear;
