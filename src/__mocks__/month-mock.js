import json214502 from './214502';
import json214008leap from './214008leap';
import json214008main from './214008main';

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
    hasLeapMonth: true,
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
    hasLeapMonth: true,
    startDate: '2013-10-05',
    endDate: '2013-11-03'
  },
  monthCount: 14936
};

const month214502 = JSON.parse(json214502);
const month214008leap = JSON.parse(json214008leap);
const month214008main = JSON.parse(json214008main);

export {
  simpleMonthMock,
  leapMonthMock,
  mainMonthMock,
  month214502,
  month214008leap,
  month214008main
};
