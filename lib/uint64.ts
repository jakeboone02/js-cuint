/**
 * C-like unsigned 64-bit integers in TypeScript
 * Copyright (C) 2013, Pierre Curto
 * MIT license
 */
export default class UINT64 {
  private _a00: number;
  private _a16: number;
  private _a32: number;
  private _a48: number;
  public remainder: UINT64 | null;

  /**
   * Represents an unsigned 64-bit integer
   * @constructor
   * @param {number | string} a00 - low bits (32) or integer as a string
   * @param {number | undefined} a16 - high bits (32) or radix (optional, default=10)
   * @param {number} a32 - first high bits (8)
   * @param {number} a48 - second high bits (8)
   */
  constructor(a00: number | string, a16?: number, a32?: number, a48?: number) {
    this.remainder = null;

    if (typeof a00 === 'string') {
      return this.fromString(a00, a16);
    }

    if (typeof a16 === 'undefined') {
      return this.fromNumber(a00 as number);
    }

    this.fromBits(a00 as number, a16, a32, a48);
  }

  /**
   * Set the current UINT64 object with its low and high bits
   * @method fromBits
   * @param {number} a00 - first low bits (8)
   * @param {number} a16 - second low bits (8)
   * @param {number} a32 - first high bits (8)
   * @param {number} a48 - second high bits (8)
   * @return {this}
   */
  fromBits(a00: number, a16: number, a32?: number, a48?: number): this {
    if (typeof a32 === 'undefined') {
      this._a00 = a00 & 0xffff;
      this._a16 = a00 >>> 16;
      this._a32 = a16 & 0xffff;
      this._a48 = a16 >>> 16;
      return this;
    }

    this._a00 = a00 | 0;
    this._a16 = a16 | 0;
    this._a32 = a32 | 0;
    // @ts-expect-error a48 may be undefined
    this._a48 = a48 | 0;

    return this;
  }

  /**
   * Set the current UINT64 object from a number
   * @method fromNumber
   * @param {number} value - number to set
   * @return {this}
   */
  fromNumber(value: number): this {
    this._a00 = value & 0xffff;
    this._a16 = value >>> 16;
    this._a32 = 0;
    this._a48 = 0;

    return this;
  }

  /**
   * Set the current UINT64 object from a string
   * @method fromString
   * @param {string} s - integer as a string
   * @param {number} radix - optional, default=10
   * @return {this}
   */
  fromString(s: string, radix: number = 10): this {
    this._a00 = 0;
    this._a16 = 0;
    this._a32 = 0;
    this._a48 = 0;

    const radixUint = radixPowerCache[radix] ?? new UINT64(Math.pow(radix, 5));

    for (let i = 0, len = s.length; i < len; i += 5) {
      const size = Math.min(5, len - i);
      const value = parseInt(s.slice(i, i + size), radix);
      this.multiply(size < 5 ? new UINT64(Math.pow(radix, size)) : radixUint).add(
        new UINT64(value)
      );
    }

    return this;
  }

  /**
   * Convert this UINT64 to a number (last 32 bits are dropped)
   * @method toNumber
   * @return {number} the converted UINT64
   */
  toNumber(): number {
    return this._a16 * 65536 + this._a00;
  }

  /**
   * Convert this UINT64 to a string
   * @method toString
   * @param {number} radix - optional, default=10
   * @return {string} the converted UINT64
   */
  toString(radix: number = 10): string {
    const radixUint = radixCache[radix] ?? new UINT64(radix);

    if (!this.gt(radixUint)) return this.toNumber().toString(radix);

    const self = this.clone();
    const res: string[] = new Array(64);
    let i = 63;
    for (; i >= 0; i--) {
      self.div(radixUint);
      res[i] = self.remainder!.toNumber().toString(radix);
      if (!self.gt(radixUint)) break;
    }
    res[i - 1] = self.toNumber().toString(radix);

    return res.join('');
  }

  /**
   * Add two UINT64. The current UINT64 stores the result
   * @method add
   * @param {UINT64} other - UINT64 to add
   * @return {this}
   */
  add(other: UINT64): this {
    const a00 = this._a00 + other._a00;

    let a16 = a00 >>> 16;
    a16 += this._a16 + other._a16;

    let a32 = a16 >>> 16;
    a32 += this._a32 + other._a32;

    let a48 = a32 >>> 16;
    a48 += this._a48 + other._a48;

    this._a00 = a00 & 0xffff;
    this._a16 = a16 & 0xffff;
    this._a32 = a32 & 0xffff;
    this._a48 = a48 & 0xffff;

    return this;
  }

