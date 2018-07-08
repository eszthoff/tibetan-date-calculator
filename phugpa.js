// REFERENCE
// www2.math.uu.se/~svante/papers/calendars/tibet.pdf

// TYPE DEFINITIONS FOR JSDOCS

/**
 * A year
 * @typedef {Object} Year
 * @property {number} rabjungCycle - number of the cycle
 * @property {number} rabjungYear - number of the year within the cycle, from 1 to 60.
 * @property {number} westernYear - western year during which most of the given tibetan year falls
 * @property {number} tibYear - tibetan year number (i.e western year + 127)
 * @property {Array} [months] - an array of Month objects that describe the month of this year
 * @property {string} [element] - the year's element
 * @property {string} [gender] - the gender for the year
 * @property {string} [animal] - animal sign of the year
 */

/**
 * A month
 * @typedef {Object} Month
 * @property {number} year - Tibetan year
 * @property {number} month - month within the Tibetan year
 * @property {boolean} isLeapMonth - true if leap month
 * @property {boolean} [hasLeapMonth] - true if month is duplicated
 * @property {Date} [startDate] - the western date of the first date of the month
 * @property {Date} [endDate] - the western date of the last date of the month
 * @property {Array} [days] - and array of Day objects that make up the month
 */

/**
 * A day
 * @typedef {Object} Day
 * @property {Year | number} year - a year object
 * @property {Month | number} month - tibetan month number
 * @property {number} day - the day number within the Tibetan month
 * @property {boolean} skippedDay - whether this is a skipped day, which does not figure in the calendar
 * @property {boolean} isLeapDay - whether this is a leap day
 * @property {boolean} hasLeapDay - whether this is a duplicated day
 * @property {Date} westernDate - the Western date corresponding to the Tibetan day.
 * @property {number} julianDate - the Julian day number for this Western date
 */




/**
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
const losar = (tibYear) => {
  const julianDay = 1 + tibToJulian(tibYear - 1, 12, 0, 30);

  return getUnixDateFromJulian(julianDay);
};

/**
 * Calculates full information about a Tibetan month: whether it is duplicated or not,
 * and the western start and end date for it.
 * The start_date and end_date correspond to the leap month if isLeapMonth is passed,
 * otherwise to the main month (i.e the second of the two).
 *
 * @param {number} year - the Tibetan year
 * @param {number} month - the Tibetan month number (1 to 12)
 * @param {boolean} isLeapMonth - if leap month or not
 * @returns {Month}
 */
const tibetanMonthInfo = (year, month, isLeapMonth) => {
  const hasLeap = hasLeapMonth(year, month);
  const isLeap = isLeapMonth && hasLeap;

  // calculate the Julian date 1st and last of the month
  const monthCount = toMonthCount({ year, month, isLeapMonth: isLeap });
  const jdFirst = 1 + Math.floor(trueDate(30, monthCount - 1));
  const jdLast = Math.floor(trueDate(30, monthCount));
  const startDate = getUnixDateFromJulian(jdFirst);
  const endDate = getUnixDateFromJulian(jdLast);

  return {
    year, month, isLeapMonth: isLeap, hasLeapMonth: hasLeap, startDate, endDate,
  };
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
const generateMonth = (year, month, isLeapMonth) => {
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


// =head2 year_calendar($tib_year)

// Generate a calendar for a whole Tibetan year, given by Tib. year number.

// Returns: a hashref containing the year's info, including each of the months
// in succession within $year->{months}.  Each month includes all the days in
// succession within $month->{days}.

// =cut
/**
 * Generate a calendar for a whole Tibetan year, given by Tib. year number.
 * @param tibYear
 * @return {Year} - the year's info, including each of the months as an array within .months
 *     Each month includes all the days as an array within .days
 */
const yearCalendar = (tibYear) => {
  const year = yearFromTibetan(tibYear);
  year.months = [];
  for (let m = 1; m <= 12; m++) {
    if (hasLeapMonth(tibYear, m)) {
      year.months.push(generateMonth(tibYear, m, true));
    }
    year.months.push(generateMonth(tibYear, m, false));
  }

  return year;
};

export {
  losar,
  tibetanMonthInfo,
  specialDay,
  generateMonth,
  yearCalendar
};
