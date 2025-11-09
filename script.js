window.addEventListener("load", () => {
  console.log("✅ JS Loaded"); // check in console to confirm script runs

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

 const THEMES = [
  "default","black","silver","gold","aqua","violet","neon","emerald","crimson","rose","sunset",
  "gojo","sakura","zenitsu","tanjiro","rinnegan",
  "ashstone","moonrock","pearlgray"
];

  function applyTheme(theme) {
  // 1️⃣ Update card class
  card.className = `card theme-${theme}`;

  // 2️⃣ Sync body background
  document.body.classList.remove(...THEMES.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${theme}`);

  // 3️⃣ Detect if light theme (for better contrast)
  const isLight = theme === "silver" || theme === "gold";

  // 4️⃣ Set text color & shadow contrast
  card.querySelectorAll(".main-title, .sub-title, .name, .role").forEach(el => {
    el.style.color = isLight ? "#111" : "#fff";
    el.style.textShadow = isLight ? "none" : "0 2px 6px rgba(0,0,0,.45)";
  });

  // 5️⃣ Optional: adjust avatar ring color for light themes
  const avatarFrame = document.querySelector(".avatar-frame");
  if (avatarFrame) {
    avatarFrame.style.boxShadow = isLight
      ? "inset 0 0 0 2px rgba(0,0,0,0.2)"
      : "inset 0 0 0 2px rgba(255,255,255,0.15)";
  }
}

  // Name
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // Font
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // Photo upload
  photoInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      avatarImg.src = r.result;
      placeholder.style.opacity = "0";
      photoOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // Card background
  cardBgInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      cardBg.style.backgroundImage = `url('${r.result}')`;
      cardBg.style.opacity = "1";
      cardBgOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // Theme buttons
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    nameInput.value = "LALA";
    cardName.textContent = "LALA";
    fontSelect.value = "Poppins";
    card.style.fontFamily = "";
    photoInput.value = "";
    photoOk.hidden = true;
    placeholder.style.opacity = "1";
    avatarImg.src = "https://api.dicebear.com/9.x/identicon/svg?seed=RE";
    cardBgInput.value = "";
    cardBgOk.hidden = true;
    cardBg.style.backgroundImage = "";
    cardBg.style.opacity = "0";
    applyTheme("default");
    shareBtn.hidden = true;
  });

  // 3D tilt
  let rect = null;
  const recalc = () => rect = tiltWrap.getBoundingClientRect();
  recalc();
  addEventListener("resize", recalc);

  tiltWrap.addEventListener("mousemove", (e) => {
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `rotateX(${(-dy * 12).toFixed(2)}deg) rotateY(${(dx * 12).toFixed(2)}deg)`;
  });

  tiltWrap.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });

  // Download + Share
  downloadBtn.addEventListener("click", async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = "Rendering…";
    try {
      const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${nameInput.value || "RE_Member"}.png`;
      a.click();
      shareBtn.hidden = false;
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = "Download PNG";
    }
  });

  shareBtn.addEventListener("click", () => {
    const text = `Just generated my RE 3D MEMBER CARD\nYou can make your own card here: https://re-3d-member-card-generator.vercel.app/`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  // Start with default theme
  applyTheme("default");
  
  // 🆕 XP Level System
  const levelInput = document.getElementById("levelInput");
  const xpFill = document.querySelector(".xp-fill");
  const rank = document.querySelector(".rank");

  const rankBadge = document.querySelector(".rank-badge");
  
  levelInput.addEventListener("input", () => {
    const level = parseInt(levelInput.value) || 1;
    const percent = Math.min(level * 10, 100);
    xpFill.style.width = `${percent}%`;
    rank.textContent = `LEVEL ${level}`;
    
    // ✨ Trigger level-up animation
    rank.classList.remove("level-up");
    void rank.offsetWidth; // restart animation
    rank.classList.add("level-up");
    
    // 🏅 Auto badge update based on level
    rankBadge.classList.remove("newbie", "pro", "elite");
    
    if (level < 5) {
      rankBadge.textContent = "NEWBIE";
      rankBadge.classList.add("newbie");
    } else if (level < 8) {
      rankBadge.textContent = "PRO";
      rankBadge.classList.add("pro");
    } else {
      rankBadge.textContent = "ELITE";
      rankBadge.classList.add("elite");
    }
  });
