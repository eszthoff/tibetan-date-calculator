import {
  RABJUNG_BEGINNING,
  RABJUNG_CYCLE_LENGTH,
  YEAR_DIFF
} from '../constants';
import { yearAttributes } from '../helpers';

/**
     * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
     *
     * @param {number} rabjungCycle : number of the cycle
     * @param {number} rabjungYear : number of the year within the cycle, from 1 to 60.
     * @returns {null | Year}
     */
const getYearFromRabjung = (rabjungCycle, rabjungYear) => {
  if (rabjungCycle < 1 || rabjungYear > RABJUNG_CYCLE_LENGTH) {
    throw new Error(`Year number must be between 1 and ${RABJUNG_CYCLE_LENGTH}`);
  }
  const wYear = RABJUNG_BEGINNING + (rabjungCycle - 1) * RABJUNG_CYCLE_LENGTH + (rabjungYear - 1);
  const year = yearAttributes({
    rabjungCycle,
    rabjungYear,
    tibYear: wYear + YEAR_DIFF,
    westernYear: wYear,
  });

  return year;
};

export default getYearFromRabjung;
