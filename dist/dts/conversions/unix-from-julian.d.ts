/**
   * get Unix date from Julian date
   * since we use only date calculations here, there is no need to correct for timezone differences
   * see explanation:
   * https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
   *
   * @param {number} julianDate - the julian date
   * @return {string}
   */
declare const unixFromJulian: (julianDate: number) => string;
export default unixFromJulian;
