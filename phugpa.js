// REFERENCE
// www2.math.uu.se/~svante/papers/calendars/tibet.pdf

// CONSTSANTS

// conversion constants

// The beginning of the Rabjung count according to Western calendar, A.D. 1027
const RABJUNG_BEGINNING = 1027;
// length of rabjung cycle in years
const RABJUNG_CYCLE_LENGTH = 60;
// the western year when the Rabjung cycle cacluations begin
const BEGINNING_OF_RANBJUNG = 966;
// difference between Western and Tibetan year count
const YEAR_DIFF = 127;

// calendrical constants: month calculations
// begining of epoch based on Kalachakra. Used as 0 for month counts since this time
const YEAR0 = 806;
const MONTH0 = 3;
const BETA_STAR = 61;
const BETA = 123;
// const P1 = 77 / 90;
// const P0 = 139 / 180;
// const ALPHA = 1 + 827 / 1005;

// calendrical constants: day calculations
// mean date
const M0 = 2015501 + 4783 / 5656;
const M1 = 167025 / 5656;
const M2 = M1 / 30;
// mean sun
const S0 = 743 / 804;
const S1 = 65 / 804;
const S2 = S1 / 30;
// anomaly moon
const A0 = 475 / 3528;
const A1 = 253 / 3528;
const A2 = 1 / 28;

// fixed tables
const MOON_TAB = [0, 5, 10, 15, 19, 22, 24, 25];
const SUN_TAB = [0, 6, 10, 11];

// western weekdays
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// year elements & animals
const YEAR_ELEMENTS	= ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];
const YEAR_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
const YEAR_GENDER	= ['Male', 'Female'];

// Special Days
const SPECIAL_DAYS = {
	'8': "Medicine Buddha & Tara Day",
	'10': "Guru Rinpoche Day",
	'15': "Amitabha Buddha Day; Full Moon",
	'25': "Dakini Day",
	'29': "Dharmapala Day",
	'30': "Shakyamuni Buddha Day; New Moon"
};


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

// amod(a, b) = a % b, but from 1..b instead of 0..b-1
const amod = (a, b) => {
	return mod(a, b) || b;
};

/** 
 * getJulianDate(unixTime)
 * get Julian date from UNIX date
 * since we use only date calculations here, there is no need to correct for timezone differences
 * see explonation:
 * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
 * 
 */
const getJulianDateFromUnix = (unixTime) => {
	return Math.floor((unixTime / 86400000) + 2440587.5);
}

const getUnixDateFromJulian = (julianDate) => {
	const unixDate = (julianDate - 2440587.5) * 86400000;

	return new Date(unixDate)
}

// week day from julian day
const weekday = (jd) => {

	return WEEKDAYS[(jd + 1) % 7];
};

// figure out the animal and element for a tibetan year
const yearAttributes = (year) => {
	const thisYear = {...year};
	const y = thisYear.tibYear;

	thisYear.animal = YEAR_ANIMALS[(y + 1) % 12];
	thisYear.element = YEAR_ELEMENTS[((y - 1) / 2) % 5];
	thisYear.gender = YEAR_GENDER[(y + 1) % 2];

	return thisYear;
};


// YEAR FUNCTIONS

/**
 * A year
 * @typedef {Object} year
 * @property {number} rabjungCycle - number of the cycle
 * @property {number} rabjungYear - number of the year within the cycle, from 1 to 60.
 * @property {number} westernYear - western year during which most of the given tibetan year falls
 * @property {number} tibYear - tibetan year number (i.e western year + 127)
 */

/**
 * rabjungYear(rabjungCycle, rabjungYear)
 * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
 *
 * @param rabjungCycle : number of the cycle
 * @param rabjungYear : number of the year within the cycle, from 1 to 60.
 * @returns {year}
 */
const rabjungYear = (rabjungCycle, rabjungYear) => {
	if (rabjungYear < 1 || rabjungYear > RABJUNG_CYCLE_LENGTH) {
		console.log(`Year number must be between 1 and ${RABJUNG_CYCLE_LENGTH}`);
		return
	}

	const year = {
		rabjungCycle,
		rabjungYear,
		westernYear: BEGINNING_OF_RANBJUNG + rabjungYear + RABJUNG_CYCLE_LENGTH * RabjungCycle
	};
	year.tibYear = year.westernYear + YEAR_DIFF;

	return(year);
};

