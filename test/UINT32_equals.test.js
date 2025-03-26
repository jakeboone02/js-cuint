const UINT32 = require('..').UINT32;

describe('UINT32 equals', () => {
  describe('0==0', () => {
    it('should return true', () => {
      const u = new UINT32(0).equals(new UINT32(0));
      expect(u).toBe(true);
    });
  });

  describe('1==1', () => {
    it('should return true', () => {
      const u = new UINT32(1).equals(new UINT32(1));
      expect(u).toBe(true);
    });
  });

  describe('low bit', () => {
    it('should return true', () => {
      const u = new UINT32(3).equals(new UINT32(3));
      expect(u).toBe(true);
    });
  });

  describe('high bit', () => {
    it('should return true', () => {
      const n = Math.pow(2, 17);
      const u = new UINT32(n).equals(new UINT32(n));
      expect(u).toBe(true);
    });
  });

  describe('1!=2', () => {
    it('should return false', () => {
      const u = new UINT32(1).equals(new UINT32(2));
      expect(!u).toBe(true);
    });
  });
});
