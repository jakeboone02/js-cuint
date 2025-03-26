const UINT64 = require('..').UINT64;

describe('UINT64 xor', () => {
  describe('0^1', () => {
    it('should return 1', () => {
      const u = new UINT64(0).xor(new UINT64(1));
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('1^2', () => {
    it('should return 3', () => {
      const u = new UINT64(1).xor(new UINT64(2));
      expect(u.toNumber()).toBe(3);
    });
  });

  describe('1^2^16', () => {
    it('should return n+1', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(1).xor(new UINT64(n));
      expect(u.toNumber()).toBe(n + 1);
    });
  });

  describe('2^16^1', () => {
    it('should return n+1', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(n).xor(new UINT64(1));
      expect(u.toNumber()).toBe(n + 1);
    });
  });

  describe('2^16^2^16', () => {
    it('should return 0', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(n).xor(new UINT64(n));
      expect(u.toNumber()).toBe(0);
    });
  });
});
