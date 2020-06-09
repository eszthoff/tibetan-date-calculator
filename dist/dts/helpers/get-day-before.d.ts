/**
 * Subtract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {{day, monthCount}}
 */
declare const getDayBefore: (day: number, monthCount: number) => {
    day: number;
    monthCount: number;
};
export default getDayBefore;
