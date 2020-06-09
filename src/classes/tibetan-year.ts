import TibetanDate from './tibetan-date'; // eslint-disable-line import/no-cycle
import TibetanMonth from './tibetan-month'; // eslint-disable-line import/no-cycle
import getYearFromTibetan from '../generators/get-year-from-tibetan';
import getYearFromWestern from '../generators/get-year-from-western';
import getYearFromRabjung from '../generators/get-year-from-rabjung';
import { isDoubledMonth } from '../helpers';
import { YEAR_ANIMALS, YEAR_ELEMENTS, YEAR_GENDER } from '../constants';


type Arg = (number | {
  rabjungCycle: number;
  rabjungYear: number;
})

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
class TibetanYear {
    rabjungCycle: number;

    rabjungYear: number;

    tibYearNum: number;

    westernYear: number;

    animal: typeof YEAR_ANIMALS[number];

    element: typeof YEAR_ELEMENTS[number];

    gender: typeof YEAR_GENDER[number];

    months: TibetanMonth[];

    constructor(arg?: Arg, isWestern = false) {
      let yearInit;

      if (!arg) {
        const westernDate = new Date();
        const tibDate = new TibetanDate(westernDate.toISOString());
        yearInit = getYearFromTibetan(tibDate.year);
      } else if (typeof arg === 'number') {
        if (isWestern) {
          yearInit = getYearFromWestern(arg);
        } else {
          yearInit = getYearFromTibetan(arg);
        }
      } else {
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
    getMonths(): TibetanMonth[] {
      if (this.months.length) {
        return this.months;
      }
      // loop over the month, taking care of duplicates
      for (let m = 1; m <= 12; m++) {
        const month = new TibetanMonth({ year: this.tibYearNum, month: m });
        this.months.push(month);
        if (isDoubledMonth(this.tibYearNum, m)) {
          const leapMonth = new TibetanMonth({ year: this.tibYearNum, month: m, isLeapMonth: true });
          this.months.push(leapMonth);
        }
      }
      return this.months;
    }

    toString(): string {
      return `${this.tibYearNum}`;
    }

    toRabjungString(): string {
      return `The ${this.rabjungYear}. year of the ${this.rabjungCycle}. rabjung cycle`;
    }
}

export default TibetanYear;
