import {
  YEAR_ANIMALS,
  YEAR_ELEMENTS,
  YEAR_GENDER,
  RABJUNG_BEGINNING,
  RABJUNG_CYCLE_LENGTH,
  YEAR_DIFF
} from './constants';
import { amod } from './helpers';

/**
 * figure out the animal and element for a tibetan year
 *
 * @param {Year} year
 * @return {Year} with additional attributes
 */
const yearAttributes = (year) => {
  const thisYear = { ...year };
  const y = thisYear.tibYear;

  thisYear.animal = YEAR_ANIMALS[(y + 1) % 12];
  thisYear.element = YEAR_ELEMENTS[((y - 1) / 2) % 5];
  thisYear.gender = YEAR_GENDER[(y + 1) % 2];

  return thisYear;
};

  /**
   * Figures out a year's info from a Western calendar year number, ex. 2008.
   *
   * @param wYear: Western calendar year number, ex. 2008
   * @returns {Year}
   */
const yearFromWestern = wYear => ({
  rabjungCycle: Math.ceil((wYear - RABJUNG_BEGINNING + 1) / RABJUNG_CYCLE_LENGTH),
  rabjungYear: amod(wYear - RABJUNG_BEGINNING + 1, RABJUNG_CYCLE_LENGTH),
  tibYear: wYear + YEAR_DIFF,
  westernYear: wYear,
});

  /**
   * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
   *
   * @param rabjungCycle : number of the cycle
   * @param rabjungYear : number of the year within the cycle, from 1 to 60.
   * @returns {null | Year}
   */
const yearFromRabjung = (rabjungCycle, rabjungYear) => {
  if (rabjungYear < 1 || rabjungYear > RABJUNG_CYCLE_LENGTH) {
    throw new Error(`Year number must be between 1 and ${RABJUNG_CYCLE_LENGTH}`);
  }
  const wYear = RABJUNG_BEGINNING + (rabjungCycle - 1) * RABJUNG_CYCLE_LENGTH + (rabjungYear - 1);

  return {
    rabjungCycle,
    rabjungYear,
    tibYear: wYear + YEAR_DIFF,
    westernYear: wYear,
  };
};

  /**
   * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
   *
   * @param tYear - Tibetan calendar year number, ex. 2135.
   * @returns {Year}
   */
const yearFromTibetan = tYear => yearFromWestern(tYear - YEAR_DIFF);

export {
  yearAttributes,
  yearFromWestern,
  yearFromRabjung,
  yearFromTibetan,
};
