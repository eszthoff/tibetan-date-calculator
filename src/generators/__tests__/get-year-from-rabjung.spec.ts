import getYearFromRabjung from '../get-year-from-rabjung';
import { yearMock } from '../../__mocks__';

describe('getYearFromRabjung(cycle, year)', () => {
  it('should give correct western year', () => {
    const year = getYearFromRabjung({ rabjungCycle: yearMock.rabjungCycle, rabjungYear: yearMock.rabjungYear });
    expect(year).toEqual(yearMock);
  });
  it('should throw error on impossible dates', () => {
    expect(() => getYearFromRabjung({ rabjungCycle: 0, rabjungYear: 5 })).toThrowError();
    expect(() => getYearFromRabjung({ rabjungCycle: 5, rabjungYear: 63 })).toThrowError();
  });
});
