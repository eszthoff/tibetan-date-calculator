// CONSTSANTS

// calendrical constants: month calculations
const MONTH_CONTS = {
	s1: 65 / 804,
	y0: 806,
	s0: 743 / 804,
	p1: 77 / 90,
	p0: 139 / 180,
	alpha: 1 + 827 / 1005,
	beta: 123
};

// calendrical constants: day calculations
const DAY_CONSTS = {
	m1:	167025/5656,
	m2: this.m1 / 30,
	m0: 2015501 + 4783 / 5656,
	s2: MONTH_CONTS.s1 / 30,
	a1: 253 / 3528,
	a2: 1/28,
	a0:	475/3528
};

// fixed tables
const MOON_TAB = [0, 5, 10, 15, 19, 22, 24, 25];
const SUN_TAB = [0, 6, 10, 11];

// western weekdays
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// year elements & animals
const YEAR_ELEMENTS	= ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];
const YEAR_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
const YEAR_GENDER	= ['Male', 'Female'];


// HELPERS

// HELPER FUNCTIONS

/**
 * frac(a)
 *
 * @param a
 * @returns {number} the fractional part of a number
 */
const frac = (a) => {
	return a - Math.floor(a);
};

/**
 * mod(a, b) is like a % b, but also works with non-integer a
 *
 * @param a
 * @param b
 * @returns {number}
 */
const mod = (a, b) => {
	return (Math.floor(a) % b) + frac(a);
};

// amod($a, $b) = $a % $b, but from 1..$b instead of 0..$b-1
const amod = (a, b) => {
	return mod(a, b) || b;
};

// week day from julian day
const weekday = (jd) => {

	return WEEKDAYS[(jd + 1) % 7];
};

// figure out the animal and element for a tibetan year
const year_attributes = (year) => {
	const thisYear = {...year};
	const y = thisYear.tib_year;

	thisYear.animal = YEAR_ANIMALS[(y + 1) % 12];
	thisYear.element = YEAR_ELEMENTS[((y - 1) / 2) % 5];
	thisYear.gender = YEAR_GENDER[(y + 1) % 2];

	return thisYear;
};


// YEAR FUNCTIONS


/**
 * rabjung_year(cycle_no, year_no)
 * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
 *
 * @param cycle_no : number of the cycle
 * @param year_no : number of the year within the cycle, from 1 to 60.
 * @returns {{
 *  cycle_no: number of the cycle,
 *  year_no: number of the year within the cycle, from 1 to 60.,
 *  western_year: western year during which most of the given tibetan year falls,
 *  tib_year: tibetan year number (i.e western year + 127)
 * }}
 */
const rabjung_year = (cycle_no, year_no) => {
	if (year_no >= 1 && year_no <= 60) {
		console.log("Year number must be between 1 and 60");
		return
	}

	const year = {
		cycle_no,
		year_no,
		western_year: 966 + year_no + 60 * cycle_no
	};
	year.tib_year = year.western_year + 127;

	return(year);
};


/**
 * western_year(year)
 * Figures out a year's info from a Western calendar year number, ex. 2008.
 *
 * @param w_year: Western calendar year number, ex. 2008
 * @returns {{
 *  cycle_no: number of the cycle,
 *  year_no: number of the year within the cycle, from 1 to 60.,
 *  western_year: western year during which most of the given tibetan year falls,
 *  tib_year: tibetan year number (i.e western year + 127)
 * }}
 */
const western_year = (w_year) => {
	const {amod} = require('./helpers');
	const year = {
		cycle_no: Math.ceil((w_year - 1026) / 60),
		year_no: amod(w_year - 6, 60),
		tib_year: w_year + 127,
		western_year: w_year,
	};

	return(year);
};


/**
 * tibetan_year(year)
 * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
 *
 * @param t_year: Tibetan calendar year number, ex. 2135.
 * @returns {{
 *  cycle_no: number of the cycle,
 *  year_no: number of the year within the cycle, from 1 to 60.,
 *  western_year: western year during which most of the given tibetan year falls,
 *  tib_year: tibetan year number (i.e western year + 127)
 * }}
 */
const tibetan_year = (t_year) => {
	return western_year(t_year - 127);
};
