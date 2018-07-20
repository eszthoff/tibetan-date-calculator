import julianFromUnix from '../julian-from-unix';

describe('julianFromUnix(date)', () => {
  it('should return the correct Julian date', () => {
    const date = new Date('2016-02-04');
    console.log(date.valueOf());
    //1454457600000
    //1454544000000
    //86400000
    expect(julianFromUnix(date)).toEqual(2457422);
  });
});
