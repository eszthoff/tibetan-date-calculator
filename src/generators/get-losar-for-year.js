import { YEAR_DIFF } from '../constants';
import { julianFromTibetan, unixFromJulian } from '../conversions';

/**
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
const getLosarForYear = (year, isTibetan = true) => {
  const tibYear = isTibetan ? year : year + YEAR_DIFF;
  const julianDay = 1 + julianFromTibetan(tibYear - 1, 12, 0, 30);

  return unixFromJulian(julianDay);
};

export default getLosarForYear;
