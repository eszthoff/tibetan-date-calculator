import julianFromTrueDate from '../julian-from-true-date';

const mockTrueDate = [2446600.578301787, 30];
const mockJulian = [4423819, 2015531];

describe('julianFromTrueDate()', () => {
  it('shoutd return the correct Julian date', () => {
    expect(julianFromTrueDate(mockTrueDate[0])).toEqual(mockJulian[0]);
    expect(julianFromTrueDate(mockTrueDate[1])).toEqual(mockJulian[1]);
  });
});
