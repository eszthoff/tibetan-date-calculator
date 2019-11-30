import getLosarForYear from '../get-losar-for-year';

const losar2018 = '2018-02-16';

describe('getLosarForYear()', () => {
  it('should return the correct date if Tibetan year is given', () => {
    expect(getLosarForYear(2145)).toEqual(losar2018);
    expect(getLosarForYear(2145, true)).toEqual(losar2018);
  });
  it('should return the correct date if Tibetan year is given', () => {
    expect(getLosarForYear(2018, false)).toEqual(losar2018);
  });
});
