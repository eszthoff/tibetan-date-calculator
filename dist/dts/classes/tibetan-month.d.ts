import TibetanDate from './tibetan-date';
import TibetanYear from './tibetan-year';
declare type Arg = (string | {
    year: number;
    month: number;
    isLeapMonth?: boolean;
});
/**
 * A TibetanMonth class
 * @param {...(object,string)} [arg] undefined will return tibetan month for
 * current month | string will return tibetan day for month of `new Date(arg)` |
 * object will return tibetan month according to object definition
 * @param {number} arg.year - Tibetan year number (ex. 2135)
 * @param {number} arg.month - month number (1 to 12)
 * @param {boolean} [arg.isLeapMonth=false] - is this month a leap month
 */
declare class TibetanMonth {
    year: number;
    month: number;
    isLeapMonth: boolean;
    isDoubledMonth: boolean;
    startDateStr: string;
    endDateStr: string;
    days: TibetanDate[];
    constructor(arg?: Arg);
    get yearObj(): TibetanYear;
    getDays(): TibetanDate[];
    toString(): string;
}
export default TibetanMonth;
