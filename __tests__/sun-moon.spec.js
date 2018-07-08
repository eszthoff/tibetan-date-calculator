import {
  meanDate, meanSun,
  moonAnomaly, moonTabInt, moonTab, moonEqu,
  sunAnomaly, sunTabInt, sunTab, sunEqu,
  getTrueDate, getDayBefore
} from '../src/sun-moon';

const mockDay = 11;
const mockMonthCount = 14598;
const mockMeanDate = 2446600.182372702;
const mockMeanSun = 1181.1403399668327;
const mockMoonAnomaly = 1047.3795351473923;
const mockMoonEqu = 16.492063492070884;
const mockSunAnomaly = 1180.8903399668327;
const mockSunEqu = -7.263681592026842;
const mockTrueDate = 2446600.578301787;
const mockDayBefore = [
  { day: mockDay - 1, monthCount: mockMonthCount },
  { day: 30, monthCount: mockMonthCount - 1 },
];

describe('meanDate()', () => {
  it('should return the correct mean date', () => {
    expect(meanDate(mockDay, mockMonthCount)).toEqual(mockMeanDate);
  });
});

describe('meanSun()', () => {
  it('should retrun the correct value', () => {
    expect(meanSun(mockDay, mockMonthCount)).toEqual(mockMeanSun);
  });
});

describe('moonAnomaly()', () => {
  it('shold return the correct value', () => {
    expect(moonAnomaly(mockDay, mockMonthCount)).toEqual(mockMoonAnomaly);
  });
});

describe('moonTabInt()', () => {
  it('should return the correct value for all cases of i%28', () => {
    expect(moonTabInt(3)).toEqual(15);
    expect(moonTabInt(9)).toEqual(22);
    expect(moonTabInt(15)).toEqual(-5);
    expect(moonTabInt(28)).toEqual(0);
  });
});

describe('moonTab()', () => {
  it('should return the correct value', () => {
    expect(moonTab(4)).toEqual(19);
    expect(moonTab(3.4)).toEqual(16.6);
  });
});

describe('moonEqu()', () => {
  it('should return the correct value', () => {
    expect(moonEqu(mockDay, mockMonthCount)).toEqual(mockMoonEqu);
  });
});

describe('sunAnomaly()', () => {
  it('shold return the correct value', () => {
    expect(sunAnomaly(mockDay, mockMonthCount)).toEqual(mockSunAnomaly);
  });
});

describe('sunTabInt()', () => {
  it('should return the correct value for all cases of i%12', () => {
    expect(sunTabInt(3)).toEqual(11);
    expect(sunTabInt(4)).toEqual(10);
    expect(sunTabInt(8)).toEqual(-10);
    expect(sunTabInt(11)).toEqual(-6);
  });
});

describe('sunTab()', () => {
  it('should return the correct value', () => {
    expect(sunTab(4)).toEqual(10);
    expect(sunTab(3.4)).toEqual(10.6);
  });
});

describe('sunEqu()', () => {
  it('should return the correct value', () => {
    expect(sunEqu(mockDay, mockMonthCount)).toEqual(mockSunEqu);
  });
});

describe('getTrueDate()', () => {
  it('should return the correct vaule', () => {
    expect(getTrueDate(mockDay, mockMonthCount)).toEqual(mockTrueDate);
  });
});

describe('getDayBefore()', () => {
  it('should return the correct value for days in the month', () => {
    expect(getDayBefore(mockDay, mockMonthCount)).toEqual(mockDayBefore[0]);
  });
  it('should return the correct value for first days of the month', () => {
    expect(getDayBefore(1, mockMonthCount)).toEqual(mockDayBefore[1]);
  });
});
