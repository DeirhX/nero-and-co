/* Nero & Co. — After Dark: one room, many scenes 🌙 */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.getElementById("stage");
const scenes = [...document.querySelectorAll(".scene")];
const dotsWrap = document.getElementById("dots");

/* ---------- scene switching ---------- */

let current = 0;
let busy = false;

scenes.forEach((scene, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " is-active" : "");
  dot.dataset.title = scene.dataset.title;
  dot.setAttribute("aria-label", scene.dataset.title);
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.children];

function goTo(n) {
  if (busy || n === current || n < 0 || n >= scenes.length) return;
  busy = true;
  scenes[current].classList.remove("is-active");
  scenes[n].classList.add("is-active");
  dots[current].classList.remove("is-active");
  dots[n].classList.add("is-active");
  current = n;
  stage.dataset.scene = n;
  setTimeout(() => (busy = false), reducedMotion ? 50 : 900);
}

/* wheel */
let wheelLock = false;
window.addEventListener(
  "wheel",
  (e) => {
    if (wheelLock || Math.abs(e.deltaY) < 12) return;
    wheelLock = true;
    goTo(current + (e.deltaY > 0 ? 1 : -1));
    setTimeout(() => (wheelLock = false), 1100);
  },
  { passive: true }
);

/* keys */
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (["ArrowDown", "Down", "PageDown", " "].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
  else if (["ArrowUp", "Up", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
  else if (e.key === "Home") goTo(0);
  else if (e.key === "End") goTo(scenes.length - 1);
});

/* touch swipe */
let touchY = null;
window.addEventListener("touchstart", (e) => (touchY = e.touches[0].clientY), { passive: true });
window.addEventListener(
  "touchend",
  (e) => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) goTo(current + (dy > 0 ? 1 : -1));
    touchY = null;
  },
  { passive: true }
);

/* ---------- fireflies ---------- */

const fireflies = document.getElementById("fireflies");
if (fireflies && !reducedMotion) {
  for (let i = 0; i < 22; i++) {
    const fly = document.createElement("span");
    fly.className = "fly";
    fly.style.left = `${Math.random() * 100}%`;
    fly.style.top = `${Math.random() * 100}%`;
    fly.style.setProperty("--dur", `${7 + Math.random() * 8}s`);
    fly.style.setProperty("--delay", `${Math.random() * 9}s`);
    fly.style.setProperty("--dx", `${(Math.random() - 0.5) * 120}px`);
    fly.style.setProperty("--dy", `${(Math.random() - 0.5) * 120}px`);
    fly.style.setProperty("--peak", `${0.4 + Math.random() * 0.5}`);
    fireflies.appendChild(fly);
  }
}

/* ---------- cursor glow + Nero's eyes ---------- */

const glow = document.getElementById("glow");
const nero = document.getElementById("nero");
const pupils = document.querySelectorAll("[data-pupil]");

if (!reducedMotion) {
  let raf = null;
  document.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
      if (nero) {
        const rect = nero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.35;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(dist / 60, 1);
        const px = (dx / dist) * 7 * reach;
        const py = (dy / dist) * 5 * reach;
        pupils.forEach((p) => (p.style.transform = `translate(${px}px, ${py}px)`));
      }
      raf = null;
    });
  });
}

/* ---------- blinking ---------- */

const eyes = document.querySelectorAll("[data-eye]");

function blink() {
  eyes.forEach((eye) => eye.classList.add("is-blinking"));
  setTimeout(() => eyes.forEach((eye) => eye.classList.remove("is-blinking")), 140);
  if (Math.random() < 0.25) {
    setTimeout(() => {
      eyes.forEach((eye) => eye.classList.add("is-blinking"));
      setTimeout(() => eyes.forEach((eye) => eye.classList.remove("is-blinking")), 140);
    }, 260);
  }
  setTimeout(blink, 2200 + Math.random() * 4200);
}
if (eyes.length && !reducedMotion) setTimeout(blink, 1800);

/* ---------- Nero speaks (night edition) ---------- */

const bubble = document.getElementById("bubble");
const meows = [
  "mrrp!",
  "the night shift begins.",
  "I can see you in the dark.",
  "purrrr…",
  "*slow blink* (that means I like you)",
  "websites with a soul. I checked personally.",
  "the moon is my desk lamp.",
  "mrrrOW! (translation: hire us)",
];
let bubbleTimer = null;
let meowIndex = Math.floor(Math.random() * meows.length);

