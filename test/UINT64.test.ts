import { describe, expect, it } from 'bun:test';
import { UINT64 } from '..';

describe('UINT64 constructor', () => {
  describe('with no parameters', () => {
    it('should properly initialize', () => {
      const u = new UINT64();
      expect(u._a00).toBe(0);
      expect(u._a16).toBe(0);
      expect(u._a32).toBe(0);
      expect(u._a48).toBe(0);
    });
  });

  describe('with low and high bits', () => {
    describe('0, 0', () => {
      it('should properly initialize', () => {
        const u = new UINT64(0, 0);
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('1, 0', () => {
      it('should properly initialize', () => {
        const u = new UINT64(1, 0);
        expect(u._a00).toBe(1);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('0, 1', () => {
      it('should properly initialize', () => {
        const u = new UINT64(0, 1);
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(1);
        expect(u._a48).toBe(0);
      });
    });

    describe('3, 5', () => {
      it('should properly initialize', () => {
        const u = new UINT64(3, 5);
        expect(u._a00).toBe(3);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(5);
        expect(u._a48).toBe(0);
      });
    });
  });

  describe('with number', () => {
    describe('0', () => {
      it('should properly initialize', () => {
        const u = new UINT64(0);
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('1', () => {
      it('should properly initialize', () => {
        const u = new UINT64(1);
        expect(u._a00).toBe(1);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('3', () => {
      it('should properly initialize', () => {
        const u = new UINT64(3);
        expect(u._a00).toBe(3);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('with high bit', () => {
      it('should properly initialize', () => {
        const u = new UINT64(Math.pow(2, 17) + 123);
        expect(u._a00).toBe(123);
        expect(u._a16).toBe(2);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });
  });

  describe('with string', () => {
    describe('"0"', () => {
      it('should properly initialize', () => {
        const u = new UINT64('0');
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('"1"', () => {
      it('should properly initialize', () => {
        const u = new UINT64('1');
        expect(u._a00).toBe(1);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('10', () => {
      it('should properly initialize', () => {
        const u = new UINT64('10');
        expect(u._a00).toBe(10);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('with high bit', () => {
      it('should properly initialize', () => {
        const u = new UINT64('' + (Math.pow(2, 17) + 123));
        expect(u._a00).toBe(123);
        expect(u._a16).toBe(2);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('with radix 10', () => {
      it('should properly initialize', () => {
        const u = new UINT64('123', 10);
        expect(u._a00).toBe(123);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('with radix 2', () => {
      it('should properly initialize', () => {
        const u = new UINT64('1111011', 2);
        expect(u._a00).toBe(123);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT64('7B', 16);
        expect(u._a00).toBe(123);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('8000 with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT64('8000', 16);
        expect(u._a00).toBe(32768);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('80000000 with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT64('80000000', 16);
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(32768);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(0);
      });
    });

    describe('800000000000 with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT64('800000000000', 16);
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(32768);
        expect(u._a48).toBe(0);
      });
    });

    describe('8000000000000000 with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT64('8000000000000000', 16);
        expect(u._a00).toBe(0);
        expect(u._a16).toBe(0);
        expect(u._a32).toBe(0);
        expect(u._a48).toBe(32768);
      });
    });

    describe('maximum unsigned 64 bits value in base 2', () => {
      it('should properly initialize', () => {
        const u = new UINT64(Array(65).join('1'), 2);
        expect(u._a00).toBe(65535);
        expect(u._a16).toBe(65535);
        expect(u._a32).toBe(65535);
        expect(u._a48).toBe(65535);
      });
    });

    describe('maximum unsigned 64 bits value in base 16', () => {
      it('should properly initialize', () => {
        const u = new UINT64(Array(17).join('F'), 16);
        expect(u._a00).toBe(65535);
        expect(u._a16).toBe(65535);
        expect(u._a32).toBe(65535);
        expect(u._a48).toBe(65535);
      });
    });
  });
});
