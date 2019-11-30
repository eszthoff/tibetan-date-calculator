import getDayFromTibetan from '../get-day-from-tibetan';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from '../../__mocks__';

describe('getDayFromTibetan()', () => {
  it('should return the correct western date in leap month', () => {
    const {
      year, month, day
    } = dayInDuplicateMonthMock;
    expect(getDayFromTibetan({
      year, month, isLeapMonth: true, day, isLeapDay: false
    })).toMatchSnapshot();
  });
  it('should return the correct western date in non-leap month', () => {
    const {
      year, month, day
    } = dayInDuplicateMonthMock;
    expect(getDayFromTibetan({ year, month, day })).toMatchSnapshot();
  });
  it('should return the correct western date for day marked as leap even though it isn\'t', () => {
    const {
      year, month, day
    } = dayInDuplicateMonthMock;
    expect(getDayFromTibetan({
      year, month, day, isLeapDay: true
    })).toMatchSnapshot();
  });
  it('should return the correct western date for skipped day', () => {
    const {
      year, month, day
    } = skippedDayMock;
    expect(getDayFromTibetan({
      year, month, isLeapMonth: true, day
    })).toMatchSnapshot();
  });
  it('should return the correct western date for leap day', () => {
    const {
      year, month, day
    } = duplicateDayMock;
    expect(getDayFromTibetan({
      year, month, day, isLeapDay: true
    })).toMatchSnapshot();
  });
  it('should return the correct western date for main day that has leap day', () => {
    const {
      year, month, day
    } = duplicateDayMock;
    expect(getDayFromTibetan({ year, month, day })).toMatchSnapshot();
  });
});
