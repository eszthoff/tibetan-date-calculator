/**
   * calculates the julian date from the day count a variant of true_date
   * @param {number} dayCount - the day count since beginning of epoch defined as dayNo + 30 * monthCount
   * @return {number} - julian date
   */
declare const julianFromTrueDate: (dayCount: number) => number;
export default julianFromTrueDate;
