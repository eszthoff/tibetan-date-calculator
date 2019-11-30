import { Month } from '../types';
/**
     * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
     * and leap month indicator, calculates the "month count" based on the epoch.
     *
     * @param {Month} monthObject
     * @returns {number} month count since epoch
     */
declare const monthCountFromTibetan: ({ year, month, isLeapMonth }: Month) => number;
export default monthCountFromTibetan;
