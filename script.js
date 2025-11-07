document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("nameInput");
  const fontSelect = document.getElementById("fontSelect");
  const photoInput = document.getElementById("photoInput");
  const photoOk = document.getElementById("photoOk");
  const bgInput = document.getElementById("bgInput");
  const bgOk = document.getElementById("bgOk");
  const resetBtn = document.getElementById("resetBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");

  const card = document.getElementById("card");
  const cardName = document.getElementById("cardName");
  const avatarImg = document.getElementById("avatarImg");
  const photoPlaceholder = document.getElementById("photoPlaceholder");
  const tiltWrap = document.getElementById("tiltWrap");
  const scene = document.body;

  // Default theme setup
  document.documentElement.style.setProperty("--scene-accent", "rgba(120,120,120,.15)");
  scene.style.background = `radial-gradient(900px 600px at 60% 10%, rgba(120,120,120,.15), transparent 60%), #0d0d0d`;

  // Update card name
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // Font selector
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // Upload avatar / logo
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

  // Upload background image for the page
  bgInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageURL = reader.result;
      scene.dataset.bg = imageURL;
      updateBackgroundGlow(imageURL);
      bgOk.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  // Update page background with current accent
  function updateBackgroundGlow(imageURL) {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--scene-accent")
      .trim();
    scene.style.background = `
      radial-gradient(900px 600px at 60% 10%, ${accent}, transparent 65%),
      ${imageURL ? `url('${imageURL}') center/cover no-repeat,` : ""}
      #0d0d0d`;
  }

  // RE glow colors for each theme
  const glowMap = {
    titanium: "rgba(160,160,160,.22)",
    silver: "rgba(240,240,255,.28)",
    gold: "rgba(255,230,150,.3)",
    aqua: "rgba(120,190,255,.28)",
    emerald: "rgba(90,255,190,.25)",
    violet: "rgba(200,150,255,.25)",
    rose: "rgba(255,170,190,.28)",
    crimson: "rgba(255,120,120,.3)",
    sunset: "rgba(255,180,120,.3)",
    neon: "rgba(120,180,255,.3)",
    default: "rgba(120,120,120,.18)"
  };

  // Apply color theme to card
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;

      // Remove old card themes
      card.className = "card";

      // Add new one
      card.classList.add(`theme-${theme}`);

      // Set accent glow for background
      const glowColor = glowMap[theme] || glowMap.default;
      document.documentElement.style.setProperty("--scene-accent", glowColor);

      // Update glow on the page
      const bg = scene.dataset.bg;
      updateBackgroundGlow(bg || null);

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

  // Reset everything
  resetBtn.addEventListener("click", () => {
    nameInput.value = "LALA";
    cardName.textContent = "LALA";
    fontSelect.value = "Poppins";
    photoInput.value = "";
    bgInput.value = "";
    photoOk.hidden = true;
    bgOk.hidden = true;
    avatarImg.src = "https://api.dicebear.com/9.x/identicon/svg?seed=RE";
    avatarImg.style.objectFit = "contain";
    avatarImg.style.mixBlendMode = "lighten";
    photoPlaceholder.style.opacity = "1";
    delete scene.dataset.bg;

    card.className = "card theme-default";
    document.documentElement.style.setProperty("--scene-accent", "rgba(120,120,120,.15)");
    updateBackgroundGlow(null);
    shareBtn.hidden = true;
  });

  // 3D tilt
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

  // Download + reveal Share button
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

  // Share on Twitter
  shareBtn.addEventListener("click", () => {
    const shareText = `Just generated my RE 3D MEMBER CARD\nYou can make your own card here: https://re-3d-member-card-generator.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
