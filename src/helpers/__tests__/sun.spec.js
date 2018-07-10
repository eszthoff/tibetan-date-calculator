import {
  meanSun,
  sunAnomaly,
  sunTab,
  sunTabInt,
  sunEqu
} from '../sun';
import { astroMock } from '../../__mocks__';

describe('meanSun()', () => {
  it('should retrun the correct value', () => {
    expect(meanSun(astroMock.day, astroMock.monthCount)).toEqual(astroMock.meanSun);
  });
});


describe('sunAnomaly()', () => {
  it('shold return the correct value', () => {
    expect(sunAnomaly(astroMock.day, astroMock.monthCount)).toEqual(astroMock.sunAnomaly);
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
    expect(sunEqu(astroMock.day, astroMock.monthCount)).toEqual(astroMock.sunEqu);
  });
});
