import { describe, expect, it } from 'bun:test';
import { UINT32 } from '..';

describe('UINT32 rotateRight', () => {
  describe('0rotr1', () => {
    it('should return 0', () => {
      const u = new UINT32(0).rotateRight(1);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('4rotr1', () => {
    it('should return 2', () => {
      const u = new UINT32(4).rotateRight(1);
      expect(u.toNumber()).toBe(2);
    });
  });

  describe('2^16rotr16', () => {
    it('should return 1', () => {
      const n = Math.pow(2, 16);
      const u = new UINT32(n).rotateRight(16);
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('1rotr32', () => {
    it('should return 1', () => {
      const u = new UINT32(1).rotateRight(32);
      expect(u.toNumber()).toBe(1);
    });
  });
});
