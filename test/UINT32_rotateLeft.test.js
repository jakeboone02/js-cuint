const UINT32 = require('..').UINT32;

describe('UINT32 rotateLeft', () => {
  describe('0rotl1', () => {
    it('should return 0', () => {
      const u = new UINT32(0).rotateLeft(1);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1rotl2', () => {
    it('should return 4', () => {
      const u = new UINT32(1).rotateLeft(2);
      expect(u.toNumber()).toBe(4);
    });
  });

  describe('1rotl16', () => {
    it('should return 2^16', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(1).rotateLeft(16);
      expect(u.toNumber()).toBe(n);
    });
  });

  describe('1rotl32', () => {
    it('should return 1', () => {
      const u = new UINT32(1).rotateLeft(32);
      expect(u.toNumber()).toBe(1);
    });
  });
});
