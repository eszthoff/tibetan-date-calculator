const dayInDuplicateMonthMock = {
  year: 2140,
  month: 8,
  day: 4,
  julianLeap: 2456574,
  julianMain: 2456545,
  westernLeap: new Date('2013-09-09T12:00:00.000Z'),
  westernMain: new Date('2013-10-08T12:00:00.000Z'),
  dayInLeapMonth: {
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
    westernDate: new Date('2013-10-08T12:00:00.000Z'),
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
  western: new Date('2013-03-31T12:00:00.000Z'),
  dayObject: {
    day: 20,
    hasLeapDay: false,
    isLeapDay: false,
    julianDate: 2456383,
    month: {
      hasLeapMonth: false, isLeapMonth: false, month: 2, year: 2140
    },
    skippedDay: true,
    westernDate: new Date('2013-03-31T12:00:00.000Z'),
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
  westernLeap: new Date('2013-03-19T12:00:00.000Z'),
  westernMain: new Date('2013-03-20T12:00:00.000Z'),
  leapDay: {
    day: 8,
    hasLeapDay: true,
    isLeapDay: true,
    julianDate: 2456371,
    month: {
      hasLeapMonth: false, isLeapMonth: false, month: 2, year: 2140
    },
    skippedDay: false,
    westernDate: new Date('2013-03-19T12:00:00.000Z'),
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
    westernDate: new Date('2013-03-20T12:00:00.000Z'),
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

const astroMock = {
  day: 11,
  monthCount: 14598,
  meanDate: 2446600.182372702,
  meanSun: 1181.1403399668327,
  moonAnomaly: 1047.3795351473923,
  moonEqu: 16.492063492070884,
  sunAnomaly: 1180.8903399668327,
  sunEqu: -7.263681592026842,
  trueDate: 2446600.578301787,
};

const simpleMonthMock = {
  info: {
    year: 2145,
    month: 1,
    isLeapMonth: false
  },
  fullInfo: {
    year: 2145,
    month: 1,
    isLeapMonth: false,
    hasLeapMonth: false,
    startDate: new Date('2018-02-16T12:00:00.000Z'),
    endDate: new Date('2018-03-17T12:00:00.000Z')
  },
  monthCount: 14990
};

const leapMonthMock = {
  info: {
    year: 2140,
    month: 8,
    isLeapMonth: true
  },
  fullInfo: {
    year: 2140,
    month: 8,
    isLeapMonth: true,
    hasLeapMonth: true,
    startDate: new Date('2013-09-06T12:00:00.000Z'),
    endDate: new Date('2013-10-04T12:00:00.000Z')
  },
  monthCount: 14935
};

const mainMonthMock = {
  info: {
    year: 2140,
    month: 8,
    isLeapMonth: false
  },
  fullInfo: {
    year: 2140,
    month: 8,
    isLeapMonth: false,
    hasLeapMonth: true,
    startDate: new Date('2013-10-05T12:00:00.000Z'),
    endDate: new Date('2013-11-03T12:00:00.000Z')
  },
  monthCount: 14936
};

const yearMock = {
  rabjungCycle: 17,
  rabjungYear: 32,
  westernYear: 2018,
  tibYear: 2145,
  element: 'Earth',
  gender: 'Male',
  animal: 'Dog'
};


export {
  dayInDuplicateMonthMock,
  skippedDayMock,
  duplicateDayMock,
  astroMock,
  simpleMonthMock,
  leapMonthMock,
  mainMonthMock,
  yearMock
};
