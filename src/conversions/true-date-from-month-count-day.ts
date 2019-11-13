import { meanDate, moon, sun } from '../helpers';

/**
 * The date at the end of the lunar day (similar to month count since beginning of epoch, but for days)
 * It is calculated by first calculating a simpler mean date, corresponding to the linear mean motion of
 *    the moon, and then adjusting it by the equations of the moon and sun, which are determined by the
 *    anomalies of the moon and sun together with tables.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const trueDateFromMonthCountDay = (day: number, monthCount: number): number => (
  meanDate(day, monthCount)
    + moon(day, monthCount) / 60
    - sun(day, monthCount) / 60
);

export default trueDateFromMonthCountDay;
