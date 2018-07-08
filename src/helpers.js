import {
  MS_IN_YEAR,
  MIN_IN_DAY,
  JULIAN_TO_UNIX
} from './constants';
/**
 * fraction part a number
 *
 * @param {number} a - a number to check
 * @returns {number} the fractional part of a number
 */
const frac = a => a % 1;

/**
 * Modulo of a number (a % b), but from 1..b instead of 0..b-1.
 * This means that
 *    amod(a, b) = a % b
 * unless a is a multiple of b. In that case:
 *    a % b = 0 but amod(a, b) = b.
 *
 * @param {number} a - number to be devided
 * @param {number} b - the number to be devided with
 * @return {number}
 */
// TODO: add control for b <= 0. Not urgent as this is not what we expect in calendar calculations (?)
const amod = (a, b) => (a % b) || b;

/**
 * get Julian date from UNIX date
 * see explanation:
 * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
 *
 * @property {Date} unixTime - the date object to be converted
 * @return {number} - julian date
 */
const getJulianDateFromUnix = unixTime => Math.floor(
  unixTime / MS_IN_YEAR
  - unixTime.getTimezoneOffset() / MIN_IN_DAY
  + JULIAN_TO_UNIX
);

/**
 * get Unix date from Julian date
 * since we use only date calculations here, there is no need to correct for timezone differences
 * see explanation:
 * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
 *
 * @param {number} julianDate - the julian date
 * @return {Date}
 */
const getUnixDateFromJulian = (julianDate) => {
  const unixDate = (julianDate - JULIAN_TO_UNIX) * MS_IN_YEAR;

  return new Date(unixDate);
};


export {
  frac,
  amod,
  getJulianDateFromUnix,
  getUnixDateFromJulian
};
