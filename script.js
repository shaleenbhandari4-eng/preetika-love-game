const app = document.getElementById('app');
const panel = document.getElementById('panel');
const floatingHearts = document.getElementById('floatingHearts');
const confettiLayer = document.getElementById('confettiLayer');

const state = {
  stage: 'question1',
  noAttempts: 0,
  noVisible: true,
  reaction: '',
  noPosition: {
    left: '58%',
    top: '16px',
  },
};

const noMessages = [
  'What?! 😳 Really?',
  'Are you sure about that? 🥲',
  'Damn… okay 😭',
  'You must hate me, huh? 💀',
  'Okay… I’m starting to take this personally 😭',
];

function createFloatingHearts() {
  floatingHearts.innerHTML = '';

  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'h';
    heart.textContent = i % 2 === 0 ? '💗' : '💖';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${(Math.random() * 8).toFixed(2)}s`;
    heart.style.animationDuration = `${(8 + Math.random() * 10).toFixed(2)}s`;
    floatingHearts.appendChild(heart);
  }
}

function applyNoButtonPosition() {
  const noBtn = document.getElementById('noBtn');
  if (!noBtn) return;

  if (!state.noVisible) {
    noBtn.classList.add('hidden');
    return;
  }

  noBtn.classList.remove('hidden');
  noBtn.style.left = state.noPosition.left;
  noBtn.style.top = state.noPosition.top;
}

function moveNoButton() {
  const noBtn = document.getElementById('noBtn');
  const buttonRow = document.getElementById('buttonRow');

  if (!noBtn || !buttonRow || !state.noVisible) return;

  const rect = buttonRow.getBoundingClientRect();
  const width = rect.width || 400;
  const height = rect.height || 110;

  const leftMax = Math.max(30, width - noBtn.offsetWidth - 24);
  const topMax = Math.max(16, height - noBtn.offsetHeight - 24);

  let left = 28 + Math.random() * (leftMax - 28);
  let top = 16 + Math.random() * (topMax - 16);

  const centerBandStart = width * 0.3;
  const centerBandEnd = width * 0.7;

  if (left > centerBandStart && left < centerBandEnd) {
    left = left < width / 2 ? left - 90 : left + 90;
  }

  left = Math.max(20, Math.min(left, leftMax));
  top = Math.max(16, Math.min(top, topMax));

  state.noPosition = {
    left: `${left}px`,
    top: `${top}px`,
  };

  noBtn.style.left = state.noPosition.left;
  noBtn.style.top = state.noPosition.top;
}

function renderQuestion1() {
  app.innerHTML = `
    <div class="question-shell">
      <div class="badge">For Preetika 💖</div>
      <h1 class="title">Preetika, do you love me? ❤️</h1>
      <p class="subtitle">I promise I’ll keep being your favorite distraction.</p>

      <div class="button-row" id="buttonRow">
        <button class="btn heart" id="yesBtn" type="button">Yes ❤️</button>
        <button class="btn ghost no-btn ${state.noVisible ? '' : 'hidden'}" id="noBtn" type="button">No 😭</button>
      </div>

      <p id="reactionText" class="reaction">${state.reaction || ''}</p>
    </div>
  `;

  document.getElementById('yesBtn').addEventListener('click', () => {
    state.stage = 'question2';
    state.reaction = '';
    state.noAttempts = 0;
    state.noVisible = true;
    state.noPosition = { left: '58%', top: '16px' };
    renderQuestion2();
  });

  document.getElementById('noBtn').addEventListener('click', handleFirstNo);
  applyNoButtonPosition();
}

function handleFirstNo() {
  state.noAttempts += 1;

  if (state.noAttempts < 5) {
    state.reaction = noMessages[state.noAttempts - 1];
    moveNoButton();
    renderQuestion1();
    return;
  }

  state.reaction = noMessages[4];
  moveNoButton();
  renderQuestion1();

  window.setTimeout(() => {
    state.noVisible = false;
    state.reaction = 'Alright, Preetika… I get it. 😭💔';
    renderQuestion1();
  }, 700);
}

function renderQuestion2() {
  app.innerHTML = `
    <div class="question-shell">
      <div class="badge">A tiny date question 🥰</div>
      <h1 class="title">Would you like to go on a date with me? 🥰</h1>
      <p class="subtitle">I’ll make it cute, chaotic, and very, very memorable.</p>

      <div class="button-row" id="buttonRow">
        <button class="btn heart" id="yesBtn" type="button">Yes 💕</button>
        <button class="btn ghost no-btn" id="noBtn" type="button">No 😭</button>
      </div>

      <p id="reactionText" class="reaction">${state.reaction || ''}</p>
    </div>
  `;

  document.getElementById('yesBtn').addEventListener('click', () => {
    state.stage = 'success';
    renderSuccess();
  });

  document.getElementById('noBtn').addEventListener('click', () => {
    state.reaction = 'No? 😭 I’ll still make you smile anyway 😌';
    moveNoButton();
    renderQuestion2();
  });

  applyNoButtonPosition();
}

function renderSuccess() {
  app.innerHTML = `
    <div class="success-shell">
      <div class="badge success-badge">Date unlocked ✨</div>
      <h1 class="title big">CONGRATULATIONS, PREETIKA! 🎉❤️</h1>
      <p class="subtitle success-subtitle">You got yourself a date with me! 😌💕</p>

      <div class="date-form hidden" id="dateForm">
        <label class="date-label" for="dateInput">Put the date and time for us 💕</label>
        <input class="date-input" id="dateInput" type="text" placeholder="Saturday, 7:00 PM" />
        <button class="btn heart small-btn" id="submitDateBtn" type="button">Send it 💌</button>
      </div>

      <button class="btn heart large-btn" id="dateBtn" type="button">Okay, when’s our date? 👀</button>
    </div>
  `;

  spawnCelebration();

  const dateBtn = document.getElementById('dateBtn');
  const dateForm = document.getElementById('dateForm');
  const dateInput = document.getElementById('dateInput');
  const submitDateBtn = document.getElementById('submitDateBtn');
  const subtitle = document.querySelector('.success-subtitle');

  dateBtn.addEventListener('click', () => {
    dateForm.classList.remove('hidden');
    dateBtn.classList.add('hidden');
    dateInput.focus();
  });

  submitDateBtn.addEventListener('click', () => {
    const dateTime = dateInput.value.trim();

    if (!dateTime) {
      dateInput.focus();
      return;
    }

    subtitle.textContent = 'You won my kisses, Mommy 💋💖 now you’ve got me all flustered 😏✨';
    subtitle.classList.add('flirty-message');
    dateForm.classList.add('hidden');
    dateBtn.textContent = 'Saved for our date 💕';
    dateBtn.classList.remove('hidden');
    dateBtn.disabled = true;
    dateBtn.style.opacity = '0.9';
    dateBtn.style.cursor = 'default';

    playFlirtyChime();

    const sparkle = document.createElement('div');
    sparkle.className = 'kiss-sparkle';
    sparkle.textContent = '💋💖✨';
    app.appendChild(sparkle);

    window.setTimeout(() => {
      sparkle.remove();
    }, 1200);
  });
}

function playFlirtyChime() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx) return;

  const audioCtx = new AudioCtx();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.12);

  gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.24);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.25);

  window.setTimeout(() => {
    audioCtx.close();
  }, 280);
}

function spawnCelebration() {
  confettiLayer.innerHTML = '';

  const emojis = ['💖', '💗', '🎉', '✨', '💕'];

  for (let i = 0; i < 28; i += 1) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti';
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${(Math.random() * 0.6).toFixed(2)}s`;
    confetti.style.fontSize = `${16 + Math.random() * 16}px`;
    confettiLayer.appendChild(confetti);
  }

  for (let i = 0; i < 16; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'floating-pop';
    heart.textContent = i % 2 === 0 ? '💞' : '💘';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;
    heart.style.animationDuration = `${(1.2 + Math.random() * 1.5).toFixed(2)}s`;
    confettiLayer.appendChild(heart);
  }
}

createFloatingHearts();
renderQuestion1();
