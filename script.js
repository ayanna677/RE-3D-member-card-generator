document.addEventListener("DOMContentLoaded", function() {
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
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const tiltWrap = document.getElementById('tiltWrap');
  const scene = document.body;

  // Update name
  nameInput.addEventListener('input', () => {
    cardName.textContent = nameInput.value.trim() || 'LALA';
  });

  // Font
  fontSelect.addEventListener('change', () => {
    const f = fontSelect.value;
    card.style.fontFamily = `'${f}', system-ui, sans-serif`;
  });

  // Photo upload
  photoInput.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      avatarImg.src = reader.result;
      const looksLikeLogo = f.name.toLowerCase().includes('logo') || f.type.includes('png');
      avatarImg.style.objectFit = looksLikeLogo ? 'contain' : 'cover';
      avatarImg.style.mixBlendMode = looksLikeLogo ? 'lighten' : 'normal';
      photoPlaceholder.style.opacity = '0';
      photoOk.hidden = false;
    };
    reader.readAsDataURL(f);
  });

  // Background upload
  bgInput.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageURL = reader.result;
      scene.dataset.bg = imageURL; // store for reuse
      updateSceneBackground(imageURL);
      bgOk.hidden = false;
    };
    reader.readAsDataURL(f);
  });

  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      scene.className = `scene theme-${theme}`;
      card.animate([{opacity:0.9},{opacity:1}],{duration:200,fill:'forwards'});

      // Keep background visible with new glow
      const bg = scene.dataset.bg;
      if (bg) updateSceneBackground(bg);
    });
  });

  // Function to rebuild layered background with glow + image
  function updateSceneBackground(imageURL) {
    scene.style.transition = 'background 0.6s ease';
    scene.style.backgroundImage = `
      radial-gradient(800px 420px at 62% 10%, var(--scene-accent), transparent 60%),
      radial-gradient(900px 540px at 15% 85%, rgba(0,0,0,.35), rgba(0,0,0,.9) 70%),
      url('${imageURL}')
    `;
    scene.style.backgroundSize = 'auto, auto, cover';
    scene.style.backgroundPosition = 'center, center, center';
    scene.style.backgroundRepeat = 'no-repeat';
  }

  // Reset
  resetBtn.addEventListener('click', () => {
    nameInput.value = 'LALA';
    cardName.textContent = 'LALA';
    fontSelect.value = 'Poppins';
    card.style.fontFamily = '';
    photoInput.value = '';
    photoOk.hidden = true;
    avatarImg.src = 'https://api.dicebear.com/9.x/identicon/svg?seed=RE';
    avatarImg.style.objectFit = 'contain';
    avatarImg.style.mixBlendMode = 'lighten';
    photoPlaceholder.style.opacity = '1';
    bgInput.value = '';
    bgOk.hidden = true;
    delete scene.dataset.bg;
    scene.style.backgroundImage = '';
    scene.className = 'scene theme-black';
  });

  // 3D tilt
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
    const px = ((dx + 1) / 2) * 100;
    const py = ((-dy + 1) / 2) * 100;
    card.style.setProperty('--shine-x', `${px}%`);
    card.style.setProperty('--shine-y', `${py}%`);
  });

  tiltWrap.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0)';
    card.style.setProperty('--shine-x','50%');
    card.style.setProperty('--shine-y','50%');
  });

  // Download
  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Rendering…';
    try {
      const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${nameInput.value || 'RE_Member'}.png`;
      a.click();
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download PNG';
    }
  });
});
