import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 greaterThan', () => {
  describe('0>1', () => {
    it('should return false', () => {
      const u = new UINT64(0).greaterThan(new UINT64(1));
      expect(!u).toBe(true);
    });
  });

  describe('1>2', () => {
    it('should return false', () => {
      const u = new UINT64(1).greaterThan(new UINT64(2));
      expect(!u).toBe(true);
    });
  });

  describe('1>2^16', () => {
    it('should return false', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(1).greaterThan(new UINT64(n));
      expect(!u).toBe(true);
    });
  });

  describe('2^16>1', () => {
    it('should return true', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(n).greaterThan(new UINT64(1));
      expect(u).toBe(true);
    });
  });
});
