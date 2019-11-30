import {
  YEAR0,
  YEAR_DIFF,
  MONTH0,
  BETA_STAR
} from '../constants';
import { isDoubledMonth } from '../helpers';
import { Month } from '../types'

/**
     * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
     * and leap month indicator, calculates the "month count" based on the epoch.
     *
     * @param {Month} monthObject
     * @returns {number} month count since epoch
     */
const monthCountFromTibetan = ({ year, month, isLeapMonth }: Month): number => {
  // the formulas on Svante's paper use western year numbers
  const wYear = year - YEAR_DIFF;
  const solarMonth = 12 * (wYear - YEAR0) + month - MONTH0;
  const hasLeap = isDoubledMonth(year, month);
  const isLeap = hasLeap && isLeapMonth ? 1 : 0;

  return Math.floor((67 * solarMonth + BETA_STAR + 17) / 65) - isLeap;
  // return Math.floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
};

export default monthCountFromTibetan;
