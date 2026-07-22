# Nero & Co. — studio website 🐈‍⬛

Playful landing page for the Nero & Co. web design studio.
Pure HTML/CSS/JS — no build step, no dependencies.

Two editions:

- **After Dark** (`index.html`) — the main site. One fixed screen, zero scrolling, zero hyperlinks;
  six scenes recompose live around Nero (wheel / swipe / arrow keys / paw dots),
  email & URL are copy-to-clipboard chips, fireflies included.
  Scene 3 is **the Shapeshifter**: a browser window that morphs through seven
  website styles (bakery, law firm, festival, e-shop, kindergarten, SaaS, restaurant) —
  auto-cycles every ~4s, pauses on hover, click it or "show me another" to advance.
  Themes live in the `themes` array in `night.js` + `[data-theme]` blocks in `night.css`.
- **Day** (`day.html`) — classic scrolling landing page, cream & amber

## Files

- `index.html` / `night.css` / `night.js` — the after-dark edition (main)
- `day.html` / `styles.css` / `script.js` — the day edition

## Interactive details

- **Nero's eyes follow your cursor** and he blinks on his own schedule
- **Click Nero** — he answers (9 different responses)
- **Click anywhere in the hero** — paw prints appear
- **Click the logo 5× fast** — it rains cats 🐈‍⬛🧶🐾
- Sections reveal on scroll; whiskers and ears twitch on hover
- Respects `prefers-reduced-motion`

## Run locally

```
npx serve .
```

## Deploy to Netlify

Drag this folder into https://app.netlify.com/drop, or:

```
netlify deploy --prod --dir .
```

## Editing

- Contact email lives in `day.html` (search for `mailto:`) and as a copy chip in `index.html`
- Colors are CSS variables at the top of `styles.css` / `night.css`
- Nero's vocabulary is the `meows` array in `script.js` / `night.js`
