// Implement partial formulas in Svante's paper.
import {
  M0, M1, M2
} from '../constants';

/**
 * meanDate(day, monthCount) - corresponding to the linear mean motion of the moon
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanDate = (day: number, monthCount: number): number => monthCount * M1 + day * M2 + M0;

export default meanDate;
