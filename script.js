document.addEventListener("DOMContentLoaded", function () {
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
  const cardName = document.getElementById("cardName");
  const avatarImg = document.getElementById("avatarImg");
  const photoPlaceholder = document.getElementById("photoPlaceholder");
  const tiltWrap = document.getElementById("tiltWrap");
  const scene = document.body;
  const cardBg = document.getElementById("cardBg");

  // Default background glow
  document.documentElement.style.setProperty("--scene-accent", "rgba(120,120,120,.15)");
  scene.style.background = `radial-gradient(900px 600px at 60% 10%, rgba(120,120,120,.15), transparent 60%), #0d0d0d`;

  // Update name
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // Font selector
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // Upload logo/photo
  photoInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      avatarImg.src = reader.result;
      avatarImg.style.objectFit = "contain";
      avatarImg.style.mixBlendMode = "lighten";
      photoPlaceholder.style.opacity = "0";
      photoOk.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  // Upload card background (inside card only)
  cardBgInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      cardBg.style.backgroundImage = `url('${url}')`;
      cardBg.style.opacity = "1";
      cardBgOk.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  // Glow color map
  const glowMap = {
    black: "rgba(180,180,200,.20)",
    silver: "rgba(255,255,255,.25)",
    gold: "rgba(255,230,150,.3)",
    aqua: "rgba(120,190,255,.28)",
    violet: "rgba(200,150,255,.25)",
    neon: "rgba(120,180,255,.3)",
    emerald: "rgba(90,255,190,.25)",
    crimson: "rgba(255,120,120,.3)",
    rose: "rgba(255,170,190,.28)",
    sunset: "rgba(255,180,120,.3)",
    default: "rgba(120,120,120,.18)",
  };

  // Apply theme colors
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;

      // Remove old themes
      card.className = "card";
      // Add new one
      card.classList.add(`theme-${theme}`);

      // Update accent glow
      const glow = glowMap[theme] || glowMap.default;
      document.documentElement.style.setProperty("--scene-accent", glow);
      scene.style.background = `
        radial-gradient(900px 600px at 60% 10%, ${glow}, transparent 60%), #0d0d0d`;

      // Adjust text color for visibility
      const lightThemes = ["gold", "silver"];
      card.querySelectorAll(".main-title, .sub-title, .name, .role").forEach((el) => {
        if (lightThemes.includes(theme)) {
          el.style.color = "#111";
          el.style.textShadow = "none";
        } else {
          el.style.color = "#fff";
          el.style.textShadow = "0 2px 8px rgba(0,0,0,.4)";
        }
      });
    });
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    nameInput.value = "LALA";
    cardName.textContent = "LALA";
    fontSelect.value = "Poppins";
    photoInput.value = "";
    cardBgInput.value = "";
    photoOk.hidden = true;
    cardBgOk.hidden = true;
    avatarImg.src = "https://api.dicebear.com/9.x/identicon/svg?seed=RE";
    avatarImg.style.mixBlendMode = "lighten";
    photoPlaceholder.style.opacity = "1";
    cardBg.style.backgroundImage = "";

    card.className = "card theme-default";
    document.documentElement.style.setProperty("--scene-accent", "rgba(120,120,120,.15)");
    scene.style.background = `radial-gradient(900px 600px at 60% 10%, rgba(120,120,120,.15), transparent 60%), #0d0d0d`;
    shareBtn.hidden = true;
  });

  // 3D Tilt
  let rect = null;
  function updateRect() {
    rect = tiltWrap.getBoundingClientRect();
  }
  updateRect();
  window.addEventListener("resize", updateRect);

  tiltWrap.addEventListener("mousemove", (e) => {
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const max = 12;
    card.style.transform = `rotateX(${(-dy * max).toFixed(2)}deg) rotateY(${(dx * max).toFixed(2)}deg)`;
  });
  tiltWrap.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });

  // Download PNG + Show Share
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

  // Share on X
  shareBtn.addEventListener("click", () => {
    const text = `Just generated my RE 3D MEMBER CARD\nYou can make your own card here: https://re-3d-member-card-generator.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
