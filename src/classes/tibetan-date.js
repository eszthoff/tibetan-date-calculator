import getDayFromWestern from '../generators/get-day-from-western';
import getDayFromTibetan from '../generators/get-day-from-tibetan';
import getYearFromTibetan from '../generators/get-year-from-tibetan';
import { getDateStr } from '../helpers';

/**
 * A TibetanDate class
 * @param {...(object,string)} [arg] undefined will return tibeatn date for today | string will return tibetan day for `new Date(arg)` | object will return tibeatn day according to objecct definition
   * @param {number} arg.year - Tibetan year number (ex. 2135)
   * @param {number} arg.month - month number (1 to 12)
   * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
   * @param {number} arg.day - day number (1 to 30)
   * @param {boolean} [arg.isLeapDay=false] - is this day a leap day
 */
class TibetanDate {
  constructor(arg) {
    if (!arg) {
      this.westernDate = new Date();
      this.tibDate = getDayFromWestern(this.westernDate);
    } else if (typeof arg === 'string') {
      this.westernDate = new Date(arg);
      this.tibDate = getDayFromWestern(this.westernDate);
    } else {
      this.tibDate = getDayFromTibetan(arg);
      this.westernDate = new Date(this.tibDate.westernDate);
    }
  }

  /** GETTERS */
  get isSkippedDay() {
    return this.tibDate.skippedDay;
  }

  get isPreviousSkipped() {
    return this.tibDate.isPreviousSkipped;
  }

  // the first of doubled days
  get isLeapDay() {
    return this.tibDate.isLeapDay;
  }

  get isDoubledDay() {
    return this.tibDate.isDoubledDay;
  }

  get date() {
    return this.tibDate.day;
  }

  get day() {
    return this.westernDate.getDate();
  }

  get month() {
    return this.tibDate.month.month;
  }

  get monthObj() {
    return this.tibDate.month;
  }

  get year() {
    return this.tibDate.year;
  }

  get yearObj() {
    return getYearFromTibetan(this.tibDate.year);
  }

  get westernDateStr() {
    return getDateStr(this.westernDate);
  }

  /** METHODS */

  getWesternDate() {
    return this.westernDate;
  }

  getDate() {
    return this.tibDate.day;
  }

  getDay() {
    return this.westernDate.getDay();
  }

  getMonth() {
    return this.tibDate.month.month;
  }

  getMonthObj() {
    return this.tibDate.month;
  }

  getYear() {
    return this.tibDate.year;
  }

  getYearObj() {
    return getYearFromTibetan(this.tibDate.year);
  }
}

export default TibetanDate;
