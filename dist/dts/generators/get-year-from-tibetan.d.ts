import { Year } from '../types';
/**
   * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
   *
   * @param {number} tYear - Tibetan calendar year number, ex. 2135.
   * @returns {Year}
   */
declare const getYearFromTibetan: (tYear: number) => Year;
export default getYearFromTibetan;
