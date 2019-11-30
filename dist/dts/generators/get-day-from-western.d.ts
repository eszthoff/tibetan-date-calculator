import { Day } from '../types';
/**
   * Calculates a Tibetan date for a given western date. This does a binary search, and is therefore
   * much slower than tibToWestern().
   *
   * The algorithm could be much improved by using the reverse of meanDate() to start with,
   * and then using the fact that julian dates and "tibetan day numbers" have a quasi-linear relation.
   *
   * @param {Date} date - the western date
   * @return {Day}
   */
declare const getDayFromWestern: (date: Date) => Day;
export default getDayFromWestern;
