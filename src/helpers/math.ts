/**
 * fraction part a number
 *
 * @param {number} a - a number to check
 * @returns {number} the fractional part of a number
 */
const frac = (a: number) => a % 1;

/**
 * Modulo of a number (a % b), but from 1..b instead of 0..b-1.
 * This means that
 *    amod(a, b) = a % b
 * unless a is a multiple of b. In that case:
 *    a % b = 0 but amod(a, b) = b.
 *
 * @param {number} a - number to be divided
 * @param {number} b - the number to be divided with
 * @return {number}
 */
// TODO: add control for b <= 0. Not urgent as this is not what we expect in calendar calculations (?)
const amod = (a: number, b: number): number => (a % b) || b;

export { frac, amod };
