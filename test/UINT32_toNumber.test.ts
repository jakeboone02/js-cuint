import { describe, expect, it } from 'bun:test';
import { UINT32 } from '..';

describe('UINT32 toNumber', () => {
  describe('from 0', () => {
    it('should return 0', () => {
      const u = new UINT32(0).toNumber();
      expect(u).toBe(0);
    });
  });

  describe('from low bit number', () => {
    it('should return the number', () => {
      const u = new UINT32(123).toNumber();
      expect(u).toBe(123);
    });
  });

  describe('from high bit number', () => {
    it('should return the number', () => {
      const n = Math.pow(2, 17);
      const u = new UINT32(n).toNumber();
      expect(u).toBe(n);
    });
  });

  describe('from high and low bit number', () => {
    it('should return the number', () => {
      const n = Math.pow(2, 17) + 123;
      const u = new UINT32(n).toNumber();
      expect(u).toBe(n);
    });
  });

  describe('toNumber and toString', () => {
    it('should return the same result for 100 random numbers', () => {
      for (let i = 0; i < 100; i++) {
        const u = new UINT32(Math.floor(Math.random() * 0xffffffff));
        expect(u.toNumber()).toBe(parseInt(u.toString()));
      }
    });
  });
});