if (nero && bubble) {
  nero.addEventListener("click", () => {
    meowIndex = (meowIndex + 1) % meows.length;
    bubble.textContent = meows[meowIndex];
    bubble.classList.add("is-visible");
    nero.classList.remove("is-happy");
    void nero.offsetWidth;
    nero.classList.add("is-happy");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove("is-visible"), 2400);
  });
}

/* ---------- the shapeshifter ---------- */

const themes = [
  {
    id: "bakery", label: "The corner bakery", tag: "warm, buttery, irresistible",
    url: "butterandcrumb.com", logo: "🥐", title: "Fresh out of the oven",
    cta: "Order pastries", cards: ["🥐", "🍞", "🎂"],
  },
  {
    id: "law", label: "The law firm", tag: "serious, sharp, spotless",
    url: "sterling-partners.legal", logo: "⚖️", title: "Counsel you can count on",
    cta: "Book a consultation", cards: ["📜", "🏛️", "🖋️"],
  },
  {
    id: "festival", label: "The music festival", tag: "loud, neon, alive",
    url: "neonwave.fest", logo: "⚡", title: "Three nights. Zero sleep.",
    cta: "Get tickets", cards: ["🎸", "🎧", "🔥"],
  },
  {
    id: "shop", label: "The e-shop", tag: "clean, quick, converting",
    url: "pawsome.store", logo: "🛍️", title: "Toys your cat will ignore",
    cta: "Add to cart", cards: ["🧶", "🐭", "📦"],
  },
  {
    id: "kids", label: "The kindergarten", tag: "bright, bouncy, joyful",
    url: "little-acorns.school", logo: "🌱", title: "Where little ideas grow",
    cta: "Come say hi!", cards: ["🎨", "🧸", "🌈"],
  },
  {
    id: "saas", label: "The tech startup", tag: "sleek, glassy, futuristic",
    url: "orbitmetrics.io", logo: "🛰️", title: "Your data, in orbit",
    cta: "Start free trial", cards: ["📈", "⚙️", "⚡"],
  },
  {
    id: "restaurant", label: "The restaurant", tag: "moody, elegant, delicious",
    url: "chez-nero.com", logo: "🕯️", title: "Dinner, elevated",
    cta: "Reserve a table", cards: ["🍷", "🦞", "🍰"],
  },
];

const carousel = document.getElementById("carousel");
const carTrack = document.getElementById("carTrack");
const showLabel = document.getElementById("showLabel");
const SHOW_SCENE = scenes.findIndex((s) => s.dataset.title === "Shapeshift");

const cards = [];
let carIndex = 0;
let carHover = false;
let dragging = false;
let typeTimer = null;

function buildCard(t) {
  const el = document.createElement("div");
  el.className = "browser";
  el.dataset.theme = t.id;
  el.innerHTML = `
    <div class="browser__bar">
      <span class="browser__light"></span><span class="browser__light"></span><span class="browser__light"></span>
      <span class="browser__url">${t.url}</span>
    </div>
    <div class="browser__page">
      <div class="b-nav">
        <span class="b-logo">${t.logo}</span>
        <span class="b-menu"></span><span class="b-menu"></span><span class="b-menu"></span>
        <span class="b-pill"></span>
      </div>
      <div class="b-hero">
        <h3 class="b-title">${t.title}</h3>
        <div class="b-lines"><span></span><span></span></div>
        <span class="b-btn">${t.cta}</span>
      </div>
      <div class="b-cards">
        ${t.cards.map((c) => `<div class="b-card"><span class="b-card__emoji">${c}</span><i></i><i></i></div>`).join("")}
      </div>
    </div>`;
  carTrack.appendChild(el);
  return { el, urlEl: el.querySelector(".browser__url"), theme: t };
}

/* slot geometry: offset from center → position in the queue */
const SLOTS = {
  "-2": { x: -104, r: 38, s: 0.52, o: 0.35, br: 0.45, z: 10 },
  "-1": { x: -60, r: 28, s: 0.74, o: 0.8, br: 0.62, z: 20 },
  "0":  { x: 0, r: 0, s: 1, o: 1, br: 1, z: 30 },
  "1":  { x: 60, r: -28, s: 0.74, o: 0.8, br: 0.62, z: 20 },
  "2":  { x: 104, r: -38, s: 0.52, o: 0.35, br: 0.45, z: 10 },
};

