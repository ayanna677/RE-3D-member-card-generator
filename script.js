// Elements
const nameInput   = document.getElementById('nameInput');
const fontSelect  = document.getElementById('fontSelect');
const photoInput  = document.getElementById('photoInput');
const photoOk     = document.getElementById('photoOk');
const resetBtn    = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

const card      = document.getElementById('card');
const cardName  = document.getElementById('cardName');
const cardRole  = document.getElementById('cardRole'); // role text kept for future use
const avatarImg = document.getElementById('avatarImg');
const tiltWrap  = document.getElementById('tiltWrap');

// Live updates
nameInput.addEventListener('input', () => {
  cardName.textContent = nameInput.value.trim() || 'Member Name';
});

// Font switch
fontSelect.addEventListener('change', () => {
  const f = fontSelect.value;
  card.style.setProperty('--card-font', `'${f}', ${getFallback(f)}`);
});
function getFallback(f){
  if (f === 'Playfair Display') return 'serif';
  if (f === 'Orbitron') return 'system-ui';
  return 'system-ui';
}

// Photo upload
photoInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatarImg.src = reader.result;
    photoOk.hidden = false;
  };
  reader.readAsDataURL(file);
});

// Theme buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme; // ocean | sunset | gold | forest | glass | neon
    card.className = `card theme-${theme}`;
  });
});

// Reset
resetBtn.addEventListener('click', () => {
  nameInput.value = 'Member Name';
  fontSelect.value = 'Inter';
  photoInput.value = '';
  photoOk.hidden = true;
  cardName.textContent = 'Member Name';
  avatarImg.src = 'https://api.dicebear.com/9.x/identicon/svg?seed=RE';
  card.className = 'card theme-ocean';
  card.style.setProperty('--card-font', `'Inter', system-ui`);
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

// Init font var
card.style.setProperty('--card-font', `'Inter', system-ui`);
