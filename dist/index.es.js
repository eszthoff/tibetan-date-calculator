// CONSTANTS
// conversion constants
// The beginning of the Rabjung count according to Western calendar, A.D. 1027
var RABJUNG_BEGINNING = 1027;
// length of rabjung cycle in years
var RABJUNG_CYCLE_LENGTH = 60;
// difference between Western and Tibetan year count
var YEAR_DIFF = 127;
// difference between Unix and Julian date starts
var JULIAN_TO_UNIX = 2440587.5;
// number of milliseconds in a year
var MS_IN_YEAR = 86400000;
// number of minutes in day
var MIN_IN_DAY = 1440;
// calendrical constants: month calculations
// beginning of epoch based on Kalachakra. Used as 0 for month counts since this time
var YEAR0 = 806;
var MONTH0 = 3;
// constants given in Svante's article
var BETA_STAR = 61;
var BETA = 123;
// const P1 = 77 / 90;
// const P0 = 139 / 180;
// const ALPHA = 1 + 827 / 1005;
// calendrical constants: day calculations
// mean date
var M0 = 2015501 + 4783 / 5656;
var M1 = 167025 / 5656;
var M2 = M1 / 30;
// mean sun
var S0 = 743 / 804;
var S1 = 65 / 804;
var S2 = S1 / 30;
// anomaly moon
var A0 = 475 / 3528;
var A1 = 253 / 3528;
var A2 = 1 / 28;
// fixed tables
var MOON_TAB = [0, 5, 10, 15, 19, 22, 24, 25];
var SUN_TAB = [0, 6, 10, 11];
// year elements & animals
var YEAR_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];
var YEAR_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Rabbit',
    'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
var YEAR_GENDER = ['Male', 'Female'];

/**
 * fraction part a number
 *
 * @param {number} a - a number to check
 * @returns {number} the fractional part of a number
 */
var frac = function (a) { return a % 1; };
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
var amod = function (a, b) { return (a % b) || b; };

var getDateStr = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dayNr = date.getDate();
    return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + dayNr).slice(-2);
};

/**
 * Subtract 1 day from a date
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {{day, monthCount}}
 */
var getDayBefore = function (day, monthCount) { return (day === 1
    ? { day: 30, monthCount: monthCount - 1 }
    : { day: day - 1, monthCount: monthCount }); };

/**
     * Calculates whether a given Tibetan year and month number is doubled, i.e
     * is preceded by a leap month.
     *
     * @param {number} tYear - tibetan year
     * @param {number} month - month number
     * @returns {boolean}
     */
var isDoubledMonth = function (tYear, month) {
    var mp = 12 * (tYear - YEAR_DIFF - YEAR0) + month;
    return ((2 * mp) % 65 === BETA % 65) || ((2 * mp) % 65 === (BETA + 1) % 65);
};

// Implement partial formulas in Svante's paper.
/**
 * meanDate(day, monthCount) - corresponding to the linear mean motion of the moon
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
var meanDate = function (day, monthCount) { return monthCount * M1 + day * M2 + M0; };

/**
   * the anomaly of the moon
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
var moonAnomaly = function (day, monthCount) { return monthCount * A1 + day * A2 + A0; };
/**
   * Moon tab for integer values
   * @param {number} i
   * @returns {number}
   */
