import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 equals', () => {
  describe('0==0', () => {
    it('should return true', () => {
      const u = new UINT64(0).equals(new UINT64(0));
      expect(u).toBe(true);
    });
  });

  describe('1==1', () => {
    it('should return true', () => {
      const u = new UINT64(1).equals(new UINT64(1));
      expect(u).toBe(true);
    });
  });

  describe('low bit', () => {
    it('should return true', () => {
      const u = new UINT64(3).equals(new UINT64(3));
      expect(u).toBe(true);
    });
  });

  describe('high bit', () => {
    it('should return true', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n).equals(new UINT64(n));
      expect(u).toBe(true);
    });
  });

  describe('1!=2', () => {
    it('should return false', () => {
      const u = new UINT64(1).equals(new UINT64(2));
      expect(!u).toBe(true);
    });
  });
});
