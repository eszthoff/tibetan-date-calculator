import { YEAR_DIFF } from '../constants';
import getYearFromWestern from './get-year-from-western';
import { Year } from '../types'

/**
   * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
   *
   * @param {number} tYear - Tibetan calendar year number, ex. 2135.
   * @returns {Year}
   */
const getYearFromTibetan = (tYear: number): Year => getYearFromWestern(tYear - YEAR_DIFF);

export default getYearFromTibetan;
