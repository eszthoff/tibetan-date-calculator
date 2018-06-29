// CONSTSANTS

// calendrical constants: month calculations
const S1 = 65 / 804;
const Y0 = 806;
const S0 = 743 / 804;
const P1 = 77 / 90;
const P0 = 139 / 180;
const ALPHA = 1 + 827 / 1005;
const BETA = 123;

// calendrical constants: day calculations
const M1 = 167025/5656;
const M2 = M1 / 30;
const M0 = 2015501 + 4783 / 5656;
const S2 = S1 / 30;
const A1 = 253 / 3528;
const A2 = 1/28;
const A0 = 475/3528;

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

// amod(a, b) = a % b, but from 1..b instead of 0..b-1
const amod = (a, b) => {
	return mod(a, b) || b;
};

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
 * @property {number} cycleNo - number of the cycle
 * @property {number} yearNo - number of the year within the cycle, from 1 to 60.
 * @property {number} westernYear - western year during which most of the given tibetan year falls
 * @property {number} tibYear - tibetan year number (i.e western year + 127)
 */

/**
 * rabjungYear(cycleNo, yearNo)
 * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
 *
 * @param cycleNo : number of the cycle
 * @param yearNo : number of the year within the cycle, from 1 to 60.
 * @returns {year}
 */
