/**
 * C-like unsigned 32-bit integers in TypeScript
 * Copyright (C) 2013, Pierre Curto
 * MIT license
 */
export class UINT32 {
  public _low!: number;
  public _high!: number;
  public remainder: UINT32 | null;

  /**
   * Represents an unsigned 32-bit integer
   * @constructor
   * @param {number | string} l - low bits | integer as a string | integer as a number
   * @param {number | undefined} h - high bits | radix (optional, default=10)
   */
  constructor(l?: number | string, h?: number) {
    this._low = 0;
    this._high = 0;
    this.remainder = null;

    if (typeof h === 'undefined') {
      return this.fromNumber(l as number);
    }

    if (typeof l === 'string') {
      return this.fromString(l, h);
    }

    this.fromBits(l as number, h);
  }

  /**
   * Set the current _UINT32_ object with its low and high bits
   * @method fromBits
   * @param {number} l - low bits
   * @param {number} h - high bits
   * @return {this}
   */
  fromBits(l: number, h: number): this {
    this._low = l | 0;
    this._high = h | 0;
    return this;
  }

  /**
   * Set the current _UINT32_ object from a number
   * @method fromNumber
   * @param {number} value
   * @return {this}
   */
  fromNumber(value: number): this {
    this._low = value & 0xffff;
    this._high = value >>> 16;
    return this;
  }

  /**
   * Set the current _UINT32_ object from a string
   * @method fromString
   * @param {string} s - integer as a string
   * @param {number} radix - radix (optional, default=10)
   * @return {this}
   */
  fromString(s: string, radix: number = 10): this {
    const value = parseInt(s, radix);
    this._low = value & 0xffff;
    this._high = value >>> 16;
    return this;
  }

  /**
   * Convert this _UINT32_ to a number
   * @method toNumber
   * @return {number} the converted UINT32
   */
  toNumber(): number {
    return this._high * 65536 + this._low;
  }

  /**
   * Convert this _UINT32_ to a string
   * @method toString
   * @param {number} radix - radix (optional, default=10)
   * @return {string} the converted UINT32
   */
  toString(radix: number = 10): string {
    return this.toNumber().toString(radix);
  }

  /**
   * Add two _UINT32_. The current _UINT32_ stores the result
   * @method add
   * @param {UINT32} other
   * @return {this}
   */
  add(other: UINT32): this {
    const a00 = this._low + other._low;
    let a16 = a00 >>> 16;

    a16 += this._high + other._high;

    this._low = a00 & 0xffff;
    this._high = a16 & 0xffff;

    return this;
  }

  /**
   * Subtract two _UINT32_. The current _UINT32_ stores the result
   * @method subtract
   * @param {UINT32} other
   * @return {this}
   */
  subtract(other: UINT32): this {
    return this.add(other.clone().negate());
  }

  /**
   * Multiply two _UINT32_. The current _UINT32_ stores the result
   * @method multiply
   * @param {UINT32} other
   * @return {this}
   */
  multiply(other: UINT32): this {
    const a16 = this._high;
    const a00 = this._low;
    const b16 = other._high;
    const b00 = other._low;

    let c16, c00;
    c00 = a00 * b00;
    c16 = c00 >>> 16;

    c16 += a16 * b00;
    c16 &= 0xffff;
    c16 += a00 * b16;

    this._low = c00 & 0xffff;
    this._high = c16 & 0xffff;

    return this;
  }

  /**
   * Divide two _UINT32_. The current _UINT32_ stores the result.
   * The remainder is made available as the _remainder_ property on
   * the _UINT32_ object. It can be null, meaning there are no remainder.
   * @method div
   * @param {UINT32} other
   * @return {this}
   */
  div(other: UINT32): this {
    if (other._low === 0 && other._high === 0) throw Error('division by zero');

    if (other._high === 0 && other._low === 1) {
      this.remainder = new UINT32(0);
      return this;
    }

    if (other.gt(this)) {
      this.remainder = this.clone();
      this._low = 0;
      this._high = 0;
      return this;
    }

    if (this.eq(other)) {
      this.remainder = new UINT32(0);
      this._low = 1;
      this._high = 0;
      return this;
    }

    const _other = other.clone();
    let i = -1;
    while (!this.lt(_other)) {
      _other.shiftLeft(1, true);
      i++;
    }

    this.remainder = this.clone();
    this._low = 0;
    this._high = 0;

    for (; i >= 0; i--) {
      _other.shiftRight(1);
      if (!this.remainder.lt(_other)) {
        this.remainder.subtract(_other);
        if (i >= 16) {
          this._high |= 1 << (i - 16);
        } else {
          this._low |= 1 << i;
        }
      }
    }

    return this;
  }

