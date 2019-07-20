import MockDate from 'mockdate';
import TibetanMonth from '../tibetan-month';
import { trueDateFromMonthCountDay } from '../../conversions';

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
  it('should calculate days when requested (includes skipped and doubled days)', () => {
    const month = new TibetanMonth({ year: 2146, month: 5 });
    const days = month.getDays();

    expect(month.days.length).not.toEqual(0);
    expect(days).toMatchSnapshot();
  });
  it('should not include skipped days', () => {
    const month = new TibetanMonth({ year: 2146, month: 5 });
    const days = month.getDays();

    expect(days.some(day => day.isPreviousSkipped)).toBeTruthy();
    expect(days.every(day => !day.isSkippedDay)).toBeTruthy();
  });
  it('should list days in the correct order according to tibetan date', () => {
    const month = new TibetanMonth({ year: 2146, month: 5 });
    const days = month.getDays();
    const isDateAfterPrev = (day, i, arr) => {
      if (i === 0 && day.date === 1) {
        return true;
      }

      return day.date >= arr[i - 1].date;
    };

    expect(days.every(isDateAfterPrev)).toBeTruthy();
  });
  it('should list days in the correct order according to western date', () => {
    const month = new TibetanMonth({ year: 2146, month: 5 });
    const days = month.getDays();
    const isDateAfterPrev = (day, i, arr) => {
      if (i === 0 && day.date === 1) {
        return true;
      }

      return day.westernDate > arr[i - 1].westernDate;
    };

    expect(days.every(isDateAfterPrev)).toBeTruthy();
  });
  it('should return year object correctly)', () => {
    const month = new TibetanMonth();
    const { yearObj } = month;

    expect(yearObj).toMatchSnapshot();
  });
});