// TODO Maybe this would be enough instead of above
const westernYearFromRabjung = (rabjungCycle, rabjungYear) => {
	if (rabjungYear < 1 || rabjungYear > RABJUNG_CYCLE_LENGTH) {
		console.log(`Year number must be between 1 and ${RABJUNG_CYCLE_LENGTH}`);
		return
	}

	return RABJUNG_BEGINNING + (rabjungCycle - 1) * RABJUNG_CYCLE_LENGTH + (rabjungYear - 1);
};

/**
 * westernYear(year)
 * Figures out a year's info from a Western calendar year number, ex. 2008.
 *
 * @param wYear: Western calendar year number, ex. 2008
 * @returns {year}
 */
const westernYear = (wYear) => {
	const year = {
		rabjungCycle: Math.ceil((wYear - RABJUNG_BEGINNING + 1) / RABJUNG_CYCLE_LENGTH),
		rabjungYear: amod(wYear - RABJUNG_BEGINNING + 1, RABJUNG_CYCLE_LENGTH),
		tibYear: wYear + YEAR_DIFF,
		westernYear: wYear,
	};

	return(year);
};


/**
 * tibetanYear(year)
 * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
 *
 * @param tYear - Tibetan calendar year number, ex. 2135.
 * @returns {year}
 */
const tibetanYear = (tYear) => {
	return westernYear(tYear - YEAR_DIFF);
};


// MONTH FUNCTIONS

/**
 * A month
 * @typedef {Object} month
 * @property {number} year - Tibetan year
 * @property {number} month - month within the Tibetan year
 * @property {boolean} isLeapMonth - true if leap month
 */

/** fromMonthCount(n)
 *
 * Figures out the Tibetan year number, month number within the year, and whether
 * this is a leap month, from a "month count" number.  See Svante Janson,
 * "Tibetan Calendar Mathematics", p.8 ff.
 *
 * @param {number} n the "month count" since beginning of epoch
 * @returns {month}
 */
const fromMonthCount = (n) => {
  //const x = ceil(12 * S1 * n + ALPHA);
  const x = Math.ceil((65 * n + BETA) / 67);
  const month = amod(x, 12);
  const year = x / 12 - + YEAR0 + YEAR_DIFF;
  const isLeapMonth = Math.ceil((65 * (n + 1) + BETA) / 67) === x;

  return { year, month, isLeapMonth }
}

/**
 * toMonthCount(year, month, isLeapMonth)
 * This is the reverse of from_month_count(n): from a Tibetan year, month number
 * and leap month indicator, calculates the "month count" based on the epoch.
 * 
 * @param {month} monthObject
 * @returns {number} month number
 */

const toMonthCount = (monthObject) => {
// the formulas on Svante's paper use western year numbers
const year = monthObject.year - YEAR_DIFF;
const month = monthObject.month;
const leap = + monthObject.isLeapMonth;

const solarMonth = 12(year - YEAR0) + month - MONTH0;
return Math.floor((67 * solarMonth + BETA_STAR + 17) / 65) - leap;
//return Math.floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
}

// =head2 has_leap_month($year, $month)

// Calculates whether a given Tibetan year and month number is duplicated, i.e
// is preceded by a leap month.

// =cut
/**
 * hasLeapMonth(y, m)
 * Calculates whether a given Tibetan year and month number is duplicated, i.e
 * is preceded by a leap month.
 * 
 * @param {number} y - tibetan year
 * @param {number} m - month number
 * @returns {boolean}
 */

const hasLeapMonth = (y, m) => {
  const mp = 12 * (y - YEAR_DIFF - Y0) + m;

  return ((2 * mp) % 65 == BETA % 65) || ((2 * mp) % 65 == (BETA + 1) % 65);
}


// MORE INTERNAL FUNCTIONS

// This and the following functions implement partial formulas in Svante's paper.

/** meanDate(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanDate = (day, monthCount) => {
  return monthCount * M1 + day * M2 + M0;
}

/** meanSun(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const meanSun = (day, monthCount) => {
	return monthCount * S1 + day * S2 + S0;
}

/** moonAnomaly(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const moonAnomaly = (day, monthCount) => {
	return monthCount * A1 + day * A2 + A0;
}

/**
 * moonTabInt (i)
 * moon_tab for integer values
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

}

/**
 * moonTab(i)
 * Moon tab, with linear interpolation
 * @param {number} i
 * @returns {number} 
 */
