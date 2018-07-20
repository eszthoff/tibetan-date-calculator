import getMonthFromTibetan from './get-month-from-tibetan';
import getDayFromTibetan from './get-day-from-tibetan';

/**
 * generate a month with all its days
 *
 * @param {number} year - tibetan year
 * @param {number} month - month number
 * @param {boolean} isLeapMonth - if leap month
 * @return {Month}
 */
const getCalendarForMonth = (year, month, isLeapMonth) => {
  const thisMonth = getMonthFromTibetan(year, month, isLeapMonth);
  const days = {};
  const westernIndex = {};

  // loop over the days, taking care of duplicate and missing days
  for (let d = 1; d <= 30; d++) {
    const day = getDayFromTibetan(year, month, isLeapMonth, d, false);

    // insert leap days before the main day
    if (day.hasLeapDay) {
      const main = getDayFromTibetan(year, month, isLeapMonth, d, true);

      days[d] = { doubled: true };
      days[`${d}-main`] = main;
      days[`${d}-leap`] = day;
      westernIndex[main.westernDate] = `${year}-${month}-${d}-main`;
      westernIndex[day.westernDate] = `${year}-${month}-${d}-leap`;
    } else {
      days[d] = day;
    }
  }

  thisMonth.days = days;
  return thisMonth;
};

export default getCalendarForMonth;
