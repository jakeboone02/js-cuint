import { describe, expect, it } from 'bun:test';
import { UINT32 } from '..';

describe('UINT32 multiply', () => {
  describe('0*0', () => {
    it('should return 0', () => {
      const u = new UINT32(0).multiply(new UINT32(0));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1*0', () => {
    it('should return 0', () => {
      const u = new UINT32(1).multiply(new UINT32(0));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('0*1', () => {
    it('should return 0', () => {
      const u = new UINT32(0).multiply(new UINT32(1));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('low bit*high bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT32(3).multiply(new UINT32(n));
      expect(u.toNumber()).toBe(3 * n);
    });
  });

  describe('high bit*low bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT32(n).multiply(new UINT32(3));
      expect(u.toNumber()).toBe(3 * n);
    });
  });

  describe('high bit*high bit', () => {
    it('should return n', () => {
      const n = 'FFFFFFFF';
      const u = new UINT32(n, 16).multiply(new UINT32(n, 16));
      expect(u.toNumber()).toBe(1);
    });
  });
});
