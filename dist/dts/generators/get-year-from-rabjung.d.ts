import { Year } from '../types';
/**
     * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
     * @param {object} arg
     * @param {number} arg.rabjungCycle : number of the cycle
     * @param {number} arg.rabjungYear : number of the year within the cycle, from 1 to 60.
     * @returns {null | Year}
     */
declare const getYearFromRabjung: ({ rabjungCycle, rabjungYear }: {
    rabjungCycle: number;
    rabjungYear: number;
}) => Year;
export default getYearFromRabjung;
