import {
  BETA,
  YEAR0,
  YEAR_DIFF,
  MONTH0,
  BETA_STAR
} from './constants';
import { amod, getUnixDateFromJulian } from './helpers';
import { getTrueDate } from './sun-moon';


/**
 * Figures out the Tibetan year number, month number within the year, and whether
 * this is a leap month, from a "month count" number.  See Svante Janson,
 * "Tibetan Calendar Mathematics", p.8 ff.
 *
 * @param {number} monthCount: the "month count" since beginning of epoch
 * @returns {Month}
 */
const fromMonthCount = (monthCount) => {
  // const x = ceil(12 * S1 * n + ALPHA);
  const x = Math.ceil((65 * monthCount + BETA) / 67);
  const tMonth = amod(x, 12);
  const tYear = Math.ceil(x / 12) - 1 + YEAR0 + YEAR_DIFF;
  const isLeapMonth = Math.ceil((65 * (monthCount + 1) + BETA) / 67) === x;

  return { year: tYear, month: tMonth, isLeapMonth };
};

  /**
   * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
   * and leap month indicator, calculates the "month count" based on the epoch.
   *
   * @param {Month} monthObject
   * @returns {number} month count since epoch
   */
const toMonthCount = ({ year, month, isLeapMonth }) => {
  // the formulas on Svante's paper use western year numbers
  const wYear = year - YEAR_DIFF;
  const solarMonth = 12 * (wYear - YEAR0) + month - MONTH0;
  const isLeap = isLeapMonth ? 1 : 0;

  return Math.floor((67 * solarMonth + BETA_STAR + 17) / 65) - isLeap;
  // return Math.floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
};

  /**
   * Calculates whether a given Tibetan year and month number is duplicated, i.e
   * is preceded by a leap month.
   *
   * @param {number} tYear - tibetan year
   * @param {number} month - month number
   * @returns {boolean}
   */
const hasLeapMonth = (tYear, month) => {
  const mp = 12 * (tYear - YEAR_DIFF - YEAR0) + month;

  return ((2 * mp) % 65 === BETA % 65) || ((2 * mp) % 65 === (BETA + 1) % 65);
};

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
const tibetanMonthInfo = (year, month, isLeapMonth) => {
  const hasLeap = hasLeapMonth(year, month);
  const isLeap = isLeapMonth && hasLeap;

  // calculate the Julian date 1st and last of the month
  const monthCount = toMonthCount({ year, month, isLeapMonth: isLeap });
  const jdFirst = 1 + Math.floor(getTrueDate(30, monthCount - 1));
  const jdLast = Math.floor(getTrueDate(30, monthCount));
  const startDate = getUnixDateFromJulian(jdFirst);
  const endDate = getUnixDateFromJulian(jdLast);

  return {
    year, month, isLeapMonth: isLeap, hasLeapMonth: hasLeap, startDate, endDate,
  };
};

export {
  toMonthCount,
  fromMonthCount,
  hasLeapMonth,
  tibetanMonthInfo
};
