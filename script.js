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

  // Update name
  nameInput.addEventListener("input", () => {
    cardName.textContent = nameInput.value.trim() || "LALA";
  });

  // Change font
  fontSelect.addEventListener("change", () => {
    card.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  });

  // Upload photo
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

  // Upload background image
  bgInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      scene.dataset.bg = r.result;
      updateSceneBackground(r.result);
      bgOk.hidden = false;
    };
    r.readAsDataURL(f);
  });

  // Update background blend
  function updateSceneBackground(imageURL) {
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--scene-accent") ||
      "rgba(90,120,255,.18)";
    scene.style.background = `
      radial-gradient(800px 420px at 62% 10%, ${accent.trim()}, transparent 60%),
      url('${imageURL}') center/cover no-repeat,
      #070a12`;
  }

  // Theme buttons logic
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;

      // Remove all old theme classes
      card.classList.remove(
        "theme-aqua","theme-emerald","theme-gold","theme-sunset",
        "theme-violet","theme-neon","theme-rose","theme-silver",
        "theme-black","theme-crimson"
      );

      // Apply new card theme
      card.classList.add(`theme-${theme}`);

      // Apply readable text color
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

      // Apply background glow
      const glow = {
        black: "rgba(180,180,200,.18)",
        silver: "rgba(255,255,255,.30)",
        gold: "rgba(255,210,120,.30)",
        aqua: "rgba(70,180,255,.28)",
        violet: "rgba(160,120,255,.28)",
        neon: "rgba(120,170,255,.30)",
        emerald: "rgba(60,220,170,.28)",
        crimson: "rgba(255,120,120,.30)",
        rose: "rgba(255,145,190,.30)",
        sunset: "rgba(255,160,110,.30)",
      };

      const glowColor = glow[theme] || "rgba(150,160,200,.18)";
      document.documentElement.style.setProperty("--scene-accent", glowColor);

      const bg = scene.dataset.bg;
      if (bg) updateSceneBackground(bg);
      else
        scene.style.background = `radial-gradient(800px 420px at 62% 10%, ${glowColor}, transparent 60%), #070a12`;
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
    scene.style.background =
      "radial-gradient(800px 420px at 62% 10%, rgba(90,120,255,.15), transparent 60%), #070a12";
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

  // Download PNG + show Share button
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

  // Share button (X / Twitter)
  shareBtn.addEventListener("click", () => {
    const shareText = `Just generated my RE 3D MEMBER CARD\nYou can make your own card here: https://re-3d-member-card-generator.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