  /**
   * Subtract two UINT64. The current UINT64 stores the result
   * @method subtract
   * @param {UINT64} other - UINT64 to subtract
   * @return {this}
   */
  subtract(other: UINT64): this {
    return this.add(other.clone().negate());
  }

  /**
   * Multiply two UINT64. The current UINT64 stores the result
   * @method multiply
   * @param {UINT64} other - UINT64 to multiply
   * @return {this}
   */
  multiply(other: UINT64): this {
    const a00 = this._a00;
    const a16 = this._a16;
    const a32 = this._a32;
    const a48 = this._a48;
    const b00 = other._a00;
    const b16 = other._a16;
    const b32 = other._a32;
    const b48 = other._a48;

    let c00 = a00 * b00;

    let c16 = c00 >>> 16;
    c16 += a00 * b16;
    let c32 = c16 >>> 16;
    c16 &= 0xffff;
    c16 += a16 * b00;

    c32 += c16 >>> 16;
    c32 += a00 * b32;
    let c48 = c32 >>> 16;
    c32 &= 0xffff;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xffff;
    c32 += a32 * b00;

    c48 += c32 >>> 16;
    c48 += a00 * b48;
    c48 &= 0xffff;
    c48 += a16 * b32;
    c48 &= 0xffff;
    c48 += a32 * b16;
    c48 &= 0xffff;
    c48 += a48 * b00;

    this._a00 = c00 & 0xffff;
    this._a16 = c16 & 0xffff;
    this._a32 = c32 & 0xffff;
    this._a48 = c48 & 0xffff;

    return this;
  }

  /**
   * Divide two UINT64. The current UINT64 stores the result.
   * The remainder is made available as the remainder property on
   * the UINT64 object. It can be null, meaning there is no remainder.
   * @method div
   * @param {UINT64} other - UINT64 to divide
   * @return {this}
   */
  div(other: UINT64): this {
    if (other._a16 === 0 && other._a32 === 0 && other._a48 === 0) {
      if (other._a00 === 0) throw Error('division by zero');

      if (other._a00 === 1) {
        this.remainder = new UINT64(0);
        return this;
      }
    }

    if (other.gt(this)) {
      this.remainder = this.clone();
      this._a00 = 0;
      this._a16 = 0;
      this._a32 = 0;
      this._a48 = 0;
      return this;
    }

    if (this.eq(other)) {
      this.remainder = new UINT64(0);
      this._a00 = 1;
      this._a16 = 0;
      this._a32 = 0;
      this._a48 = 0;
      return this;
    }

    const _other = other.clone();
    let i = -1;
    while (!this.lt(_other)) {
      _other.shiftLeft(1, true);
      i++;
    }

    this.remainder = this.clone();
    this._a00 = 0;
    this._a16 = 0;
    this._a32 = 0;
    this._a48 = 0;
    for (; i >= 0; i--) {
      _other.shiftRight(1);
      if (!this.remainder.lt(_other)) {
        this.remainder.subtract(_other);
        if (i >= 48) {
          this._a48 |= 1 << (i - 48);
        } else if (i >= 32) {
          this._a32 |= 1 << (i - 32);
        } else if (i >= 16) {
          this._a16 |= 1 << (i - 16);
        } else {
          this._a00 |= 1 << i;
        }
      }
    }

    return this;
  }

  /**
   * Negate the current UINT64
   * @method negate
   * @return {this}
   */
  negate(): this {
    let v = (~this._a00 & 0xffff) + 1;
    this._a00 = v & 0xffff;
    v = (~this._a16 & 0xffff) + (v >>> 16);
    this._a16 = v & 0xffff;
    v = (~this._a32 & 0xffff) + (v >>> 16);
    this._a32 = v & 0xffff;
    this._a48 = (~this._a48 + (v >>> 16)) & 0xffff;

    return this;
  }

