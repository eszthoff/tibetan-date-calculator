import MockDate from 'mockdate';
import TibetanMonth from '../tibetan-month';

describe('TibetanMonth', () => {
  beforeAll(() => {
    MockDate.set('2019/06/07');
  });
  afterAll(() => {
    MockDate.reset();
  });

  it('should create a correct class when invoked without arg', () => {
    expect(new TibetanMonth()).toMatchSnapshot();
  });
  it('should create a correct class when invoked with string arg', () => {
    expect(new TibetanMonth('2019/06/22')).toMatchSnapshot();
  });
  it('should create a correct class when invoked with object arg', () => {
    expect(new TibetanMonth({
      year: 2146, month: 3, isLeapMonth: false
    })).toMatchSnapshot();
  });
  it('should not calculate days when initially incoved', () => {
    const month = new TibetanMonth();
    expect(month.days.length).toEqual(0);
  });
  it('should not calculate days when requested (includes skipped and doubled days)', () => {
    const month = new TibetanMonth({ year: 2146, month: 1 });
    const days = month.getDays();

    expect(month.days.length).not.toEqual(0);
    expect(days.length).toMatchSnapshot();
  });
  it('should return year object correctly)', () => {
    const month = new TibetanMonth();
    const { yearObj } = month;

    expect(yearObj).toMatchSnapshot();
  });
});
