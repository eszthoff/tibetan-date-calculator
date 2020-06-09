import TibetanDate from './tibetan-date'; // eslint-disable-line import/no-cycle
import TibetanYear from './tibetan-year'; // eslint-disable-line import/no-cycle
import getMonthFromTibetan from '../generators/get-month-from-tibetan';

type Arg = (string | {
  year: number;
  month: number;
  isLeapMonth?: boolean;
})

/**
 * A TibetanMonth class
 * @param {...(object,string)} [arg] undefined will return tibetan month for
 * current month | string will return tibetan day for month of `new Date(arg)` |
 * object will return tibetan month according to object definition
 * @param {number} arg.year - Tibetan year number (ex. 2135)
 * @param {number} arg.month - month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
 */
class TibetanMonth {
  year: number;

  month: number;

  isLeapMonth: boolean;

  isDoubledMonth: boolean;

  startDateStr: string;

  endDateStr: string;

  days: TibetanDate[];

  constructor(arg?: Arg) {
    let westernDate;
    let tibDate;

    if (!arg) {
      westernDate = new Date();
      tibDate = new TibetanDate(westernDate.toISOString());
    } else if (typeof arg === 'string') {
      westernDate = new Date(arg);
      tibDate = new TibetanDate(westernDate.toISOString());
    } else {
      this.year = arg.year;
      this.month = arg.month;
      this.isLeapMonth = arg.isLeapMonth || false;
    }

    if (tibDate) {
      this.year = tibDate.year;
      this.month = tibDate.month;
      this.isLeapMonth = tibDate.monthObj.isLeapMonth;
    }

    const monthObj = getMonthFromTibetan({
      year: this.year,
      month: this.month,
      isLeapMonth: this.isLeapMonth
    });

    this.isDoubledMonth = monthObj.isDoubledMonth;
    this.startDateStr = monthObj.startDate;
    this.endDateStr = monthObj.endDate;

    this.days = [];
  }

  get yearObj(): TibetanYear {
    return new TibetanYear(this.year);
  }

  // Need to call this method at least once in order to calculate the dates.
  // This is in order to reduce initial object size.
  getDays(): TibetanDate[] {
    if (this.days.length) {
      return this.days;
    }
    // loop over the days, taking care of duplicate and missing days
    for (let d = 1; d <= 30; d++) {
      const day = new TibetanDate({
        year: this.year,
        month: this.month,
        isLeapMonth: this.isLeapMonth,
        day: d,
        isLeapDay: false
      });

      if (day.isDoubledDay) {
        const main = new TibetanDate({
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
  }

  toString(): string {
    let double = '';
    if (this.isDoubledMonth) {
      double = this.isLeapMonth ? '-leap' : '-main';
    }

    return `${this.yearObj.toString()}-${this.month}${double}`;
  }
}

export default TibetanMonth;
