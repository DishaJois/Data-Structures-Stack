// Function to define precedence
function precedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  if (op === '^') return 3;
  return 0;
}

// Function to check if character is an operator
function isOperator(c) {
  return ['+', '-', '*', '/', '^'].includes(c);
}

// Function to reverse a string and swap parentheses
function reverseAndSwap(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === '(') reversed += ')';
    else if (str[i] === ')') reversed += '(';
    else reversed += str[i];
  }
  return reversed;
}

// Convert infix to postfix (helper)
function infixToPostfix(infix) {
  let stack = [];
  let result = '';

  for (let i = 0; i < infix.length; i++) {
    let c = infix[i];

    if (c === ' ') continue;

    if (/[A-Za-z0-9]/.test(c)) {
      result += c;
    } else if (c === '(') {
      stack.push(c);
    } else if (c === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        result += stack.pop();
      }
      stack.pop(); // remove '('
    } else if (isOperator(c)) {
      while (
        stack.length &&
        precedence(c) <= precedence(stack[stack.length - 1])
      ) {
        result += stack.pop();
      }
      stack.push(c);
    }
  }

  while (stack.length) result += stack.pop();
  return result;
}

// Convert infix to prefix
function infixToPrefix(infix) {
  // Step 1: Reverse and swap brackets
  let reversed = reverseAndSwap(infix);

  // Step 2: Convert reversed expression to postfix
  let postfix = infixToPostfix(reversed);

  // Step 3: Reverse the postfix result → prefix
  return postfix.split('').reverse().join('');
}

// Main logic
document.getElementById('convertBtn').addEventListener('click', () => {
  const infix = document.getElementById('infix').value.trim();

  if (infix === '') {
    document.getElementById('result').textContent = '⚠️ Please enter an expression!';
    return;
  }

  try {
    const prefix = infixToPrefix(infix);
    document.getElementById('result').textContent = prefix;
  } catch (err) {
    document.getElementById('result').textContent = '❌ Invalid expression!';
  }
});
