import {
  MS_IN_YEAR,
  MIN_IN_DAY,
  JULIAN_TO_UNIX
} from '../constants';
import { getDateStr } from '../helpers';


/**
   * get Unix date from Julian date
   * since we use only date calculations here, there is no need to correct for timezone differences
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @param {number} julianDate - the julian date
   * @return {string}
   */
const unixFromJulian = (julianDate: number): string => {
  const localTimezoneOffset = new Date().getTimezoneOffset();
  const unixDate = (julianDate - JULIAN_TO_UNIX + localTimezoneOffset / MIN_IN_DAY) * MS_IN_YEAR;
  const unix = new Date(unixDate);

  return getDateStr(unix);
};


export default unixFromJulian;
