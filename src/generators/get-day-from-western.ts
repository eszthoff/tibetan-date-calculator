import { YEAR_DIFF } from '../constants';
import { julianFromTrueDate, julianFromUnix, monthCountFromTibetan } from '../conversions';
import getMonthFromMonthCount from './get-month-from-month-count';
import getDayFromTibetan from './get-day-from-tibetan';
import { Day } from '../types'

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
const getDayFromWestern = (date: Date): Day => {
  // const date = new Date(wYear, wMonth - 1, wDay);
  const wYear = date.getFullYear();
  const jd = julianFromUnix(date);
  const tibYears = [wYear + YEAR_DIFF - 1, wYear + YEAR_DIFF + 1];
  const monthCounts = tibYears.map(y => monthCountFromTibetan({ year: y, month: 1, isLeapMonth: true }));
  const trueDate = monthCounts.map(m => 1 + 30 * m);
  const jds = trueDate.map(n => julianFromTrueDate(n));
  //   croak "Binary search algorithm is wrong" unless $jd1 <= $jd && $jd <= $jd2;

  while (trueDate[0] < trueDate[1] - 1 && jds[0] < jds[1]) {
    const nTrueDate = Math.floor((trueDate[0] + trueDate[1]) / 2);
    const njd = julianFromTrueDate(nTrueDate);

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
  // if the western date is the 1st of a doubled tib. day, then jd[0] == jd - 1 and
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
  const { year, month, isLeapMonth } = getMonthFromMonthCount(monthCount);

  return getDayFromTibetan({
    year, month, isLeapMonth, day, isLeapDay
  });
};

export default getDayFromWestern;
