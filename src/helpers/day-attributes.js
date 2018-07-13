import { SPECIAL_DAYS } from '../constants';

/**
 * figure out if a day is special based on SPECIAL_DAYS const
 * if it is skipped, return its speciality so it can be applied to the next day.
 * on dup days, the special one is the 1st.
 *
 * @param dayNumber
 * @param dayObject
 * @param carriedFromPrevious
 * @return {[attributes, carryover]} - attribute for this day as first arrgument as an array,
 *         and array for special attributes to be applied to next day (carry over) as second arrgument
 */
const dayAttributes = (dayNumber, dayObject, carriedFromPrevious = []) => {
  const attributes = dayObject.attributes || [];
  // apply speciality if carried over from previous day
  if (carriedFromPrevious) {
    carriedFromPrevious.forEach((att) => {
      if (!attributes.includes(att)) {
        attributes.push(att);
      }
    });
  }

  // return early if nothing else to apply
  if (!SPECIAL_DAYS[dayNumber]) {
    return [attributes, []];
  }

  // check if speciality should be carried over or skipped
  if (dayObject.skippedDay) {
    return [attributes, SPECIAL_DAYS[dayNumber]];
  }
  if (dayObject.hasLeapDay && !dayObject.isLeapDay) {
    return [attributes, []];
  }

  // apply speciality while preserving the one from the previous day if applicable
  attributes.concat(SPECIAL_DAYS[dayNumber]);

  return [attributes, []];
};

export default dayAttributes;
