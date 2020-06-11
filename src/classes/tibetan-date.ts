import getDayFromWestern from '../generators/get-day-from-western';
import getDayFromTibetan from '../generators/get-day-from-tibetan';
import { getDateStr } from '../helpers';
import TibetanMonth from './tibetan-month'; // eslint-disable-line import/no-cycle
import TibetanYear from './tibetan-year'; // eslint-disable-line import/no-cycle

type Arg = (string | {
  year: number;
  month: number;
  isLeapMonth?: boolean;
  day: number;
  isLeapDay?: boolean;
})

type SimpleMonth = {
  month: number;
  isLeapMonth: boolean;
  isDoubledMonth: boolean;
}

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
class TibetanDate {
    year: number;

    month: SimpleMonth;

    skippedDay: boolean;

    isPreviousSkipped: boolean;

    isLeapDay: boolean;

    isDoubledDay: boolean;

    westernDate: Date;

    isSkippedDay: boolean;

    date: number;

    monthObj: TibetanMonth;

    constructor(arg?: Arg) {
      let tibDate;
      if (!arg) {
        this.westernDate = new Date();
        tibDate = getDayFromWestern(this.westernDate);
      } else if (typeof arg === 'string') {
        this.westernDate = new Date(arg);
        tibDate = getDayFromWestern(this.westernDate);
      } else {
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

    /** GETTERS */
    get day(): number {
      return this.westernDate.getDay();
    }

    get yearObj(): TibetanYear {
      return new TibetanYear(this.year);
    }

    get westernDateStr(): string {
      return getDateStr(this.westernDate);
    }

    /** METHODS */
    getWesternDate(): Date {
      return this.westernDate;
    }

    getDate(): number {
      return this.date;
    }

    getDay(): number {
      return this.westernDate.getDay();
    }

    getMonth(): SimpleMonth {
      return this.month;
    }

    getMonthObj(): TibetanMonth {
      return this.monthObj;
    }

    getYear(): number {
      return this.year;
    }

    getYearObj(): TibetanYear {
      return this.yearObj;
    }

    toString(): string {
      let double = '';
      if (this.isDoubledDay) {
        double = this.isLeapDay ? '-leap' : '-main';
      }

      return `${this.monthObj.toString()}-${this.date}${double}`;
    }
}

export default TibetanDate;
