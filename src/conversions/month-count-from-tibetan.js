import {
  YEAR0,
  YEAR_DIFF,
  MONTH0,
  BETA_STAR
} from '../constants';
import { hasLeapMonth } from '../helpers';

/**
     * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
     * and leap month indicator, calculates the "month count" based on the epoch.
     *
     * @param {Month} monthObject
     * @returns {number} month count since epoch
     */
const monthCountFromTibetan = ({ year, month, isLeapMonth }) => {
  // the formulas on Svante's paper use western year numbers
  const wYear = year - YEAR_DIFF;
  const solarMonth = 12 * (wYear - YEAR0) + month - MONTH0;
  const hasLeap = hasLeapMonth(year, month);
  const isLeap = hasLeap && isLeapMonth ? 1 : 0;

  return Math.floor((67 * solarMonth + BETA_STAR + 17) / 65) - isLeap;
  // return Math.floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
};

export default monthCountFromTibetan;
