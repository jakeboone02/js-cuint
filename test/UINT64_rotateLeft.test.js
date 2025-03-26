const UINT64 = require('..').UINT64;

describe('UINT64 rotateLeft', () => {
  describe('0rotl1', () => {
    it('should return 0', () => {
      const u = new UINT64(0).rotateLeft(1);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1rotl2', () => {
    it('should return 4', () => {
      const u = new UINT64(1).rotateLeft(2);
      expect(u.toNumber()).toBe(4);
    });
  });

  describe('1rotl16', () => {
    it('should return 2^16', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(1).rotateLeft(16);
      expect(u.toNumber()).toBe(n);
    });
  });

  describe('1rotl32', () => {
    it('should return 1', () => {
      const u = new UINT64(1).rotateLeft(32);
      expect(u.toString(16)).toBe('100000000');
    });
  });
});
