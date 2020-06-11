import MockDate from 'mockdate';
import TibetanDate from '../tibetan-date';

describe('TibetanDate', () => {
  const mockToday = '2019-06-07';
  let tDate;

  beforeEach(() => {
    MockDate.set(`${mockToday} 12:00`);
    tDate = new TibetanDate();
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should create a correct class when invoked without arg', () => {
    expect(new TibetanDate()).toMatchSnapshot();
  });
  it('should create a correct class when invoked with string arg', () => {
    expect(new TibetanDate('2019/06/22 12:00')).toMatchSnapshot();
  });
  it('should create a correct class when invoked with object arg', () => {
    expect(new TibetanDate({
      year: 2146, month: 3, day: 10, isLeapMonth: false, isLeapDay: false
    })).toMatchSnapshot();
  });
  it('should get day correctly', () => {
    expect(tDate.day).toEqual(5);
  });
  it('should return year object correctly', () => {
    expect(tDate.yearObj).toMatchSnapshot();
  });
  it('should get western date string correctly', () => {
    expect(tDate.westernDateStr).toEqual(mockToday);
  });
  describe('JS Date like getters', () => {
    it('should return getWesternDate correctly', () => {
      expect(tDate.getWesternDate()).toEqual(tDate.westernDate);
    });
    it('should return getDate correctly', () => {
      expect(tDate.getDate()).toEqual(tDate.date);
    });
    it('should return getDay correctly', () => {
      expect(tDate.getDay()).toEqual(tDate.day);
    });
    it('should return getMonth correctly', () => {
      expect(tDate.getMonth()).toEqual(tDate.month);
    });
    it('should return getMonthObj correctly', () => {
      expect(tDate.getMonthObj()).toEqual(tDate.monthObj);
    });
    it('should return getYear correctly', () => {
      expect(tDate.getYear()).toEqual(tDate.year);
    });
    it('should return getYearObj correctly', () => {
      expect(tDate.getYearObj()).toEqual(tDate.yearObj);
    });
  });
  it('should return the correct string when `toString` is called in not double day', () => {
    expect(new TibetanDate().toString()).toEqual('2146-4-4');
  });
  it('should return the correct string when `toString` is called in leap of double month', () => {
    expect(new TibetanDate('2020/04/24').toString()).toEqual('2147-3-2-leap');
  });
  it('should return the correct string when `toString` is called in main of double month', () => {
    expect(new TibetanDate('2020/04/25').toString()).toEqual('2147-3-2-main');
  });
});
