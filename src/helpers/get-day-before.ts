/**
 * Subtract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {{day, monthCount}}
 */
const getDayBefore = (day: number, monthCount: number): {day: number, monthCount: number} => (
  day === 1
    ? { day: 30, monthCount: monthCount - 1 }
    : { day: day - 1, monthCount }
);

export default getDayBefore;
