import { dayInDuplicateMonthMock } from '../../__mocks__';
import julianFromTibetan from '../julian-from-tibetan';

describe('julianFromTibetan()', () => {
  const { year, month, day } = dayInDuplicateMonthMock;

  it('should return the correct julian date for not leap month', () => {
    expect(julianFromTibetan(year, month, false, day))
      .toEqual(dayInDuplicateMonthMock.julianLeap);
  });
  it('should return the correct julian date for leap month', () => {
    expect(julianFromTibetan(year, month, true, day))
      .toEqual(dayInDuplicateMonthMock.julianMain);
  });
});
