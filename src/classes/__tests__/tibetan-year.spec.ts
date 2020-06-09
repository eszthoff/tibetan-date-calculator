import MockDate from 'mockdate';
import TibetanYear from '../tibetan-year';

describe('TibetanYear', () => {
  beforeAll(() => {
    MockDate.set('2019/06/07');
  });
  afterAll(() => {
    MockDate.reset();
  });

  it('should create a correct class when invoked without arg', () => {
    expect(new TibetanYear()).toMatchSnapshot();
  });
  it('should create a correct class when invoked with number arg', () => {
    expect(new TibetanYear(2145)).toMatchSnapshot();
  });
  it('should create a correct class when invoked with number arg and western set to true', () => {
    expect(new TibetanYear(2013, true)).toMatchSnapshot();
  });
  it('should create a correct class when invoked with object arg', () => {
    expect(new TibetanYear({
      rabjungCycle: 17, rabjungYear: 33
    })).toMatchSnapshot();
  });
  it('should not calculate months when initially incoved', () => {
    const year = new TibetanYear();
    expect(year.months.length).toEqual(0);
  });
  it('should not calculate months when requested', () => {
    const year = new TibetanYear();
    const months = year.getMonths();

    expect(year.months.length).not.toEqual(0);
    expect(months.length).toEqual(13);
  });
  it('should return the correct string when `toRabjungString` is called', () => {
    const year = new TibetanYear();
    expect(year.toRabjungString()).toEqual('The 33. year of the 17. rabjung cycle');
  });
  it('should return the correct string when `toString` is called', () => {
    const year = new TibetanYear();
    expect(year.toString()).toEqual('2146');
  });
});
