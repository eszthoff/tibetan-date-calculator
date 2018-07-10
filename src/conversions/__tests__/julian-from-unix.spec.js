import julianFromUnix from '../julian-from-unix';

describe('julianFromUnix(date)', () => {
  it('should return the correct Julian date', () => {
    const date = new Date(Date.UTC(2016, 1, 3, 16, 0, 0));
    expect(julianFromUnix(date)).toEqual(2457422);
  });
});
