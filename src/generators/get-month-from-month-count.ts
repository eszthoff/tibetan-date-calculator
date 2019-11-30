import {
  BETA,
  YEAR0,
  YEAR_DIFF,
} from '../constants';
import { amod } from '../helpers';
import { Month } from '../types'


/**
   * Figures out the Tibetan year number, month number within the year, and whether
   * this is a leap month, from a "month count" number.  See Svante Janson,
   * "Tibetan Calendar Mathematics", p.8 ff.
   *
   * @param {number} monthCount: the "month count" since beginning of epoch
   * @returns {Month}
   */
const getMonthFromMonthCount = (monthCount: number): Month => {
  // const x = ceil(12 * S1 * n + ALPHA);
  const x = Math.ceil((65 * monthCount + BETA) / 67);
  const tMonth = amod(x, 12);
  const tYear = Math.ceil(x / 12) - 1 + YEAR0 + YEAR_DIFF;
  const isLeapMonth = Math.ceil((65 * (monthCount + 1) + BETA) / 67) === x;

  return { year: tYear, month: tMonth, isLeapMonth };
};

export default getMonthFromMonthCount;
