// CONSTANTS

// conversion constants

// The beginning of the Rabjung count according to Western calendar, A.D. 1027
export const RABJUNG_BEGINNING = 1027;
// length of rabjung cycle in years
export const RABJUNG_CYCLE_LENGTH = 60;
// difference between Western and Tibetan year count
export const YEAR_DIFF = 127;
// difference between Unix and Julian date starts
export const JULIAN_TO_UNIX = 2440587.5;
// number of miliseconds in a year
export const MS_IN_YEAR = 86400000;
// number of minutes in day
export const MIN_IN_DAY = 1440;

// calendrical constants: month calculations

// begining of epoch based on Kalachakra. Used as 0 for month counts since this time
export const YEAR0 = 806;
export const MONTH0 = 3;
// constants given in Svante's article
export const BETA_STAR = 61;
export const BETA = 123;
// const P1 = 77 / 90;
// const P0 = 139 / 180;
// const ALPHA = 1 + 827 / 1005;

// calendrical constants: day calculations
// mean date
export const M0 = 2015501 + 4783 / 5656;
export const M1 = 167025 / 5656;
export const M2 = M1 / 30;
// mean sun
export const S0 = 743 / 804;
export const S1 = 65 / 804;
export const S2 = S1 / 30;
// anomaly moon
export const A0 = 475 / 3528;
export const A1 = 253 / 3528;
export const A2 = 1 / 28;

// fixed tables
export const MOON_TAB = [0, 5, 10, 15, 19, 22, 24, 25];
export const SUN_TAB = [0, 6, 10, 11];

// year elements & animals
export const YEAR_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];
export const YEAR_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Rabbit',
  'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
export const YEAR_GENDER = ['Male', 'Female'];

// Special Days
export const SPECIAL_DAYS = {
  8: 'Medicine Buddha & Tara Day',
  10: 'Guru Rinpoche Day',
  15: 'Amitabha Buddha Day; Full Moon',
  25: 'Dakini Day',
  29: 'Dharmapala Day',
  30: 'Shakyamuni Buddha Day; New Moon',
};
