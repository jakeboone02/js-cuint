const UINT64 = require('..').UINT64;

describe('UINT64 lessThan', () => {
  describe('0<1', () => {
    it('should return true', () => {
      const u = new UINT64(0).lessThan(new UINT64(1));
      expect(u).toBe(true);
    });
  });

  describe('1<2', () => {
    it('should return true', () => {
      const u = new UINT64(1).lessThan(new UINT64(2));
      expect(u).toBe(true);
    });
  });

  describe('1<2^16', () => {
    it('should return true', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(1).lessThan(new UINT64(n));
      expect(u).toBe(true);
    });
  });

  describe('2^16<1', () => {
    it('should return false', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(n).lessThan(new UINT64(1));
      expect(!u).toBe(true);
    });
  });
});
