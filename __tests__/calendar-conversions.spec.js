import {
  tibToJulian, tibToWestern, trueDateToJulian, westernToTib
} from '../src/calendar-conversions';

const mockyear = 2140;
const mockMonth = 8;
const mockDay = 4;
const mockTrueDate = 2446600.578301787;
const mockJulianDate = [2456574, 2456545, 4423819];
const mockDate = [
  {
    day: 4,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456545,
    month: {
      hasLeapMonth: true, isLeapMonth: true, month: 8, year: 2140
    },
    skippedDay: false,
    westernDate: new Date('2013-09-09T12:00:00.000Z'),
    year: {
      rabjungCycle: 17, rabjungYear: 27, tibYear: 2140, westernYear: 2013
    }
  },
  {
    day: 4,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456574,
    month: {
      hasLeapMonth: true, isLeapMonth: false, month: 8, year: 2140
    },
    skippedDay: false,
    westernDate: new Date('2013-10-08T12:00:00.000Z'),
    year: {
      rabjungCycle: 17, rabjungYear: 27, tibYear: 2140, westernYear: 2013
    }
  },
  {
    day: 9,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456549,
    month: {
      hasLeapMonth: true, isLeapMonth: true, month: 8, year: 2140
    },
    skippedDay: true,
    westernDate: new Date('2013-09-13T12:00:00.000Z'),
    year: {
      rabjungCycle: 17, rabjungYear: 27, tibYear: 2140, westernYear: 2013
    }
  },
  {
    day: 20,
    hasLeapDay: true,
    isLeapDay: true,
    julianDate: 2456589,
    month: {
      hasLeapMonth: true, isLeapMonth: false, month: 8, year: 2140
    },
    skippedDay: false,
    westernDate: new Date('2013-10-23T12:00:00.000Z'),
    year: {
      rabjungCycle: 17, rabjungYear: 27, tibYear: 2140, westernYear: 2013
    }
  },
  {
    day: 20,
    hasLeapDay: true,
    isLeapDay: false,
    julianDate: 2456590,
    month: {
      hasLeapMonth: true, isLeapMonth: false, month: 8, year: 2140
    },
    skippedDay: false,
    westernDate: new Date('2013-10-24T12:00:00.000Z'),
    year: {
      rabjungCycle: 17, rabjungYear: 27, tibYear: 2140, westernYear: 2013
    }
  }
];
const mockSimpleDate = [
  {
    day: 4,
    isLeapDay: false,
    isLeapMonth: true,
    month: 8,
    year: 2140
  },
  {
    day: 4,
    isLeapDay: false,
    isLeapMonth: false,
    month: 8,
    year: 2140
  },
  {
    day: 8,
    isLeapDay: false,
    isLeapMonth: true,
    month: 8,
    year: 2140
  },
  {
    day: 20,
    isLeapDay: true,
    isLeapMonth: false,
    month: 8,
    year: 2140
  },
  {
    day: 20,
    isLeapDay: false,
    isLeapMonth: false,
    month: 8,
    year: 2140
  },
];

describe('tibToJulian()', () => {
  it('should return the correct julian date for not leap month', () => {
    expect(tibToJulian(mockyear, mockMonth, false, mockDay)).toEqual(mockJulianDate[0]);
  });
  it('should return the correct julian date for leap month', () => {
    expect(tibToJulian(mockyear, mockMonth, true, mockDay)).toEqual(mockJulianDate[1]);
  });
});

describe('tibToWestern()', () => {
  it('should return the correct western date in leap month', () => {
    expect(tibToWestern(mockyear, mockMonth, true, mockDay, false)).toEqual(mockDate[0]);
  });
  it('should return the correct western date in non-leap month', () => {
    expect(tibToWestern(mockyear, mockMonth, false, mockDay, false)).toEqual(mockDate[1]);
  });
  it('should return the correct western date for day marked as leap even though it isn\'t', () => {
    expect(tibToWestern(mockyear, mockMonth, false, mockDay, true)).toEqual(mockDate[1]);
  });
  it('should return the correct western date for skipped day', () => {
    expect(tibToWestern(mockyear, mockMonth, true, 9, false)).toEqual(mockDate[2]);
  });
  it('should return the correct western date for leap day', () => {
    expect(tibToWestern(mockyear, mockMonth, false, 20, true)).toEqual(mockDate[3]);
  });
  it('should return the correct western date for main day that has leap day', () => {
    expect(tibToWestern(mockyear, mockMonth, false, 20, false)).toEqual(mockDate[4]);
  });
});

describe('trueDateToJulian()', () => {
  it('shoutd return the correct Julian date', () => {
    expect(trueDateToJulian(mockTrueDate)).toEqual(mockJulianDate[2]);
  });
});

describe('westernToTib()', () => {
  it('should return the correct object', () => {
    expect(westernToTib(mockDate[0].westernDate)).toEqual(mockSimpleDate[0]);
    expect(westernToTib(mockDate[1].westernDate)).toEqual(mockSimpleDate[1]);
    expect(westernToTib(mockDate[2].westernDate)).toEqual(mockSimpleDate[2]);
    expect(westernToTib(mockDate[3].westernDate)).toEqual(mockSimpleDate[3]);
    expect(westernToTib(mockDate[4].westernDate)).toEqual(mockSimpleDate[4]);
  });
});
