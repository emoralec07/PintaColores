// Estado

let currentPalette = [];
let savedPalettes = [];

// Referencias DOM

const paletteEl = document.getElementById("palette");
const favoritesEl = document.getElementById("favorites");
const toastEl = document.getElementById("toast");

// Iniciar con una paleta

generatePalette();

// Generar color HEX aleatorio

function randomHex() {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return "#" + hex.padStart(6, "0");
}

// Convertir HEX a RGB

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// Generar paleta de 5 colores

function generatePalette() {
  currentPalette = Array.from({ length: 5 }, randomHex);
  renderPalette();
}

// Renderizar paleta actual

function renderPalette() {
  paletteEl.innerHTML = currentPalette
    .map(
      (hex) => `
      <div class="color-card" onclick="copyColor('${hex}')">
        <div class="color-swatch" style="background: ${hex};"></div>
        <div class="color-info">
          <div class="color-hex">${hex.toUpperCase()}</div>
          <div class="color-rgb">${hexToRgb(hex)}</div>
          <div class="copy-label">Clic para copiar</div>
        </div>
      </div>
    `,
    )
    .join("");
}

// Copiar color al portapapeles

navigator.clipboard.writeText(hex.toUpperCase()).then(() => {
  showToast(`¡Copiado: ${hex.toUpperCase()}!`);
});

// Mostrar toast

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2000);
}

// Guardar paleta favorita

function savePalette() {
  if (currentPalette.length === 0) return;

  // Evitar duplicados exactos

  const alreadySaved = savedPalettes.some(
    (p) => p.join() === currentPalette.join(),
  );
  if (alreadySaved) {
    showToast("Esta paleta ya está guardada");
    return;
  }

  savedPalettes.push([...currentPalette]);
  renderFavorites();
  showToast("¡Paleta guardada! ⭐");
}

// Eliminar paleta favorita

function removePalette(index) {
  savedPalettes.splice(index, 1);
  renderFavorites();
}

// Cargar paleta guardada como actual

currentPalette = [...savedPalettes[index]];
renderPalette();
window.scrollTo({ top: 0, behavior: "smooth" });
showToast("Paleta cargada ✓");

// Renderizar favoritos

function renderFavorites() {
  if (savedPalettes.length === 0) {
    favoritesEl.innerHTML =
      '<p class="empty">Aún no tienes paletas guardadas.</p>';
    return;
  }

  favoritesEl.innerHTML = savedPalettes
    .map(
      (palette, i) => `
      <div class="favorite-item">
        <div class="favorite-header">
          <span class="favorite-label">Paleta ${i + 1}</span>
          <div style="display:flex; gap:6px;">
            <button class="btn-sm" onclick="loadPalette(${i})">Cargar</button>
            <button class="btn-sm" onclick="removePalette(${i})">✕ Eliminar</button>
          </div>
        </div>
        <div class="favorite-palette">
          ${palette
            .map(
              (hex) => `
            <div class="favorite-color"
              style="background: ${hex};"
              onclick="copyColor('${hex}')"
              title="${hex.toUpperCase()}">
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `,
    )
    .join("");
}
