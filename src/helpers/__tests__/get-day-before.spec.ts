import getDayBefore from '../get-day-before';

const day = 11;
const monthCount = 14598;
const mockDayBefore = [
  { day: day - 1, monthCount },
  { day: 30, monthCount: monthCount - 1 },
];

describe('getDayBefore()', () => {
  it('should return the correct value for days in the month', () => {
    expect(getDayBefore(day, monthCount)).toEqual(mockDayBefore[0]);
  });
  it('should return the correct value for first days of the month', () => {
    expect(getDayBefore(1, monthCount)).toEqual(mockDayBefore[1]);
  });
});
