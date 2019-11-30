/**
   * get Julian date from UNIX date
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @property {Date} unixTime - the date object to be converted
   * @return {number} - julian date
   */
declare const julianFromUnix: (unixTime: Date) => number;
export default julianFromUnix;
