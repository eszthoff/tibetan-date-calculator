import getDayFromWestern from '../get-day-from-western';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from '../../__mocks__';

describe('getDayFromWestern()', () => {
  it('should return the correct object for day in leap month', () => {
    const day = getDayFromWestern(new Date(`${dayInDuplicateMonthMock.westernLeap}T12:00`));
    expect(day)
      .toMatchSnapshot();
    expect(day.month.isDoubledMonth).toBeTruthy();
    expect(day.month.isLeapMonth).toBeTruthy();
  });
  it('should return the correct object for day in main doubled month', () => {
    const day = getDayFromWestern(new Date(`${dayInDuplicateMonthMock.westernMain}T12:00`));
    expect(day).toMatchSnapshot();
    expect(day.month.isDoubledMonth).toBeTruthy();
    expect(day.month.isLeapMonth).toBeFalsy();
  });
  it('should not return the object with skipped day', () => {
    const day = getDayFromWestern(new Date(`${skippedDayMock.western}T12:00`));
    expect(day).not.toEqual(skippedDayMock.dayObject);
    expect(day.day).toEqual(skippedDayMock.day - 1);
  });
  it('should return the correct object for leap day', () => {
    const day = getDayFromWestern(new Date(`${duplicateDayMock.westernLeap}T12:00`));
    expect(day).toMatchSnapshot();
    expect(day.isDoubledDay).toBeTruthy();
    expect(day.isLeapDay).toBeTruthy();
  });
  it('should return the correct object for main duplicate day', () => {
    const day = getDayFromWestern(new Date(`${duplicateDayMock.westernMain}T12:00`));
    expect(day).toMatchSnapshot();
    expect(day.isDoubledDay).toBeTruthy();
    expect(day.isLeapDay).toBeFalsy();
  });
});