const moonTab = (i) => {
	const a = moonTabInt(floor(i));
	const x = frac(i);
	if (x) {
		const b = moonTabInt(floor(i) + 1);
		const ad = (b - a) * x;
		a += ad
	}

	return a;
}

/** moonEqu(day, monthCount)
 * Equation of the moon.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const moonEqu = (day, monthCount) => {
	return moonTab(28 * moonAnomaly(day, monthCount));
}

/** sunAnomaly(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const sunAnomaly = (day, monthCount) => {
	return meanSun(day, monthCount) - 1/4;
}

/**
 * sunTabInt (i)
 * sun_tab for integer values
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

}

/**
 * sunTab(i)
 * sun tab, with linear interpolation
 * @param {number} i
 * @returns {number} 
 */
const sunTab = (i) => {
	const a = sunTabInt(floor(i));
	const x = frac(i);
	if (x) {
		const b = sunTabInt(floor(i) + 1);
		const ad = (b - a) * x;
		a += ad
	}

	return a;
}

/** sunEqu(day, monthCount)
 * Equation of the sun.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const sunEqu = (day, monthCount) => {
	return sunTab(12 * sunAnomaly(day, monthCount));
}

/** trueDate(day, monthCount)
 * The date at the end of the lunar day
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
const trueDate = (day, monthCount) => {
	return meanDate(day, monthCount) + moonEqu(day, monthCount) / 60 - sunEqu(day, monthCount) / 60;
}

//TODO: here we return an object; check compatibility
/** getDayBefore(day, monthCount)
 * substract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {{day, monthCount}}
 */
const getDayBefore = (day, monthCount) => {
	return day === 1 ? {day: 30, monthCount: monthCount - 1} : {day: day - 1, monthCount};
}


/**
 * tibToJulian(year, month, isLeapMonth, day)
 * 
 * Gives the Julian date for a Tibetan year, month number (leap or not) and
 * Tibetan day.
 * 
 * Does not check that the tibetan day actually exists:
 *  - If given the date of a skipped day, will return the same Julian date as the
 *    day before.
 *  - If given the date of a duplicate day, returns the Julian date of the second
 *    of the two.
 * 
 * @param {number} year - Tibetan year
 * @param {number} month - Tibetan month
 * @param {boolean} isLeapMonth - true if leap month
 * @param {number} day - Tibetan day
 * @returns {number} - Julian date
 */
const tibToJulian = (year, month, isLeapMonth, day) => {
	const n = toMonthCount(year, month, isLeapMonth);

	return Math.floor(trueDate(day, n));
}

/**
 * tibToWestern(year, month, isLeapMonth, day, isLeapDay)
 * 
 * Calculates full information for a given Tibetan date, given by Tibetan
 * year number (ex. 2135), month number (1 to 12), leap month (boolean),
 * day number, and leap day (boolean).
 * 
 * For duplicated days, just as with duplicated months, the "main" day or month is
 * the second, and the "leap" day or month is the first.
 * 
 * Returns an object with the following fields:
 *   year           - a year object
 *   monthNo       - tibetan month number (as passed)
 *   isLeapMonth  - boolean, whether this is a leap month (this is the same as the
 * 		   passed "leap month" boolean, except if you try to get dates
 * 		   within a non-existing leap month, in which case isLeapMonth
 * 		   is returned as false
 *   hasLeapMonth - boolean, whether this year and month is duplicated (regardless
 * 		   of whether the date is calculated within the leap or the main month)
 * 
 *   dayNo	 - the day number within the Tibetan month, as passed
 *   skippedDay	 - whether this is a skipped day, which does not figure in the
 * 		   Tibetan calendar
 *   isLeapDay    - boolean, whether this is a leap day (same as the passed leapDay
 *                    value, except if you request a leap day when there isn't one)
 *   hasLeapDay   - whether this is a duplicated day (regardless of whether we are
 *                    calculating info about the main or the leap day)
 *   westernDate	 - the Western date ("YYYY-MM-DD") corresponding to the Tibetan day.
 *   weekday        - weekday ("Sun", "Mon", etc) of the westernDate
 *   julianDate    - the Julian day number for this Western date
 */
