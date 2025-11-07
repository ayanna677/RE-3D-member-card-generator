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

  // Live update name
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // Font style
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // Upload photo / logo
  photoInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      avatarImg.src = r.result;
      avatarImg.style.objectFit = "contain";
      avatarImg.style.mixBlendMode = "lighten";
      photoPlaceholder.style.opacity = "0";
      photoOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // Upload background
  bgInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const imageURL = r.result;
      scene.dataset.bg = imageURL;
      updateSceneBackground(imageURL);
      bgOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // Update scene background (with optional image)
  function updateSceneBackground(imageURL) {
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--scene-accent").trim() ||
      "rgba(90,120,255,.18)";
    scene.style.background = `
      radial-gradient(1000px 600px at 60% 10%, ${accent}, transparent 65%),
      ${imageURL ? `url('${imageURL}') center/cover no-repeat,` : ""}
      #070a12`;
  }

  // Glow color mapping
  const glowMap = {
    black: "rgba(180,180,200,.20)",
    silver: "rgba(255,255,255,.32)",
    gold: "rgba(255,210,120,.30)",
    aqua: "rgba(90,160,255,.30)",
    violet: "rgba(170,130,255,.28)",
    neon: "rgba(120,170,255,.30)",
    emerald: "rgba(90,255,190,.28)",
    crimson: "rgba(255,110,110,.30)",
    rose: "rgba(255,155,200,.30)",
    sunset: "rgba(255,160,110,.30)"
  };

  // Apply theme to card + sync background
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;

      // remove old themes
      card.classList.remove(
        "theme-aqua", "theme-emerald", "theme-gold", "theme-sunset",
        "theme-violet", "theme-neon", "theme-rose", "theme-silver",
        "theme-black", "theme-crimson"
      );

      // add new card theme
      card.classList.add(`theme-${theme}`);

      // update glow color to match theme
      const glowColor = glowMap[theme] || "rgba(150,160,200,.18)";
      document.documentElement.style.setProperty("--scene-accent", glowColor);

      // fix text color contrast for light themes
      const lightThemes = ["silver", "gold"];
      card.querySelectorAll(".main-title, .sub-title, .name, .role").forEach((el) => {
        if (lightThemes.includes(theme)) {
          el.style.color = "#111";
          el.style.textShadow = "none";
        } else {
          el.style.color = "#fff";
          el.style.textShadow = "0 2px 8px rgba(0,0,0,.4)";
        }
      });

      // sync background (apply glow + image)
      const bg = scene.dataset.bg;
      updateSceneBackground(bg || null);
    });
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    nameInput.value = "LALA";
    cardName.textContent = "LALA";
    fontSelect.value = "Poppins";
    card.style.fontFamily = "";
    photoInput.value = "";
    photoOk.hidden = true;
    avatarImg.src = "https://api.dicebear.com/9.x/identicon/svg?seed=RE";
    avatarImg.style.objectFit = "contain";
    avatarImg.style.mixBlendMode = "lighten";
    photoPlaceholder.style.opacity = "1";
    bgInput.value = "";
    bgOk.hidden = true;
    delete scene.dataset.bg;

    card.className = "card theme-black";
    scene.className = "scene theme-black";

    document.documentElement.style.setProperty("--scene-accent", "rgba(150,160,200,.18)");
    updateSceneBackground(null);
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

  // Download card + reveal share button
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

  // Share on X (Twitter)
  shareBtn.addEventListener("click", () => {
    const shareText = `Just generated my RE 3D MEMBER CARD\nYou can make your own card here: https://re-3d-member-card-generator.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
