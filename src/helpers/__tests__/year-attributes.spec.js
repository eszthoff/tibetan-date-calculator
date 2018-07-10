import yearAttributes from '../year-attributes';
import { yearMock } from '../../__mocks__';

describe('yearAttributes(year)', () => {
  const basicInfo = {
    rabjungCycle: yearMock.rabjungCycle,
    rabjungYear: yearMock.rabjungYear,
    westernYear: yearMock.westernYear,
    tibYear: yearMock.tibYear,
  };
  it('should return correct year attributes', () => {
    expect(yearAttributes(basicInfo)).toMatchObject(yearMock);
    expect(yearAttributes({
      rabjungCycle: 17, rabjungYear: 27, tibYear: 2140, westernYear: 2013
    })).toMatchObject({
      rabjungCycle: 17,
      rabjungYear: 27,
      tibYear: 2140,
      westernYear: 2013,
      animal: 'Snake',
      element: 'Water',
      gender: 'Female',
    });
  });
});
