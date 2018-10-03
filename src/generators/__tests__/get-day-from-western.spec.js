import getDayFromWestern from '../get-day-from-western';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from '../../__mocks__';

describe('getDayFromWestern()', () => {
  it('should return the correct object', () => {
    expect(getDayFromWestern(new Date(dayInDuplicateMonthMock.westernLeap)))
      .toMatchSnapshot();
    expect(getDayFromWestern(new Date(dayInDuplicateMonthMock.westernMain)))
      .toMatchSnapshot();
    expect(getDayFromWestern(new Date(skippedDayMock.western))).not.toEqual(skippedDayMock.dayObject);
    expect(getDayFromWestern(new Date(duplicateDayMock.westernLeap))).toMatchSnapshot();
    expect(getDayFromWestern(new Date(duplicateDayMock.westernMain))).toMatchSnapshot();
  });
});