  /**
   * Check equality of two UINT64
   * @method eq
   * @param {UINT64} other - UINT64 to compare
   * @return {boolean} true if equal, false otherwise
   */
  eq(other: UINT64): boolean {
    return (
      this._a48 === other._a48 &&
      this._a00 === other._a00 &&
      this._a32 === other._a32 &&
      this._a16 === other._a16
    );
  }

  equals(other: UINT64): boolean {
    return this.eq(other);
  }

  /**
   * Greater than (strict)
   * @method gt
   * @param {UINT64} other - UINT64 to compare
   * @return {boolean} true if greater, false otherwise
   */
  gt(other: UINT64): boolean {
    if (this._a48 > other._a48) return true;
    if (this._a48 < other._a48) return false;
    if (this._a32 > other._a32) return true;
    if (this._a32 < other._a32) return false;
    if (this._a16 > other._a16) return true;
    if (this._a16 < other._a16) return false;
    return this._a00 > other._a00;
  }

  greaterThan(other: UINT64): boolean {
    return this.gt(other);
  }

  /**
   * Less than (strict)
   * @method lt
   * @param {UINT64} other - UINT64 to compare
   * @return {boolean} true if less, false otherwise
   */
  lt(other: UINT64): boolean {
    if (this._a48 < other._a48) return true;
    if (this._a48 > other._a48) return false;
    if (this._a32 < other._a32) return true;
    if (this._a32 > other._a32) return false;
    if (this._a16 < other._a16) return true;
    if (this._a16 > other._a16) return false;
    return this._a00 < other._a00;
  }

  lessThan(other: UINT64): boolean {
    return this.lt(other);
  }

  /**
   * Bitwise OR
   * @method or
   * @param {UINT64} other - UINT64 to OR
   * @return {this}
   */
  or(other: UINT64): this {
    this._a00 |= other._a00;
    this._a16 |= other._a16;
    this._a32 |= other._a32;
    this._a48 |= other._a48;

    return this;
  }

  /**
   * Bitwise AND
   * @method and
   * @param {UINT64} other - UINT64 to AND
   * @return {this}
   */
  and(other: UINT64): this {
    this._a00 &= other._a00;
    this._a16 &= other._a16;
    this._a32 &= other._a32;
    this._a48 &= other._a48;

    return this;
  }

  /**
   * Bitwise XOR
   * @method xor
   * @param {UINT64} other - UINT64 to XOR
   * @return {this}
   */
  xor(other: UINT64): this {
    this._a00 ^= other._a00;
    this._a16 ^= other._a16;
    this._a32 ^= other._a32;
    this._a48 ^= other._a48;

    return this;
  }

  /**
   * Bitwise NOT
   * @method not
   * @return {this}
   */
  not(): this {
    this._a00 = ~this._a00 & 0xffff;
    this._a16 = ~this._a16 & 0xffff;
    this._a32 = ~this._a32 & 0xffff;
    this._a48 = ~this._a48 & 0xffff;

    return this;
  }

  /**
   * Bitwise shift right
   * @method shiftRight
   * @param {number} n - number of bits to shift
   * @return {this}
   */
  shiftRight(n: number): this {
    n %= 64;
    if (n >= 48) {
      this._a00 = this._a48 >> (n - 48);
      this._a16 = 0;
      this._a32 = 0;
      this._a48 = 0;
    } else if (n >= 32) {
      n -= 32;
      this._a00 = ((this._a32 >> n) | (this._a48 << (16 - n))) & 0xffff;
      this._a16 = (this._a48 >> n) & 0xffff;
      this._a32 = 0;
      this._a48 = 0;
    } else if (n >= 16) {
      n -= 16;
      this._a00 = ((this._a16 >> n) | (this._a32 << (16 - n))) & 0xffff;
      this._a16 = ((this._a32 >> n) | (this._a48 << (16 - n))) & 0xffff;
      this._a32 = (this._a48 >> n) & 0xffff;
      this._a48 = 0;
    } else {
      this._a00 = ((this._a00 >> n) | (this._a16 << (16 - n))) & 0xffff;
      this._a16 = ((this._a16 >> n) | (this._a32 << (16 - n))) & 0xffff;
      this._a32 = ((this._a32 >> n) | (this._a48 << (16 - n))) & 0xffff;
      this._a48 = (this._a48 >> n) & 0xffff;
    }

    return this;
  }

