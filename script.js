/* Nero & Co. — the life support system 🐾 */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- scroll reveal ---------- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  revealObserver.observe(el);
});

/* ---------- Nero's eyes follow the cursor ---------- */

const nero = document.getElementById("nero");
const pupils = document.querySelectorAll("[data-pupil]");

if (nero && !reducedMotion) {
  let raf = null;

  document.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const rect = nero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.35; // eye level
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 60, 1); // eyes relax when cursor is close
      const px = (dx / dist) * 7 * reach;
      const py = (dy / dist) * 5 * reach;
      pupils.forEach((p) => (p.style.transform = `translate(${px}px, ${py}px)`));
      raf = null;
    });
  });
}

/* ---------- blinking ---------- */

const eyes = document.querySelectorAll("[data-eye]");

function blink() {
  eyes.forEach((eye) => eye.classList.add("is-blinking"));
  setTimeout(() => eyes.forEach((eye) => eye.classList.remove("is-blinking")), 140);
  // occasionally double-blink, because cats
  if (Math.random() < 0.25) {
    setTimeout(() => {
      eyes.forEach((eye) => eye.classList.add("is-blinking"));
      setTimeout(() => eyes.forEach((eye) => eye.classList.remove("is-blinking")), 140);
    }, 260);
  }
  scheduleBlink();
}

function scheduleBlink() {
  setTimeout(blink, 2200 + Math.random() * 4200);
}

if (eyes.length && !reducedMotion) scheduleBlink();

/* ---------- Nero speaks when clicked ---------- */

const bubble = document.getElementById("bubble");
const meows = [
  "mrrp!",
  "meow.",
  "purrrr…",
  "mrrrOW!",
  "*slow blink* (that means I like you)",
  "*knocks your coffee over*",
  "have you considered a website?",
  "prrrt?",
  "…feed me and I'll waive my fee.",
];
let bubbleTimer = null;
let meowIndex = Math.floor(Math.random() * meows.length);

if (nero && bubble) {
  nero.addEventListener("click", () => {
    meowIndex = (meowIndex + 1) % meows.length;
    bubble.textContent = meows[meowIndex];
    bubble.classList.add("is-visible");
    nero.classList.remove("is-happy");
    void nero.offsetWidth; // restart wiggle
    nero.classList.add("is-happy");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove("is-visible"), 2200);
  });
}

/* ---------- paw prints where you click (hero only) ---------- */

const hero = document.getElementById("hero");
let pawFlip = false;

if (hero && !reducedMotion) {
  hero.addEventListener("click", (e) => {
    if (e.target.closest("a, button, #nero")) return;
    const paw = document.createElement("span");
    paw.className = "pawprint";
    paw.textContent = "🐾";
    pawFlip = !pawFlip;
    paw.style.setProperty("--rot", `${pawFlip ? -18 : 18}deg`);
    paw.style.left = `${e.clientX - 12}px`;
    paw.style.top = `${e.clientY - 12}px`;
    document.body.appendChild(paw);
    setTimeout(() => paw.remove(), 1200);
  });
}

/* ---------- logo easter egg: 5 clicks = it's raining cats ---------- */

const logo = document.getElementById("logo");
let logoClicks = 0;
let logoClickTimer = null;

if (logo) {
  logo.addEventListener("click", () => {
    logoClicks += 1;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => (logoClicks = 0), 1500);
    if (logoClicks >= 5 && !reducedMotion) {
      logoClicks = 0;
      rainCats();
    }
  });
}

function rainCats() {
  for (let i = 0; i < 14; i++) {
    const cat = document.createElement("span");
    cat.textContent = ["🐈‍⬛", "🐾", "🧶"][i % 3];
    Object.assign(cat.style, {
      position: "fixed",
      top: "-50px",
      left: `${Math.random() * 100}vw`,
      fontSize: `${1.2 + Math.random() * 1.6}rem`,
      zIndex: 200,
      pointerEvents: "none",
      transition: `top ${1.6 + Math.random() * 1.4}s cubic-bezier(0.5, 0, 0.9, 0.6), transform 2.6s linear`,
    });
    document.body.appendChild(cat);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        cat.style.top = "110vh";
        cat.style.transform = `rotate(${Math.random() * 540 - 270}deg)`;
      })
    );
    setTimeout(() => cat.remove(), 3400);
  }
}
