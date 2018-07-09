import { tibToWestern, tibToJulian } from './calendar-conversions';
import { tibetanMonthInfo, hasLeapMonth } from './month';
import { getUnixDateFromJulian } from './helpers';
import { SPECIAL_DAYS } from './constants';
import { yearFromTibetan } from './year';

/**
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
const getLosarForTibeatanYear = (tibYear) => {
  const julianDay = 1 + tibToJulian(tibYear - 1, 12, 0, 30);

  return getUnixDateFromJulian(julianDay);
};

/**
 * figure out if a day is special based on SPECIAL_DAYS const
 * if it is skipped, return its speciality so it can be applied to the next day.
 * on dup days, the special one is the 1st.
 *
 * @param dayNumber
 * @param dayObject
 * @param carriedFromPrevious
 * @return {null | string} - adds attribute special day to dayObject if applicable
 *         and null or string for special day to be applied to next day (carry over)
 */
const specialDay = (dayNumber, dayObject, carriedFromPrevious) => {
  // apply speciality if carried over from previous day
  if (carriedFromPrevious) {
    // eslint-disable-next-line no-param-reassign
    dayObject.specialDay = `${carriedFromPrevious} (carried over from previous day)`;
  }

  if (!SPECIAL_DAYS[dayNumber]) {
    return null;
  }

  // check if speciality should be carried over or skipped
  if (dayObject.skippedDay) {
    return SPECIAL_DAYS[dayNumber];
  }
  if (dayObject.hasLeapDay && !dayObject.isLeapDay) {
    return null;
  }

  // apply speciality while preserving the one from the previous day if applicable
  // eslint-disable-next-line no-param-reassign
  dayObject.specialDay = dayObject.specialDay
    ? dayObject.specialDay.concat(`; ${SPECIAL_DAYS[dayNumber]}`)
    : dayObject.specialDay = SPECIAL_DAYS[dayNumber]; // eslint-disable-line no-param-reassign

  return null;
};


/**
 * generate a month with all its days
 *
 * @param {number} year - tibetan year
 * @param {number} month - month number
 * @param {boolean} isLeapMonth - if leap month
 * @return {Month}
 */
const getTibetanCalendarForMonth = (year, month, isLeapMonth) => {
  const thisMonth = tibetanMonthInfo(year, month, isLeapMonth);
  let carrySpecial = null;
  const days = [];

  // loop over the days, taking care of duplicate and missing days
  for (let d = 1; d <= 30; d++) {
    const day = tibToWestern(year, month, isLeapMonth, d, false);

    // insert leap days before the main day
    if (day.hasLeapDay) {
      const day2 = tibToWestern(year, month, isLeapMonth, d, true);
      carrySpecial = specialDay(d, day2, carrySpecial);
      days.push(day2);
    }

    carrySpecial = specialDay(d, day, carrySpecial);
    if (day.skippedDay) {
      d++;
    }

    days.push(day);
  }

  thisMonth.days = days;
  return thisMonth;
};

/**
 * Generate a calendar for a whole Tibetan year, given by Tib. year number.
 * @param tibYear
 * @return {Year} - the year's info, including each of the months as an array within .months
 *     Each month includes all the days as an array within .days
 */
const getTibetanCalendarForYear = (tibYear) => {
  const year = yearFromTibetan(tibYear);
  year.months = [];
  for (let m = 1; m <= 12; m++) {
    if (hasLeapMonth(tibYear, m)) {
      year.months.push(getTibetanCalendarForMonth(tibYear, m, true));
    }
    year.months.push(getTibetanCalendarForMonth(tibYear, m, false));
  }

  return year;
};

export {
  getLosarForTibeatanYear,
  tibetanMonthInfo,
  specialDay,
  getTibetanCalendarForMonth,
  getTibetanCalendarForYear
};
