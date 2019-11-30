/**
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
declare const getLosarForYear: (year: number, isTibetan?: boolean) => string;
export default getLosarForYear;
