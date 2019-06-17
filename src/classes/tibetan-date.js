import getDayFromWestern from '../generators/get-day-from-western';
import getDayFromTibetan from '../generators/get-day-from-tibetan';
import { getDateStr } from '../helpers';
import TibetanMonth from './tibetan-month'; // eslint-disable-line import/no-cycle
import TibetanYear from './tibetan-year'; // eslint-disable-line import/no-cycle

/**
 * A TibetanDate class
 * @param {...(object,string)} [arg] undefined will return tibeatn date
 * for today | string will return tibetan day for `new Date(arg)` | object
 * will return tibeatn day according to objecct definition
 * @param {number} arg.year - Tibetan year number (ex. 2135)
 * @param {number} arg.month - month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
 * @param {number} arg.day - day number (1 to 30)
 * @param {boolean} [arg.isLeapDay=false] - is this day a leap day
 */
class TibetanDate {
  constructor(arg) {
    let tibDate;
    if (!arg) {
      this.westernDate = new Date();
      tibDate = getDayFromWestern(this.westernDate);
    } else if (typeof arg === 'string') {
      this.westernDate = new Date(arg);
      tibDate = getDayFromWestern(this.westernDate);
    } else {
      tibDate = getDayFromTibetan(arg);
      this.westernDate = new Date(tibDate.westernDate);
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
      isLeapMonth: tibDate.isLeapMonth
    });
  }

  /** GETTERS */
  get day() {
    return this.westernDate.getDay();
  }

  get yearObj() {
    return new TibetanYear(this.year);
  }

  get westernDateStr() {
    return getDateStr(this.westernDate);
  }

  /** METHODS */
  getWesternDate() {
    return this.westernDate;
  }

  getDate() {
    return this.date;
  }

  getDay() {
    return this.westernDate.getDay();
  }

  getMonth() {
    return this.month;
  }

  getMonthObj() {
    return this.monthObj;
  }

  getYear() {
    return this.year;
  }

  getYearObj() {
    return this.yearObj;
  }
}

export default TibetanDate;
