import {
  S0, S1, S2, SUN_TAB
} from '../constants';
import { frac } from './math';

/**
   * the mean longitude of the sun
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
const meanSun = (day: number, monthCount: number) => monthCount * S1 + day * S2 + S0;


/**
   * sunAnomaly(day, monthCount)
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
const sunAnomaly = (day: number, monthCount: number) => meanSun(day, monthCount) - 1 / 4;

/**
   * sun tab for integer values
   * @param {number} i
   * @returns {number}
   */
const sunTabInt = (i: number) => {
  const iMod = i % 12;
  if (iMod <= 3) {
    return SUN_TAB[iMod];
  }
  if (iMod <= 6) {
    return SUN_TAB[6 - iMod];
  }
  if (iMod <= 9) {
    return -SUN_TAB[iMod - 6];
  }
  return -SUN_TAB[12 - iMod];
};

  /**
   * sun tab, with linear interpolation
   * @param {number} i
   * @returns {number}
   */
const sunTab = (i: number) => {
  let a = sunTabInt(Math.floor(i));
  const x = frac(i);
  if (x) {
    const b = sunTabInt(Math.floor(i) + 1);
    a += (b - a) * x;
  }

  return a;
};

  /**
   * Equation of the sun.
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
const sunEqu = (day: number, monthCount: number): number => sunTab(12 * sunAnomaly(day, monthCount));

export default sunEqu;
export {
  meanSun,
  sunAnomaly,
  sunTab,
  sunTabInt,
  sunEqu
};
