import UtilService from './util';

describe('UtilService', () => {
  describe('calculateByte', () => {
    it('caculate bytes under 1KB', () => {
      expect(UtilService.calculateByte(500)).toBe('0.49 KB');
    });
    it('caculate bytes to KB', () => {
      expect(UtilService.calculateByte(50000)).toBe('48.83 KB');
    });
    it('caculate bytes to MB', () => {
      expect(UtilService.calculateByte(50000000)).toBe('47.68 MB');
    });
    it('caculate bytes to GB', () => {
      expect(UtilService.calculateByte(50000000000)).toBe('46.57 GB');
    });
  });

  describe('getDate', () => {
    it('gets date from string', () => {
      expect(UtilService.getDate('2022-03-07 13:41:39')).toBe('Mon, Mar 07');
    });
  });

  describe('getDateAndTime', () => {
    it('gets date and PM time from string', () => {
      expect(UtilService.getDateAndTime('2022-03-07 13:41:39')).toBe('Mon, Mar 07, 1:41pm');
    });
  });

  describe('getDateAndTime', () => {
    it('gets date and AM time from string', () => {
      expect(UtilService.getDateAndTime('2022-03-07 09:41:39')).toBe('Mon, Mar 07, 9:41am');
    });
  });

  describe('getDateAndYear', () => {
    it('gets date and year from string', () => {
      expect(UtilService.getDateAndYear('2022-03-07 13:41:39')).toBe('Mar, 07 2022');
    });
  });
});
