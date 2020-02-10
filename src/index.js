import RPN from './lib/rpn-engine';

const rpn = new RPN();

let display;

const updateDisplay = () => {
  const value = rpn.state().stack[0] || '0';
  display.innerText = value;
};

const operationMap = {
  'add': rpn.add,
  'changeSign': rpn.changeSign,
  'deleteChar': rpn.deleteChar,
  'divide': rpn.divide,
  'drop': rpn.drop,
  'enter': rpn.push,
  'enterDecimal': rpn.enterDecimal,
  'enterExponent': rpn.enterExponent,
  'multiply': rpn.multiply,
  'subtract': rpn.subtract,
};

const processOperation = (data) => {
  try {
    const func = operationMap[data.op];
    func.bind(rpn)();
  } catch(err) {
    console.error(err);
  }
};

const processKey = (data) => {
  console.log(data);

  if (data.op === 'insertChar') {
    rpn.insertChar(data.char);
  } else {
    processOperation(data);
  }

  updateDisplay();
};

window.onload = (event) => {
  display = document.querySelector('div[name="display0"]');
  updateDisplay();

  // number key handlers
  for (let i = 0; i < 10; i++) {
    document.querySelector(`div[name="${i}"]`)
      .addEventListener('click', processKey.bind(null, {op: 'insertChar', char: String(i)}));
  }

  // button/operation map
  const buttonMap = {
    changeSign: 'changeSign',
    deleteChar: 'deleteChar',
    enterDecimal: 'enterDecimal',
    enterExponent: 'enterExponent',
    enter: 'enter',
    add: 'add',
    subtract: 'subtract',
    multiply: 'multiply',
    divide: 'divide',
  };

  for (let btn in buttonMap) {
    if (Object.prototype.hasOwnProperty.call(buttonMap, btn)) {
      document.querySelector(`div[name="${btn}"]`)
        .addEventListener('click', processKey.bind(null, {op: buttonMap[btn]}));
    } else {
      console.error(`Failed to add event listener for button: ${btn}`);
    }
  }
};
