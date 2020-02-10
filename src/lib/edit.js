/* eslint-disable no-restricted-syntax */
class Edit {
  constructor (state = '') {
    this.edit = state;
  }

  insertChar (c) {
    this.edit += c;
  }

  deleteChar () {
    this.edit = this.edit.slice(0, -1);
  }

  hasExponent () {
    return this.edit.includes('E');
  }

  isNegative () {
    return this.edit.slice(0, 1) === '-';
  }

  changeSign () {
    if (!this.hasExponent()) {
      if (this.isNegative()) {
        this.edit = `+${this.edit.slice(1)}`;
      } else if (this.edit.slice(0, 1) === '+') {
        this.edit = `-${this.edit.slice(1)}`;
      } else {
        this.edit = `-${this.edit}`;
      }
    } else {
      const format = (mantissa, sign, exponent) => `${mantissa}${sign}${exponent}`;

      const expPosition = this.edit.indexOf('E');
      if (this.edit[expPosition + 1] === '-') {
        this.edit = format(
          this.edit.slice(0, expPosition + 1),
          '+',
          this.edit.slice(expPosition + 2)
        );
      } else if (this.edit[expPosition + 1] === '+') {
        this.edit = format(
          this.edit.slice(0, expPosition + 1),
          '-',
          this.edit.slice(expPosition + 2)
        );
      } else {
        this.edit = format(
          this.edit.slice(0, expPosition + 1),
          '-', this.edit.slice(expPosition + 1)
        );
      }
    }
  }

  hasDecimal () {
    return this.edit.indexOf('.') !== -1;
  }

  enterDecimal () {
    if (!this.hasDecimal() && !this.hasExponent()) {
      if (this.edit.length > 0) {
        this.edit += '.';
      } else {
        this.edit += '0.';
      }
    }
  }

  enterExponent () {
    if (!this.hasExponent()) {
      if (this.edit.length > 0) {
        this.edit += 'E';
      } else {
        this.edit += '1E';
      }
    }
  }

  state () {
    return this.edit;
  }
}

module.exports = Edit;
