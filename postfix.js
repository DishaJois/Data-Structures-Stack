// Utility function: precedence of operators
function precedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  if (op === '^') return 3;
  return 0;
}

// Check if a character is an operator
function isOperator(c) {
  return ['+', '-', '*', '/', '^'].includes(c);
}

// Main conversion function
function infixToPostfix(expression) {
  let stack = [];
  let result = "";
  let steps = [];

  expression = expression.replace(/\s+/g, ""); // Remove spaces

  for (let ch of expression) {
    if (/[a-zA-Z0-9]/.test(ch)) {
      // Operand
      result += ch;
      steps.push(`Read operand '${ch}', add to output → ${result}`);
    } 
    else if (ch === '(') {
      stack.push(ch);
      steps.push(`Push '(' onto stack`);
    } 
    else if (ch === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        result += stack.pop();
        steps.push(`Pop operator from stack, add to output → ${result}`);
      }
      stack.pop(); // Remove '('
      steps.push(`Encounter ')', pop '(' from stack`);
    } 
    else if (isOperator(ch)) {
      while (
        stack.length &&
        precedence(stack[stack.length - 1]) >= precedence(ch)
      ) {
        result += stack.pop();
        steps.push(`Pop higher/equal precedence op, output → ${result}`);
      }
      stack.push(ch);
      steps.push(`Push operator '${ch}' onto stack`);
    }
  }

  // Pop remaining operators
  while (stack.length) {
    result += stack.pop();
    steps.push(`Pop remaining operator, output → ${result}`);
  }

  return { result, steps };
}

// Display logic
document.getElementById("convertBtn").addEventListener("click", () => {
  const infix = document.getElementById("infixInput").value.trim();
  const output = document.getElementById("postfixOutput");
  const stepBox = document.getElementById("stepOutput");

  if (!infix) {
    output.textContent = "Please enter an expression!";
    stepBox.innerHTML = "";
    return;
  }

  const { result, steps } = infixToPostfix(infix);

  output.textContent = result || "Invalid expression";
  stepBox.innerHTML = steps.map(s => `<p>${s}</p>`).join("");
});
