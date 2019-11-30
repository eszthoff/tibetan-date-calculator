import { Year } from '../types';
/**
     * Figures out a year's info from a Western calendar year number, ex. 2008.
     *
     * @param {number} wYear: Western calendar year number, ex. 2008
     * @returns {Year}
     */
declare const getYearFromWestern: (wYear: number) => Year;
export default getYearFromWestern;
