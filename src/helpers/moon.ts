import {
  A0, A1, A2,
  MOON_TAB
} from '../constants';
import { frac } from './math';


/**
   * the anomaly of the moon
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
const moonAnomaly = (day: number, monthCount: number) => monthCount * A1 + day * A2 + A0;

/**
   * Moon tab for integer values
   * @param {number} i
   * @returns {number}
   */
const moonTabInt = (i: number) => {
  const iMod = i % 28;
  if (iMod <= 7) {
    return MOON_TAB[iMod];
  }
  if (iMod <= 14) {
    return MOON_TAB[14 - iMod];
  }
  if (iMod <= 21) {
    return -MOON_TAB[iMod - 14];
  }
  return -MOON_TAB[28 - iMod];
};

  /**
   * Moon tab, with linear interpolation
   * @param {number} i
   * @returns {number}
   */
const moonTab = (i: number) => {
  let a = moonTabInt(Math.floor(i));
  const x = frac(i);
  if (x) {
    const b = moonTabInt(Math.floor(i) + 1);
    a += (b - a) * x;
  }

  return a;
};

  /**
   * Equation of the moon.
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
const moonEqu = (day: number, monthCount: number): number => moonTab(28 * moonAnomaly(day, monthCount));

export default moonEqu;
export {
  moonAnomaly,
  moonTab,
  moonTabInt,
  moonEqu
};