const tibToWestern = (year, month, isLeapMonth, day, isLeapDay) => {
	const julianDate = tibToJulian(year, month, isLeapMonth, day);

	// also calculate the Julian date of the previous Tib. day
	const monthCount = toMonthCount({ year, month, isLeapMonth });
	const dayBefore = getDayBefore(day, monthCount);
	const julianDatePrevious = floor(trueDate(dayBefore.day, dayBefore.monthCount));

	// figure out leap months, leap days & skipped days
	const hasLeapMonthThis = hasLeapMonth(year, month);
	const hasLeapDayThis = julianDate === julianDatePrevious + 2;
	const skippedDay = julianDate === julianDatePrevious;
	isLeapDayChecked = isLeapDay && hasLeapDayThis;

	// figure out western date info for the main or leap day
	if (isLeapDayChecked) {
		julianDate --;
	}
	// TODO: figure this translation!
	// in origianl script inverse_julian_day was required from Time::JulianDay
	// my ($w_y, $w_m, $w_d) = inverse_julian_day($jd);
	const westernDate = "DD-MM-YYYY";

	const day = {
		year: tibetanYear(year),
		monthNo: month,
		isLeapMonth: isLeapMonth && hasLeapMonth,
		dayNo: day,
		skippedDay,
		isLeapDay: isLeapDayChecked,
		hasLeapDay: hasLeapDayThis,
		westernDate,
		julianDate,
		weekDay: weekDay(julianDate)
	};

	return day;
}


// # to calculate Tibetan dates from western ones, we use a binary search algorithm
// # within a span of 2 years.  for this we use a variant of true_date which takes
// # a linear "tibetan day number", defined as $day_no + 30 * $month_no.
const tibDayToJulian = (day) => {
	const n = floor((day - 1) / 30);
	const calulatedDay = day % 30 || 30;

	return Math.floor(trueDate(calulatedDay, n));
}

// =head2 western_to_tib($western_year, $month, $day)

// Calculates a Tibetan date for a given western date.  This does a binary search,
// and is therefore much slower than tib_to_western().

// Returns: ($tib_year, $tib_month, $leap_month, $tib_day, $leap_day)

// =cut

// # The algorithm could be much improved by using the reverse of mean_date()
// # to start with, and then using the fact that julian dates and "tibetan day
// # numbers" have a quasi-linear relation.

const westernToTib = (wYear, wMonth, wDay) => {
	const date = new Date(wYear, wMonth - 1, wDay);
	const jd = getJulianDateFromUnix(date);
	const tibYears = [wYear + YEAR_DIFF - 1, wYear + YEAR_DIFF + 1];
	const monthCounts = tibYears.map(y => toMonthCount(y, 1, 1));
	const dn = monthCounts.map(m => 1 + 30 * m);
	const jds = dn.map(n => tibDayToJulian(n));
	//   croak "Binary search algo is wrong" unless $jd1 <= $jd && $jd <= $jd2;

	while (dn[0] < dn[1] - 1 && jds[0] < jds[1]) {
		const ndn = Math.floor((dn[0] + dn[1]) / 2);
		const njd = tibDayToJulian(ndn);

		if (njd < jd) {
			dn[0] = ndn;
			jd[0] = njd
		} else {
			dn[1] = ndn;
			jd[1] = ndn;
		}
	}

	// so we found it; put it in dn[1] & jds[1].
	// if the western date is the 1st of a duplicated tib. day, then jd[0] == jd - 1 and
	// jd[1] == jd + 1, and the corresponding tib. day number is the one from jd[1].
	if (jds[0] === jd) {
		jds[1] = jds[0];
		dn[1] = dn[0];
	}

	// figure out the real tib. date: year, month, leap month, day number, leap day.
	const isLeapDay = jds[1] > jd;
	const monthCount = Math.floor((dn[1] - 1) / 30);
	const day = (dn % 30) || 30;
	const { year, month, isLeapMonth } = fromMonthCount(monthCount);

	return { year, month, isLeapMonth, day, isLeapDay };
}

// =head2 losar($tib_year)

// Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
// year number (ex. 2137).