const rabjungYear = (cycleNo, yearNo) => {
	if (yearNo >= 1 && yearNo <= 60) {
		console.log("Year number must be between 1 and 60");
		return
	}

	const year = {
		cycleNo,
		yearNo,
		westernYear: 966 + yearNo + 60 * cycleNo
	};
	year.tibYear = year.westernYear + 127;

	return(year);
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
		cycleNo: Math.ceil((wYear - 1026) / 60),
		yearNo: amod(wYear - 6, 60),
		tibYear: wYear + 127,
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
	return westernYear(tYear - 127);
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
 * @param {number} n the "month count" within the year
 * @returns {month}
 */
const fromMonthCount = (n) => {
  const x = ceil(12 * S1 * n + ALPHA);
  const month = amod(x, 12);
  const year = (x - M) / 12 + Y0 + 127;
  const isLeapMonth = ceil(12 * S1 * (n + 1) + ALPHA) === x;

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
const year = monthObject.year - 127;
const isLeap = + monthObject.isLeapMonth;

return floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
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
  const mp = 12 * (y - 127 - Y0) + m;

  return ((2 * mp) % 65 == BETA % 65) || ((2 * mp) % 65 == (BETA + 1) % 65);
}


// MORE INTERNAL FUNCTIONS

// This and the following functions implement partial formulas in Svante's paper.

/** meanDate(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - the tibetan month count
 * @returns {number}
 */
const meanDate = (day, monthCount) => {
  return monthCount * M1 + day * M2 + M0;
}

/** meanSun(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - the tibetan month count
 * @returns {number}
 */
const meanSun = (day, monthCount) => {
	return monthCount * S1 + day * S2 + S0;
}

/** moonAnomaly(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - the tibetan month count
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
 * @param {number} monthCount - the tibetan month count
 * @returns {number}
 */
const moonEqu = (day, monthCount) => {
	return moonTab(28 * moonAnomaly(day, monthCount));
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
 * @param {number} monthCount - the tibetan month count
 * @returns {number}
 */
const sunEqu = (day, monthCount) => {
	return sunTab(12 * (meanSun(day, monthCount) - 1/4));
}

/** trueDate(day, monthCount)
 * @param {number} day - the tibetan day
 * @param {number} monthCount - the tibetan month count
 * @returns {number}
 */
const trueDate = (day, monthCount) => {
	return meanDate(day, monthCount) + moonEqu(day, monthCount) / 60 - sunEqu(day, monthCount) / 60;
}

//TODO: here we return an object; check compatibility
/** getDayBefore(day, monthCount)
 * substract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - the tibetan month count
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

	return floor(trueDate(day, n));
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
	const monthCount = toMonthCount({year, month, isLeapMonth});
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
// sub tib_day_to_julian {
//   my $d = shift;
//   my $n = floor(($d - 1) / 30);
//   $d = ($d % 30) || 30;
//   floor(true_date($d, $n));
// }

// =head2 western_to_tib($western_year, $month, $day)

// Calculates a Tibetan date for a given western date.  This does a binary search,
// and is therefore much slower than tib_to_western().

// Returns: ($tib_year, $tib_month, $leap_month, $tib_day, $leap_day)

// =cut

// # The algorithm could be much improved by using the reverse of mean_date()
// # to start with, and then using the fact that julian dates and "tibetan day
// # numbers" have a quasi-linear relation.

// sub western_to_tib {
//   my ($w_y, $w_m, $w_d) = @_;
//   my $jd = julian_day(@_);

//   my $tib_year1 = $w_y + 126;
//   my $tib_year2 = $w_y + 128;

//   my $n1 = to_month_count($tib_year1, 1, 1);
//   my $n2 = to_month_count($tib_year2, 1, 1);

//   my $dn1 = 1 + 30 * $n1;
//   my $dn2 = 1 + 30 * $n2;

//   my $jd1 = tib_day_to_julian($dn1);
//   my $jd2 = tib_day_to_julian($dn2);
//   croak "Binary search algo is wrong" unless $jd1 <= $jd && $jd <= $jd2;

//   while ($dn1 < $dn2 - 1 && $jd1 < $jd2 - 1) {
//     my $ndn = floor(($dn1 + $dn2) / 2);
//     my $njd = tib_day_to_julian($ndn);
//     if ($njd < $jd) {
//       $dn1 = $ndn;
//       $jd1 = $njd;
//     } else {
//       $dn2 = $ndn;
//       $jd2 = $njd;
//     }
//   }

//   # so we found it; put it in $dn2 & $jd2.
//   # if the western date is the 1st of a duplicated tib. day, then $jd1 == $jd - 1 and
//   #   $jd2 == $jd + 1, and the corresponding tib. day number is the one from $jd2.
//   if ($jd1 == $jd) {
//     $jd2 = $jd1;
//     $dn2 = $dn1;
//   }

//   # figure out the real tib. date: year, month, leap month, day number, leap day.
//   my $leap_day = ($jd2 > $jd);
//   my $n = floor(($dn2 - 1) / 30);
//   $dn2 = ($dn2 % 30) || 30;
//   my ($Y, $M, $l) = from_month_count($n);
//   ($Y, $M, $l, $dn2, $leap_day);
// }

// =head2 losar($tib_year)

// Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
// year number (ex. 2137).

// Returns: "YYYY-MM-DD" string.

// =cut

// sub losar {
//   my $Y = shift;
//   my $jd = 1 + tib_to_julian($Y - 1, 12, 0, 30);
//   my ($w_y, $w_m, $w_d) = inverse_julian_day($jd);
//   sprintf("%.4d-%.2d-%.2d", $w_y, $w_m, $w_d);
// }

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

// sub tibetan_month {
//   my ($Y, $M, $l) = @_;

//   my $has_leap = has_leap_month($Y, $M);
//   $l &&= $has_leap;

//   # calculate the Julian date 1st and last of the month
//   my $n = to_month_count($Y, $M, $l);
//   my $jd1 = 1 + floor(true_date(30, $n - 1));
//   my $jd2 = floor(true_date(30, $n));

//   my $month = {
//     year		=> tibetan_year($Y),
//     month_no		=> $M,
//     is_leap_month	=> $l,
//     has_leap_month	=> $has_leap,
//     start_date		=> sprintf("%.4d-%.2d-%.2d", inverse_julian_day($jd1)),
//     end_date		=> sprintf("%.4d-%.2d-%.2d", inverse_julian_day($jd2)),
//   };

//   $month;
// }

// =head2 year_calendar($tib_year)

// Generate a calendar for a whole Tibetan year, given by Tib. year number.

// Returns: a hashref containing the year's info, including each of the months
// in succession within $year->{months}.  Each month includes all the days in
// succession within $month->{days}.

// =cut

// sub year_calendar {
//   my $Y = shift;
//   my $year = tibetan_year($Y);

//   # loop over the months, inserting leap months before the main ones
//   my @months;
//   foreach my $M (1 .. 12) {
//     if (has_leap_month($Y, $M)) {
//       push @months, generate_month($Y, $M, 1);
//     }
//     push @months, generate_month($Y, $M, undef);
//   }

//   $months[0]{days}[0]{special_day} = 'Losar';

//   $year->{months} = \@months;
//   $year;
// }

// use constant SPECIAL_DAYS	=> {
// 	8	=> "Medicine Buddha & Tara Day",
// 	10	=> "Guru Rinpoche Day",
// 	15	=> "Amitabha Buddha Day; Full Moon",
// 	25	=> "Dakini Day",
// 	29	=> "Dharmapala Day",
// 	30	=> "Shakyamuni Buddha Day; New Moon",
// };

// # figure out if a day is special; if it is skipped, return its speciality so it can be
// # applied to the next day.  on dup days, the special one is the 1st.
// sub special_day {
//   my ($no, $day, $carry_special) = @_;

//   # if we are carrying over a special feature from the day before, apply it
//   $day->{special_day} = $carry_special . ' (carried over)' if $carry_special;

//   return undef unless SPECIAL_DAYS()->{$no};
//   return SPECIAL_DAYS()->{$no} if $day->{skipped_day};
//   return undef if $day->{has_leap_day} && !$day->{is_leap_day};

//   # carried over special features can overlap with the ones for the day itself!
//   if ($day->{special_day}) {
//     $day->{special_day} .= '; ' . SPECIAL_DAYS()->{$no};
//   } else {
//     $day->{special_day} = SPECIAL_DAYS()->{$no};
//   }

//   undef;
// }

// # generate a month with all its days
// sub generate_month {
//   my ($Y, $M, $l) = @_;
//   my $month = tibetan_month($Y, $M, $l);
//   my $carry_special;

//   # loop over the days, taking care of dup and missing days
//   my @days;
//   foreach my $d (1 .. 30) {
//     my $day = tib_to_western($Y, $M, $l, $d, undef);

//     # insert leap days before their main day
//     if ($day->{has_leap_day}) {
//       my $day2 = tib_to_western($Y, $M, $l, $d, 1);
//       $carry_special = special_day($d, $day2, $carry_special);
//       push @days, $day2;
//     }

//     $carry_special = special_day($d, $day, $carry_special);
//     next if $day->{skipped_day};
//     push @days, $day;
//   }

//   $month->{days} = \@days;
//   $month;
// }

// 1;