  /**
   * Negate the current _UINT32_
   * @method negate
   * @return {this}
   */
  negate(): this {
    const v = (~this._low & 0xffff) + 1;
    this._low = v & 0xffff;
    this._high = (~this._high + (v >>> 16)) & 0xffff;

    return this;
  }

  /**
   * Equals
   * @method eq
   * @param {UINT32} other
   * @return {boolean}
   */
  eq(other: UINT32): boolean {
    return this._low === other._low && this._high === other._high;
  }

  equals(other: UINT32): boolean {
    return this.eq(other);
  }

  /**
   * Greater than (strict)
   * @method gt
   * @param {UINT32} other
   * @return {boolean}
   */
  gt(other: UINT32): boolean {
    if (this._high > other._high) return true;
    if (this._high < other._high) return false;
    return this._low > other._low;
  }

  greaterThan(other: UINT32): boolean {
    return this.gt(other);
  }

  /**
   * Less than (strict)
   * @method lt
   * @param {UINT32} other
   * @return {boolean}
   */
  lt(other: UINT32): boolean {
    if (this._high < other._high) return true;
    if (this._high > other._high) return false;
    return this._low < other._low;
  }

  lessThan(other: UINT32): boolean {
    return this.lt(other);
  }

  /**
   * Bitwise OR
   * @method or
   * @param {UINT32} other
   * @return {this}
   */
  or(other: UINT32): this {
    this._low |= other._low;
    this._high |= other._high;
    return this;
  }

  /**
   * Bitwise AND
   * @method and
   * @param {UINT32} other
   * @return {this}
   */
  and(other: UINT32): this {
    this._low &= other._low;
    this._high &= other._high;
    return this;
  }

  /**
   * Bitwise NOT
   * @method not
   * @return {this}
   */
  not(): this {
    this._low = ~this._low & 0xffff;
    this._high = ~this._high & 0xffff;
    return this;
  }

  /**
   * Bitwise XOR
   * @method xor
   * @param {UINT32} other
   * @return {this}
   */
  xor(other: UINT32): this {
    this._low ^= other._low;
    this._high ^= other._high;
    return this;
  }

  /**
   * Bitwise shift right
   * @method shiftRight
   * @param {number} n - number of bits to shift
   * @return {this}
   */
  shiftRight(n: number): this {
    if (n > 16) {
      this._low = this._high >> (n - 16);
      this._high = 0;
    } else if (n === 16) {
      this._low = this._high;
      this._high = 0;
    } else {
      this._low = (this._low >> n) | ((this._high << (16 - n)) & 0xffff);
      this._high >>= n;
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
   * @param {boolean} allowOverflow
   * @return {this}
   */
  shiftLeft(n: number, allowOverflow = false): this {
    if (n > 16) {
      this._high = this._low << (n - 16);
      this._low = 0;
      if (!allowOverflow) {
        this._high &= 0xffff;
      }
    } else if (n === 16) {
      this._high = this._low;
      this._low = 0;
    } else {
      this._high = (this._high << n) | (this._low >> (16 - n));
      this._low = (this._low << n) & 0xffff;
      if (!allowOverflow) {
        this._high &= 0xffff;
      }
    }
    return this;
  }

  shiftl(n: number, allowOverflow?: boolean): this {
    return this.shiftLeft(n, allowOverflow);
  }

  /**
   * Bitwise rotate left
   * @method rotateLeft
   * @param {number} n - number of bits to rotate
   * @return {this}
   */
  rotateLeft(n: number): this {
    const v = (this._high << 16) | this._low;
    const rotated = (v << n) | (v >>> (32 - n));
    this._low = rotated & 0xffff;
    this._high = rotated >>> 16;
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
    const v = (this._high << 16) | this._low;
    const rotated = (v >>> n) | (v << (32 - n));
    this._low = rotated & 0xffff;
    this._high = rotated >>> 16;
    return this;
  }

  rotr(n: number): this {
    return this.rotateRight(n);
  }

  /**
   * Clone the current _UINT32_
   * @method clone
   * @return {UINT32} cloned UINT32
   */
  clone(): UINT32 {
    return new UINT32(this._low, this._high);
  }
}
