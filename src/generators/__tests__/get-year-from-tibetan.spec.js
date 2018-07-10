import getYearFromTibetan from '../get-year-from-tibetan';
import { yearMock } from '../../__mocks__';

describe('getYearFromTibetan(tYear', () => {
  it('should return correct year attributes', () => {
    expect(getYearFromTibetan(yearMock.tibYear)).toMatchObject(yearMock);
  });
});
