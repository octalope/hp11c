/* eslint-disable no-restricted-syntax */
const Edit = require('./edit');

class Stack {
  constructor (state = []) {
    if (typeof state[0] === 'string' || state[0] instanceof String) {
      this.edit = new Edit(state[0]);
      this.stack = state.slice(1) || [];
    } else {
      this.stack = state;
    }
  }

  isEditing () {
    return this.edit instanceof Edit;
  }

  insertChar (c) {
    this.startEdit();
    this.edit.insertChar(c);
  }

  deleteChar () {
    if (this.isEditing()) {
      this.edit.deleteChar();
    }
  }

  changeSign () {
    if (this.isEditing()) {
      this.edit.changeSign();
    } else {
      this.stack[0] *= -1;
    }
  }

  enterDecimal () {
    this.startEdit();
    this.edit.enterDecimal();
  }

  enterExponent () {
    this.startEdit();
    this.edit.enterExponent();
  }

  push () {
    if (this.isEditing()) {
      this.stack.unshift(Number(this.edit.state()));
      delete this.edit;
      return;
    }

    this.validateMinimumArgs(1);
    this.stack.unshift(this.stack[0]);
  }

  drop () {
    if (this.isEditing()) {
      delete this.edit;
      return;
    }

    this.validateMinimumArgs(1);
    this.stack.shift();
  }

  state () {
    if (this.isEditing()) {
      return {
        stack: [
          this.edit.state(),
          ...this.stack
        ]
      };
    }

    return {
      stack: this.stack
    };
  }

  // ===============
  //  Operations
  // ===============

  validateMinimumArgs (n) {
    if (this.stack.length < n) {
      const err = new Error('TooFewArguments');
      err.details = {
        expected: `${n} Arguments`
      };
      throw err;
    }
  }

  startEdit () {
    if (!this.isEditing()) {
      this.edit = new Edit();
    }
  }

  endEdit () {
    if (this.isEditing()) {
      this.stack.unshift(Number(this.edit.state()));
      delete this.edit;
    }
  }

  multiply () {
    this.endEdit();
    this.validateMinimumArgs(2);
    const x = this.stack.shift();
    const y = this.stack.shift();
    this.stack.unshift(x * y);
  }

  divide () {
    this.endEdit();
    this.validateMinimumArgs(2);
    if (this.stack[0] === 0) {
      throw new Error('InfiniteResult');
    }
    const x = this.stack.shift();
    const y = this.stack.shift();
    this.stack.unshift(y / x);
  }

  add () {
    this.endEdit();
    this.validateMinimumArgs(2);
    const x = this.stack.shift();
    const y = this.stack.shift();
    this.stack.unshift(x + y);
  }

  subtract () {
    this.endEdit();
    this.validateMinimumArgs(2);
    const x = this.stack.shift();
    const y = this.stack.shift();
    this.stack.unshift(y - x);
  }
}

module.exports = Stack;
