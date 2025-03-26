const UINT32 = require('..').UINT32;

describe('UINT32 toString', () => {
  describe('from 0', () => {
    it('should return "0"', () => {
      const u = new UINT32(0).toString();
      expect(u).toBe('0');
    });
  });

  describe('from low bit number', () => {
    it('should return the number', () => {
      const u = new UINT32(123).toString();
      expect(u).toBe('123');
    });
  });

  describe('from high bit number', () => {
    it('should return the number', () => {
      const n = Math.pow(2, 17);
      const u = new UINT32(n).toString();
      expect(u).toBe('' + n);
    });
  });

  describe('from high and low bit number', () => {
    it('should return the number', () => {
      const n = Math.pow(2, 17) + 123;
      const u = new UINT32(n).toString();
      expect(u).toBe('' + n);
    });
  });

  describe('< radix', () => {
    it('should return the number', () => {
      const u = new UINT32(4).toString();
      expect(u).toBe('4');
    });
  });

  describe('= radix', () => {
    it('should return the number', () => {
      const u = new UINT32(2).toString(2);
      expect(u).toBe('10');
    });
  });
});
