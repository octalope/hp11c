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

  // listen for number keys
  for (let i = 0; i < 10; i++) {
    document.querySelector(`div[name="${i}"]`)
      .addEventListener('click', processKey.bind(null, {op: 'insertChar', char: String(i)}));
  }

  document.querySelector('div[name="deleteChar"]')
    .addEventListener('click', processKey.bind(null, {op: 'deleteChar'}));

  document.querySelector('div[name="changeSign"]')
    .addEventListener('click', processKey.bind(null, {op: 'changeSign'}));

  document.querySelector('div[name="enterDecimal"]')
    .addEventListener('click', processKey.bind(null, {op: 'enterDecimal'}));

  document.querySelector('div[name="enterExponent"]')
    .addEventListener('click', processKey.bind(null, {op: 'enterExponent'}));

  document.querySelector('div[name="enter"]')
    .addEventListener('click', processKey.bind(null, {op: 'enter'}));

  // document.querySelector('div[name="drop"]')
  //   .addEventListener('click', processKey.bind(null, {op: 'drop'}));

  document.querySelector('div[name="add"]')
    .addEventListener('click', processKey.bind(null, {op: 'add'}));

  document.querySelector('div[name="subtract"]')
    .addEventListener('click', processKey.bind(null, {op: 'subtract'}));

  document.querySelector('div[name="multiply"]')
    .addEventListener('click', processKey.bind(null, {op: 'multiply'}));

  document.querySelector('div[name="divide"]')
    .addEventListener('click', processKey.bind(null, {op: 'divide'}));
};
