import getTrueDate from './true-date-from-month-count-day';
/**
   * calculates the julian date from the day count a variant of true_date
   * @param {number} dayCount - the day count since beginning of epoch defined as dayNo + 30 * monthCount
   * @return {number} - julian date
   */
const julianFromTrueDate = (dayCount: number): number => {
  const monthCount = Math.floor((dayCount - 1) / 30);
  const calculatedDay = dayCount % 30 || 30;

  return Math.floor(getTrueDate(calculatedDay, monthCount));
};

export default julianFromTrueDate;
