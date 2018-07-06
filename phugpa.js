// REFERENCE
// www2.math.uu.se/~svante/papers/calendars/tibet.pdf

// CONSTANTS

// conversion constants

// The beginning of the Rabjung count according to Western calendar, A.D. 1027
const RABJUNG_BEGINNING = 1027;
// length of rabjung cycle in years
const RABJUNG_CYCLE_LENGTH = 60;
// difference between Western and Tibetan year count
const YEAR_DIFF = 127;
// difference between Unix and Julian date starts
const JULIAN_TO_UNIX = 2440587.5;
// number of miliseconds in a year
const MS_IN_YEAR = 86400000;
// number of minutes in day
const MIN_IN_DAY = 1440;

// calendrical constants: month calculations

// begining of epoch based on Kalachakra. Used as 0 for month counts since this time
const YEAR0 = 806;
const MONTH0 = 3;
// constants given in Svante's article
const BETA_STAR = 61;
const BETA = 123;
// const P1 = 77 / 90;
// const P0 = 139 / 180;
// const ALPHA = 1 + 827 / 1005;

// calendrical constants: day calculations
// mean date
const M0 = 2015501 + 4783 / 5656;
const M1 = 167025 / 5656;
const M2 = M1 / 30;
// mean sun
const S0 = 743 / 804;
const S1 = 65 / 804;
const S2 = S1 / 30;
// anomaly moon
const A0 = 475 / 3528;
const A1 = 253 / 3528;
const A2 = 1 / 28;

// fixed tables
const MOON_TAB = [0, 5, 10, 15, 19, 22, 24, 25];
const SUN_TAB = [0, 6, 10, 11];

// year elements & animals
const YEAR_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];
const YEAR_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Rabbit',
  'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
const YEAR_GENDER = ['Male', 'Female'];

// Special Days
const SPECIAL_DAYS = {
  8: 'Medicine Buddha & Tara Day',
  10: 'Guru Rinpoche Day',
  15: 'Amitabha Buddha Day; Full Moon',
  25: 'Dakini Day',
  29: 'Dharmapala Day',
  30: 'Shakyamuni Buddha Day; New Moon',
};

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


// HELPERS

/**
 * fraction part a number
 *
 * @param {number} a - a number to check
 * @returns {number} the fractional part of a number
 */
const frac = a => a % 1;

/**
 * Modulo of a number (a % b), but from 1..b instead of 0..b-1.
 * This means that
 *    amod(a, b) = a % b
 * unless a is a multiple of b. In that case:
 *    a % b = 0 but amod(a, b) = b.
 *
 * @param {number} a - number to be devided
 * @param {number} b - the number to be devided with
 * @return {number}
 */
// TODO: add control for b <= 0. Not urgent as this is not what we expect in calendar calculations (?)
const amod = (a, b) => (a % b) || b;

/**
 * get Julian date from UNIX date
 * see explanation:
 * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
 *
 * @property {Date} unixTime - the date object to be converted
 * @return {number} - julian date
 */
const getJulianDateFromUnix = unixTime => Math.floor(
  unixTime / MS_IN_YEAR
  - unixTime.getTimezoneOffset() / MIN_IN_DAY
  + JULIAN_TO_UNIX
);

/**
 * get Unix date from Julian date
 * since we use only date calculations here, there is no need to correct for timezone differences
 * see explanation:
 * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
 *
 * @param {number} julianDate - the julian date
 * @return {Date}
 */
const getUnixDateFromJulian = (julianDate) => {
  const unixDate = (julianDate - JULIAN_TO_UNIX) * MS_IN_YEAR;

  return new Date(unixDate);
};


// YEAR FUNCTIONS


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
    console.log(`Year number must be between 1 and ${RABJUNG_CYCLE_LENGTH}`);
    return null;
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


// MONTH FUNCTIONS

/**
 * Figures out the Tibetan year number, month number within the year, and whether
 * this is a leap month, from a "month count" number.  See Svante Janson,
 * "Tibetan Calendar Mathematics", p.8 ff.
 *
 * @param {number} monthCount: the "month count" since beginning of epoch
 * @returns {Month}
 */
const fromMonthCount = (monthCount) => {
  // const x = ceil(12 * S1 * n + ALPHA);
  const x = Math.ceil((65 * monthCount + BETA) / 67);
  const month = amod(x, 12);
  const tYear = x / 12 + YEAR0 + YEAR_DIFF;
  const isLeapMonth = Math.ceil((65 * (monthCount + 1) + BETA) / 67) === x;

  return { year: tYear, month, isLeapMonth };
};

/**
 * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
 * and leap month indicator, calculates the "month count" based on the epoch.
 *
 * @param {Month} monthObject
 * @returns {number} month count since epoch
 */
const toMonthCount = ({ year, month, isLeapMonth }) => {
// the formulas on Svante's paper use western year numbers
  const wYear = year - YEAR_DIFF;
  const solarMonth = 12 * (wYear - YEAR0) + month - MONTH0;

  return Math.floor((67 * solarMonth + BETA_STAR + 17) / 65) - isLeapMonth;
// return Math.floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
};

