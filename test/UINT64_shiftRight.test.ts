import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 shiftRight', () => {
  describe('0>>1', () => {
    it('should return 0', () => {
      const u = new UINT64(0).shiftRight(1);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('4>>2', () => {
    it('should return 1', () => {
      const u = new UINT64(4).shiftRight(2);
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('2^16>>16', () => {
    it('should return 1', () => {
      const n = Math.pow(2, 16);
      const u = new UINT64(n).shiftRight(16);
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('1>>32', () => {
    it('should return 0', () => {
      const u = new UINT64(1).shiftRight(32);
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('2^31>>31', () => {
    it('should return 1', () => {
      const u = new UINT64('80000000', 16).shiftRight(31);
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('2^28>>28', () => {
    it('should return 1', () => {
      const u = new UINT64('10000000', 16).shiftRight(28);
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('2^31+2^28>>31', () => {
    it('should return 1', () => {
      const u = new UINT64('90000000', 16).shiftRight(31);
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('2^31+2^28>>28', () => {
    it('should return 9', () => {
      const u = new UINT64('90000000', 16).shiftRight(28);
      expect(u.toNumber()).toBe(9);
    });
  });
});
