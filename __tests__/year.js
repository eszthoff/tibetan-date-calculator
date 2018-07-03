const {
  yearAttributes, westernYear, westernYearFromRabjung, tibetanYear
} = require('../phugpa');

const mockYearBasic = {
  rabjungCycle: 17,
  rabjungYear: 32,
  westernYear: 2018,
  tibYear: 2145
};
const mockYearAttributes = {
  element: 'Earth',
  gender: 'Male',
  animal: 'Dog'
};
const mockYearAll = { ...mockYearBasic, ...mockYearAttributes };

describe('westernYear(wYear)', () => {
  it('should retrun the correct year attributes', () => {
    const year = westernYear(2018);
    expect(year).toMatchObject(mockYearBasic);
  });
});

describe('westernYearFromRabjung(cycle, year)', () => {
  it('should give correct western year', () => {
    const wYear = westernYearFromRabjung(mockYearBasic.rabjungCycle, mockYearBasic.rabjungYear);
    expect(wYear).toEqual(mockYearBasic.westernYear);
  });
});

describe('tibetanYear(tYear', () => {
  it('should return correct year attributes', () => {
    expect(tibetanYear(mockYearBasic.tibYear)).toMatchObject(mockYearBasic);
  });
});

describe('yearAttributes(year)', () => {
  it('should return correct year attributes', () => {
    expect(yearAttributes(mockYearBasic)).toMatchObject(mockYearAll);
  });
});
