import {
  BETA,
  YEAR0,
  YEAR_DIFF,
} from '../constants';

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

export default hasLeapMonth;
