import getMonthFromTibetan from './get-month-from-tibetan';
import getDayFromTibetan from './get-day-from-tibetan';
import dayAttributes from '../helpers';

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
  let carrySpecial = [];
  const days = [];

  // loop over the days, taking care of duplicate and missing days
  for (let d = 1; d <= 30; d++) {
    const day = getDayFromTibetan(year, month, isLeapMonth, d, false);

    // insert leap days before the main day
    if (day.hasLeapDay) {
      const day2 = getDayFromTibetan(year, month, isLeapMonth, d, true);
      [day2.attributes, carrySpecial] = dayAttributes(d, day2, carrySpecial);
      days.push(day2);
    }

    [day.attributes, carrySpecial] = dayAttributes(d, day, carrySpecial);
    if (day.skippedDay) {
      d++;
    }

    days.push(day);
  }

  thisMonth.days = days;
  return thisMonth;
};

export default getCalendarForMonth;
