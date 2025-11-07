// Elements
const nameInput   = document.getElementById('nameInput');
const fontSelect  = document.getElementById('fontSelect');
const photoInput  = document.getElementById('photoInput');
const photoOk     = document.getElementById('photoOk');
const bgInput     = document.getElementById('bgInput');
const bgOk        = document.getElementById('bgOk');
const resetBtn    = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

const card      = document.getElementById('card');
const cardName  = document.getElementById('cardName');
const avatarImg = document.getElementById('avatarImg');
const tiltWrap  = document.getElementById('tiltWrap');
const photoPlaceholder = document.getElementById('photoPlaceholder');

// Live updates
nameInput.addEventListener('input', () => {
  cardName.textContent = nameInput.value.trim() || 'LALA';
});

// Font switch
fontSelect.addEventListener('change', () => {
  const f = fontSelect.value;
  card.style.setProperty('--card-font', `'${f}', system-ui`);
});

// Photo upload
photoInput.addEventListener('change', (e) => {
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

// Background upload
bgInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    card.style.backgroundImage = `url('${reader.result}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    card.style.backgroundBlendMode = 'overlay';
    bgOk.hidden = false;
  };
  reader.readAsDataURL(file);
});

// Theme buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    card.className = `card theme-${theme}`;
    document.body.className = `theme-${theme}`;
  });
});

// Reset
resetBtn.addEventListener('click', () => {
  nameInput.value = 'LALA';
  fontSelect.value = 'Inter';
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
  card.style.setProperty('--card-font', `'Inter', system-ui`);
});

// 3D Tilt
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
  const max = 12;
  card.style.transform = `rotateX(${(-dy*max).toFixed(2)}deg) rotateY(${(dx*max).toFixed(2)}deg)`;
});
tiltWrap.addEventListener('mouseleave', ()=> card.style.transform = 'rotateX(0) rotateY(0)');

// Download PNG
downloadBtn.addEventListener('click', async () => {
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Rendering…';
  try{
    const prev = card.style.boxShadow;
    card.style.boxShadow = 'none';
    const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
    card.style.boxShadow = prev || '';
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (nameInput.value || 'RE_Member').replace(/[^a-z0-9_-]+/gi,'_') + '.png';
    document.body.appendChild(a); a.click(); a.remove();
  }catch(err){
    alert('Could not create PNG. Try again.');
    console.error(err);
  }finally{
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download as PNG';
  }
});

// Init
card.style.setProperty('--card-font', `'Inter', system-ui`);
document.body.className = 'theme-aqua';
