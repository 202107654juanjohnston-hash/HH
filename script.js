
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Navegación de la carta
document.querySelector("#startBtn").addEventListener("click", () => {
  showScreen("message1");
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.next);
  });
});

// Respuesta afirmativa
document.querySelector("#yesBtn").addEventListener("click", () => {
  showScreen("happy");
  celebrate();
});

// Elementos del botón fugitivo
const noBtn = document.querySelector("#noBtn");
const yesBtn = document.querySelector("#yesBtn");
const buttonArea = document.querySelector("#buttonArea");
const hint = document.querySelector("#hint");

let escapes = 0;
let canEscape = true;

const noTexts = [
  "¡Uy, casi! 😂",
  "¡No me atrapas! 🏃",
  "Por aquí no 😈",
  "Demasiado lento 👀",
  "¡Última escapada! 💨"
];

function moveNoButton() {
  if (!canEscape) return;

  escapes++;

  const area = buttonArea.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const maxX = Math.max(0, area.width - btn.width - 8);
  const maxY = Math.max(0, area.height - btn.height - 8);

  const oldX = parseFloat(noBtn.style.left) || 0;
  const oldY = parseFloat(noBtn.style.top) || 0;

  let x = 0;
  let y = 0;
  let farthestDistance = -1;

  // Elige una posición lo más lejana posible.
  for (let i = 0; i < 30; i++) {
    const candidateX = Math.random() * maxX;
    const candidateY = Math.random() * maxY;

    const distance = Math.hypot(
      candidateX - oldX,
      candidateY - oldY
    );

    if (distance > farthestDistance) {
      farthestDistance = distance;
      x = candidateX;
      y = candidateY;
    }
  }

  noBtn.style.transition =
    "left 0.12s ease-out, top 0.12s ease-out, transform 0.12s";

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const rotation = Math.random() > 0.5 ? 16 : -16;

  noBtn.style.transform =
    `rotate(${rotation}deg) scale(0.88)`;

  noBtn.textContent =
    noTexts[Math.min(escapes - 1, noTexts.length - 1)];

  hint.textContent = `Intentos de atraparlo: ${escapes} 😂`;

  // El botón Sí crece un poquito.
  const scale = Math.min(1.15, 1 + escapes * 0.025);

  yesBtn.style.transform =
    `translateX(-50%) scale(${scale})`;

  window.setTimeout(() => {
    noBtn.style.transform = "rotate(0deg) scale(1)";
  }, 140);

  // Tras cinco escapadas, ambas opciones quedan disponibles.
  if (escapes >= 5) {
    canEscape = false;

    window.setTimeout(() => {
      noBtn.style.transition = "none";
      noBtn.style.left = "50%";
      noBtn.style.top = "175px";
      noBtn.style.transform = "translateX(-50%)";
      noBtn.textContent = "No, gracias";

      hint.textContent =
        "Ahora sí, elige lo que realmente sientes ❤️";
    }, 180);
  }
}

// En computadora, escapa cuando el cursor se acerca.
noBtn.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse" && canEscape) {
    moveNoButton();
  }
});

// En celulares, escapa al intentar tocarlo.
noBtn.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" && canEscape) {
    event.preventDefault();
    moveNoButton();
  }
});

// Si ya terminó de escapar, permite responder No.
noBtn.addEventListener("click", () => {
  if (!canEscape) {
    showScreen("noThanks");
  } else {
    moveNoButton();
  }
});

// Corazones flotantes de fondo
const heartsContainer = document.querySelector("#floatingHearts");
const heartSymbols = ["❤️", "💕", "💗", "💖", "🌸"];

function createHeart() {
  if (document.hidden) return;

  const heart = document.createElement("span");

  heart.className = "floating-heart";
  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 16}px`;
  heart.style.animationDuration = `${6 + Math.random() * 4}s`;

  heartsContainer.appendChild(heart);

  heart.addEventListener("animationend", () => {
    heart.remove();
  });
}

window.setInterval(createHeart, 850);

// Pequeña celebración al aceptar hablar.
function celebrate() {
  for (let i = 0; i < 18; i++) {
    window.setTimeout(createHeart, i * 100);
  }
}