var moonTabInt = function (i) {
    var iMod = i % 28;
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
var moonTab = function (i) {
    var a = moonTabInt(Math.floor(i));
    var x = frac(i);
    if (x) {
        var b = moonTabInt(Math.floor(i) + 1);
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
var moonEqu = function (day, monthCount) { return moonTab(28 * moonAnomaly(day, monthCount)); };

/**
   * the mean longitude of the sun
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
var meanSun = function (day, monthCount) { return monthCount * S1 + day * S2 + S0; };
/**
   * sunAnomaly(day, monthCount)
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
var sunAnomaly = function (day, monthCount) { return meanSun(day, monthCount) - 1 / 4; };
/**
   * sun tab for integer values
   * @param {number} i
   * @returns {number}
   */
var sunTabInt = function (i) {
    var iMod = i % 12;
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
var sunTab = function (i) {
    var a = sunTabInt(Math.floor(i));
    var x = frac(i);
    if (x) {
        var b = sunTabInt(Math.floor(i) + 1);
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
var sunEqu = function (day, monthCount) { return sunTab(12 * sunAnomaly(day, monthCount)); };

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
   * figure out the animal and element for a tibetan year
   *
   * @param {Year} year
   * @return {Year} with additional attributes
   */
var yearAttributes = function (year) {
    var thisYear = __assign({}, year);
    var y = thisYear.tibYear;
    thisYear.animal = YEAR_ANIMALS[(y + 1) % 12];
    thisYear.element = YEAR_ELEMENTS[Math.floor(((y - 1) / 2) % 5)];
    thisYear.gender = YEAR_GENDER[(y + 1) % 2];
    return thisYear;
};

/**
   * get Julian date from UNIX date
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @property {Date} unixTime - the date object to be converted
   * @return {number} - julian date
   */
var julianFromUnix = function (unixTime) {
    var dateOnly = getDateStr(unixTime);
    var timeAfterNoon = new Date(dateOnly + "T18:00:00");
    return Math.floor(+timeAfterNoon / MS_IN_YEAR
        - unixTime.getTimezoneOffset() / MIN_IN_DAY
        + JULIAN_TO_UNIX);
};

/**
     * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
     * and leap month indicator, calculates the "month count" based on the epoch.
     *
     * @param {Month} monthObject
     * @returns {number} month count since epoch
     */
var monthCountFromTibetan = function (_a) {
    var year = _a.year, month = _a.month, isLeapMonth = _a.isLeapMonth;
    // the formulas on Svante's paper use western year numbers
    var wYear = year - YEAR_DIFF;
    var solarMonth = 12 * (wYear - YEAR0) + month - MONTH0;
    var hasLeap = isDoubledMonth(year, month);
    var isLeap = hasLeap && isLeapMonth ? 1 : 0;
    return Math.floor((67 * solarMonth + BETA_STAR + 17) / 65) - isLeap;
    // return Math.floor((12 * (year - Y0) + monthObject.month - ALPHA - (1 - 12 * S1) * isLeap) / (12 * S1));
};

/**
 * The date at the end of the lunar day (similar to month count since beginning of epoch, but for days)
 * It is calculated by first calculating a simpler mean date, corresponding to the linear mean motion of
 *    the moon, and then adjusting it by the equations of the moon and sun, which are determined by the
 *    anomalies of the moon and sun together with tables.
 * @param {number} day - the tibetan day
 * @param {number} monthCount - month count since beginning of epoch
 * @returns {number}
 */
var trueDateFromMonthCountDay = function (day, monthCount) { return (meanDate(day, monthCount)
    + moonEqu(day, monthCount) / 60
    - sunEqu(day, monthCount) / 60); };

/**
 * Gives the Julian date for a Tibetan year, month number (leap or not) and Tibetan day.
 *
 * Does not check that the tibetan day actually exists:
 *  - If given the date of a skipped day, will return the same Julian date as the day before.
 *  - If given the date of a duplicate day, returns the Julian date of the second of the two.
 *
 * @param {number} year - Tibetan year
 * @param {number} month - Tibetan month
 * @param {boolean} isLeapMonth - true if leap month
 * @param {number} day - Tibetan day
 * @returns {number} - Julian date
 */
var julianFromTibetan = function (year, month, isLeapMonth, day) {
    var monthCount = monthCountFromTibetan({ year: year, month: month, isLeapMonth: isLeapMonth });
    return Math.floor(trueDateFromMonthCountDay(day, monthCount));
};

/**
   * calculates the julian date from the day count a variant of true_date
   * @param {number} dayCount - the day count since beginning of epoch defined as dayNo + 30 * monthCount
   * @return {number} - julian date
   */
var julianFromTrueDate = function (dayCount) {
    var monthCount = Math.floor((dayCount - 1) / 30);
    var calculatedDay = dayCount % 30 || 30;
    return Math.floor(trueDateFromMonthCountDay(calculatedDay, monthCount));
};

/**
   * get Unix date from Julian date
   * since we use only date calculations here, there is no need to correct for timezone differences
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @param {number} julianDate - the julian date
   * @return {Date}
   */
var unixFromJulian = function (julianDate) {
    var localTimezoneOffset = new Date().getTimezoneOffset();
    var unixDate = (julianDate - JULIAN_TO_UNIX + localTimezoneOffset / MIN_IN_DAY) * MS_IN_YEAR;
    var unix = new Date(unixDate);
    return unix;
};

/**
 * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
 * year number (ex. 2137).
 * @param {number} tibYear - Tibetan year number
 * @returns {Date}
 */
var getLosarForYear = function (year, isTibetan) {
    if (isTibetan === void 0) { isTibetan = true; }
    var tibYear = isTibetan ? year : year + YEAR_DIFF;
    var julianDay = 1 + julianFromTibetan(tibYear - 1, 12, false, 30);
    return getDateStr(unixFromJulian(julianDay));
};

/**
   * Figures out the Tibetan year number, month number within the year, and whether
   * this is a leap month, from a "month count" number.  See Svante Janson,
   * "Tibetan Calendar Mathematics", p.8 ff.
   *
   * @param {number} monthCount: the "month count" since beginning of epoch
   * @returns {Month}
   */
var getMonthFromMonthCount = function (monthCount) {
    // const x = ceil(12 * S1 * n + ALPHA);
    var x = Math.ceil((65 * monthCount + BETA) / 67);
    var tMonth = amod(x, 12);
    var tYear = Math.ceil(x / 12) - 1 + YEAR0 + YEAR_DIFF;
    var isLeapMonth = Math.ceil((65 * (monthCount + 1) + BETA) / 67) === x;
    return { year: tYear, month: tMonth, isLeapMonth: isLeapMonth };
};

/**
   * Calculates full information for a given Tibetan date
   *
   * For doubled days, just as with doubled months, the "main" day or month is
   * the second, and the "leap" day or month is the first.
   *
   * @param {object} arg
   * @param {number} arg.year - Tibetan year number (ex. 2135)
   * @param {number} arg.month - month number (1 to 12)
   * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
   * @param {number} arg.day - day number (1 to 30)
   * @param {boolean} [arg.isLeapDay=false] - is this day a leap day
   *
   * @returns {Day} day - with all its attributes. isLeapMonth and isLeapDay are checked and corrected compared to input
   */
var getDayFromTibetan = function (_a) {
    var year = _a.year, month = _a.month, _b = _a.isLeapMonth, isLeapMonth = _b === void 0 ? false : _b, day = _a.day, _c = _a.isLeapDay, isLeapDay = _c === void 0 ? false : _c;
    var julianDate = julianFromTibetan(year, month, isLeapMonth, day);
    // also calculate the Julian date of the previous Tib. day
    var monthCount = monthCountFromTibetan({ year: year, month: month, isLeapMonth: isLeapMonth });
    var dayBefore = getDayBefore(day, monthCount);
    var julianDatePrevious = Math.floor(trueDateFromMonthCountDay(dayBefore.day, dayBefore.monthCount));
    var twoDaysBefore = getDayBefore(dayBefore.day, dayBefore.monthCount);
    var julianDate2DaysBefore = Math.floor(trueDateFromMonthCountDay(twoDaysBefore.day, twoDaysBefore.monthCount));
    // figure out leap months, leap days & skipped days
    var isDoubledMonthThis = isDoubledMonth(year, month);
    var hasLeapDayThis = julianDate === julianDatePrevious + 2;
    var skippedDay = julianDate === julianDatePrevious;
    var isPreviousSkipped = julianDatePrevious === julianDate2DaysBefore;
    var isLeapDayChecked = isLeapDay && hasLeapDayThis;
    // figure out western date info for the main or leap day
    if (isLeapDayChecked) {
        julianDate--;
    }
    var westernDate = unixFromJulian(julianDate);
    return ({
        year: year,
        month: {
            month: month,
            isLeapMonth: isLeapMonth && isDoubledMonthThis,
            isDoubledMonth: isDoubledMonthThis,
        },
        day: day,
        skippedDay: skippedDay,
        isPreviousSkipped: isPreviousSkipped,
        isLeapDay: isLeapDayChecked,
        isDoubledDay: hasLeapDayThis,
        westernDate: westernDate
    });
};

/**
   * Calculates a Tibetan date for a given western date. This does a binary search, and is therefore
   * much slower than tibToWestern().
   *
   * The algorithm could be much improved by using the reverse of meanDate() to start with,
   * and then using the fact that julian dates and "tibetan day numbers" have a quasi-linear relation.
   *
   * @param {Date} date - the western date
   * @return {Day}
   */
var getDayFromWestern = function (date) {
    // const date = new Date(wYear, wMonth - 1, wDay);
    var wYear = date.getFullYear();
    var jd = julianFromUnix(date);
    var tibYears = [wYear + YEAR_DIFF - 1, wYear + YEAR_DIFF + 1];
    var monthCounts = tibYears.map(function (y) { return monthCountFromTibetan({ year: y, month: 1, isLeapMonth: true }); });
    var trueDate = monthCounts.map(function (m) { return 1 + 30 * m; });
    var jds = trueDate.map(function (n) { return julianFromTrueDate(n); });
    //   croak "Binary search algorithm is wrong" unless $jd1 <= $jd && $jd <= $jd2;
    while (trueDate[0] < trueDate[1] - 1 && jds[0] < jds[1]) {
        var nTrueDate = Math.floor((trueDate[0] + trueDate[1]) / 2);
        var njd = julianFromTrueDate(nTrueDate);
        if (njd < jd) {
            trueDate[0] = nTrueDate;
            jds[0] = njd;
        }
        else {
            trueDate[1] = nTrueDate;
            jds[1] = njd;
        }
    }
    // so we found it;
    var winnerJd;
    var winnerTrueDate;
    // if the western date is the 1st of a doubled tib. day, then jd[0] == jd - 1 and
    // jd[1] == jd + 1, and the corresponding tib. day number is the one from jd[1].
    if (jds[0] === jd) {
        winnerJd = jds[0]; // eslint-disable-line prefer-destructuring
        winnerTrueDate = trueDate[0]; // eslint-disable-line prefer-destructuring
    }
    else {
        winnerJd = jds[1]; // eslint-disable-line prefer-destructuring
        winnerTrueDate = trueDate[1]; // eslint-disable-line prefer-destructuring
    }
    // figure out the real tib. date: year, month, leap month, day number, leap day.
    var isLeapDay = winnerJd > jd;
    var monthCount = Math.floor((winnerTrueDate - 1) / 30);
    var day = (winnerTrueDate % 30) || 30;
    var _a = getMonthFromMonthCount(monthCount), year = _a.year, month = _a.month, isLeapMonth = _a.isLeapMonth;
    return getDayFromTibetan({
        year: year, month: month, isLeapMonth: isLeapMonth, day: day, isLeapDay: isLeapDay
    });
};

/**
     * Figures out a year's info from a Western calendar year number, ex. 2008.
     *
     * @param {number} wYear: Western calendar year number, ex. 2008
     * @returns {Year}
     */
var getYearFromWestern = function (wYear) { return (yearAttributes({
    rabjungCycle: Math.ceil((wYear - RABJUNG_BEGINNING + 1) / RABJUNG_CYCLE_LENGTH),
    rabjungYear: amod(wYear - RABJUNG_BEGINNING + 1, RABJUNG_CYCLE_LENGTH),
    tibYear: wYear + YEAR_DIFF,
    westernYear: wYear,
})); };

/**
   * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
   *
   * @param {number} tYear - Tibetan calendar year number, ex. 2135.
   * @returns {Year}
   */
var getYearFromTibetan = function (tYear) { return getYearFromWestern(tYear - YEAR_DIFF); };

/**
     * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
     * @param {object} arg
     * @param {number} arg.rabjungCycle : number of the cycle
     * @param {number} arg.rabjungYear : number of the year within the cycle, from 1 to 60.
     * @returns {null | Year}
     */
var getYearFromRabjung = function (_a) {
    var rabjungCycle = _a.rabjungCycle, rabjungYear = _a.rabjungYear;
    if (rabjungCycle < 1 || rabjungYear > RABJUNG_CYCLE_LENGTH) {
        throw new Error("Year number must be between 1 and " + RABJUNG_CYCLE_LENGTH);
    }
    var wYear = RABJUNG_BEGINNING + (rabjungCycle - 1) * RABJUNG_CYCLE_LENGTH + (rabjungYear - 1);
    var year = yearAttributes({
        rabjungCycle: rabjungCycle,
        rabjungYear: rabjungYear,
        tibYear: wYear + YEAR_DIFF,
        westernYear: wYear,
    });
    return year;
};

/**
 * A TibetanYear class
 * @param {...(object,number)} [arg] undefined will return tibetan year for
 * current year | number will return tibetan year unless isWestern is true |
 * object will return tibetan year according to rabjung cycle
 * @param {number} arg.rabjungCycle number of the cycle
 * @param {number} arg.rabjungYear number of the year within the cycle,
 * from 1 to 60.
 * @param {bool} [isWestern=false] optional second argument, if set to true
 * and fist arg is a number it will be treated as western year date
*/
var TibetanYear = /** @class */ (function () {
    function TibetanYear(arg, isWestern) {
        if (isWestern === void 0) { isWestern = false; }
        var yearInit;
        if (!arg) {
            var westernDate = new Date();
            var tibDate = new TibetanDate(westernDate.toISOString());
            yearInit = getYearFromTibetan(tibDate.year);
        }
        else if (typeof arg === 'number') {
            if (isWestern) {
                yearInit = getYearFromWestern(arg);
            }
            else {
                yearInit = getYearFromTibetan(arg);
            }
        }
        else {
            yearInit = getYearFromRabjung(arg);
        }
        this.rabjungCycle = yearInit.rabjungCycle;
        this.rabjungYear = yearInit.rabjungYear;
        this.tibYearNum = yearInit.tibYear;
        this.westernYear = yearInit.westernYear;
        this.animal = yearInit.animal;
        this.element = yearInit.element;
        this.gender = yearInit.gender;
        this.months = [];
    }
    // Need to call this method at least once in order to calculate the month.
    // This is in order to reduce initial object size.
    TibetanYear.prototype.getMonths = function () {
        if (this.months.length) {
            return this.months;
        }
        // loop over the month, taking care of duplicates
        for (var m = 1; m <= 12; m++) {
            var month = new TibetanMonth({ year: this.tibYearNum, month: m });
            this.months.push(month);
            if (isDoubledMonth(this.tibYearNum, m)) {
                var leapMonth = new TibetanMonth({ year: this.tibYearNum, month: m, isLeapMonth: true });
                this.months.push(leapMonth);
            }
        }
        return this.months;
    };
    TibetanYear.prototype.toString = function () {
        return "" + this.tibYearNum;
    };
    TibetanYear.prototype.toRabjungString = function () {
        return "The " + this.rabjungYear + ". year of the " + this.rabjungCycle + ". rabjung cycle";
    };
    return TibetanYear;
}());

/**
 * Calculates full information about a Tibetan month: whether it is doubled or not,
 * and the western start and end date for it.
 * The start_date and end_date correspond to the leap month if isLeapMonth is true,
 * otherwise to the main month (i.e the second of the two).
 *
 * @param {object} arg
 * @param {number} arg.year - the Tibetan year
 * @param {number} arg.month - the Tibetan month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - if leap month or not
 * @returns {Month}
 */
var getMonthFromTibetan = function (_a) {
    var year = _a.year, month = _a.month, _b = _a.isLeapMonth, isLeapMonth = _b === void 0 ? false : _b;
    var hasLeap = isDoubledMonth(year, month);
    var isLeap = isLeapMonth && hasLeap;
    // calculate the Julian date 1st and last of the month
    var monthCount = monthCountFromTibetan({ year: year, month: month, isLeapMonth: isLeap });
    var jdFirst = 1 + Math.floor(trueDateFromMonthCountDay(30, monthCount - 1));
    var jdLast = Math.floor(trueDateFromMonthCountDay(30, monthCount));
    var startDate = getDateStr(unixFromJulian(jdFirst));
    var endDate = getDateStr(unixFromJulian(jdLast));
    return {
        year: year, month: month, isLeapMonth: isLeap, isDoubledMonth: hasLeap, startDate: startDate, endDate: endDate,
    };
};

/**
 * A TibetanMonth class
 * @param {...(object,string)} [arg] undefined will return tibetan month for
 * current month | string will return tibetan day for month of `new Date(arg)` |
 * object will return tibetan month according to object definition
 * @param {number} arg.year - Tibetan year number (ex. 2135)
 * @param {number} arg.month - month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
 */
var TibetanMonth = /** @class */ (function () {
    function TibetanMonth(arg) {
        var westernDate;
        var tibDate;
        if (!arg) {
            westernDate = new Date();
            tibDate = new TibetanDate(westernDate.toISOString());
        }
        else if (typeof arg === 'string') {
            westernDate = new Date(arg);
            tibDate = new TibetanDate(westernDate.toISOString());
        }
        else {
            this.year = arg.year;
            this.month = arg.month;
            this.isLeapMonth = arg.isLeapMonth || false;
        }
        if (tibDate) {
            this.year = tibDate.year;
            this.month = tibDate.month;
            this.isLeapMonth = tibDate.monthObj.isLeapMonth;
        }
        var monthObj = getMonthFromTibetan({
            year: this.year,
            month: this.month,
            isLeapMonth: this.isLeapMonth
        });
        this.isDoubledMonth = monthObj.isDoubledMonth;
        this.startDateStr = monthObj.startDate;
        this.endDateStr = monthObj.endDate;
        this.days = [];
    }
    Object.defineProperty(TibetanMonth.prototype, "yearObj", {
        get: function () {
            return new TibetanYear(this.year);
        },
        enumerable: true,
        configurable: true
    });
    // Need to call this method at least once in order to calculate the dates.
    // This is in order to reduce initial object size.
    TibetanMonth.prototype.getDays = function () {
        if (this.days.length) {
            return this.days;
        }
        // loop over the days, taking care of duplicate and missing days
        for (var d = 1; d <= 30; d++) {
            var day = new TibetanDate({
                year: this.year,
                month: this.month,
                isLeapMonth: this.isLeapMonth,
                day: d,
                isLeapDay: false
            });
            if (day.isDoubledDay) {
                var main = new TibetanDate({
                    year: this.year,
                    month: this.month,
                    isLeapMonth: this.isLeapMonth,
                    day: d,
                    isLeapDay: true
                });
                this.days.push(main);
            }
            if (!day.isSkippedDay) {
                this.days.push(day);
            }
        }
        return this.days;
    };
    TibetanMonth.prototype.toString = function () {
        var double = '';
        if (this.isDoubledMonth) {
            double = this.isLeapMonth ? '-leap' : '-main';
        }
        return this.yearObj.toString() + "-" + this.month + double;
    };
    return TibetanMonth;
}());

/**
 * A TibetanDate class
 * @param {...(object,string)} [arg] undefined will return tibetan date
 * for today | string will return tibetan day for `new Date(arg)` | object
 * will return tibetan day according to object definition
 * @param {number} arg.year - Tibetan year number (ex. 2135)
 * @param {number} arg.month - month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
 * @param {number} arg.day - day number (1 to 30)
 * @param {boolean} [arg.isLeapDay=false] - is this day a leap day
 */
var TibetanDate = /** @class */ (function () {
    function TibetanDate(arg) {
        var tibDate;
        if (!arg) {
            this.westernDate = new Date();
            tibDate = getDayFromWestern(this.westernDate);
        }
        else if (typeof arg === 'string') {
            this.westernDate = new Date(arg);
            tibDate = getDayFromWestern(this.westernDate);
        }
        else {
            tibDate = getDayFromTibetan(arg);
            this.westernDate = tibDate.westernDate;
        }
        this.isSkippedDay = tibDate.skippedDay;
        this.isPreviousSkipped = tibDate.isPreviousSkipped;
        // the first of doubled days
        this.isLeapDay = tibDate.isLeapDay;
        this.isDoubledDay = tibDate.isDoubledDay;
        this.date = tibDate.day;
        this.year = tibDate.year;
        this.month = tibDate.month.month;
        this.monthObj = new TibetanMonth({
            year: tibDate.year,
            month: tibDate.month.month,
            isLeapMonth: tibDate.month.isLeapMonth
        });
    }
    Object.defineProperty(TibetanDate.prototype, "day", {
        /** GETTERS */
        get: function () {
            return this.westernDate.getDay();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TibetanDate.prototype, "yearObj", {
        get: function () {
            return new TibetanYear(this.year);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TibetanDate.prototype, "westernDateStr", {
        get: function () {
            return getDateStr(this.westernDate);
        },
        enumerable: true,
        configurable: true
    });
    /** METHODS */
    TibetanDate.prototype.getWesternDate = function () {
        return this.westernDate;
    };
    TibetanDate.prototype.getDate = function () {
        return this.date;
    };
    TibetanDate.prototype.getDay = function () {
        return this.westernDate.getDay();
    };
    TibetanDate.prototype.getMonth = function () {
        return this.month;
    };
    TibetanDate.prototype.getMonthObj = function () {
        return this.monthObj;
    };
    TibetanDate.prototype.getYear = function () {
        return this.year;
    };
    TibetanDate.prototype.getYearObj = function () {
        return this.yearObj;
    };
    TibetanDate.prototype.toString = function () {
        var double = '';
        if (this.isDoubledDay) {
            double = this.isLeapDay ? '-leap' : '-main';
        }
        return this.monthObj.toString() + "-" + this.date + double;
    };
    return TibetanDate;
}());

export { TibetanDate, TibetanMonth, TibetanYear, getLosarForYear };
