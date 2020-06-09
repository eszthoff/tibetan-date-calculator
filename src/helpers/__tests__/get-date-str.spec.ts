import MockDate from 'mockdate';
import getDateStr from '../get-date-str';

describe('getDateStr()', () => {
  it('should return a date str for now', () => {
    MockDate.set('2018-07-21T12:00');
    const date = new Date();

    expect(getDateStr(date)).toEqual('2018-07-21');
    MockDate.reset();
  });
  it('should work in different time of the day', () => {
    const dateStrings = [
      '2018-07-21T00:00',
      '2018-07-21T06:30',
      '2018-07-21T12:00',
      '2018-07-21T18:30',
      '2018-07-21T23:30',
    ];
    const dates = dateStrings.map(str => new Date(str));
    dates.forEach((date, i) => {
      expect(getDateStr(date)).toEqual(dateStrings[i].slice(0, 10));
    });
  });
});
