document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const fontSelect = document.getElementById("fontSelect");
  const photoInput = document.getElementById("photoInput");
  const photoOk = document.getElementById("photoOk");
  const cardBgInput = document.getElementById("cardBgInput");
  const cardBgOk = document.getElementById("cardBgOk");
  const resetBtn = document.getElementById("resetBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");

  const card = document.getElementById("card");
  const cardBg = document.getElementById("cardBg");
  const cardName = document.getElementById("cardName");
  const avatarImg = document.getElementById("avatarImg");
  const placeholder = document.getElementById("photoPlaceholder");
  const tiltWrap = document.getElementById("tiltWrap");

  // Accent colors for glow & background sync
  const glowMap = {
    default: "rgba(120,120,120,.18)",
    black: "rgba(180,180,200,.22)",
    silver: "rgba(255,255,255,.28)",
    gold: "rgba(255,230,150,.28)",
    aqua: "rgba(120,190,255,.28)",
    violet: "rgba(200,150,255,.26)",
    neon: "rgba(140,170,255,.30)",
    emerald: "rgba(90,255,190,.26)",
    crimson: "rgba(255,120,120,.30)",
    rose: "rgba(255,170,190,.30)",
    sunset: "rgba(255,180,120,.30)"
  };

  const setTheme = (theme) => {
    document.body.className = `theme-${theme}`;
    const accent = glowMap[theme] || glowMap.default;
    document.documentElement.style.setProperty("--accent", accent);
  };

  // === Name ===
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // === Font ===
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // === Photo Upload ===
  photoInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
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

  // === Card Background Upload ===
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

  // === Theme Buttons ===
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      card.className = `card theme-${theme}`;
      setTheme(theme);

      // Text contrast fix for light cards
      const isLight = (theme === "silver" || theme === "gold");
      card.querySelectorAll(".main-title,.sub-title,.name,.role").forEach(el => {
        el.style.color = isLight ? "#111" : "#fff";
        el.style.textShadow = isLight ? "none" : "0 2px 6px rgba(0,0,0,.45)";
      });
    });
  });

  // === Reset ===
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
    card.className = "card theme-default";
    setTheme("default");
    shareBtn.hidden = true;
  });

  // === 3D Tilt ===
  let rect = null;
  const updateRect = () => rect = tiltWrap.getBoundingClientRect();
  updateRect();
  window.addEventListener("resize", updateRect);

  tiltWrap.addEventListener("mousemove", e => {
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

  // === Download + Share ===
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
});
