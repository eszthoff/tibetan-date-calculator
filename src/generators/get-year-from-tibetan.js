import { YEAR_DIFF } from '../constants';
import getYearFromWestern from './get-year-from-western';

/**
   * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
   *
   * @param tYear - Tibetan calendar year number, ex. 2135.
   * @returns {Year}
   */
const getYearFromTibetan = tYear => getYearFromWestern(tYear - YEAR_DIFF);

export default getYearFromTibetan;
