document.addEventListener("DOMContentLoaded", () => {
  const nameInput   = document.getElementById("nameInput");
  const fontSelect  = document.getElementById("fontSelect");
  const photoInput  = document.getElementById("photoInput");
  const photoOk     = document.getElementById("photoOk");
  const cardBgInput = document.getElementById("cardBgInput");
  const cardBgOk    = document.getElementById("cardBgOk");
  const resetBtn    = document.getElementById("resetBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn    = document.getElementById("shareBtn");

  const card        = document.getElementById("card");
  const cardBg      = document.getElementById("cardBg");
  const cardName    = document.getElementById("cardName");
  const avatarImg   = document.getElementById("avatarImg");
  const placeholder = document.getElementById("photoPlaceholder");
  const tiltWrap    = document.getElementById("tiltWrap");

  const THEMES = ["default","black","silver","gold","aqua","violet","neon","emerald","crimson","rose","sunset"];

  const applyTheme = (theme) => {
    // update card class
    card.className = `card theme-${theme}`;
    // sync body background (remove previous theme- classes)
    document.body.classList.remove(...THEMES.map(t => `theme-${t}`));
    document.body.classList.add(`theme-${theme}`);

    // light themes: adjust text contrast on the card
    const isLight = (theme === "silver" || theme === "gold");
    card.querySelectorAll(".main-title,.sub-title,.name,.role").forEach(el => {
      el.style.color = isLight ? "#111" : "#fff";
      el.style.textShadow = isLight ? "none" : "0 2px 6px rgba(0,0,0,.45)";
    });
  };

  // name change
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // font change
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // photo upload
  photoInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      avatarImg.src = r.result;
      avatarImg.style.objectFit = "contain";
      avatarImg.style.mixBlendMode = "lighten";
      placeholder.style.opacity = "0";
      photoOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // inside-card background upload
  cardBgInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      cardBg.style.backgroundImage = `url('${r.result}')`;
      cardBg.style.opacity = "1";
      cardBgOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // theme buttons
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.theme);
    });
  });

  // reset
  resetBtn.addEventListener("click", () => {
    nameInput.value = "LALA"; cardName.textContent = "LALA";
    fontSelect.value = "Poppins"; card.style.fontFamily = "";
    photoInput.value = ""; photoOk.hidden = true; placeholder.style.opacity = "1";
    avatarImg.src = "https://api.dicebear.com/9.x/identicon/svg?seed=RE";
    cardBgInput.value = ""; cardBgOk.hidden = true; cardBg.style.backgroundImage = ""; cardBg.style.opacity = "0";
    applyTheme("default");
    shareBtn.hidden = true;
  });

  // 3D tilt
  let rect = null; const recalc = () => rect = tiltWrap.getBoundingClientRect(); recalc();
  addEventListener("resize", recalc);
  tiltWrap.addEventListener("mousemove", (e) => {
    if (!rect) return;
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / (rect.width/2);
    const dy = (e.clientY - cy) / (rect.height/2);
    card.style.transform = `rotateX(${(-dy*12).toFixed(2)}deg) rotateY(${(dx*12).toFixed(2)}deg)`;
  });
  tiltWrap.addEventListener("mouseleave", () => { card.style.transform = "rotateX(0) rotateY(0)"; });

  // download + share
  downloadBtn.addEventListener("click", async () => {
    downloadBtn.disabled = true; downloadBtn.textContent = "Rendering…";
    try{
      const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${nameInput.value || "RE_Member"}.png`;
      a.click();
      shareBtn.hidden = false;
    } finally {
      downloadBtn.disabled = false; downloadBtn.textContent = "Download PNG";
    }
  });

  shareBtn.addEventListener("click", () => {
    const text = `Just generated my RE 3D MEMBER CARD\nYou can make your own card here: https://re-3d-member-card-generator.vercel.app/`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
// put near the top of script.js
const THEMES = ["default","black","silver","gold","aqua","violet","neon","emerald","crimson","rose","sunset"];

function applyTheme(theme){
  // 1) card theme
  card.className = `card theme-${theme}`;

  // 2) page background sync
  document.body.classList.remove(...THEMES.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${theme}`);

  // 3) readable text on light cards
  const isLight = (theme === "silver" || theme === "gold");
  card.querySelectorAll(".main-title,.sub-title,.name,.role").forEach(el=>{
    el.style.color = isLight ? "#111" : "#fff";
    el.style.textShadow = isLight ? "none" : "0 2px 6px rgba(0,0,0,.45)";
  });
}

// hook buttons (unchanged)
document.querySelectorAll(".theme-btn").forEach(btn=>{
  btn.addEventListener("click", ()=> applyTheme(btn.dataset.theme));
});

  // initial state
  applyTheme("default");
});
