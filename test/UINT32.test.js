const UINT32 = require('..').UINT32;

describe('UINT32 constructor', () => {
  describe('with no parameters', () => {
    it('should properly initialize', () => {
      const u = new UINT32();
      expect(u._low).toBe(0);
      expect(u._high).toBe(0);
    });
  });

  describe('with low and high bits', () => {
    describe('0, 0', () => {
      it('should properly initialize', () => {
        const u = new UINT32(0, 0);
        expect(u._low).toBe(0);
        expect(u._high).toBe(0);
      });
    });

    describe('1, 0', () => {
      it('should properly initialize', () => {
        const u = new UINT32(1, 0);
        expect(u._low).toBe(1);
        expect(u._high).toBe(0);
      });
    });

    describe('0, 1', () => {
      it('should properly initialize', () => {
        const u = new UINT32(0, 1);
        expect(u._low).toBe(0);
        expect(u._high).toBe(1);
      });
    });

    describe('3, 5', () => {
      it('should properly initialize', () => {
        const u = new UINT32(3, 5);
        expect(u._low).toBe(3);
        expect(u._high).toBe(5);
      });
    });
  });

  describe('with number', () => {
    describe('0', () => {
      it('should properly initialize', () => {
        const u = new UINT32(0);
        expect(u._low).toBe(0);
        expect(u._high).toBe(0);
      });
    });

    describe('1', () => {
      it('should properly initialize', () => {
        const u = new UINT32(1);
        expect(u._low).toBe(1);
        expect(u._high).toBe(0);
      });
    });

    describe('3', () => {
      it('should properly initialize', () => {
        const u = new UINT32(3);
        expect(u._low).toBe(3);
        expect(u._high).toBe(0);
      });
    });

    describe('with high bit', () => {
      it('should properly initialize', () => {
        const u = new UINT32(Math.pow(2, 17) + 123);
        expect(u._low).toBe(123);
        expect(u._high).toBe(2);
      });
    });
  });

  describe('with string', () => {
    describe('"0"', () => {
      it('should properly initialize', () => {
        const u = new UINT32('0');
        expect(u._low).toBe(0);
        expect(u._high).toBe(0);
      });
    });

    describe('"1"', () => {
      it('should properly initialize', () => {
        const u = new UINT32('1');
        expect(u._low).toBe(1);
        expect(u._high).toBe(0);
      });
    });

    describe('10', () => {
      it('should properly initialize', () => {
        const u = new UINT32('10');
        expect(u._low).toBe(10);
        expect(u._high).toBe(0);
      });
    });

    describe('with high bit', () => {
      it('should properly initialize', () => {
        const u = new UINT32('' + (Math.pow(2, 17) + 123));
        expect(u._low).toBe(123);
        expect(u._high).toBe(2);
      });
    });

    describe('with radix 10', () => {
      it('should properly initialize', () => {
        const u = new UINT32('123', 10);
        expect(u._low).toBe(123);
        expect(u._high).toBe(0);
      });
    });

    describe('with radix 2', () => {
      it('should properly initialize', () => {
        const u = new UINT32('1111011', 2);
        expect(u._low).toBe(123);
        expect(u._high).toBe(0);
      });
    });

    describe('with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT32('7B', 16);
        expect(u._low).toBe(123);
        expect(u._high).toBe(0);
      });
    });

    describe('8000 with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT32('8000', 16);
        expect(u._low).toBe(32768);
        expect(u._high).toBe(0);
      });
    });

    describe('80000000 with radix 16', () => {
      it('should properly initialize', () => {
        const u = new UINT32('80000000', 16);
        expect(u._low).toBe(0);
        expect(u._high).toBe(32768);
      });
    });

    describe('maximum unsigned 32 bits value in base 2', () => {
      it('should properly initialize', () => {
        const u = new UINT32(Array(33).join('1'), 2);
        expect(u._low).toBe(65535);
        expect(u._high).toBe(65535);
      });
    });

    describe('maximum unsigned 32 bits value in base 16', () => {
      it('should properly initialize', () => {
        const u = new UINT32(Array(9).join('F'), 16);
        expect(u._low).toBe(65535);
        expect(u._high).toBe(65535);
      });
    });
  });
});
