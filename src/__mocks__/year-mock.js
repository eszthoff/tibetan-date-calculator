import json2013 from './2013';
import json2018 from './2018';

const yearMock = {
  rabjungCycle: 17,
  rabjungYear: 32,
  westernYear: 2018,
  tibYear: 2145,
  element: 'Earth',
  gender: 'Male',
  animal: 'Dog'
};

const year2013 = JSON.parse(json2013);

const year2018 = JSON.parse(json2018);

export {
  yearMock,
  year2018,
  year2013
};
