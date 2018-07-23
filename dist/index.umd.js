(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.tibetanCalendarCalculator = {})));
}(this, (function (exports) { 'use strict';

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
  // number of miliseconds in a year
  var MS_IN_YEAR = 86400000;
  // number of minutes in day
  var MIN_IN_DAY = 1440;

  // calendrical constants: month calculations

  // begining of epoch based on Kalachakra. Used as 0 for month counts since this time
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
  var YEAR_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
  var YEAR_GENDER = ['Male', 'Female'];

  /**
   * get Julian date from UNIX date
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @property {Date} unixTime - the date object to be converted
   * @return {number} - julian date
   */
  var julianFromUnix = function julianFromUnix(unixTime) {
    var dateOnly = unixTime.toJSON().split('T')[0];
    var timeAfterNoon = new Date(dateOnly + 'T18:00:00');

    return Math.floor(timeAfterNoon / MS_IN_YEAR - unixTime.getTimezoneOffset() / MIN_IN_DAY + JULIAN_TO_UNIX);
  };

  /**
   * fraction part a number
   *
   * @param {number} a - a number to check
   * @returns {number} the fractional part of a number
   */
  var frac = function frac(a) {
    return a % 1;
  };

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
  var amod = function amod(a, b) {
    return a % b || b;
  };

  /**
   * substract 1 day from a date
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {{day, monthCount}}
   */
  var getDayBefore = function getDayBefore(day, monthCount) {
    return day === 1 ? { day: 30, monthCount: monthCount - 1 } : { day: day - 1, monthCount: monthCount };
  };

  /**
       * Calculates whether a given Tibetan year and month number is duplicated, i.e
       * is preceded by a leap month.
       *
       * @param {number} tYear - tibetan year
       * @param {number} month - month number
       * @returns {boolean}
       */
  var hasLeapMonth = function hasLeapMonth(tYear, month) {
    var mp = 12 * (tYear - YEAR_DIFF - YEAR0) + month;

    return 2 * mp % 65 === BETA % 65 || 2 * mp % 65 === (BETA + 1) % 65;
  };

  // Implement partial formulas in Svante's paper.

  /**
   * meanDate(day, monthCount) - corresponding to the linear mean motion of the moon
   * @param {number} day - the tibetan day
   * @param {number} monthCount - month count since beginning of epoch
   * @returns {number}
   */
  var meanDate = function meanDate(day, monthCount) {
    return monthCount * M1 + day * M2 + M0;
  };

  /**
     * the anomaly of the moon
     * @param {number} day - the tibetan day
     * @param {number} monthCount - month count since beginning of epoch
     * @returns {number}
     */
  var moonAnomaly = function moonAnomaly(day, monthCount) {
    return monthCount * A1 + day * A2 + A0;
  };

  /**
     * Moon tab for integer values
     * @param {number} i
     * @returns {number}
     */
  var moonTabInt = function moonTabInt(i) {
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
  var moonTab = function moonTab(i) {
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
  var moonEqu = function moonEqu(day, monthCount) {
    return moonTab(28 * moonAnomaly(day, monthCount));
  };

  /**
     * the mean longitude of the sun
     * @param {number} day - the tibetan day
     * @param {number} monthCount - month count since beginning of epoch
     * @returns {number}
     */
  var meanSun = function meanSun(day, monthCount) {
    return monthCount * S1 + day * S2 + S0;
  };

  /**
     * sunAnomaly(day, monthCount)
     * @param {number} day - the tibetan day
     * @param {number} monthCount - month count since beginning of epoch
     * @returns {number}
     */
  var sunAnomaly = function sunAnomaly(day, monthCount) {
    return meanSun(day, monthCount) - 1 / 4;
  };

  /**
     * sun tab for integer values
     * @param {number} i
     * @returns {number}
     */
  var sunTabInt = function sunTabInt(i) {
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
  var sunTab = function sunTab(i) {
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
  var sunEqu = function sunEqu(day, monthCount) {
    return sunTab(12 * sunAnomaly(day, monthCount));
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  /**
     * figure out the animal and element for a tibetan year
     *
     * @param {Year} year
     * @return {Year} with additional attributes
     */
  var yearAttributes = function yearAttributes(year) {
    var thisYear = _extends({}, year);
    var y = thisYear.tibYear;

    thisYear.animal = YEAR_ANIMALS[(y + 1) % 12];
    thisYear.element = YEAR_ELEMENTS[Math.floor((y - 1) / 2 % 5)];
    thisYear.gender = YEAR_GENDER[(y + 1) % 2];

    return thisYear;
  };

  /**
       * This is the reverse of fromMonthCount(n): from a Tibetan year, month number
       * and leap month indicator, calculates the "month count" based on the epoch.
       *
       * @param {Month} monthObject
       * @returns {number} month count since epoch
       */
  var monthCountFromTibetan = function monthCountFromTibetan(_ref) {
    var year = _ref.year,
        month = _ref.month,
        isLeapMonth = _ref.isLeapMonth;

    // the formulas on Svante's paper use western year numbers
    var wYear = year - YEAR_DIFF;
    var solarMonth = 12 * (wYear - YEAR0) + month - MONTH0;
    var hasLeap = hasLeapMonth(year, month);
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
  var trueDateFromMonthCountDay = function trueDateFromMonthCountDay(day, monthCount) {
    return meanDate(day, monthCount) + moonEqu(day, monthCount) / 60 - sunEqu(day, monthCount) / 60;
  };

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
  var julianFromTibetan = function julianFromTibetan(year, month, isLeapMonth, day) {
    var monthCount = monthCountFromTibetan({ year: year, month: month, isLeapMonth: isLeapMonth });

    return Math.floor(trueDateFromMonthCountDay(day, monthCount));
  };

  /**
     * calculates the julian date from the day count a variant of true_date
     * @param {number} dayCount - the day count since beginning of epoch defined as dayNo + 30 * monthCount
     * @return {number} - julian date
     */
  var julianFromTrueDate = function julianFromTrueDate(dayCount) {
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
  var unixFromJulian = function unixFromJulian(julianDate) {
    var unixDate = (julianDate - JULIAN_TO_UNIX) * MS_IN_YEAR;
    var unix = new Date(unixDate);

    return unix.toJSON().split('T')[0];
  };

  /**
   * Calculates full information about a Tibetan month: whether it is duplicated or not,
   * and the western start and end date for it.
   * The start_date and end_date correspond to the leap month if isLeapMonth is passed,
   * otherwise to the main month (i.e the second of the two).
   *
   * @param {number} year - the Tibetan year
   * @param {number} month - the Tibetan month number (1 to 12)
   * @param {boolean} isLeapMonth - if leap month or not
   * @returns {Month}
   */
  var getMonthFromTibetan = function getMonthFromTibetan(year, month, isLeapMonth) {
    var hasLeap = hasLeapMonth(year, month);
    var isLeap = isLeapMonth && hasLeap;

    // calculate the Julian date 1st and last of the month
    var monthCount = monthCountFromTibetan({ year: year, month: month, isLeapMonth: isLeap });
    var jdFirst = 1 + Math.floor(trueDateFromMonthCountDay(30, monthCount - 1));
    var jdLast = Math.floor(trueDateFromMonthCountDay(30, monthCount));
    var startDate = unixFromJulian(jdFirst);
    var endDate = unixFromJulian(jdLast);

    return {
      year: year, month: month, isLeapMonth: isLeap, hasLeapMonth: hasLeap, startDate: startDate, endDate: endDate
    };
  };

  /**
     * Calculates full information for a given Tibetan date
     *
     * For duplicated days, just as with duplicated months, the "main" day or month is
     * the second, and the "leap" day or month is the first.
     *
     * @param {number} year - Tibetan year number (ex. 2135)
     * @param {number} month - month number (1 to 12)
     * @param {boolean} isLeapMonth - is this month a leap month
     * @param {number} day - day number (1 to 30)
     * @param {boolean} isLeapDay - is this day a leap day
     *
     * @returns {Day} day - with all its attributes. isLeapMonth and isLeapDay are checked and corrected compared to input
     */
  var getDayFromTibetan = function getDayFromTibetan(year, month, isLeapMonth, day, isLeapDay) {
    var julianDate = julianFromTibetan(year, month, isLeapMonth, day);

    // also calculate the Julian date of the previous Tib. day
    var monthCount = monthCountFromTibetan({ year: year, month: month, isLeapMonth: isLeapMonth });
    var dayBefore = getDayBefore(day, monthCount);
    var julianDatePrevious = Math.floor(trueDateFromMonthCountDay(dayBefore.day, dayBefore.monthCount));

    // figure out leap months, leap days & skipped days
    var hasLeapMonthThis = hasLeapMonth(year, month);
    var hasLeapDayThis = julianDate === julianDatePrevious + 2;
    var skippedDay = julianDate === julianDatePrevious;
    var isLeapDayChecked = isLeapDay && hasLeapDayThis;

    // figure out western date info for the main or leap day
    if (isLeapDayChecked) {
      julianDate--;
    }
    var westernDate = unixFromJulian(julianDate);

    return {
      year: year,
      month: {
        month: month,
        isLeapMonth: isLeapMonth && hasLeapMonthThis,
        hasLeapMonth: hasLeapMonthThis
      },
      day: day,
      skippedDay: skippedDay,
      isLeapDay: isLeapDayChecked,
      hasLeapDay: hasLeapDayThis,
      westernDate: westernDate
    };
  };

  /**
   * generate a month with all its days
   *
   * @param {number} year - tibetan year
   * @param {number} month - month number
   * @param {boolean} isLeapMonth - if leap month
   * @return {Month}
   */
  var getCalendarForMonth = function getCalendarForMonth(year, month, isLeapMonth) {
    var thisMonth = getMonthFromTibetan(year, month, isLeapMonth);
    var days = {};
    var westernIndex = {};
    var monthString = '';
    if (hasLeapMonth(year, month)) {
      if (isLeapMonth) {
        monthString = year + '-' + month + '-leap';
      } else {
        monthString = year + '-' + month + '-main';
      }
    } else {
      monthString = year + '-' + month;
    }

    // loop over the days, taking care of duplicate and missing days
    for (var d = 1; d <= 30; d++) {
      var day = getDayFromTibetan(year, month, isLeapMonth, d, false);
      var dateString = monthString + '-' + d;

      if (day.hasLeapDay) {
        var main = getDayFromTibetan(year, month, isLeapMonth, d, true);

        days[dateString] = { doubled: true };
        days[dateString + '-main'] = main;
        days[dateString + '-leap'] = day;
        westernIndex[main.westernDate] = dateString + '-main';
        westernIndex[day.westernDate] = dateString + '-leap';
      } else if (day.skippedDay) {
        days[dateString] = day;
      } else {
        days[dateString] = day;
        westernIndex[day.westernDate] = dateString;
      }
    }

    thisMonth.days = days;
    thisMonth.westernIndex = westernIndex;
    return thisMonth;
  };

  /**
       * Figures out a year's info from a Western calendar year number, ex. 2008.
       *
       * @param wYear: Western calendar year number, ex. 2008
       * @returns {Year}
       */
  var getYearFromWestern = function getYearFromWestern(wYear) {
    return yearAttributes({
      rabjungCycle: Math.ceil((wYear - RABJUNG_BEGINNING + 1) / RABJUNG_CYCLE_LENGTH),
      rabjungYear: amod(wYear - RABJUNG_BEGINNING + 1, RABJUNG_CYCLE_LENGTH),
      tibYear: wYear + YEAR_DIFF,
      westernYear: wYear
    });
  };

  /**
     * Figures out a year's info from a Tibetan calendar year number, ex. 2135.
     *
     * @param tYear - Tibetan calendar year number, ex. 2135.
     * @returns {Year}
     */
  var getYearFromTibetan = function getYearFromTibetan(tYear) {
     return getYearFromWestern(tYear - YEAR_DIFF);
  };

  /** internal helper function */
  var getEssentialMonth = function getEssentialMonth(_ref) {
    var days = _ref.days,
        westernIndex = _ref.westernIndex,
        rest = objectWithoutProperties(_ref, ['days', 'westernIndex']);
    return rest;
  };

  /**
   * Generate a calendar for a whole Tibetan year, given by Tib. year number.
   * @param tibYear
   * @return {Year} - the year's info, including each of the months as an array within .months
   *     Each month includes all the days as an array within .days
   */
  var getCalendarForYear = function getCalendarForYear(tYear) {
    var isTibetan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var tibYear = isTibetan ? tYear : tYear + YEAR_DIFF;
    var year = getYearFromTibetan(tibYear);

    var months = {};
    var days = {};
    var westernIndex = {};

    for (var m = 1; m <= 12; m++) {
      if (hasLeapMonth(tibYear, m)) {
        var mainMonth = getCalendarForMonth(tibYear, m, true);
        var leapMonth = getCalendarForMonth(tibYear, m, false);

        months[tibYear + '-' + m] = { doubled: true };
        months[tibYear + '-' + m + '-main'] = getEssentialMonth(mainMonth);
        months[tibYear + '-' + m + '-leap'] = getEssentialMonth(leapMonth);
        days = _extends({}, days, mainMonth.days, leapMonth.days);
        westernIndex = _extends({}, westernIndex, mainMonth.westernIndex, leapMonth.westernIndex);
      } else {
        var month = getCalendarForMonth(tibYear, m, false);

        months[tibYear + '-' + m] = getEssentialMonth(month);
        days = _extends({}, days, month.days);
        westernIndex = _extends({}, westernIndex, month.westernIndex);
      }
    }

    year.months = months;
    year.days = days;
    year.westernIndex = westernIndex;

    return year;
  };

  /**
     * Figures out the Tibetan year number, month number within the year, and whether
     * this is a leap month, from a "month count" number.  See Svante Janson,
     * "Tibetan Calendar Mathematics", p.8 ff.
     *
     * @param {number} monthCount: the "month count" since beginning of epoch
     * @returns {Month}
     */
  var getMonthFromMonthCount = function getMonthFromMonthCount(monthCount) {
    // const x = ceil(12 * S1 * n + ALPHA);
    var x = Math.ceil((65 * monthCount + BETA) / 67);
    var tMonth = amod(x, 12);
    var tYear = Math.ceil(x / 12) - 1 + YEAR0 + YEAR_DIFF;
    var isLeapMonth = Math.ceil((65 * (monthCount + 1) + BETA) / 67) === x;

    return { year: tYear, month: tMonth, isLeapMonth: isLeapMonth };
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
  var getDayFromWestern = function getDayFromWestern(date) {
    // const date = new Date(wYear, wMonth - 1, wDay);
    var wYear = date.getFullYear();
    var jd = julianFromUnix(date);
    var tibYears = [wYear + YEAR_DIFF - 1, wYear + YEAR_DIFF + 1];
    var monthCounts = tibYears.map(function (y) {
      return monthCountFromTibetan({ year: y, month: 1, isLeapMonth: true });
    });
    var trueDate = monthCounts.map(function (m) {
      return 1 + 30 * m;
    });
    var jds = trueDate.map(function (n) {
      return julianFromTrueDate(n);
    });
    //   croak "Binary search algo is wrong" unless $jd1 <= $jd && $jd <= $jd2;

    while (trueDate[0] < trueDate[1] - 1 && jds[0] < jds[1]) {
      var nTrueDate = Math.floor((trueDate[0] + trueDate[1]) / 2);
      var njd = julianFromTrueDate(nTrueDate);

      if (njd < jd) {
        trueDate[0] = nTrueDate;
        jds[0] = njd;
      } else {
        trueDate[1] = nTrueDate;
        jds[1] = njd;
      }
    }

    // so we found it;
    var winnerJd = void 0;
    var winnerTrueDate = void 0;
    // if the western date is the 1st of a duplicated tib. day, then jd[0] == jd - 1 and
    // jd[1] == jd + 1, and the corresponding tib. day number is the one from jd[1].
    if (jds[0] === jd) {
      winnerJd = jds[0]; // eslint-disable-line prefer-destructuring
      winnerTrueDate = trueDate[0]; // eslint-disable-line prefer-destructuring
    } else {
      winnerJd = jds[1]; // eslint-disable-line prefer-destructuring
      winnerTrueDate = trueDate[1]; // eslint-disable-line prefer-destructuring
    }

    // figure out the real tib. date: year, month, leap month, day number, leap day.
    var isLeapDay = winnerJd > jd;
    var monthCount = Math.floor((winnerTrueDate - 1) / 30);
    var day = winnerTrueDate % 30 || 30;

    var _getMonthFromMonthCou = getMonthFromMonthCount(monthCount),
        year = _getMonthFromMonthCou.year,
        month = _getMonthFromMonthCou.month,
        isLeapMonth = _getMonthFromMonthCou.isLeapMonth;

    return getDayFromTibetan(year, month, isLeapMonth, day, isLeapDay);
  };

  /**
       * Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of the 15th Rabjung calendrical cycle.
       *
       * @param rabjungCycle : number of the cycle
       * @param rabjungYear : number of the year within the cycle, from 1 to 60.
       * @returns {null | Year}
       */
  var getYearFromRabjung = function getYearFromRabjung(rabjungCycle, rabjungYear) {
    if (rabjungCycle < 1 || rabjungYear > RABJUNG_CYCLE_LENGTH) {
      throw new Error('Year number must be between 1 and ' + RABJUNG_CYCLE_LENGTH);
    }
    var wYear = RABJUNG_BEGINNING + (rabjungCycle - 1) * RABJUNG_CYCLE_LENGTH + (rabjungYear - 1);
    var year = yearAttributes({
      rabjungCycle: rabjungCycle,
      rabjungYear: rabjungYear,
      tibYear: wYear + YEAR_DIFF,
      westernYear: wYear
    });

    return year;
  };

  /**
   * Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
   * year number (ex. 2137).
   * @param {number} tibYear - Tibetan year number
   * @returns {Date}
   */
  var getLosarForYear = function getLosarForYear(year) {
    var isTibetan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var tibYear = isTibetan ? year : year + YEAR_DIFF;
    var julianDay = 1 + julianFromTibetan(tibYear - 1, 12, 0, 30);

    return unixFromJulian(julianDay);
  };

  exports.getCalendarForMonth = getCalendarForMonth;
  exports.getCalendarForYear = getCalendarForYear;
  exports.getDayFromTibetan = getDayFromTibetan;
  exports.getDayFromWestern = getDayFromWestern;
  exports.getYearFromRabjung = getYearFromRabjung;
  exports.getYearFromTibetan = getYearFromTibetan;
  exports.getYearFromWestern = getYearFromWestern;
  exports.getLosarForYear = getLosarForYear;
  exports.getMonthFromTibetan = getMonthFromTibetan;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
