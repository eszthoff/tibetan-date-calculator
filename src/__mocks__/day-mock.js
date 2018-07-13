const dayInDuplicateMonthMock = {
  year: 2140,
  month: 8,
  day: 4,
  julianLeap: 2456574,
  julianMain: 2456545,
  westernLeap: '2013-09-09T12:00:00.000Z',
  westernMain: '2013-10-08T12:00:00.000Z',
  dayInLeapMonth: {
    day: 4,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456545,
    month: {
      hasLeapMonth: true, isLeapMonth: true, month: 8, year: 2140
    },
    skippedDay: false,
    westernDate: '2013-09-09T12:00:00.000Z',
    year: {
      rabjungCycle: 17,
      rabjungYear: 27,
      tibYear: 2140,
      westernYear: 2013,
      animal: 'Snake',
      element: 'Water',
      gender: 'Female',
    }
  },
  dayInMainMonth: {
    day: 4,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456574,
    month: {
      hasLeapMonth: true, isLeapMonth: false, month: 8, year: 2140
    },
    skippedDay: false,
    westernDate: '2013-10-08T12:00:00.000Z',
    year: {
      rabjungCycle: 17,
      rabjungYear: 27,
      tibYear: 2140,
      westernYear: 2013,
      animal: 'Snake',
      element: 'Water',
      gender: 'Female',
    }
  },
};

const skippedDayMock = {
  year: 2140,
  month: 2,
  day: 20,
  western: '2013-03-31T12:00:00.000Z',
  dayObject: {
    day: 20,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456383,
    month: {
      hasLeapMonth: false, isLeapMonth: false, month: 2, year: 2140
    },
    skippedDay: true,
    westernDate: '2013-03-31T12:00:00.000Z',
    year: {
      rabjungCycle: 17,
      rabjungYear: 27,
      tibYear: 2140,
      westernYear: 2013,
      animal: 'Snake',
      element: 'Water',
      gender: 'Female',
    }
  },
};

const duplicateDayMock = {
  year: 2140,
  month: 2,
  day: 8,
  westernLeap: '2013-03-19T12:00:00.000Z',
  westernMain: '2013-03-20T12:00:00.000Z',
  leapDay: {
    day: 8,
    hasLeapDay: true,
    isLeapDay: true,
    julianDate: 2456371,
    month: {
      hasLeapMonth: false, isLeapMonth: false, month: 2, year: 2140
    },
    skippedDay: false,
    westernDate: '2013-03-19T12:00:00.000Z',
    year: {
      rabjungCycle: 17,
      rabjungYear: 27,
      tibYear: 2140,
      westernYear: 2013,
      animal: 'Snake',
      element: 'Water',
      gender: 'Female',
    }
  },
  mainDay: {
    day: 8,
    hasLeapDay: true,
    isLeapDay: false,
    julianDate: 2456372,
    month: {
      hasLeapMonth: false, isLeapMonth: false, month: 2, year: 2140
    },
    skippedDay: false,
    westernDate: '2013-03-20T12:00:00.000Z',
    year: {
      rabjungCycle: 17,
      rabjungYear: 27,
      tibYear: 2140,
      westernYear: 2013,
      animal: 'Snake',
      element: 'Water',
      gender: 'Female',
    }
  },
};

export {
  dayInDuplicateMonthMock,
  skippedDayMock,
  duplicateDayMock
};
