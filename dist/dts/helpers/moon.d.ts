/**
   * the anomaly of the moon
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
declare const moonAnomaly: (day: number, monthCount: number) => number;
/**
   * Moon tab for integer values
   * @param {number} i
   * @returns {number}
   */
declare const moonTabInt: (i: number) => number;
/**
 * Moon tab, with linear interpolation
 * @param {number} i
 * @returns {number}
 */
declare const moonTab: (i: number) => number;
/**
 * Equation of the moon.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
declare const moonEqu: (day: number, monthCount: number) => number;
export default moonEqu;
export { moonAnomaly, moonTab, moonTabInt, moonEqu };
