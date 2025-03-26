import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 not', () => {
  describe('0', () => {
    it('should return 2^64-1', () => {
      const u = new UINT64(0).not();
      expect(u.toString(16)).toBe('ffffffffffffffff');
    });
  });

  describe('1', () => {
    it('should return 2^64-2', () => {
      const u = new UINT64(1).not();
      expect(u.toString(16)).toBe('fffffffffffffffe');
    });
  });

  describe('2^63', () => {
    const u = new UINT64(0xffff, 0xffff, 0xffff, 0x7fff).not();
    expect(u.toString(16)).toBe('8000000000000000');
  });

  describe('all bits set', () => {
    it('should return 0', () => {
      const u = new UINT64(0xffff, 0xffff, 0xffff, 0xffff).not();
      expect(u.toString()).toBe('0');
    });
  });
});
