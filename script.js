// 🎨 UI Elements
const ui = {
  name: document.querySelector("#nameInput"),
  font: document.querySelector("#fontSelect"),
  photo: document.querySelector("#photoInput"),
  photoNote: document.querySelector("#photoOk"),
  bg: document.querySelector("#bgInput"),
  bgNote: document.querySelector("#bgOk"),
  reset: document.querySelector("#resetBtn"),
  download: document.querySelector("#downloadBtn"),
};

// 💳 Card Elements
const card = document.querySelector("#card");
const cardName = document.querySelector("#cardName");
const avatar = document.querySelector("#avatarImg");
const placeholder = document.querySelector("#photoPlaceholder");
const tilt = document.querySelector("#tiltWrap");

// ✏️ Update name
ui.name.addEventListener("input", () => {
  cardName.textContent = ui.name.value.trim() || "LALA";
});

// 🆎 Font style switch
ui.font.addEventListener("change", () => {
  card.style.fontFamily = `'${ui.font.value}', system-ui`;
});

// 🖼️ Upload member photo / logo
ui.photo.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    avatar.src = reader.result;
    placeholder.style.opacity = "0";
    ui.photoNote.hidden = false;

    // Detect if it's likely a logo (transparent or small size)
    if (file.name.toLowerCase().includes("logo") || file.type.includes("png")) {
      avatar.style.objectFit = "contain";
      avatar.style.maxWidth = "80%";
      avatar.style.maxHeight = "80%";
      avatar.style.mixBlendMode = "lighten";
      avatar.style.filter = "drop-shadow(0 0 10px rgba(255,255,255,.2))";
    } else {
      avatar.style.objectFit = "cover";
      avatar.style.mixBlendMode = "normal";
      avatar.style.filter = "none";
    }
  };
  reader.readAsDataURL(file);
});

// 🌅 Upload background
ui.bg.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    card.style.backgroundImage = `url('${reader.result}')`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.style.backgroundBlendMode = "overlay";
    ui.bgNote.hidden = false;
  };
  reader.readAsDataURL(file);
});

// 🌈 Theme switching
document.querySelectorAll(".theme-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    const allThemes = [
      "theme-aqua","theme-emerald","theme-gold","theme-sunset",
      "theme-violet","theme-neon","theme-rose","theme-silver",
      "theme-black","theme-crimson"
    ];

    card.classList.remove(...allThemes);
    document.body.classList.remove(...allThemes);
    card.classList.add(`theme-${theme}`);
    document.body.classList.add(`theme-${theme}`);

    card.animate([{opacity:0.8},{opacity:1}],{duration:300,fill:"forwards"});
    card.style.backgroundImage = "none";
  });
});

// 🔁 Reset everything
ui.reset.addEventListener("click", () => {
  ui.name.value = "LALA";
  ui.font.value = "Poppins";
  ui.photo.value = "";
  ui.bg.value = "";
  ui.photoNote.hidden = true;
  ui.bgNote.hidden = true;
  placeholder.style.opacity = "1";

  cardName.textContent = "LALA";
  avatar.src = "https://api.dicebear.com/9.x/identicon/svg?seed=RE";
  avatar.style = `
    object-fit: contain;
    max-width: 80%;
    max-height: 80%;
    mix-blend-mode: lighten;
    background: transparent;
  `;

  card.style.backgroundImage = "none";
  card.className = "card theme-aqua";
  document.body.className = "theme-aqua";

  card.animate([{transform:"scale(0.98)"},{transform:"scale(1)"}],{duration:200});
});

// 🌀 Smooth 3D tilt effect
let rect;
function updateRect() { rect = tilt.getBoundingClientRect(); }
updateRect();
window.addEventListener("resize", updateRect);

tilt.addEventListener("mousemove", e => {
  if (!rect) return;
  const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  const rotate = 10;
  card.style.transform = `rotateX(${(-y * rotate).toFixed(2)}deg) rotateY(${(x * rotate).toFixed(2)}deg)`;
});
tilt.addEventListener("mouseleave", () => {
  card.style.transform = "rotateX(0) rotateY(0)";
});

// 📸 Download card as PNG
ui.download.addEventListener("click", async () => {
  ui.download.disabled = true;
  ui.download.textContent = "Saving…";

  try {
    const prevShadow = card.style.boxShadow;
    card.style.boxShadow = "none";

    const canvas = await html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
    card.style.boxShadow = prevShadow;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${ui.name.value || "RE_Member"}.png`;
    link.click();

    ui.download.textContent = "Downloaded ✓";
    setTimeout(() => (ui.download.textContent = "Download as PNG"), 1000);
  } catch (err) {
    alert("Error creating image. Try again.");
    console.error(err);
  } finally {
    ui.download.disabled = false;
  }
});
