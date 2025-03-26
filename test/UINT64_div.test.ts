import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 div', () => {
  describe('1/0', () => {
    it('should throw', () => {
      expect(() => {
        new UINT64(1).div(new UINT64(0));
      }).toThrowError(Error);
    });
  });

  describe('0/1', () => {
    it('should return 0', () => {
      const u = new UINT64(2).div(new UINT64(1));
      expect(u.toNumber()).toBe(2);
    });
  });

  describe('2/1', () => {
    it('should return 2', () => {
      const u = new UINT64(0).div(new UINT64(1));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('1/2', () => {
    it('should return 0', () => {
      const u = new UINT64(1).div(new UINT64(2));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('low bit/high bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(3).div(new UINT64(n));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('high bit/low bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n).div(new UINT64(3));
      expect(u.toNumber()).toBe((n / 3) | 0);
      expect(u.remainder!.toNumber()).toBe(2);
    });
  });

  describe('high bit/high bit', () => {
    it('should return n', () => {
      const n = 'FFFFFFFF';
      const u = new UINT64(n, 16).div(new UINT64(n, 16));
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('high bit/high bit 2', () => {
    it('should return n', () => {
      const u = new UINT64('3266489917').div(new UINT64('668265263'));
      expect(u.toNumber()).toBe(4);
    });
  });
});
