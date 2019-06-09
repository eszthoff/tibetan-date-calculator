const dayInDuplicateMonthMock = {
  year: 2140,
  month: 8,
  day: 4,
  julianLeap: 2456574,
  julianMain: 2456545,
  westernLeap: '2013-09-09',
  westernMain: '2013-10-08',
  dayInLeapMonth: {
    day: 4,
    isDoubledDay: false,
    isLeapDay: false,
    month: {
      isDoubledMonth: true, isLeapMonth: true, month: 8
    },
    skippedDay: false,
    westernDate: '2013-09-09',
    year: 2140,
  },
  dayInMainMonth: {
    day: 4,
    isDoubledDay: false,
    isLeapDay: false,
    month: {
      isDoubledMonth: true, isLeapMonth: false, month: 8,
    },
    skippedDay: false,
    westernDate: '2013-10-08',
    year: 2140,
  },
};

const skippedDayMock = {
  year: 2140,
  month: 2,
  day: 20,
  western: '2013-03-31',
  dayObject: {
    day: 20,
    isDoubledDay: false,
    isLeapDay: false,
    month: {
      isDoubledMonth: false, isLeapMonth: false, month: 2
    },
    skippedDay: true,
    westernDate: '2013-03-31',
    year: 2140,
  },
};

const duplicateDayMock = {
  year: 2140,
  month: 2,
  day: 8,
  westernLeap: '2013-03-19',
  westernMain: '2013-03-20',
  leapDay: {
    day: 8,
    isDoubledDay: true,
    isLeapDay: true,
    month: {
      isDoubledMonth: false, isLeapMonth: false, month: 2
    },
    skippedDay: false,
    westernDate: '2013-03-19',
    year: 2140,
  },
  mainDay: {
    day: 8,
    isDoubledDay: true,
    isLeapDay: false,
    month: {
      isDoubledMonth: false, isLeapMonth: false, month: 2
    },
    skippedDay: false,
    westernDate: '2013-03-20',
    year: 2140,
  },
};

export {
  dayInDuplicateMonthMock,
  skippedDayMock,
  duplicateDayMock
};
