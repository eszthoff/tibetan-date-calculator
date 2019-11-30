/**
   * the mean longitude of the sun
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
declare const meanSun: (day: number, monthCount: number) => number;
/**
   * sunAnomaly(day, monthCount)
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
declare const sunAnomaly: (day: number, monthCount: number) => number;
/**
   * sun tab for integer values
   * @param {number} i
   * @returns {number}
   */
declare const sunTabInt: (i: number) => number;
/**
 * sun tab, with linear interpolation
 * @param {number} i
 * @returns {number}
 */
declare const sunTab: (i: number) => number;
/**
 * Equation of the sun.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
declare const sunEqu: (day: number, monthCount: number) => number;
export default sunEqu;
export { meanSun, sunAnomaly, sunTab, sunTabInt, sunEqu };
