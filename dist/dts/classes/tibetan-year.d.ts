import TibetanMonth from './tibetan-month';
import { YEAR_ANIMALS, YEAR_ELEMENTS, YEAR_GENDER } from '../constants';
declare type Arg = (number | {
    rabjungCycle: number;
    rabjungYear: number;
});
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
declare class TibetanYear {
    rabjungCycle: number;
    rabjungYear: number;
    tibYearNum: number;
    westernYear: number;
    animal: typeof YEAR_ANIMALS[number];
    element: typeof YEAR_ELEMENTS[number];
    gender: typeof YEAR_GENDER[number];
    months: TibetanMonth[];
    constructor(arg?: Arg, isWestern?: boolean);
    getMonths(): TibetanMonth[];
    toString(): string;
    toRabjungString(): string;
}
export default TibetanYear;
