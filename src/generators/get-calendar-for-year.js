import { isDoubledMonth } from '../helpers';
import getYearFromTibetan from './get-year-from-tibetan';
import getCalendarForMonth from './get-calendar-for-month';
import { YEAR_DIFF } from '../constants';

/** internal helper function */
const getEssentialMonth = ({ days, westernIndex, ...rest }) => rest;

/**
 * Generate a calendar for a whole Tibetan year, given by Tib. year number.
 * @param tibYear
 * @return {Year} - the year's info, including each of the months as an array within .months
 *     Each month includes all the days as an array within .days
 */
const getCalendarForYear = (tYear, isTibetan = true) => {
  const tibYear = isTibetan ? tYear : tYear + YEAR_DIFF;
  const year = getYearFromTibetan(tibYear);

  const months = {};
  let days = {};
  let westernIndex = {};

  for (let m = 1; m <= 12; m++) {
    if (isDoubledMonth(tibYear, m)) {
      const mainMonth = getCalendarForMonth(tibYear, m, true);
      const leapMonth = getCalendarForMonth(tibYear, m, false);

      months[`${tibYear}-${m}`] = { doubled: true };
      months[`${tibYear}-${m}-main`] = getEssentialMonth(mainMonth);
      months[`${tibYear}-${m}-leap`] = getEssentialMonth(leapMonth);
      days = { ...days, ...mainMonth.days, ...leapMonth.days };
      westernIndex = { ...westernIndex, ...mainMonth.westernIndex, ...leapMonth.westernIndex };
    } else {
      const month = getCalendarForMonth(tibYear, m, false);

      months[`${tibYear}-${m}`] = getEssentialMonth(month);
      days = { ...days, ...month.days };
      westernIndex = { ...westernIndex, ...month.westernIndex };
    }
  }

  year.months = months;
  year.days = days;
  year.westernIndex = westernIndex;

  return year;
};

export default getCalendarForYear;
