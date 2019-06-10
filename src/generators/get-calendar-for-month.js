import getMonthFromTibetan from './get-month-from-tibetan';
import TibetanDate from '../classes/tibetan-date';
import { isDoubledMonth } from '../helpers';

/**
 * generate a month with all its days
 *
 * @param {object} arg
 * @param {number} arg.year - tibetan year
 * @param {number} arg.month - month number
 * @param {boolean} [arg.isLeapMonth=false] - if leap month
 * @return {Month}
 */
const getCalendarForMonth = ({ year, month, isLeapMonth = false }) => {
  const thisMonth = getMonthFromTibetan({ year, month, isLeapMonth });
  const days = {};
  const westernIndex = {};
  let monthString = '';
  if (isDoubledMonth(year, month)) {
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
    const day = new TibetanDate({
      year, month, isLeapMonth, day: d, isLeapDay: false
    });
    const dateString = `${monthString}-${d}`;

    if (day.isDoubledDay) {
      const main = new TibetanDate({
        year, month, isLeapMonth, day: d, isLeapDay: true
      });

      days[dateString] = { doubled: true };
      days[`${dateString}-main`] = main;
      days[`${dateString}-leap`] = day;
      westernIndex[main.westernDateStr] = `${dateString}-main`;
      westernIndex[day.westernDateStr] = `${dateString}-leap`;
    } else if (day.isSkippedDay) {
      days[dateString] = day;
    } else {
      days[dateString] = day;
      westernIndex[day.westernDateStr] = dateString;
    }
  }

  thisMonth.days = days;
  thisMonth.westernIndex = westernIndex;
  return thisMonth;
};

export default getCalendarForMonth;
