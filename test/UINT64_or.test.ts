import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 or', () => {
  describe('0|1', () => {
    it('should return 1', () => {
      const u = new UINT64(0).or(new UINT64(1));
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('1|2', () => {
    it('should return 3', () => {
      const u = new UINT64(1).or(new UINT64(2));
      expect(u.toNumber()).toBe(3);
    });
  });

  describe('1|2^16', () => {
    it('should return n+1', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(1).or(new UINT64(n));
      expect(u.toNumber()).toBe(n + 1);
    });
  });

  describe('2^16|1', () => {
    it('should return n+1', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(n).or(new UINT64(1));
      expect(u.toNumber()).toBe(n + 1);
    });
  });
});
