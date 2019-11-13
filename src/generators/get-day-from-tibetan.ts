import {
  julianFromTibetan, monthCountFromTibetan, trueDateFromMonthCountDay, unixFromJulian
} from '../conversions';
import { getDayBefore, isDoubledMonth } from '../helpers';
import { Day } from '../types';

/**
   * Calculates full information for a given Tibetan date
   *
   * For doubled days, just as with doubled months, the "main" day or month is
   * the second, and the "leap" day or month is the first.
   *
   * @param {object} arg
   * @param {number} arg.year - Tibetan year number (ex. 2135)
   * @param {number} arg.month - month number (1 to 12)
   * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
   * @param {number} arg.day - day number (1 to 30)
   * @param {boolean} [arg.isLeapDay=false] - is this day a leap day
   *
   * @returns {Day} day - with all its attributes. isLeapMonth and isLeapDay are checked and corrected compared to input
   */
const getDayFromTibetan = ({
  year,
  month,
  isLeapMonth = false,
  day,
  isLeapDay = false
}: {
  year: number,
  month: number,
  isLeapMonth?: boolean,
  day: number,
  isLeapDay?: boolean
}): Day => {
  let julianDate = julianFromTibetan(year, month, isLeapMonth, day);

  // also calculate the Julian date of the previous Tib. day
  const monthCount = monthCountFromTibetan({ year, month, isLeapMonth });
  const dayBefore = getDayBefore(day, monthCount);
  const julianDatePrevious = Math.floor(trueDateFromMonthCountDay(dayBefore.day, dayBefore.monthCount));
  const twoDaysBefore = getDayBefore(dayBefore.day, dayBefore.monthCount);
  const julianDate2DaysBefore = Math.floor(trueDateFromMonthCountDay(twoDaysBefore.day, twoDaysBefore.monthCount));

  // figure out leap months, leap days & skipped days
  const isDoubledMonthThis = isDoubledMonth(year, month);
  const hasLeapDayThis = julianDate === julianDatePrevious + 2;
  const skippedDay = julianDate === julianDatePrevious;
  const isPreviousSkipped = julianDatePrevious === julianDate2DaysBefore;
  const isLeapDayChecked = isLeapDay && hasLeapDayThis;

  // figure out western date info for the main or leap day
  if (isLeapDayChecked) {
    julianDate--;
  }
  const westernDate = unixFromJulian(julianDate);

  return ({
    year,
    month: {
      month,
      isLeapMonth: isLeapMonth && isDoubledMonthThis,
      isDoubledMonth: isDoubledMonthThis,
    },
    day,
    skippedDay,
    isPreviousSkipped,
    isLeapDay: isLeapDayChecked,
    isDoubledDay: hasLeapDayThis,
    westernDate
  });
};

export default getDayFromTibetan;
