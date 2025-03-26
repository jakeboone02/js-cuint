import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 add', () => {
  describe('0+0', () => {
    it('should return 0', () => {
      const u = new UINT64(0).add(new UINT64(0));
      expect(u.toNumber()).toBe(0);
    });
  });

  describe('0+1', () => {
    it('should return 1', () => {
      const u = new UINT64(0).add(new UINT64(1));
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('1+0', () => {
    it('should return 0', () => {
      const u = new UINT64(1).add(new UINT64(0));
      expect(u.toNumber()).toBe(1);
    });
  });

  describe('1+1', () => {
    it('should return 2', () => {
      const u = new UINT64(1).add(new UINT64(1));
      expect(u.toNumber()).toBe(2);
    });
  });

  describe('low bit+high bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(123).add(new UINT64(n));
      expect(u.toNumber()).toBe(123 + n);
    });
  });

  describe('high bit+low bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n).add(new UINT64(123));
      expect(u.toNumber()).toBe(123 + n);
    });
  });

  describe('high bit+high bit', () => {
    it('should return n', () => {
      const n = Math.pow(2, 17);
      const u = new UINT64(n).add(new UINT64(n));
      expect(u.toNumber()).toBe(n + n);
    });
  });

  describe('overflow', () => {
    it('should return n', () => {
      const n = 'FFFFFFFF';
      const u = new UINT64(n, 16).add(new UINT64(n, 16));
      expect(u.toNumber()).toBe(Math.pow(2, 32) - 2);
    });
  });

  describe('high bit+high bit 2', () => {
    it('should return n', () => {
      const u = new UINT64('326648991').add(new UINT64('265443576'));
      expect(u.toNumber()).toBe(592092567);
    });
  });

  describe('high bit+high bit 3', () => {
    it('should return n', () => {
      const u = new UINT64('800000000000', 16).add(new UINT64('100000000000', 16));
      expect(u.toString(16)).toBe('900000000000');
    });
  });
});
