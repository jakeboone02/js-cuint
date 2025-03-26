import { describe, expect, it } from 'bun:test';
import { UINT32 } from '..';

describe('UINT32 not', () => {
  describe('0', () => {
    it('should return 2^32-1', () => {
      const u = new UINT32(0).not();
      expect(u.toString(16)).toBe('ffffffff');
    });
  });

  describe('1', () => {
    it('should return 2^32-2', () => {
      const u = new UINT32(1).not();
      expect(u.toString(16)).toBe('fffffffe');
    });
  });

  describe('2^31', () => {
    const u = new UINT32(0x7fffffff).not();
    expect(u.toString(16)).toBe('80000000');
  });

  describe('all bits set', () => {
    it('should return 0', () => {
      const u = new UINT32(0xffffffff).not();
      expect(u.toNumber()).toBe(0);
    });
  });
});
