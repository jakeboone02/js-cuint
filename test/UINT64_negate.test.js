const UINT64 = require('..').UINT64;

describe('UINT64 negate', () => {
  describe('0', () => {
    it('should return 0', () => {
      const u = new UINT64(0).negate();
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1', () => {
    it('should return -1', () => {
      const u = new UINT64(1).negate();
      expect(u.toNumber()).toBe(Math.pow(2, 32) - 1);
    });
  });

  describe('low bit', () => {
    it('should return -n', () => {
      const u = new UINT64(3).negate();
      expect(u.toNumber()).toBe(Math.pow(2, 32) - 3);
    });
  });

  describe('high bit', () => {
    it('should return -n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n).negate();
      expect(u.toNumber()).toBe(Math.pow(2, 32) - n);
    });
  });
});
