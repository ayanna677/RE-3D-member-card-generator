const nameInput = document.getElementById('nameInput');
const fontSelect = document.getElementById('fontSelect');
const photoInput = document.getElementById('photoInput');
const photoOk = document.getElementById('photoOk');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const card = document.getElementById('card');
const cardName = document.getElementById('cardName');
const avatarImg = document.getElementById('avatarImg');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const tiltWrap = document.getElementById('tiltWrap');

// Update member name
nameInput.addEventListener('input', () => {
  cardName.textContent = nameInput.value.trim() || 'LALA';
});

// Change font
fontSelect.addEventListener('change', () => {
  card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
});

// Upload photo
photoInput.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatarImg.src = reader.result;
    photoPlaceholder.style.opacity = '0';
    photoOk.hidden = false;
  };
  reader.readAsDataURL(file);
});

// Apply theme
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    card.className = `card theme-${theme}`;
    document.body.style.background = getComputedStyle(card).background;
  });
});

// Reset
resetBtn.addEventListener('click', () => {
  nameInput.value = 'LALA';
  cardName.textContent = 'LALA';
  photoInput.value = '';
  photoOk.hidden = true;
  avatarImg.src = 'https://api.dicebear.com/9.x/identicon/svg?seed=RE';
  photoPlaceholder.style.opacity = '1';
  card.className = 'card theme-black';
  document.body.style.background = 'radial-gradient(circle at 60% 5%, #222 0%, #000 100%)';
});

// Tilt
let rect = null;
function updateRect(){ rect = tiltWrap.getBoundingClientRect(); }
updateRect();
window.addEventListener('resize', updateRect);

tiltWrap.addEventListener('mousemove', e => {
  if (!rect) return;
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = (e.clientX - cx)/(rect.width/2);
  const dy = (e.clientY - cy)/(rect.height/2);
  const max = 12;
  card.style.transform = `rotateX(${(-dy*max).toFixed(2)}deg) rotateY(${(dx*max).toFixed(2)}deg)`;
});
tiltWrap.addEventListener('mouseleave', ()=> card.style.transform='rotateX(0) rotateY(0)');

// Download card
downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Rendering...';
  try {
    const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${nameInput.value || 'RE_Member'}.png`;
    a.click();
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download Card';
  }
});