// Returns: "YYYY-MM-DD" string.
/**
 * losar(tibYear)
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
const losar = (tibYear) => {
	const julianDay = 1 + tibToJulian(tibYear - 1, 12, 0, 30);

	return getUnixDateFromJulian(julianDay);
}

// =head2 tibetan_month($year, $month, $leap_month)

// Calculates full information about a Tibetan month: whether it is
// duplicated or not, and the western start and end date for it.

// Returns a hashref with the following fields:
//   year           - a hashref as returned by rabjung_year and similar functions above
//   month_no       - tibetan month number (as passed)
//   is_leap_month  - boolean, whether this is a leap month (this is the same as the
// 		   passed "leap month" boolean, except if you try to get dates
// 		   within a non-existing leap month, in which case is_leap_month
// 		   is returned as false
//   has_leap_month - boolean, whether this year and month is duplicated (regardless
// 		   of whether the date is calculated within the leap or the main month)
//   start_date     - Western date of the 1st of the month (or 2nd if the 1st is skipped),
// 		   in "YYYY-MM-DD" format
//   end_date       - Western date of the 30th of the Tib. month.

// The start_date and end_date correspond to the leap month if $leap_month is passed,
// otherwise to the main month (i.e the second of the two).

// =cut
const tibetanMonthInfo = (year, month, isLeapMonth) => {
	const hasLeap = hasLeapMonth(year, month);
	const isLeap = isLeapMonth && hasLeap;

	// calculate the Julian date 1st and last of the month
	const monthCount = toMonthCount(year, month, isLeap);
	const jdFirst = 1 + Math.floor(trueDate(30, monthCount - 1));
	const jdLast = Math.floor(trueDate(30, monthCount));
	const startDate = getUnixDateFromJulian(jdFirst);
	const endDate = getUnixDateFromJulian(jdLast);

	return { year, month, isLeapMonth: isLeap, hasLeap, startDate, endDate }
}

// =head2 year_calendar($tib_year)

// Generate a calendar for a whole Tibetan year, given by Tib. year number.

// Returns: a hashref containing the year's info, including each of the months
// in succession within $year->{months}.  Each month includes all the days in
// succession within $month->{days}.

// =cut
const yearCalendar = (tibYear) => {
	const year = tibetanYear(tibYear);
	year.months = [];
	for (let m = 1; m <= 12; m++) {
		if (hasLeapMonth(tibYear, m)) {
			year.months.push(generateMonth(tibYear, m, true))
		}
		year.months.push(generateMonth(tibYear, m, false))
	}

	return year;
}

// # figure out if a day is special; if it is skipped, return its speciality so it can be
// # applied to the next day.  on dup days, the special one is the 1st.
// adds attribute special day to dayObject if applicable
// returns null or string for special day to be applied to next day (carry over)
const specialDay = (dayNumber, dayObject, carriedFromPrevious) => {
	// apply speciality if carried over from previous day
	if (carriedFromPrevious) {
		dayObject.specialDay = `${carriedFromPrevious} (carried over from previous day)`;
	}

	if (!SPECIAL_DAYS[dayNumber]) {
		return null;
	}

	// check if speciality should be carried over or skipped
	if (day.skippedDay) {
		return SPECIAL_DAYS[dayNumber];
	}
	if (day.hasLeapDay && !day.isLeapDay) {
		return null
	}

	// apply speciality while preserving the one from the previous day if applicable
	dayObject.specialDay = dayObject.specialDay
		? dayObject.specialDay.concat(`; ${SPECIAL_DAYS[dayNumber]}`)
		: dayObject.specialDay = SPECIAL_DAYS[dayNumber];

	return null;
}

// # generate a month with all its days
const generateMonth = (year, month, isLeapMonth) => {
	const thisMonth = tibetanMonthInfo(year, month, isLeapMonth);
	let carrySpecial = null;
	const days = [];

	// loop over the days, taking care of duplicate and missing days
	for (let d = 1; d <= 30; d++) {
		const day = tibToWestern(year, month, isLeapMonth, d, false)
		
		// insert leap days before the main day
		if (day.hasLeapDay) {
			const day2 = tibToWestern(year, month, isLeapMonth, d, true);
			carrySpecial = specialDay(d, day2, carrySpecial);
			days.push(day2);
		}

		carrySpecial = specialDay(d, day, carrySpecial);
		if (day.skippedDay) {
			d++
		}

		days.push(day);
	}

	thisMonth.days = days;
	return thisMonth;
}


