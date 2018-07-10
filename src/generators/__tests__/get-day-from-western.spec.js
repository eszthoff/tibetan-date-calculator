import getDayFromWestern from '../get-day-from-western';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from '../../__mocks__';

describe('getDayFromWestern()', () => {
  it('should return the correct object', () => {
    expect(getDayFromWestern(dayInDuplicateMonthMock.westernLeap))
      .toEqual(dayInDuplicateMonthMock.dayInLeapMonth);
    expect(getDayFromWestern(dayInDuplicateMonthMock.westernMain))
      .toEqual(dayInDuplicateMonthMock.dayInMainMonth);
    expect(getDayFromWestern(skippedDayMock.western)).not.toEqual(skippedDayMock.dayObject);
    expect(getDayFromWestern(duplicateDayMock.westernLeap)).toEqual(duplicateDayMock.leapDay);
    expect(getDayFromWestern(duplicateDayMock.westernMain)).toEqual(duplicateDayMock.mainDay);
  });
});
