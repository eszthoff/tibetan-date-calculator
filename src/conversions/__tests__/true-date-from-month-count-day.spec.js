import getTrueDate from '../true-date-from-month-count-day';
import { astroMock } from '../../__mocks__';

describe('getTrueDate()', () => {
  it('should return the correct vaule', () => {
    expect(getTrueDate(astroMock.day, astroMock.monthCount)).toEqual(astroMock.trueDate);
  });
});
