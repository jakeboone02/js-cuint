const UINT64 = require('..').UINT64;

describe('UINT64 subtract', () => {
  describe('0-0', () => {
    it('should return 0', () => {
      const u = new UINT64(0).subtract(new UINT64(0));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1-0', () => {
    it('should return 1', () => {
      const u = new UINT64(1).subtract(new UINT64(0));
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('0-1', () => {
    it('should return -1', () => {
      const u = new UINT64(0).subtract(new UINT64(1));
      expect(u.toNumber()).toBe(Math.pow(2, 32) - 1);
    });
  });

  describe('low bit-high bit', () => {
    it('should return 0', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(1).subtract(new UINT64(n));
      expect(u.toNumber()).toBe(Math.pow(2, 32) - n + 1);
    });
  });

  describe('high bit-low bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n).subtract(new UINT64(123));
      expect(u.toNumber()).toBe(n - 123);
    });
  });

  describe('high bit-high bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n + 1).subtract(new UINT64(n));
      expect(u.toNumber()).toBe(1);
    });
  });
});
