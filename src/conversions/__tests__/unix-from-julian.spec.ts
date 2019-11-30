import unixFromJulian from '../unix-from-julian';

describe('unixFromJulian(jd)', () => {
  it('should return the correct unix date', () => {
    expect(unixFromJulian(2458321)).toEqual('2018-07-21');
    expect(unixFromJulian(2457422)).toEqual('2016-02-03');
  });
});
