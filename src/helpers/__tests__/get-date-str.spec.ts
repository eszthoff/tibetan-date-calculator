import getDateStr from '../get-date-str';

describe('getDateStr()', () => {
  it('should return a date str from a date', () => {
    const str = '2019-06-12';
    const date = new Date(str);

    expect(getDateStr(date)).toEqual(str);
  });
});
