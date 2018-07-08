import {
  BETA,
  YEAR0,
  YEAR_DIFF,
  MONTH0,
  BETA_STAR
} from './constants';
import { amod } from './helpers';


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

export {
  toMonthCount,
  fromMonthCount,
  hasLeapMonth
};
