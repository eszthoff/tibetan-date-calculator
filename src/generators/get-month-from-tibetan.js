import { unixFromJulian, monthCountFromTibetan, trueDateFromMonthCountDay as getTrueDate } from '../conversions';
import { hasLeapMonth } from '../helpers';


/**
 * Calculates full information about a Tibetan month: whether it is duplicated or not,
 * and the western start and end date for it.
 * The start_date and end_date correspond to the leap month if isLeapMonth is passed,
 * otherwise to the main month (i.e the second of the two).
 *
 * @param {number} year - the Tibetan year
 * @param {number} month - the Tibetan month number (1 to 12)
 * @param {boolean} isLeapMonth - if leap month or not
 * @returns {Month}
 */
const getMonthFromTibetan = (year, month, isLeapMonth) => {
  const hasLeap = hasLeapMonth(year, month);
  const isLeap = isLeapMonth && hasLeap;

  // calculate the Julian date 1st and last of the month
  const monthCount = monthCountFromTibetan({ year, month, isLeapMonth: isLeap });
  const jdFirst = 1 + Math.floor(getTrueDate(30, monthCount - 1));
  const jdLast = Math.floor(getTrueDate(30, monthCount));
  const startDate = unixFromJulian(jdFirst);
  const endDate = unixFromJulian(jdLast);

  return {
    year, month, isLeapMonth: isLeap, hasLeapMonth: hasLeap, startDate, endDate,
  };
};

export default getMonthFromTibetan;
