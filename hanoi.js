let step = 0;
let moves = [];
let pegs = { A: [], B: [], C: [] };

function resetPegs(n) {
  pegs = { A: [], B: [], C: [] };
  const pegA = document.getElementById('pegA');
  const pegB = document.getElementById('pegB');
  const pegC = document.getElementById('pegC');
  [pegA, pegB, pegC].forEach(p => (p.innerHTML = ''));

  for (let i = n; i >= 1; i--) {
    const disk = document.createElement('div');
    disk.classList.add('disk');
    disk.style.width = 30 + i * 15 + 'px';
    disk.style.bottom = (n - i) * 22 + 'px';
    disk.style.backgroundColor = `hsl(${i * 40}, 80%, 50%)`;
    disk.textContent = i;
    pegA.appendChild(disk);
    pegs.A.push(disk);
  }
}

function hanoi(n, from, to, aux) {
  if (n === 1) {
    moves.push([from, to]);
    return;
  }
  hanoi(n - 1, from, aux, to);
  moves.push([from, to]);
  hanoi(n - 1, aux, to, from);
}

function animateMoves() {
  if (moves.length === 0) return;

  const [from, to] = moves.shift();
  step++;
  document.getElementById('stepcount').textContent = step;
  const moveList = document.getElementById('moveList');
  const li = document.createElement('li');
  li.textContent = `Move ${step}: ${from} → ${to}`;
  moveList.appendChild(li);

  const disk = pegs[from].pop();
  pegs[to].push(disk);
  const toPeg = document.getElementById('peg' + to);
  disk.style.bottom = (pegs[to].length - 1) * 22 + 'px';
  toPeg.appendChild(disk);

  setTimeout(animateMoves, 600);
}

function startHanoi() {
  const n = parseInt(document.getElementById('numDisks').value);
  step = 0;
  moves = [];
  document.getElementById('stepcount').textContent = '0';
  document.getElementById('moveList').innerHTML = '';
  resetPegs(n);
  hanoi(n, 'A', 'C', 'B');
  animateMoves();
}

document.getElementById('startBtn').addEventListener('click', startHanoi);
