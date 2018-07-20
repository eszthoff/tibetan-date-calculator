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
 * @property {number} year - th tibetan year this day belong to (e.g. 2150)
 * @property {number} month - tibetan month number this day belongs to
 * @property {number} day - the day number within the Tibetan month
 * @property {boolean} skippedDay - whether this is a skipped day, which does not figure in the calendar
 * @property {boolean} isLeapDay - whether this is a leap day
 * @property {boolean} hasLeapDay - whether this is a duplicated day
 * @property {string} westernDate - the Western date corresponding to the Tibetan day (as provided by unixFromJulian()).
 * @property {number} julianDate - the Julian day number for this Western date
 */
