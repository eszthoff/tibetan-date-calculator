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
    isDoubledMonth: false,
    startDate: '2018-02-16',
    endDate: '2018-03-17'
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
    isDoubledMonth: true,
    startDate: '2013-09-06',
    endDate: '2013-10-04'
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
    isDoubledMonth: true,
    startDate: '2013-10-05',
    endDate: '2013-11-03'
  },
  monthCount: 14936
};

export {
  simpleMonthMock,
  leapMonthMock,
  mainMonthMock
};
