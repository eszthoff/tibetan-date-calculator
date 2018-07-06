const {
  yearAttributes, yearFromWestern, yearFromRabjung, yearFromTibetan
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

describe('yearFromWestern(wYear)', () => {
  it('should retrun the correct year attributes', () => {
    const year = yearFromWestern(2018);
    expect(year).toMatchObject(mockYearBasic);
  });
});

describe('yearFromRabjung(cycle, year)', () => {
  it('should give correct western year', () => {
    const year = yearFromRabjung(mockYearBasic.rabjungCycle, mockYearBasic.rabjungYear);
    expect(year).toEqual(mockYearBasic);
  });
});

describe('yearFromTibetan(tYear', () => {
  it('should return correct year attributes', () => {
    expect(yearFromTibetan(mockYearBasic.tibYear)).toMatchObject(mockYearBasic);
  });
});

describe('yearAttributes(year)', () => {
  it('should return correct year attributes', () => {
    expect(yearAttributes(mockYearBasic)).toMatchObject(mockYearAll);
  });
});
