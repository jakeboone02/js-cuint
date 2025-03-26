import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 shiftLeft', () => {
  describe('0<<1', () => {
    it('should return 0', () => {
      const u = new UINT64(0).shiftLeft(1);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1<<2', () => {
    it('should return 4', () => {
      const u = new UINT64(1).shiftLeft(2);
      expect(u.toNumber()).toBe(4);
    });
  });

  describe('1<<16', () => {
    it('should return 2^16', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(1).shiftLeft(16);
      expect(u.toNumber()).toBe(n);
    });
  });

  describe('1<<32', () => {
    it('should return 0', () => {
      const u = new UINT64(1).shiftLeft(32);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1<<31', () => {
    it('should return 2^31', () => {
      const u = new UINT64(1).shiftLeft(31);
      expect(u.toString(16)).toBe('80000000');
    });
  });

  describe('9<<28', () => {
    it('should return 2^31', () => {
      const u = new UINT64(9).shiftLeft(28);
      expect(u.toString(16)).toBe('90000000');
    });
  });
});
