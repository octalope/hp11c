const { expect } = require('chai');

const RPNEngine = require('../lib/rpn-engine');

describe('Stack', () => {
  let rpn;

  const insertNumberString = (n) => {
    [...n].forEach((c) => {
      rpn.insertChar(c);
    });
  };

  beforeEach(() => {
    rpn = new RPNEngine();
  });

  describe('constructor', () => {
    describe('when state is empty', () => {
      it('returns the expected state', () => {
        const newRpn = new RPNEngine([]);
        expect(newRpn.state()).to.deep.equal({
          stack: []
        });
      });
    });

    describe('when state is not editing', () => {
      it('returns the expected state', () => {
        const newRpn = new RPNEngine([
          123,
          456
        ]);
        expect(newRpn.state()).to.deep.equal({
          stack: [123, 456]
        });
      });
    });

    describe('when state is editing', () => {
      it('returns the expected state', () => {
        const newRpn = new RPNEngine([
          '1.2E-3',
          456
        ]);
        expect(newRpn.state()).to.deep.equal({
          stack: ['1.2E-3', 456]
        });
      });
    });
  });

  describe('insertChar', () => {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((digit) => {
      it(`inserts the digit ${digit} into the stack as a string`, () => {
        rpn.insertChar(digit);
        expect(rpn.state()).to.deep.equal({
          stack: [`${digit}`]
        });
      });
    });
  });

  describe('deleteChar', () => {
    it('removes a single character from the end of the number', () => {
      insertNumberString('3.14');
      expect(rpn.state()).to.deep.equal({
        stack: ['3.14']
      });
      rpn.deleteChar();
      expect(rpn.state()).to.deep.equal({
        stack: ['3.1']
      });
    });

    it('does nothing if no input exists', () => {
      insertNumberString('1');
      expect(rpn.state()).to.deep.equal({
        stack: ['1']
      });
      rpn.deleteChar();
      expect(rpn.state()).to.deep.equal({
        stack: ['']
      });
      rpn.deleteChar();
      expect(rpn.state()).to.deep.equal({
        stack: ['']
      });
    });

    it('does nothing if not editing', () => {
      expect(rpn.state()).to.deep.equal({
        stack: []
      });
      rpn.deleteChar();
      expect(rpn.state()).to.deep.equal({
        stack: []
      });
    });
  });

  describe('push', () => {
    describe('when editing', () => {
      describe('when entering a single item', () => {
        it('adds input to the stack as a number', () => {
          insertNumberString('3.14');
          expect(rpn.state()).to.deep.equal({
            stack: ['3.14']
          });
          rpn.push();
          expect(rpn.state()).to.deep.equal({
            stack: [3.14]
          });
        });
      });

      describe('when entering multiple items', () => {
        it('adds each input to the stack a number', () => {
          insertNumberString('3.14');
          rpn.push();
          insertNumberString('6.28');
          rpn.push();
          insertNumberString('123');
          expect(rpn.state()).to.deep.equal({
            stack: ['123', 6.28, 3.14]
          });
        });
      });
    });

    describe('when not editing', () => {
      it('duplicates the first item if one exists', () => {
        insertNumberString('12345');
        rpn.push();
        expect(rpn.state()).to.deep.equal({
          stack: [12345]
        });

        rpn.push();
        expect(rpn.state()).to.deep.equal({
          stack: [12345, 12345]
        });
      });

      it('throws if the stack is empty', () => {
        expect(() => {
          rpn.push();
        }).to.throw('TooFewArguments');
      });
    });
  });

  describe('drop', () => {
    describe('when editing', () => {
      it('stops editing', () => {
        insertNumberString('123');
        expect(rpn.state()).to.deep.equal({
          stack: ['123']
        });

        rpn.drop();
        expect(rpn.state()).to.deep.equal({
          stack: []
        });
      });
    });

    describe('when not editing and the stack is not empty', () => {
      it('stops removes the first stack item', () => {
        insertNumberString('123');
        rpn.push();
        insertNumberString('456');
        rpn.push();
        expect(rpn.state()).to.deep.equal({
          stack: [456, 123]
        });

        rpn.drop();
        expect(rpn.state()).to.deep.equal({
          stack: [123]
        });
      });
    });

    describe('when not editing and the stack is empty', () => {
      it('throws if the stack is empty', () => {
        expect(() => {
          rpn.drop();
        }).to.throw('TooFewArguments');
      });
    });
  });

  describe('changeSign', () => {
    describe('when editing', () => {
      describe('when no exponent exists', () => {
        it('changes the sign of an implicit positive number', () => {
          insertNumberString('12345');
          expect(rpn.state()).to.deep.equal({
            stack: ['12345']
          });

          rpn.changeSign();
          expect(rpn.state()).to.deep.equal({
            stack: ['-12345']
          });
        });

        it('changes the sign of an explicit positive number', () => {
          insertNumberString('+12345');
          expect(rpn.state()).to.deep.equal({
            stack: ['+12345']
          });

          rpn.changeSign();
          expect(rpn.state()).to.deep.equal({
            stack: ['-12345']
          });
        });

        it('changes the sign of a negative number', () => {
          insertNumberString('-12345');
          expect(rpn.state()).to.deep.equal({
            stack: ['-12345']
          });

          rpn.changeSign();
          expect(rpn.state()).to.deep.equal({
            stack: ['+12345']
          });
        });
      });

      describe('when an exponent exists', () => {
        it('changes the sign of a negative exponent', () => {
          insertNumberString('1E-2');
          rpn.changeSign();
          expect(rpn.state()).to.deep.equal({
            stack: ['1E+2']
          });
        });

        it('changes the sign of an explicit positive exponent', () => {
          insertNumberString('1E+2');
          rpn.changeSign();
          expect(rpn.state()).to.deep.equal({
            stack: ['1E-2']
          });
        });

        it('changes the sign of an implicit positive exponent', () => {
          insertNumberString('1E2');
          rpn.changeSign();
          expect(rpn.state()).to.deep.equal({
            stack: ['1E-2']
          });
        });
      });
    });

    describe('when not editing', () => {
      it('changes the sign of the first stack entry', () => {
        insertNumberString('123');
        rpn.push();
        insertNumberString('456');
        rpn.push();
        expect(rpn.state()).to.deep.equal({
          stack: [456, 123]
        });
        rpn.changeSign();
        expect(rpn.state()).to.deep.equal({
          stack: [-456, 123]
        });
      });
    });
  });

  describe('enterDecimal', () => {
    it('adds a decimal if none exists', () => {
      insertNumberString('1');
      expect(rpn.state()).to.deep.equal({
        stack: ['1']
      });

      rpn.enterDecimal();
      expect(rpn.state()).to.deep.equal({
        stack: ['1.']
      });
    });

    it('does not add a decimal if one exists', () => {
      insertNumberString('1');
      rpn.enterDecimal();
      expect(rpn.state()).to.deep.equal({
        stack: ['1.']
      });

      rpn.enterDecimal();
      expect(rpn.state()).to.deep.equal({
        stack: ['1.']
      });
    });

    it('does not add a decimal if one does not exist but an exponent exists', () => {
      insertNumberString('1');
      rpn.enterExponent();
      expect(rpn.state()).to.deep.equal({
        stack: ['1E']
      });

      rpn.enterDecimal();
      expect(rpn.state()).to.deep.equal({
        stack: ['1E']
      });
    });

    it('prefixes the decimal with a 0 if the edit is empty', () => {
      rpn.enterDecimal();
      expect(rpn.state()).to.deep.equal({
        stack: ['0.']
      });
    });
  });

  describe('enterExponent', () => {
    describe('when no exponent exists', () => {
      it('adds an exponent', () => {
        insertNumberString('3.14');
        expect(rpn.state()).to.deep.equal({
          stack: ['3.14']
        });
        rpn.enterExponent();
        expect(rpn.state()).to.deep.equal({
          stack: ['3.14E']
        });
      });
    });

    describe('when an exponent exists', () => {
      it('does not add an exponent', () => {
        insertNumberString('3.14');
        rpn.enterExponent();
        expect(rpn.state()).to.deep.equal({
          stack: ['3.14E']
        });
        rpn.enterExponent();
        expect(rpn.state()).to.deep.equal({
          stack: ['3.14E']
        });
      });
    });

    it('prefixes the E with a 1 if the edit is empty', () => {
      rpn.enterExponent();
      expect(rpn.state()).to.deep.equal({
        stack: ['1E']
      });
    });
  });

  describe('add', () => {
    describe('when less than two arguments exist', () => {
      it('throws an error', () => {
        expect(() => {
          rpn.add();
        }).to.throw('TooFewArguments');
      });
    });
    describe('when two or more arguments exist', () => {
      describe('when not editing', () => {
        it('removes the two arguments and adds the result to the stack', () => {
          insertNumberString('1');
          rpn.push();
          insertNumberString('2');
          rpn.push();
          expect(rpn.state()).to.deep.equal({
            stack: [2, 1]
          });
          rpn.add();
          expect(rpn.state()).to.deep.equal({
            stack: [3]
          });
        });
      });
      describe('when editing', () => {
        it('stops editing, removes the two arguments, and adds the result to the stack', () => {
          insertNumberString('1');
          rpn.push();
          insertNumberString('2');
          expect(rpn.state()).to.deep.equal({
            stack: ['2', 1]
          });
          rpn.add();
          expect(rpn.state()).to.deep.equal({
            stack: [3]
          });
        });
      });
    });
  });

  describe('subtract', () => {
    describe('when less than two arguments exist', () => {
      it('throws an error', () => {
        expect(() => {
          rpn.subtract();
        }).to.throw('TooFewArguments');
      });
    });
    describe('when two or more arguments exist', () => {
      describe('when not editing', () => {
        it('removes the two arguments and adds the result to the stack', () => {
          insertNumberString('1');
          rpn.push();
          insertNumberString('2');
          rpn.push();
          expect(rpn.state()).to.deep.equal({
            stack: [2, 1]
          });
          rpn.subtract();
          expect(rpn.state()).to.deep.equal({
            stack: [-1]
          });
        });
      });
      describe('when editing', () => {
        it('stops editing, removes the two arguments, and adds the result to the stack', () => {
          insertNumberString('1');
          rpn.push();
          insertNumberString('2');
          expect(rpn.state()).to.deep.equal({
            stack: ['2', 1]
          });
          rpn.subtract();
          expect(rpn.state()).to.deep.equal({
            stack: [-1]
          });
        });
      });
    });
  });

  describe('multiply', () => {
    describe('when less than two arguments exist', () => {
      it('throws an error', () => {
        expect(() => {
          rpn.multiply();
        }).to.throw('TooFewArguments');
      });
    });
    describe('when two or more arguments exist', () => {
      describe('when not editing', () => {
        it('removes the two arguments and adds the result to the stack', () => {
          insertNumberString('3');
          rpn.push();
          insertNumberString('2');
          rpn.push();
          expect(rpn.state()).to.deep.equal({
            stack: [2, 3]
          });
          rpn.multiply();
          expect(rpn.state()).to.deep.equal({
            stack: [6]
          });
        });
      });
      describe('when editing', () => {
        it('stops editing, removes the two arguments, and adds the result to the stack', () => {
          insertNumberString('3');
          rpn.push();
          insertNumberString('2');
          expect(rpn.state()).to.deep.equal({
            stack: ['2', 3]
          });
          rpn.multiply();
          expect(rpn.state()).to.deep.equal({
            stack: [6]
          });
        });
      });
    });
  });

  describe('divide', () => {
    describe('when less than two arguments exist', () => {
      it('throws an error', () => {
        expect(() => {
          rpn.divide();
        }).to.throw('TooFewArguments');
      });
    });
    describe('when the divisor is 0', () => {
      it('throws an error', () => {
        insertNumberString('1');
        rpn.push();
        insertNumberString('0');
        rpn.push();
        expect(rpn.state()).to.deep.equal({
          stack: [0, 1]
        });
        expect(() => {
          rpn.divide();
        }).to.throw('InfiniteResult');
      });
    });
    describe('when two or more arguments exist', () => {
      describe('when not editing', () => {
        it('removes the two arguments and adds the result to the stack', () => {
          insertNumberString('4');
          rpn.push();
          insertNumberString('2');
          rpn.push();
          expect(rpn.state()).to.deep.equal({
            stack: [2, 4]
          });
          rpn.divide();
          expect(rpn.state()).to.deep.equal({
            stack: [2]
          });
        });
      });
      describe('when editing', () => {
        it('stops editing, removes the two arguments, and adds the result to the stack', () => {
          insertNumberString('4');
          rpn.push();
          insertNumberString('2');
          expect(rpn.state()).to.deep.equal({
            stack: ['2', 4]
          });
          rpn.divide();
          expect(rpn.state()).to.deep.equal({
            stack: [2]
          });
        });
      });
    });
  });
});
