/**
 * Local cache for typical radices
 */
const radixPowerCache = {
  16: new UINT64(Math.pow(16, 5)),
  10: new UINT64(Math.pow(10, 5)),
  2: new UINT64(Math.pow(2, 5)),
};

const radixCache = {
  16: new UINT64(16),
  10: new UINT64(10),
  2: new UINT64(2),
};

/**
 * C-like unsigned 64 bits integers in Javascript
 * Copyright (C) 2013, Pierre Curto
 * MIT license
 */
export default class UINT64 {
  /**
   * Represents an unsigned 64 bits integer
   * @constructor
   * @param {Number|String} a00 - low bits (32) or integer as a string
   * @param {Number|Undefined} a16 - high bits (32) or radix (optional, default=10)
   * @param {Number} a32 - first high bits (8)
   * @param {Number} a48 - second high bits (8)
   */
  constructor(a00, a16, a32, a48) {
    this.remainder = null;

    if (typeof a00 === 'string') {
      return this.fromString(a00, a16);
    }

    if (typeof a16 === 'undefined') {
      return this.fromNumber(a00);
    }

    this.fromBits(a00, a16, a32, a48);
  }

  /**
   * Set the current UINT64 object with its low and high bits
   * @method fromBits
   * @param {Number} a00 - first low bits (8)
   * @param {Number} a16 - second low bits (8)
   * @param {Number} a32 - first high bits (8)
   * @param {Number} a48 - second high bits (8)
   * @return {UINT64} ThisExpression
   */
  fromBits(a00, a16, a32, a48) {
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
    this._a48 = a48 | 0;

    return this;
  }

  /**
   * Set the current UINT64 object from a number
   * @method fromNumber
   * @param {Number} value - number to set
   * @return {UINT64} ThisExpression
   */
  fromNumber(value) {
    this._a00 = value & 0xffff;
    this._a16 = value >>> 16;
    this._a32 = 0;
    this._a48 = 0;

    return this;
  }

  /**
   * Set the current UINT64 object from a string
   * @method fromString
   * @param {String} s - integer as a string
   * @param {Number} radix - optional, default=10
   * @return {UINT64} ThisExpression
   */
  fromString(s, radix = 10) {
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
   * @return {Number} the converted UINT64
   */
  toNumber() {
    return this._a16 * 65536 + this._a00;
  }

  /**
   * Convert this UINT64 to a string
   * @method toString
   * @param {Number} radix - optional, default=10
   * @return {String} the converted UINT64
   */
  toString(radix = 10) {
    const radixUint = radixCache[radix] ?? new UINT64(radix);

    if (!this.gt(radixUint)) return this.toNumber().toString(radix);

    const self = this.clone();
    const res = new Array(64);
    let i = 63;
    for (; i >= 0; i--) {
      self.div(radixUint);
      res[i] = self.remainder.toNumber().toString(radix);
      if (!self.gt(radixUint)) break;
    }
    res[i - 1] = self.toNumber().toString(radix);

    return res.join('');
  }

  /**
   * Add two UINT64. The current UINT64 stores the result
   * @method add
   * @param {UINT64} other - UINT64 to add
   * @return {UINT64} ThisExpression
   */
  add(other) {
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
   * @return {UINT64} ThisExpression
   */
  subtract(other) {
    return this.add(other.clone().negate());
  }

  /**
   * Multiply two UINT64. The current UINT64 stores the result
   * @method multiply
   * @param {UINT64} other - UINT64 to multiply
   * @return {UINT64} ThisExpression
   */
  multiply(other) {
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
   * @return {UINT64} ThisExpression
   */
  div(other) {
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
   * @return {UINT64} ThisExpression
   */
  negate() {
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
   * @return {Boolean} true if equal, false otherwise
   */
  eq(other) {
    return (
      this._a48 === other._a48 &&
      this._a00 === other._a00 &&
      this._a32 === other._a32 &&
      this._a16 === other._a16
    );
  }

  equals(other) {
    return this.eq(other);
  }

  /**
   * Greater than (strict)
   * @method gt
   * @param {UINT64} other - UINT64 to compare
   * @return {Boolean} true if greater, false otherwise
   */
  gt(other) {
    if (this._a48 > other._a48) return true;
    if (this._a48 < other._a48) return false;
    if (this._a32 > other._a32) return true;
    if (this._a32 < other._a32) return false;
    if (this._a16 > other._a16) return true;
    if (this._a16 < other._a16) return false;
    return this._a00 > other._a00;
  }

  greaterThan(other) {
    return this.gt(other);
  }

  /**
   * Less than (strict)
   * @method lt
   * @param {UINT64} other - UINT64 to compare
   * @return {Boolean} true if less, false otherwise
   */
  lt(other) {
    if (this._a48 < other._a48) return true;
    if (this._a48 > other._a48) return false;
    if (this._a32 < other._a32) return true;
    if (this._a32 > other._a32) return false;
    if (this._a16 < other._a16) return true;
    if (this._a16 > other._a16) return false;
    return this._a00 < other._a00;
  }

  lessThan(other) {
    return this.lt(other);
  }

  /**
   * Bitwise OR
   * @method or
   * @param {UINT64} other - UINT64 to OR
   * @return {UINT64} ThisExpression
   */
  or(other) {
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
   * @return {UINT64} ThisExpression
   */
  and(other) {
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
   * @return {UINT64} ThisExpression
   */
  xor(other) {
    this._a00 ^= other._a00;
    this._a16 ^= other._a16;
    this._a32 ^= other._a32;
    this._a48 ^= other._a48;

    return this;
  }

  /**
   * Bitwise NOT
   * @method not
   * @return {UINT64} ThisExpression
   */
  not() {
    this._a00 = ~this._a00 & 0xffff;
    this._a16 = ~this._a16 & 0xffff;
    this._a32 = ~this._a32 & 0xffff;
    this._a48 = ~this._a48 & 0xffff;

    return this;
  }

  /**
   * Bitwise shift right
   * @method shiftRight
   * @param {Number} n - number of bits to shift
   * @return {UINT64} ThisExpression
   */
  shiftRight(n) {
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

  shiftr(n) {
    return this.shiftRight(n);
  }

  /**
   * Bitwise shift left
   * @method shiftLeft
   * @param {Number} n - number of bits to shift
   * @param {Boolean} allowOverflow - allow overflow
   * @return {UINT64} ThisExpression
   */
  shiftLeft(n, allowOverflow) {
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

  shiftl(n, allowOverflow = false) {
    return this.shiftLeft(n, allowOverflow);
  }

  /**
   * Bitwise rotate left
   * @method rotateLeft
   * @param {Number} n - number of bits to rotate
   * @return {UINT64} ThisExpression
   */
  rotateLeft(n) {
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

  rotl(n) {
    return this.rotateLeft(n);
  }

  /**
   * Bitwise rotate right
   * @method rotateRight
   * @param {Number} n - number of bits to rotate
   * @return {UINT64} ThisExpression
   */
  rotateRight(n) {
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

  rotr(n) {
    return this.rotateRight(n);
  }

  /**
   * Clone the current UINT64
   * @method clone
   * @return {UINT64} cloned UINT64
   */
  clone() {
    return new UINT64(this._a00, this._a16, this._a32, this._a48);
  }
}
