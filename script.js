const nameInput = document.getElementById('nameInput');
const fontSelect = document.getElementById('fontSelect');
const photoInput = document.getElementById('photoInput');
const photoOk = document.getElementById('photoOk');
const bgInput = document.getElementById('bgInput');
const bgOk = document.getElementById('bgOk');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

const card = document.getElementById('card');
const cardName = document.getElementById('cardName');
const avatarImg = document.getElementById('avatarImg');
const tiltWrap = document.getElementById('tiltWrap');
const photoPlaceholder = document.getElementById('photoPlaceholder');

// Name
nameInput.addEventListener('input', () => {
  cardName.textContent = nameInput.value.trim() || 'LALA';
});

// Font
fontSelect.addEventListener('change', () => {
  const f = fontSelect.value;
  card.style.setProperty('--card-font', `'${f}', system-ui`);
});

// Photo Upload
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

// Background Upload
bgInput.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    card.style.backgroundImage = `url('${reader.result}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    bgOk.hidden = false;
  };
  reader.readAsDataURL(file);
});

// Themes
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    card.style.backgroundImage = 'none';
    card.className = `card theme-${theme}`;
    document.body.className = `theme-${theme}`;
  });
});

// Reset
resetBtn.addEventListener('click', () => {
  nameInput.value = 'LALA';
  fontSelect.value = 'Poppins';
  photoInput.value = '';
  bgInput.value = '';
  photoOk.hidden = true;
  bgOk.hidden = true;
  photoPlaceholder.style.opacity = '1';
  cardName.textContent = 'LALA';
  avatarImg.src = 'https://api.dicebear.com/9.x/identicon/svg?seed=RE';
  card.style.backgroundImage = 'none';
  card.className = 'card theme-aqua';
  document.body.className = 'theme-aqua';
});

// 3D Tilt
let rect = null;
function updateRect(){ rect = tiltWrap.getBoundingClientRect(); }
updateRect();
window.addEventListener('resize', updateRect);

tiltWrap.addEventListener('mousemove', e => {
  if (!rect) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  const max = 12;
  card.style.transform = `rotateX(${(-dy*max).toFixed(2)}deg) rotateY(${(dx*max).toFixed(2)}deg)`;
});
tiltWrap.addEventListener('mouseleave', ()=> card.style.transform = 'rotateX(0) rotateY(0)');

// Download
downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Rendering…';
  try {
    const prev = card.style.boxShadow;
    card.style.boxShadow = 'none';
    const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
    card.style.boxShadow = prev;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${nameInput.value || 'RE_Member'}.png`;
    a.click();
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download as PNG';
  }
});
