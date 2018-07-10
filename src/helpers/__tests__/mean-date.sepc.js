import meanDate from '../mean-date';
import { astroMock } from '../../__mocks__';

describe('meanDate()', () => {
  it('should return the correct mean date', () => {
    expect(meanDate(astroMock.day, astroMock.monthCount)).toEqual(astroMock.meanDate);
  });
});
