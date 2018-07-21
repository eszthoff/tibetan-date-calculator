import getMonthFromTibetan from './get-month-from-tibetan';
import getDayFromTibetan from './get-day-from-tibetan';
import { hasLeapMonth } from '../helpers';

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
  let monthString = '';
  if (hasLeapMonth(year, month)) {
    if (isLeapMonth) {
      monthString = `${year}-${month}-leap`;
    } else {
      monthString = `${year}-${month}-main`;
    }
  } else {
    monthString = `${year}-${month}`;
  }

  // loop over the days, taking care of duplicate and missing days
  for (let d = 1; d <= 30; d++) {
    const day = getDayFromTibetan(year, month, isLeapMonth, d, false);
    const dateString = `${monthString}-${d}`;

    if (day.hasLeapDay) {
      const main = getDayFromTibetan(year, month, isLeapMonth, d, true);

      days[dateString] = { doubled: true };
      days[`${dateString}-main`] = main;
      days[`${dateString}-leap`] = day;
      westernIndex[main.westernDate] = `${dateString}-main`;
      westernIndex[day.westernDate] = `${dateString}-leap`;
    } else if (day.skippedDay) {
      days[dateString] = day;
    } else {
      days[dateString] = day;
      westernIndex[day.westernDate] = dateString;
    }
  }

  thisMonth.days = days;
  thisMonth.westernIndex = westernIndex;
  return thisMonth;
};

export default getCalendarForMonth;
