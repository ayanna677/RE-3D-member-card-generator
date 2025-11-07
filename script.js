// Controls
const nameInput   = document.getElementById('nameInput');
const roleInput   = document.getElementById('roleInput');
const photoInput  = document.getElementById('photoInput');
const themeSelect = document.getElementById('themeSelect');
const brandingToggle = document.getElementById('brandingToggle');
const resetBtn    = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Card parts
const card      = document.getElementById('card');
const cardName  = document.getElementById('cardName');
const cardRole  = document.getElementById('cardRole');
const avatarImg = document.getElementById('avatarImg');
const tiltWrap  = document.getElementById('tiltWrap');

// Live updates
nameInput.addEventListener('input', () => {
  cardName.textContent = nameInput.value.trim() || 'Member Name';
});
roleInput.addEventListener('input', () => {
  cardRole.textContent = roleInput.value.trim() || 'Member';
});

// Photo upload (PNG/JPG)
photoInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { avatarImg.src = reader.result; };
  reader.readAsDataURL(file);
});

// Theme switcher
const THEMES = ['theme-dark', 'theme-neon', 'theme-gold', 'theme-glass'];
function applyTheme(key) {
  card.classList.remove(...THEMES);
  card.classList.add(`theme-${key}`);
}
themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));

// Branding toggle (adds/removes slogan + sweep/rim via class)
brandingToggle.addEventListener('change', (e) => {
  card.dataset.branding = e.target.checked ? 'on' : 'off';
  if (e.target.checked){
    card.querySelector('.slogan').style.display = '';
  } else {
    card.querySelector('.slogan').style.display = 'none';
  }
});

// Reset
resetBtn.addEventListener('click', () => {
  nameInput.value = 'Member Name';
  roleInput.value = 'Member';
  themeSelect.value = 'dark';
  brandingToggle.checked = true;
  avatarImg.src = 'https://api.dicebear.com/9.x/identicon/svg?seed=RE';
  cardName.textContent = 'Member Name';
  cardRole.textContent = 'Member';
  applyTheme('dark');
  card.dataset.branding = 'on';
  card.querySelector('.slogan').style.display = '';
});

// 3D tilt math
let rect = null;
function updateRect(){ rect = tiltWrap.getBoundingClientRect(); }
updateRect();
window.addEventListener('resize', updateRect);

tiltWrap.addEventListener('mousemove', (e) => {
  if (!rect) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  const maxTilt = 12;
  card.style.transform = `rotateX(${(-dy*maxTilt).toFixed(2)}deg) rotateY(${(dx*maxTilt).toFixed(2)}deg)`;
});
tiltWrap.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0) rotateY(0)';
});

// Download PNG
downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Rendering…';
  try{
    const prevShadow = card.style.boxShadow;
    card.style.boxShadow = 'none';

    const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });

    card.style.boxShadow = prevShadow || '';

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    const safeName = (nameInput.value || 'RE_Member').replace(/[^a-z0-9_-]+/gi, '_');
    a.href = url;
    a.download = `${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }catch(err){
    alert('Could not create PNG. Try again.');
    console.error(err);
  }finally{
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download PNG';
  }
});

// Init
applyTheme('dark');
card.dataset.branding = 'on';
