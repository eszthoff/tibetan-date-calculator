import getDayFromTibetan from '../get-day-from-tibetan';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from '../../__mocks__';

describe('getDayFromTibetan()', () => {
  it('should return the correct western date in leap month', () => {
    const {
      year, month, day, dayInLeapMonth
    } = dayInDuplicateMonthMock;
    expect(getDayFromTibetan(year, month, true, day, false)).toMatchSnapshot();
  });
  it('should return the correct western date in non-leap month', () => {
    const {
      year, month, day, dayInMainMonth
    } = dayInDuplicateMonthMock;
    expect(getDayFromTibetan(year, month, false, day, false)).toMatchSnapshot();
  });
  it('should return the correct western date for day marked as leap even though it isn\'t', () => {
    const {
      year, month, day, dayInMainMonth
    } = dayInDuplicateMonthMock;
    expect(getDayFromTibetan(year, month, false, day, true)).toMatchSnapshot();
  });
  it('should return the correct western date for skipped day', () => {
    const {
      year, month, day, dayObject
    } = skippedDayMock;
    expect(getDayFromTibetan(year, month, true, day, false)).toMatchSnapshot();
  });
  it('should return the correct western date for leap day', () => {
    const {
      year, month, day, leapDay
    } = duplicateDayMock;
    expect(getDayFromTibetan(year, month, false, day, true)).toMatchSnapshot();
  });
  it('should return the correct western date for main day that has leap day', () => {
    const {
      year, month, day, mainDay
    } = duplicateDayMock;
    expect(getDayFromTibetan(year, month, false, day, false)).toMatchSnapshot();
  });
});
