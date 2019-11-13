import getYearFromWestern from '../get-year-from-western';
import { yearMock } from '../../__mocks__';


describe('getYearFromWestern(wYear)', () => {
  it('should retrun the correct year attributes', () => {
    const year = getYearFromWestern(yearMock.westernYear);
    expect(year).toMatchObject(yearMock);
  });
});
