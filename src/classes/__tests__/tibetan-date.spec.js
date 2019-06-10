import MockDate from 'mockdate';
import TibetanDate from '../tibetan-date';

describe('TibetanDate', () => {
  beforeAll(() => {
    MockDate.set('2019/06/07');
  });
  afterAll(() => {
    MockDate.reset();
  });

  it('should create a correct class when invoked without arg', () => {
    expect(new TibetanDate()).toMatchSnapshot();
  });
  it('should create a correct class when invoked with string arg', () => {
    expect(new TibetanDate('2019/06/22')).toMatchSnapshot();
  });
  it('should create a correct class when invoked with object arg', () => {
    expect(new TibetanDate({
      year: 2146, month: 3, day: 10, isLeapMonth: false, isLeapDay: false
    })).toMatchSnapshot();
  });
});
