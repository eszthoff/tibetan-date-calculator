import { Month } from '../types';
/**
   * Figures out the Tibetan year number, month number within the year, and whether
   * this is a leap month, from a "month count" number.  See Svante Janson,
   * "Tibetan Calendar Mathematics", p.8 ff.
   *
   * @param {number} monthCount: the "month count" since beginning of epoch
   * @returns {Month}
   */
declare const getMonthFromMonthCount: (monthCount: number) => Month;
export default getMonthFromMonthCount;