/**
 * Calculates whether a given Tibetan year and month number is duplicated, i.e
 * is preceded by a leap month.
 *
 * @param {number} tYear - tibetan year
 * @param {number} month - month number
 * @returns {boolean}
 */
const hasLeapMonth = (tYear, month) => {
  const mp = 12 * (tYear - YEAR_DIFF - YEAR0) + month;

  return ((2 * mp) % 65 === BETA % 65) || ((2 * mp) % 65 === (BETA + 1) % 65);
};


// MORE INTERNAL FUNCTIONS

// This and the following functions implement partial formulas in Svante's paper.

/**
 * meanDate(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanDate = (day, monthCount) => monthCount * M1 + day * M2 + M0;

/**
 * meanSun(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanSun = (day, monthCount) => monthCount * S1 + day * S2 + S0;

/**
 * moonAnomaly(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const moonAnomaly = (day, monthCount) => monthCount * A1 + day * A2 + A0;

/**
 * moonTabInt (i)
 * Moon tab for integer values
 * @param {number} i
 * @returns {number}
 */
const moonTabInt = (i) => {
  const iMod = i % 28;
  if (iMod <= 7) {
    return MOON_TAB[iMod];
  }
  if (iMod <= 14) {
    return MOON_TAB[14 - iMod];
  }
  if (iMod <= 21) {
    return -MOON_TAB[iMod - 14];
  }
  return -MOON_TAB[28 - iMod];
};

/**
 * moonTab(i)
 * Moon tab, with linear interpolation
 * @param {number} i
 * @returns {number}
 */
const moonTab = (i) => {
  let a = moonTabInt(Math.floor(i));
  const x = frac(i);
  if (x) {
    const b = moonTabInt(Math.floor(i) + 1);
    a += (b - a) * x;
  }

  return a;
};

/**
 * moonEqu(day, monthCount)
 * Equation of the moon.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const moonEqu = (day, monthCount) => moonTab(28 * moonAnomaly(day, monthCount));

/**
 * sunAnomaly(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const sunAnomaly = (day, monthCount) => meanSun(day, monthCount) - 1 / 4;

/**
 * sunTabInt (i)
 * sun_tab for integer values
 * @param {number} i
 * @returns {number}
 */
const sunTabInt = (i) => {
  const iMod = i % 12;
  if (iMod <= 3) {
    return SUN_TAB[iMod];
  }
  if (iMod <= 6) {
    return SUN_TAB[6 - iMod];
  }
  if (iMod <= 9) {
    return -SUN_TAB[iMod - 6];
  }
  return -SUN_TAB[12 - iMod];
};

/**
 * sunTab(i)
 * sun tab, with linear interpolation
 * @param {number} i
 * @returns {number}
 */
const sunTab = (i) => {
  let a = sunTabInt(Math.floor(i));
  const x = frac(i);
  if (x) {
    const b = sunTabInt(Math.floor(i) + 1);
    a += (b - a) * x;
  }

  return a;
};

/**
 * sunEqu(day, monthCount)
 * Equation of the sun.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const sunEqu = (day, monthCount) => sunTab(12 * sunAnomaly(day, monthCount));

/**
 * trueDate(day, monthCount)
 * The date at the end of the lunar day (similar to month count since beginning of epoch, but for days)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const trueDate = (day, monthCount) => (
  meanDate(day, monthCount)
  + moonEqu(day, monthCount) / 60
  - sunEqu(day, monthCount) / 60
);

/**
 * getDayBefore(day, monthCount)
 * substract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {{day, monthCount}}
 */
const getDayBefore = (day, monthCount) => (
  day === 1
    ? { day: 30, monthCount: monthCount - 1 }
    : { day: day - 1, monthCount }
);

/**
 * Gives the Julian date for a Tibetan year, month number (leap or not) and Tibetan day.
 *
 * Does not check that the tibetan day actually exists:
 *  - If given the date of a skipped day, will return the same Julian date as the day before.
 *  - If given the date of a duplicate day, returns the Julian date of the second of the two.
 *
 * @param {number} year - Tibetan year
 * @param {number} month - Tibetan month
 * @param {boolean} isLeapMonth - true if leap month
 * @param {number} day - Tibetan day
 * @returns {number} - Julian date
 */
const tibToJulian = (year, month, isLeapMonth, day) => {
  const monthCount = toMonthCount({ year, month, isLeapMonth });

  return Math.floor(trueDate(day, monthCount));
};

/**
 * Calculates full information for a given Tibetan date
 *
 * For duplicated days, just as with duplicated months, the "main" day or month is
 * the second, and the "leap" day or month is the first.
 *
 * @param {number} year - Tibetan year number (ex. 2135)
 * @param {number} month - month number (1 to 12)
 * @param {boolean} isLeapMonth - is this month a leap month
 * @param {number} day - day number (1 to 30)
 * @param {boolean} isLeapDay - is this day a leap day
 *
 * @returns {Day} day - with all its attributes. isLeapMonth and isLeapDay are checked and corrected compared to input
 */
