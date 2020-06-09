import TibetanMonth from './tibetan-month';
import TibetanYear from './tibetan-year';
declare type Arg = (string | {
    year: number;
    month: number;
    isLeapMonth?: boolean;
    day: number;
    isLeapDay?: boolean;
});
declare type SimpleMonth = {
    month: number;
    isLeapMonth: boolean;
    isDoubledMonth: boolean;
};
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
declare class TibetanDate {
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
    constructor(arg?: Arg);
    /** GETTERS */
    get day(): number;
    get yearObj(): TibetanYear;
    get westernDateStr(): string;
    /** METHODS */
    getWesternDate(): Date;
    getDate(): number;
    getDay(): number;
    getMonth(): SimpleMonth;
    getMonthObj(): TibetanMonth;
    getYear(): number;
    getYearObj(): TibetanYear;
    toString(): string;
}
export default TibetanDate;
