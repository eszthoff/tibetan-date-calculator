import julianFromUnix from '../julian-from-unix';

describe('julianFromUnix(date)', () => {
  it('should return the correct Julian date', () => {
    const date = new Date('2018-07-21T18:00');
    expect(julianFromUnix(date)).toEqual(2458321);
  });
});
