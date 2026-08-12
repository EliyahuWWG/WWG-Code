# Working With God — React site

Faith-based leadership site for **Dr. Eliyahu Lotzar** — the *Working With God* practice,
built on the **Ten Modes of Elevated Leadership**. Vite + React + React Router, statically
prerendered. Navy + gold editorial design; every path funnels to a call, a free event, or the book.

## Run it
```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # static prerender → /dist (vite-react-ssg)
npm run preview    # preview the production build
```

## Routes
Home · `/services` · `/events` · `/roundtable` · `/the-book` · `/about` · `/contact` · 404.
Each route is prerendered to real HTML with its own `<title>`, meta, and JSON-LD.

## Deploy
`/dist` is static files.
- **Netlify** (recommended — forms work with zero backend): drag `dist` to app.netlify.com/drop,
  or connect the repo. `public/_redirects` handles SPA fallback; the three forms are pre-registered
  via static copies in `index.html`.
- **Other hosts:** serve `dist`; set `VITE_FORM_ENDPOINT` (Formspree/Web3Forms) so forms reach an inbox.

## Forms
Contact, Roundtable registration, and the daily-quote signup are real, validated forms
(`src/components/forms/`). They POST to Netlify Forms by default, or to `VITE_FORM_ENDPOINT` if set.
Each has inline validation, a loading state, a success state, and an error state with a mailto fallback.

## Before launch — client to-dos (also marked `TODO(client)` in code)
1. **Headshot** → `/public/eliyahu.jpg`, then swap the `.ph` block in `About.jsx` for
   `<img src="/eliyahu.jpg" alt="Dr. Eliyahu Lotzar" />`.
2. **Book cover** → `/public/book-cover.jpg`, swap the `.book` block in `Home.jsx` + `TheBook.jsx`.
3. **Form delivery inbox** — confirm Netlify or set `VITE_FORM_ENDPOINT`.
4. **Next Roundtable date** — set `NEXT_ROUNDTABLE` in `src/data.js` (update monthly).
5. **Calendly** — confirm `CALENDLY` in `src/data.js`; consider a WWG-specific event type.
6. **Domain** — canonicals/sitemap assume `https://workingwithgod.live`.

## Where things live
- `src/data.js` — all real copy: constants, pillars, offerings, testimonials, endorsements, events, FAQ.
- `src/index.css` — the design system (navy/gold tokens at the top).
- `src/seo/schema.js` — JSON-LD builders (Person, ProfessionalService, Book, Event, Breadcrumb, FAQ).
- `src/components/` — Nav, Footer, CTA, Reveal, MaskLines, Ridge, VideoFacade, forms/…
- `src/pages/` — Home, Services, Events, Roundtable, TheBook, About, Contact, NotFound.

## Design notes
- Navy `#050d6e` + gold `#c9a227` + warm bone. Gold is an accent only (rules, numerals, marks) — never a fill.
- Type: Fraunces (display) · Inter (body) · JetBrains Mono (labels) — self-hosted via @fontsource.
- Mountain-ridge motif (perspective) draws itself on the hero. Everything respects `prefers-reduced-motion`.
- Copy is his own, verbatim where possible. Review for accuracy before launch.
