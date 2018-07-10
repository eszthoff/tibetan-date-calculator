import getYearFromRabjung from '../get-year-from-rabjung';
import { yearMock } from '../../__mocks__';

describe('getYearFromRabjung(cycle, year)', () => {
  it('should give correct western year', () => {
    const year = getYearFromRabjung(yearMock.rabjungCycle, yearMock.rabjungYear);
    expect(year).toEqual(yearMock);
  });
  it('should throw error on impossible dates', () => {
    expect(() => getYearFromRabjung(0, 5)).toThrowError();
    expect(() => getYearFromRabjung(5, 63)).toThrowError();
  });
});
