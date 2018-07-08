// Implement partial formulas in Svante's paper.
import {
  M0, M1, M2,
  S0, S1, S2,
  A0, A1, A2,
  MOON_TAB, SUN_TAB
} from './constants';
import { frac } from './helpers';

/**
 * meanDate(day, monthCount) - corresponding to the linear mean motion of the moon
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanDate = (day, monthCount) => monthCount * M1 + day * M2 + M0;

/**
 * the mean longitude of the sun
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanSun = (day, monthCount) => monthCount * S1 + day * S2 + S0;

/**
 * the anomaly of the moon
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const moonAnomaly = (day, monthCount) => monthCount * A1 + day * A2 + A0;

/**
 * Moon tab for integer values
 * @param {number} i
 * @returns {number}
 */
const moonTabInt = (i) => {
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
const moonTab = (i) => {
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
const moonEqu = (day, monthCount) => moonTab(28 * moonAnomaly(day, monthCount));

/**
 * sunAnomaly(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const sunAnomaly = (day, monthCount) => meanSun(day, monthCount) - 1 / 4;

/**
 * sun tab for integer values
 * @param {number} i
 * @returns {number}
 */
const sunTabInt = (i) => {
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
const sunTab = (i) => {
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
const sunEqu = (day, monthCount) => sunTab(12 * sunAnomaly(day, monthCount));

/**
 * The date at the end of the lunar day (similar to month count since beginning of epoch, but for days)
 * It is calculated by first calculating a simpler mean date, corresponding to the linear mean motion of
 *    the moon, and then adjusting it by the equations of the moon and sun, which are determined by the
 *    anomalies of the moon and sun together with tables.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const getTrueDate = (day, monthCount) => (
  meanDate(day, monthCount)
  + moonEqu(day, monthCount) / 60
  - sunEqu(day, monthCount) / 60
);

/**
 * substract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {{day, monthCount}}
 */
const getDayBefore = (day, monthCount) => (
  day === 1
    ? { day: 30, monthCount: monthCount - 1 }
    : { day: day - 1, monthCount }
);

export {
  meanDate,
  meanSun,
  moonAnomaly,
  moonTab,
  moonTabInt,
  moonEqu,
  sunAnomaly,
  sunTab,
  sunTabInt,
  sunEqu,
  getTrueDate,
  getDayBefore,
};
