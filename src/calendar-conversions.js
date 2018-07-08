import { YEAR_DIFF } from './constants';
import { toMonthCount, fromMonthCount, hasLeapMonth } from './month';
import { yearFromTibetan } from './year';
import { getTrueDate, getDayBefore } from './sun-moon';
import { getJulianDateFromUnix, getUnixDateFromJulian } from './helpers';

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

  return Math.floor(getTrueDate(day, monthCount));
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
  const julianDatePrevious = Math.floor(getTrueDate(dayBefore.day, dayBefore.monthCount));

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
const trueDateToJulian = (dayCount) => {
  const monthCount = Math.floor((dayCount - 1) / 30);
  const calculatedDay = dayCount % 30 || 30;

  return Math.floor(getTrueDate(calculatedDay, monthCount));
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
  const trueDate = monthCounts.map(m => 1 + 30 * m);
  const jds = trueDate.map(n => trueDateToJulian(n));
  //   croak "Binary search algo is wrong" unless $jd1 <= $jd && $jd <= $jd2;

  while (trueDate[0] < trueDate[1] - 1 && jds[0] < jds[1]) {
    const nTrueDate = Math.floor((trueDate[0] + trueDate[1]) / 2);
    const njd = trueDateToJulian(nTrueDate);

    if (njd < jd) {
      trueDate[0] = nTrueDate;
      jds[0] = njd;
    } else {
      trueDate[1] = nTrueDate;
      jds[1] = njd;
    }
  }

  // so we found it;
  let winnerJd;
  let winnerTrueDate;
  // if the western date is the 1st of a duplicated tib. day, then jd[0] == jd - 1 and
  // jd[1] == jd + 1, and the corresponding tib. day number is the one from jd[1].
  if (jds[0] === jd) {
    winnerJd = jds[0]; // eslint-disable-line prefer-destructuring
    winnerTrueDate = trueDate[0]; // eslint-disable-line prefer-destructuring
  } else {
    winnerJd = jds[1]; // eslint-disable-line prefer-destructuring
    winnerTrueDate = trueDate[1]; // eslint-disable-line prefer-destructuring
  }

  // figure out the real tib. date: year, month, leap month, day number, leap day.
  const isLeapDay = winnerJd > jd;
  const monthCount = Math.floor((winnerTrueDate - 1) / 30);
  const day = (winnerTrueDate % 30) || 30;
  const { year, month, isLeapMonth } = fromMonthCount(monthCount);

  return {
    year, month, isLeapMonth, day, isLeapDay,
  };
};

export {
  tibToJulian,
  tibToWestern,
  trueDateToJulian,
  westernToTib,
};
