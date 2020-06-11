import unixFromJulian from '../unix-from-julian';

describe('unixFromJulian(jd)', () => {
  it('should return the correct unix date', () => {
    expect(unixFromJulian(2458321).toISOString()).toEqual('2018-07-21T10:00:00.000Z');
    expect(unixFromJulian(2457422).toISOString()).toEqual('2016-02-03T10:00:00.000Z');
  });
});
