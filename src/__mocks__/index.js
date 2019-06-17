import {
  simpleMonthMock, leapMonthMock, mainMonthMock
} from './month-mock';
import { dayInDuplicateMonthMock, skippedDayMock, duplicateDayMock } from './day-mock';
import { yearMock } from './year-mock';

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