const tibToWestern = (year, month, isLeapMonth, day, isLeapDay) => {
  let julianDate = tibToJulian(year, month, isLeapMonth, day);

  // also calculate the Julian date of the previous Tib. day
  const monthCount = toMonthCount({ year, month, isLeapMonth });
  const dayBefore = getDayBefore(day, monthCount);
  const julianDatePrevious = Math.floor(trueDate(dayBefore.day, dayBefore.monthCount));

  // figure out leap months, leap days & skipped days
  const hasLeapMonthThis = hasLeapMonth(year, month);
  const hasLeapDayThis = julianDate === julianDatePrevious + 2;
  const skippedDay = julianDate === julianDatePrevious;
  const isLeapDayChecked = isLeapDay && hasLeapDayThis;

  // figure out western date info for the main or leap day
  if (isLeapDayChecked) {
    julianDate--;
  }
  const westernDate = getUnixDateFromJulian(julianDate);

  return ({
    year: yearFromTibetan(year),
    month: {
      year,
      month,
      isLeapMonth: isLeapMonth && hasLeapMonthThis,
      hasLeapMonth: hasLeapMonthThis,
    },
    day,
    skippedDay,
    isLeapDay: isLeapDayChecked,
    hasLeapDay: hasLeapDayThis,
    westernDate,
    julianDate,
  });
};


/**
 * calculates the julian date from the day count a variant of true_date
 * @param {number} dayCount - the day count since beginning of epoch defined as dayNo + 30 * monthCount
 * @return {number} - julian date
 */
const tibDayToJulian = (dayCount) => {
  const monthCount = Math.floor((dayCount - 1) / 30);
  const calculatedDay = dayCount % 30 || 30;

  return Math.floor(trueDate(calculatedDay, monthCount));
};


/**
 * Calculates a Tibetan date for a given western date. This does a binary search, and is therefore
 * much slower than tibToWestern().
 *
 * The algorithm could be much improved by using the reverse of meanDate() to start with,
 * and then using the fact that julian dates and "tibetan day numbers" have a quasi-linear relation.
 *
 * @param {Date} date - the western date
 * @return {Day}
 */
const westernToTib = (date) => {
  // const date = new Date(wYear, wMonth - 1, wDay);
  const wYear = date.getFullYear();
  const jd = getJulianDateFromUnix(date);
  const tibYears = [wYear + YEAR_DIFF - 1, wYear + YEAR_DIFF + 1];
  const monthCounts = tibYears.map(y => toMonthCount({ year: y, month: 1, isLeapMonth: true }));
  const dn = monthCounts.map(m => 1 + 30 * m);
  const jds = dn.map(n => tibDayToJulian(n));
  //   croak "Binary search algo is wrong" unless $jd1 <= $jd && $jd <= $jd2;

  while (dn[0] < dn[1] - 1 && jds[0] < jds[1]) {
    const ndn = Math.floor((dn[0] + dn[1]) / 2);
    const njd = tibDayToJulian(ndn);

    if (njd < jd) {
      dn[0] = ndn;
      jd[0] = njd;
    } else {
      dn[1] = ndn;
      jd[1] = ndn;
    }
  }

  // so we found it; put it in dn[1] & jds[1].
  // if the western date is the 1st of a duplicated tib. day, then jd[0] == jd - 1 and
  // jd[1] == jd + 1, and the corresponding tib. day number is the one from jd[1].
  if (jds[0] === jd) {
    jds[1] = jds[0]; // eslint-disable-line prefer-destructuring
    dn[1] = dn[0]; // eslint-disable-line prefer-destructuring
  }

  // figure out the real tib. date: year, month, leap month, day number, leap day.
  const isLeapDay = jds[1] > jd;
  const monthCount = Math.floor((dn[1] - 1) / 30);
  const day = (dn % 30) || 30;
  const { year, month, isLeapMonth } = fromMonthCount(monthCount);

  return {
    year, month, isLeapMonth, day, isLeapDay,
  };
};


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

module.exports = {
  frac,
  amod,
  getJulianDateFromUnix,
  getUnixDateFromJulian,
  yearAttributes,
  yearFromWestern,
  yearFromRabjung,
  yearFromTibetan,
  toMonthCount,
  fromMonthCount,
  hasLeapMonth,
  meanDate,
  meanSun,
  moonAnomaly,
  moonTab,
  moonTabInt,
  moonEqu,
  sunAnomaly,
  sunTab,
  sunTabInt,
  sunEqu,
  trueDate,
  getDayBefore,
  tibToJulian,
  tibToWestern,
  tibDayToJulian,
  westernToTib,
  losar,
  tibetanMonthInfo,
  specialDay,
  generateMonth,
  yearCalendar
};
