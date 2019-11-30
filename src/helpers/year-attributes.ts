import {
  YEAR_ANIMALS,
  YEAR_ELEMENTS,
  YEAR_GENDER,
} from '../constants';
import { Year } from '../types';

/**
   * figure out the animal and element for a tibetan year
   *
   * @param {Year} year
   * @return {Year} with additional attributes
   */
const yearAttributes = (year: Year): Year => {
  const thisYear = { ...year };
  const y = thisYear.tibYear;

  thisYear.animal = YEAR_ANIMALS[(y + 1) % 12];
  thisYear.element = YEAR_ELEMENTS[Math.floor(((y - 1) / 2) % 5)];
  thisYear.gender = YEAR_GENDER[(y + 1) % 2];

  return thisYear;
};

export default yearAttributes;
