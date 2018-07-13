import getDayFromWestern from '../get-day-from-western';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from '../../__mocks__';

describe('getDayFromWestern()', () => {
  it('should return the correct object', () => {
    expect(getDayFromWestern(new Date(dayInDuplicateMonthMock.westernLeap)))
      .toEqual(dayInDuplicateMonthMock.dayInLeapMonth);
    expect(getDayFromWestern(new Date(dayInDuplicateMonthMock.westernMain)))
      .toEqual(dayInDuplicateMonthMock.dayInMainMonth);
    expect(getDayFromWestern(new Date(skippedDayMock.western))).not.toEqual(skippedDayMock.dayObject);
    expect(getDayFromWestern(new Date(duplicateDayMock.westernLeap))).toEqual(duplicateDayMock.leapDay);
    expect(getDayFromWestern(new Date(duplicateDayMock.westernMain))).toEqual(duplicateDayMock.mainDay);
  });
});
