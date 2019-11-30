import { Month } from '../types';
/**
 * Calculates full information about a Tibetan month: whether it is doubled or not,
 * and the western start and end date for it.
 * The start_date and end_date correspond to the leap month if isLeapMonth is true,
 * otherwise to the main month (i.e the second of the two).
 *
 * @param {object} arg
 * @param {number} arg.year - the Tibetan year
 * @param {number} arg.month - the Tibetan month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - if leap month or not
 * @returns {Month}
 */
declare const getMonthFromTibetan: ({ year, month, isLeapMonth }: {
    year: number;
    month: number;
    isLeapMonth?: boolean;
}) => Month;
export default getMonthFromTibetan;
