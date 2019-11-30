import {
  MS_IN_YEAR,
  MIN_IN_DAY,
  JULIAN_TO_UNIX
} from '../constants';
import { getDateStr } from '../helpers';

/**
   * get Julian date from UNIX date
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @property {Date} unixTime - the date object to be converted
   * @return {number} - julian date
   */
const julianFromUnix = (unixTime: Date): number => {
  const dateOnly = getDateStr(unixTime);
  const timeAfterNoon = new Date(`${dateOnly}T18:00:00`);

  return Math.floor(
    + timeAfterNoon / MS_IN_YEAR
    - unixTime.getTimezoneOffset() / MIN_IN_DAY
    + JULIAN_TO_UNIX
  );
};

export default julianFromUnix;
