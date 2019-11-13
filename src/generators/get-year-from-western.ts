import {
  RABJUNG_BEGINNING,
  RABJUNG_CYCLE_LENGTH,
  YEAR_DIFF
} from '../constants';
import { amod, yearAttributes } from '../helpers';
import { Year } from '../types'

/**
     * Figures out a year's info from a Western calendar year number, ex. 2008.
     *
     * @param {number} wYear: Western calendar year number, ex. 2008
     * @returns {Year}
     */
const getYearFromWestern = (wYear: number): Year => (yearAttributes({
  rabjungCycle: Math.ceil((wYear - RABJUNG_BEGINNING + 1) / RABJUNG_CYCLE_LENGTH),
  rabjungYear: amod(wYear - RABJUNG_BEGINNING + 1, RABJUNG_CYCLE_LENGTH),
  tibYear: wYear + YEAR_DIFF,
  westernYear: wYear,
}));

export default getYearFromWestern;