  shiftr(n: number): this {
    return this.shiftRight(n);
  }

  /**
   * Bitwise shift left
   * @method shiftLeft
   * @param {number} n - number of bits to shift
   * @param {boolean} allowOverflow - allow overflow
   * @return {this}
   */
  shiftLeft(n: number, allowOverflow: boolean): this {
    n %= 64;
    if (n >= 48) {
      this._a48 = this._a00 << (n - 48);
      this._a32 = 0;
      this._a16 = 0;
      this._a00 = 0;
    } else if (n >= 32) {
      n -= 32;
      this._a48 = (this._a16 << n) | (this._a00 >> (16 - n));
      this._a32 = (this._a00 << n) & 0xffff;
      this._a16 = 0;
      this._a00 = 0;
    } else if (n >= 16) {
      n -= 16;
      this._a48 = (this._a32 << n) | (this._a16 >> (16 - n));
      this._a32 = ((this._a16 << n) | (this._a00 >> (16 - n))) & 0xffff;
      this._a16 = (this._a00 << n) & 0xffff;
      this._a00 = 0;
    } else {
      this._a48 = (this._a48 << n) | (this._a32 >> (16 - n));
      this._a32 = ((this._a32 << n) | (this._a16 >> (16 - n))) & 0xffff;
      this._a16 = ((this._a16 << n) | (this._a00 >> (16 - n))) & 0xffff;
      this._a00 = (this._a00 << n) & 0xffff;
    }
    if (!allowOverflow) {
      this._a48 &= 0xffff;
    }

    return this;
  }

  shiftl(n: number, allowOverflow = false): this {
    return this.shiftLeft(n, allowOverflow);
  }

  /**
   * Bitwise rotate left
   * @method rotateLeft
   * @param {number} n - number of bits to rotate
   * @return {this}
   */
  rotateLeft(n: number): this {
    n %= 64;
    if (n === 0) return this;
    if (n >= 32) {
      let v = this._a00;
      this._a00 = this._a32;
      this._a32 = v;
      v = this._a48;
      this._a48 = this._a16;
      this._a16 = v;
      if (n === 32) return this;
      n -= 32;
    }

    const high = (this._a48 << 16) | this._a32;
    const low = (this._a16 << 16) | this._a00;

    const _high = (high << n) | (low >>> (32 - n));
    const _low = (low << n) | (high >>> (32 - n));

    this._a00 = _low & 0xffff;
    this._a16 = _low >>> 16;
    this._a32 = _high & 0xffff;
    this._a48 = _high >>> 16;

    return this;
  }

  rotl(n: number): this {
    return this.rotateLeft(n);
  }

  /**
   * Bitwise rotate right
   * @method rotateRight
   * @param {number} n - number of bits to rotate
   * @return {this}
   */
  rotateRight(n: number): this {
    n %= 64;
    if (n === 0) return this;
    if (n >= 32) {
      let v = this._a00;
      this._a00 = this._a32;
      this._a32 = v;
      v = this._a48;
      this._a48 = this._a16;
      this._a16 = v;
      if (n === 32) return this;
      n -= 32;
    }

    const high = (this._a48 << 16) | this._a32;
    const low = (this._a16 << 16) | this._a00;

    const _high = (high >>> n) | (low << (32 - n));
    const _low = (low >>> n) | (high << (32 - n));

    this._a00 = _low & 0xffff;
    this._a16 = _low >>> 16;
    this._a32 = _high & 0xffff;
    this._a48 = _high >>> 16;

    return this;
  }

  rotr(n: number): this {
    return this.rotateRight(n);
  }

  /**
   * Clone the current UINT64
   * @method clone
   * @return {UINT64} cloned UINT64
   */
  clone(): UINT64 {
    return new UINT64(this._a00, this._a16, this._a32, this._a48);
  }
}

/**
 * Local cache for typical radices
 */
const radixPowerCache: Record<number, UINT64> = {
  16: new UINT64(Math.pow(16, 5)),
  10: new UINT64(Math.pow(10, 5)),
  2: new UINT64(Math.pow(2, 5)),
};

const radixCache: Record<number, UINT64> = {
  16: new UINT64(16),
  10: new UINT64(10),
  2: new UINT64(2),
};
