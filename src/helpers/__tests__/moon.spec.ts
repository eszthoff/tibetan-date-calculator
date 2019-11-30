import {
  moonAnomaly,
  moonTab,
  moonTabInt,
  moonEqu
} from '../moon';
import { astroMock } from '../../__mocks__';

describe('moonAnomaly()', () => {
  it('shold return the correct value', () => {
    expect(moonAnomaly(astroMock.day, astroMock.monthCount)).toEqual(astroMock.moonAnomaly);
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
    expect(moonEqu(astroMock.day, astroMock.monthCount)).toEqual(astroMock.moonEqu);
  });
});
