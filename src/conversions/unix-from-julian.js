import {
  MS_IN_YEAR,
  JULIAN_TO_UNIX
} from '../constants';


  /**
   * get Unix date from Julian date
   * since we use only date calculations here, there is no need to correct for timezone differences
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @param {number} julianDate - the julian date
   * @return {Date}
   */
const unixFromJulian = (julianDate) => {
  const unixDate = (julianDate - JULIAN_TO_UNIX) * MS_IN_YEAR;

  return new Date(unixDate);
};


export default unixFromJulian;
