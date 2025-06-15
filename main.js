const startBtn = document.getElementById('start-btn');
const targetDateInput = document.getElementById('target-date');
const labelInput = document.getElementById('label-input');
const countdownDisplay = document.getElementById('countdown-display');
const countdownLabel = document.getElementById('countdown-label');
const form = document.getElementById('countdown-form');
const bgColorInput = document.getElementById('bg-color-input');
const fontColorInput = document.getElementById('font-color-input');
const sidebar = document.querySelector('.sidebar');
const bgTypeRadios = document.querySelectorAll('input[name="bg-type"]');
const bgColorGroup = document.getElementById('bg-color-group');
const bgImageGroup = document.getElementById('bg-image-group');
const bgImageInput = document.getElementById('bg-image-input');
let countdownInterval;
let currentBgImage = null;

function formatTime(ms) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function applyCustomColors() {
  const isColorMode = document.getElementById('bg-color-toggle').checked;
  if (isColorMode) {
    document.body.style = `
      background: ${bgColorInput.value} !important;
      background-color: ${bgColorInput.value} !important;
      background-image: none !important;
      color: ${fontColorInput.value} !important;
    `;
  } else if (currentBgImage) {
    document.body.style = `
      background: url(${currentBgImage}) !important;
      background-size: cover !important;
      background-position: center !important;
      color: ${fontColorInput.value} !important;
    `;
  }
  countdownLabel.style.color = fontColorInput.value;
  countdownDisplay.style.color = fontColorInput.value;
}

bgTypeRadios.forEach(radio => {
  radio.addEventListener('change', handleBackgroundTypeChange);
});

function handleBackgroundTypeChange(e) {
  const isColor = e.target.value === 'color';
  bgColorGroup.style.display = isColor ? 'flex' : 'none';
  bgImageGroup.style.display = isColor ? 'none' : 'flex';
  applyCustomColors();
}

bgImageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentBgImage = e.target.result;
      applyCustomColors();
    };
    reader.readAsDataURL(file);
  }
});

bgColorInput.addEventListener('input', applyCustomColors);
fontColorInput.addEventListener('input', applyCustomColors);
if (sidebar) {
  sidebar.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('bg-color-toggle').checked = true;
      document.getElementById('bg-image-toggle').checked = false;
      handleBackgroundTypeChange({ target: { value: 'color' } });
      
      if (btn.dataset.label) labelInput.value = btn.dataset.label;
      if (btn.dataset.date) targetDateInput.value = btn.dataset.date;
      if (btn.dataset.bg) bgColorInput.value = btn.dataset.bg;
      if (btn.dataset.font) fontColorInput.value = btn.dataset.font;
      
      applyCustomColors();
    });
  });
}

function startCountdown() {
  const target = new Date(targetDateInput.value);
  if (isNaN(target.getTime())) {
    alert('Please select a valid date and time.');
    return;
  }
  
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
  
  const label = labelInput.value.trim();
  countdownLabel.textContent = label ? label : '';
  document.body.classList.add('fullscreen');
  applyCustomColors();

  clearInterval(countdownInterval);
  function update() {
    const now = new Date();
    const diff = target - now;
    countdownDisplay.textContent = formatTime(diff);
    if (diff <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "Time's up!";
    }
  }
  update();
  countdownInterval = setInterval(update, 1000);
}

form.addEventListener('submit', e => e.preventDefault());
startBtn.addEventListener('click', startCountdown);
applyCustomColors();
