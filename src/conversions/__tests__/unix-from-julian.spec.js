import unixFromJulian from '../unix-from-julian';

describe('unixFromJulian(jd)', () => {
  it('should return the correct unix date', () => {
    const jd = 2457422;
    const date = new Date(Date.UTC(2016, 1, 3, 12, 0, 0));
    expect(unixFromJulian(jd)).toEqual(date);
  });
});
