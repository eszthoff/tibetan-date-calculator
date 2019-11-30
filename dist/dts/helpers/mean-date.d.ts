/**
 * meanDate(day, monthCount) - corresponding to the linear mean motion of the moon
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
declare const meanDate: (day: number, monthCount: number) => number;
export default meanDate;
