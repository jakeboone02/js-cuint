import { describe, expect, it } from 'bun:test';
import { UINT32 } from '..';

describe('UINT32 lessThan', () => {
  describe('0<1', () => {
    it('should return true', () => {
      const u = new UINT32(0).lessThan(new UINT32(1));
      expect(u).toBe(true);
    });
  });

  describe('1<2', () => {
    it('should return true', () => {
      const u = new UINT32(1).lessThan(new UINT32(2));
      expect(u).toBe(true);
    });
  });

  describe('1<2^16', () => {
    it('should return true', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(1).lessThan(new UINT32(n));
      expect(u).toBe(true);
    });
  });

  describe('2^16<1', () => {
    it('should return false', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(n).lessThan(new UINT32(1));
      expect(!u).toBe(true);
    });
  });
});
