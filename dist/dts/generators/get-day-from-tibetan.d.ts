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
declare const getDayFromTibetan: ({ year, month, isLeapMonth, day, isLeapDay }: {
    year: number;
    month: number;
    isLeapMonth?: boolean;
    day: number;
    isLeapDay?: boolean;
}) => Day;
export default getDayFromTibetan;
