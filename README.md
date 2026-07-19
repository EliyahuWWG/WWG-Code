# Reframed Reality — React site

An editorial, conversion-focused site for Dr. Eliyahu Lotzar / Reframed Reality.
Built with **Vite + React + React Router**. Dual-door structure (Business / Working With God);
every CTA drives to his Calendly.

## Run it
```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # outputs static site to /dist
npm run preview    # preview the production build
```

## Deploy (all free)
The build in `/dist` is plain static files.
- **Netlify:** drag the `dist` folder onto https://app.netlify.com/drop. `public/_redirects` (SPA fallback) is already included.
- **Vercel:** `vercel` from the project root — framework preset **Vite**. `vercel.json` handles SPA routing.
- **GitHub Pages / any static host:** serve `dist`; ensure unknown routes fall back to `index.html`.

Then point `reframedreality.com` DNS at the host once he approves.

## Before final launch — 3 quick swaps
1. **Headshot.** Drop `eliyahu.jpg` into `/public`, then in `src/pages/Home.jsx` and
   `src/pages/About.jsx` replace the `<div className="ph">…</div>` inside `.portrait` with
   `<img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" />`.
2. **Book cover.** ✅ Done — the real cover is at `/public/working-with-god.jpg` (311×466),
   shown via `.book-cover` in `Home.jsx` + `WorkingWithGod.jsx` with explicit width/height.
3. **Confirm the Calendly URL.** Set in one place — `src/data.js` (`CALENDLY`). Currently
   `https://calendly.com/eliyahu-lotzar-reframedreality` (from his LinkedIn). Change there if needed.

### Image rules (keeps Core Web Vitals green)
When adding any real `<img>` (headshot, book cover, future photos):
- Always set explicit `width` and `height` attributes (prevents layout shift).
- Use `loading="lazy"` for anything below the fold; the Home hero portrait can stay eager.
- Always write a descriptive `alt` (e.g. `alt="Dr. Eliyahu Lotzar"`); decorative images get `alt=""`.
- Prefer WebP/AVIF with a JPEG fallback (`<picture>`), sized close to the largest display size
  (portrait renders ≤ 640px wide — don't ship a 4000px original).

## Where things live
- `src/data.js` — all copy that changes often: testimonials, orgs, services, contact links.
- `src/index.css` — the whole design system (colors, type, components) via CSS variables at the top.
- `src/components/` — Nav, Footer, CTA, Reveal (scroll animation), Arrow, Calendly helper.
- `src/pages/` — Home, Business, WorkingWithGod, About, Results, BookCall.

## Design notes
- Type: Fraunces (display) · Inter (text) · JetBrains Mono (labels) — Google Fonts, already linked.
- Palette: ink-green / warm bone / one clay accent. Hairline rules instead of drop shadows.
- Fully responsive; mobile menu included. Respects `prefers-reduced-motion`.
- Copy is drawn from his live site + LinkedIn — review for accuracy before launch.
