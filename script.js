let selectedDice = 4;
let selectedCount = 1;
let rollHistory = [];
let allRolls = [];

function selectDice(sides, btn) {
  selectedDice = sides;
  document.querySelectorAll('.dice-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectCount(count, btn) {
  selectedCount = count;
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateDiceFaces();
}

function updateDiceFaces() {
  const faces = document.getElementById('diceFaces');
  faces.innerHTML = '';
  for (let i = 0; i < selectedCount; i++) {
    const div = document.createElement('div');
    div.className = 'dice-face';
    div.id = `dice-${i}`;
    div.textContent = '?';
    faces.appendChild(div);
  }
  document.getElementById('rollTotal').classList.add('hidden');
}

function rollDice() {
  const btn = document.getElementById('rollBtn');
  btn.disabled = true;

  const faces = document.querySelectorAll('.dice-face');
  faces.forEach(f => f.classList.add('rolling'));

  let iteration = 0;
  const maxIterations = 10;
  const interval = setInterval(() => {
    faces.forEach(f => {
      f.textContent = Math.floor(Math.random() * selectedDice) + 1;
    });
    iteration++;
    if (iteration >= maxIterations) {
      clearInterval(interval);
      finalizeRoll(faces, btn);
    }
  }, 60);
}

function finalizeRoll(faces, btn) {
  const results = [];
  faces.forEach((f, i) => {
    const val = Math.floor(Math.random() * selectedDice) + 1;
    f.textContent = val;
    f.classList.remove('rolling');
    results.push(val);
  });

  const total = results.reduce((a, b) => a + b, 0);
  allRolls.push(total);

  if (selectedCount > 1) {
    const totalEl = document.getElementById('rollTotal');
    totalEl.innerHTML = `Total: <span>${total}</span>`;
    totalEl.classList.remove('hidden');
  } else {
    document.getElementById('rollTotal').classList.add('hidden');
  }

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  rollHistory.unshift({
    dice: `${selectedCount}D${selectedDice}`,
    results,
    total,
    time
  });

  updateStats();
  renderHistory();
  btn.disabled = false;
}

function updateStats() {
  document.getElementById('totalRolls').textContent = allRolls.length;
  document.getElementById('highestRoll').textContent = Math.max(...allRolls);
  document.getElementById('lowestRoll').textContent = Math.min(...allRolls);
  const avg = allRolls.reduce((a, b) => a + b, 0) / allRolls.length;
  document.getElementById('avgRoll').textContent = avg.toFixed(1);
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (rollHistory.length === 0) {
    list.innerHTML = '<li class="history-empty">No rolls yet — roll some dice!</li>';
    return;
  }
  list.innerHTML = rollHistory.slice(0, 10).map(r => `
    <li class="history-item">
      <span class="roll-info">${r.dice} → [${r.results.join(', ')}]</span>
      <span class="roll-result">${r.total}</span>
      <span class="roll-time">${r.time}</span>
    </li>
  `).join('');
}

function clearHistory() {
  rollHistory = [];
  allRolls = [];
  document.getElementById('totalRolls').textContent = '0';
  document.getElementById('highestRoll').textContent = '—';
  document.getElementById('lowestRoll').textContent = '—';
  document.getElementById('avgRoll').textContent = '—';
  renderHistory();
}

window.onload = () => updateDiceFaces();