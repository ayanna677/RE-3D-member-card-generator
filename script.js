document.addEventListener("DOMContentLoaded", function() {
  const nameInput = document.getElementById('nameInput');
  const fontSelect = document.getElementById('fontSelect');
  const photoInput = document.getElementById('photoInput');
  const photoOk = document.getElementById('photoOk');
  const bgInput = document.getElementById('bgInput');
  const bgOk = document.getElementById('bgOk');
  const resetBtn = document.getElementById('resetBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareBtn = document.getElementById('shareBtn');

  const card = document.getElementById('card');
  const cardName = document.getElementById('cardName');
  const avatarImg = document.getElementById('avatarImg');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const tiltWrap = document.getElementById('tiltWrap');
  const scene = document.body;

  // Live name
  nameInput.addEventListener('input', () => {
    cardName.textContent = nameInput.value.trim() || 'LALA';
  });

  // Font switch
  fontSelect.addEventListener('change', () => {
    card.style.fontFamily = `'${fontSelect.value}', system-ui, sans-serif`;
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

  // Background upload (page)
  bgInput.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageURL = reader.result;
      scene.dataset.bg = imageURL;
      updateSceneBackground(imageURL);
      bgOk.hidden = false;
    };
    reader.readAsDataURL(f);
  });

  function updateSceneBackground(imageURL) {
    scene.style.background = `
      radial-gradient(800px 420px at 62% 10%, var(--scene-accent, rgba(90,120,255,.18)), transparent 60%),
      url('${imageURL}') center/cover no-repeat, #070a12
    `;
  }

  // Theme switching
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      scene.className = `scene theme-${theme}`;

      // readable text on light themes
      const lightThemes = ['silver','gold'];
      card.querySelectorAll('.main-title, .sub-title, .name, .role').forEach(el=>{
        if (lightThemes.includes(theme)) { el.style.color = '#111'; el.style.textShadow = 'none'; }
        else { el.style.color = '#fff'; el.style.textShadow = '0 2px 8px rgba(0,0,0,.4)'; }
      });

      // page glow color
      const glow = {
        black:'rgba(180,180,200,.18)', silver:'rgba(255,255,255,.30)', gold:'rgba(255,210,120,.30)',
        aqua:'rgba(70,180,255,.28)',  violet:'rgba(160,120,255,.28)', neon:'rgba(120,170,255,.30)',
        emerald:'rgba(60,220,170,.28)', crimson:'rgba(255,120,120,.30)', rose:'rgba(255,145,190,.30)',
        sunset:'rgba(255,160,110,.30)'
      };
      document.documentElement.style.setProperty('--scene-accent', glow[theme] || 'rgba(150,160,200,.18)');

      // keep uploaded background
      const bg = scene.dataset.bg;
      if (bg) updateSceneBackground(bg);
    });
  });

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
    scene.className = 'scene theme-black';
    document.documentElement.style.setProperty('--scene-accent','rgba(150,160,200,.18)');
    scene.style.background = 'radial-gradient(800px 420px at 62% 10%, rgba(90,120,255,.15), transparent 60%), #070a12';

    // hide share again
    shareBtn.hidden = true;
  });

  // 3D tilt + brushed position
  let rect = null;
  function updateRect(){ rect = tiltWrap.getBoundingClientRect(); }
  updateRect();
  window.addEventListener('resize', updateRect);

  tiltWrap.addEventListener('mousemove', e => {
    if (!rect) return;
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / (rect.width/2);
    const dy = (e.clientY - cy) / (rect.height/2);
    const max = 12;

    card.style.transform = `rotateX(${(-dy*max).toFixed(2)}deg) rotateY(${(dx*max).toFixed(2)}deg)`;

    // move brushed reflection
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

  // Download → reveal Share button
  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Rendering…';
    try {
      const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${nameInput.value || 'RE_Member'}.png`;
      a.click();

      // show Share button after successful generation
      shareBtn.hidden = false;
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download PNG';
    }
  });

  // Share on X (Twitter) — opens intent with your text + link
  shareBtn.addEventListener('click', () => {
    const shareText = "Just generated my re  3d member card join the re community then my site link https://re-3d-member-card-generator.vercel.app/";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});
