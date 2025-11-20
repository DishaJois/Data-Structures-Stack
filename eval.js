// ✅ Utility function to check if a character is an operator
function isOperator(ch) {
  return ['+', '-', '*', '/', '^'].includes(ch);
}

// ✅ Function to return precedence
function precedence(op) {
  switch (op) {
    case '+':
    case '-': return 1;
    case '*':
    case '/': return 2;
    case '^': return 3;
    default: return 0;
  }
}

// ✅ Convert Infix → Postfix (Shunting Yard Algorithm)
function infixToPostfix(expression) {
  const stack = [];
  let postfix = '';

  for (let i = 0; i < expression.length; i++) {
    const c = expression[i];

    if (c === ' ') continue;

    // If operand
    if (!isNaN(c)) {
      postfix += c + ' ';
    }
    // If '('
    else if (c === '(') {
      stack.push(c);
    }
    // If ')'
    else if (c === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        postfix += stack.pop() + ' ';
      }
      stack.pop(); // remove '('
    }
    // If operator
    else if (isOperator(c)) {
      while (
        stack.length &&
        precedence(stack[stack.length - 1]) >= precedence(c)
      ) {
        postfix += stack.pop() + ' ';
      }
      stack.push(c);
    }
  }

  while (stack.length) {
    postfix += stack.pop() + ' ';
  }

  return postfix.trim();
}

// ✅ Evaluate Postfix
function evaluatePostfix(expression) {
  const stack = [];
  const steps = [];
  const tokens = expression.split(/\s*/).filter(t => t !== '');

  for (let c of tokens) {
    if (!isNaN(c)) {
      stack.push(Number(c));
      steps.push(`Pushed ${c} → Stack: [${stack.join(', ')}]`);
    } else if (isOperator(c)) {
      const val2 = stack.pop();
      const val1 = stack.pop();

      if (val1 === undefined || val2 === undefined) {
        throw new Error("Invalid postfix expression");
      }

      let result;
      switch (c) {
        case '+': result = val1 + val2; break;
        case '-': result = val1 - val2; break;
        case '*': result = val1 * val2; break;
        case '/': result = val1 / val2; break;
        case '^': result = Math.pow(val1, val2); break;
      }

      stack.push(result);
      steps.push(`Applied ${c}: ${val1} ${c} ${val2} = ${result} → Stack: [${stack.join(', ')}]`);
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression");

  return { result: stack[0], steps };
}

// ✅ Detect whether the input is infix or postfix
function detectExpressionType(expr) {
  if (expr.includes('(') || expr.includes(')')) return 'infix';
  if (/[\+\-\*\/\^]/.test(expr) && expr.trim().split(' ').length === 1) {
    // Likely postfix (no spaces)
    return 'postfix';
  }
  // If multiple tokens separated by spaces, assume postfix
  return 'postfix';
}

// ✅ Main logic (shared for both)
document.getElementById("evalBtn").addEventListener("click", () => {
  const input = document.getElementById("postfix").value.trim();
  const resultBox = document.getElementById("result");
  const stepsBox = document.getElementById("steps");

  stepsBox.innerHTML = '';
  resultBox.textContent = '—';

  if (input === '') {
    resultBox.textContent = '⚠️ Please enter an expression!';
    return;
  }

  try {
    let expressionType = detectExpressionType(input);
    let postfixExpr = input;
    const steps = [];

    if (expressionType === 'infix') {
      postfixExpr = infixToPostfix(input);
      steps.push(`Converted Infix → Postfix: ${postfixExpr}`);
    }

    const { result, steps: evalSteps } = evaluatePostfix(postfixExpr);
    steps.push(...evalSteps);

    resultBox.textContent = result;

    steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsBox.appendChild(li);
    });
  } catch (err) {
    resultBox.textContent = `❌ Error: ${err.message}`;
  }
});
