import { unixFromJulian, monthCountFromTibetan, trueDateFromMonthCountDay as getTrueDate } from '../conversions';
import { isDoubledMonth, getDateStr } from '../helpers';
import { Month } from '../types';


/**
 * Calculates full information about a Tibetan month: whether it is doubled or not,
 * and the western start and end date for it.
 * The start_date and end_date correspond to the leap month if isLeapMonth is true,
 * otherwise to the main month (i.e the second of the two).
 *
 * @param {object} arg
 * @param {number} arg.year - the Tibetan year
 * @param {number} arg.month - the Tibetan month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - if leap month or not
 * @returns {Month}
 */
const getMonthFromTibetan = ({ year, month, isLeapMonth = false }: { year: number; month: number; isLeapMonth?: boolean }): Month => {
  const hasLeap = isDoubledMonth(year, month);
  const isLeap = isLeapMonth && hasLeap;

  // calculate the Julian date 1st and last of the month
  const monthCount = monthCountFromTibetan({ year, month, isLeapMonth: isLeap });
  const jdFirst = 1 + Math.floor(getTrueDate(30, monthCount - 1));
  const jdLast = Math.floor(getTrueDate(30, monthCount));
  const startDate = getDateStr(unixFromJulian(jdFirst));
  const endDate = getDateStr(unixFromJulian(jdLast));

  return {
    year, month, isLeapMonth: isLeap, isDoubledMonth: hasLeap, startDate, endDate,
  };
};

export default getMonthFromTibetan;