function layoutCarousel() {
  const n = themes.length;
  cards.forEach((c, i) => {
    let off = (((i - carIndex) % n) + n) % n;
    if (off > n / 2) off -= n;
    const slot = SLOTS[off];
    if (!slot) {
      c.el.style.transform = `translateX(calc(-50% + ${off > 0 ? 150 : -150}%)) scale(0.4)`;
      c.el.style.opacity = 0;
      c.el.style.zIndex = 0;
      c.el.style.pointerEvents = "none";
      c.el.classList.remove("is-center");
      return;
    }
    c.el.style.transform =
      `translateX(calc(-50% + ${slot.x}%)) rotateY(${slot.r}deg) scale(${slot.s})`;
    c.el.style.opacity = slot.o;
    c.el.style.filter = slot.br === 1 ? "none" : `brightness(${slot.br})`;
    c.el.style.zIndex = slot.z;
    c.el.style.pointerEvents = "auto";
    c.el.classList.toggle("is-center", off === 0);
  });
  const t = themes[carIndex];
  showLabel.innerHTML = `<strong>${t.label}</strong> — ${t.tag}`;
}

function typeUrl(card) {
  clearInterval(typeTimer);
  cards.forEach((c) => {
    c.el.classList.remove("is-typing");
    c.urlEl.textContent = c.theme.url;
  });
  if (reducedMotion) return;
  const text = card.theme.url;
  card.urlEl.textContent = "";
  card.el.classList.add("is-typing");
  let i = 0;
  typeTimer = setInterval(() => {
    card.urlEl.textContent = text.slice(0, ++i);
    if (i >= text.length) {
      clearInterval(typeTimer);
      setTimeout(() => card.el.classList.remove("is-typing"), 700);
    }
  }, 34);
}

function spinTo(index) {
  const n = themes.length;
  const next = ((index % n) + n) % n;
  if (next === carIndex) return;
  carIndex = next;
  layoutCarousel();
  typeUrl(cards[carIndex]);
}

const spin = (dir) => spinTo(carIndex + dir);

if (carTrack) {
  themes.forEach((t) => cards.push(buildCard(t)));
  layoutCarousel();

  document.getElementById("carPrev").addEventListener("click", () => spin(-1));
  document.getElementById("carNext").addEventListener("click", () => spin(1));
  document.getElementById("nextStyle").addEventListener("click", () => spin(1));

  /* click a card: center → next, neighbour → bring it to the front */
  let dragMoved = false;
  cards.forEach((c, i) => {
    c.el.addEventListener("click", () => {
      if (dragMoved) return;
      if (i === carIndex) spin(1);
      else spinTo(i);
    });
  });

  /* drag / flick to spin */
  let startX = 0;
  carTrack.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    startX = e.clientX;
    carTrack.classList.add("is-dragging");
    carTrack.setPointerCapture(e.pointerId);
  });
  carTrack.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 8) dragMoved = true;
    carTrack.style.transform = `translateX(${dx * 0.16}px)`;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    carTrack.classList.remove("is-dragging");
    carTrack.style.transform = "";
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 55) spin(dx < 0 ? 1 : -1);
    setTimeout(() => (dragMoved = false), 0);
  };
  carTrack.addEventListener("pointerup", endDrag);
  carTrack.addEventListener("pointercancel", endDrag);

  /* sideways wheel / trackpad swipe spins the queue */
  let wheelLockH = false;
  carousel.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 18) return;
      e.preventDefault();
      if (wheelLockH) return;
      wheelLockH = true;
      spin(e.deltaX > 0 ? 1 : -1);
      setTimeout(() => (wheelLockH = false), 650);
    },
    { passive: false }
  );

  /* ← → keys while the scene is on stage */
  window.addEventListener("keydown", (e) => {
    if (current !== SHOW_SCENE || e.repeat) return;
    if (["ArrowRight", "Right"].includes(e.key)) { e.preventDefault(); spin(1); }
    else if (["ArrowLeft", "Left"].includes(e.key)) { e.preventDefault(); spin(-1); }
  });

  carousel.addEventListener("mouseenter", () => (carHover = true));
  carousel.addEventListener("mouseleave", () => (carHover = false));

  /* lazy idle spin — pauses while you play */
  if (!reducedMotion) {
    setInterval(() => {
      if (current === SHOW_SCENE && !carHover && !dragging && !document.hidden) spin(1);
    }, 4600);
  }
}

/* ---------- copy chips (no hyperlinks after dark) ---------- */

const toast = document.getElementById("toast");
let toastTimer = null;

document.querySelectorAll("[data-copy]").forEach((chip) => {
  chip.addEventListener("click", async () => {
    const text = chip.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast.textContent = `copied! 🐾  ${text}`;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
});
