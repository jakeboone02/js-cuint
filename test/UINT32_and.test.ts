import { describe, expect, it } from 'bun:test';
import { UINT32 } from '..';

describe('UINT32 and', () => {
  describe('0&1', () => {
    it('should return 0', () => {
      const u = new UINT32(0).and(new UINT32(1));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1&2', () => {
    it('should return 0', () => {
      const u = new UINT32(1).and(new UINT32(2));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1&2^16', () => {
    it('should return 0', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(1).and(new UINT32(n));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('2^16&1', () => {
    it('should return 0', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(n).and(new UINT32(1));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('2^16&2^16', () => {
    it('should return n', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(n).and(new UINT32(n));
      expect(u.toNumber()).toBe(n);
    });
  });
});
