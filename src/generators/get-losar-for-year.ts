import { YEAR_DIFF } from '../constants';
import { julianFromTibetan, unixFromJulian } from '../conversions';
import { getDateStr } from '../helpers';

/**
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
const getLosarForYear = (year: number, isTibetan = true): string => {
  const tibYear = isTibetan ? year : year + YEAR_DIFF;
  const julianDay = 1 + julianFromTibetan(tibYear - 1, 12, false, 30);

  return getDateStr(unixFromJulian(julianDay));
};

export default getLosarForYear;
