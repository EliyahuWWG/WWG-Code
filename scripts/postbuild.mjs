// Runs after `vite-react-ssg build` (npm postbuild hook).
//
//  1. dist/404.html      so Netlify serves a real 404 status
//  2. dist/sitemap.xml   generated from what was actually prerendered
//  3. dist/rss.xml       so the writing is subscribable and syndicatable
//  4. dist/llms.txt      a plain-text map for LLM crawlers
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const SITE = 'https://workingwithgod.live'

/* ---------------- 1. 404 ---------------- */
const src404 = join(dist, '404', 'index.html')
if (existsSync(src404)) {
  copyFileSync(src404, join(dist, '404.html'))
  console.log('[postbuild] dist/404/index.html -> dist/404.html')
} else {
  console.warn('[postbuild] WARNING: no prerendered 404 at', src404)
  process.exitCode = 1
}

/* ---------------- discover routes ---------------- */
const routes = []
const walk = (dir, base = '') => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name === 'assets' || name === 'fonts') continue
      walk(full, `${base}/${name}`)
    } else if (name === 'index.html') {
      routes.push(base || '/')
    }
  }
}
walk(dist)
const pages = routes.filter(r => r !== '/404').sort()

/* ---- strip modulepreload for on-demand-only chunks ----
   three.js is imported dynamically by Book3D and only on desktop, in view,
   without prefers-reduced-motion. vite-react-ssg injects its own
   modulepreload links at prerender time, which pulled ~190 KB gz into the
   initial load of /the-book for every visitor, including the ones the
   component deliberately skips. */
const LAZY_ONLY = [/three\.module/]
let stripped = 0
for (const route of routes) {
  const file = join(dist, route === '/' ? '' : route, 'index.html')
  if (!existsSync(file)) continue
  const before = readFileSync(file, 'utf8')
  const after = before.replace(/<link rel="modulepreload"[^>]*>/g, tag =>
    LAZY_ONLY.some(re => re.test(tag)) ? (stripped++, '') : tag)
  if (after !== before) writeFileSync(file, after)
}
if (stripped) console.log(`[postbuild] stripped ${stripped} modulepreload link(s) for on-demand chunks`)

/* ---------------- 2. sitemap ---------------- */
const priority = r => (r === '/' ? '1.0' : r.startsWith('/blog/') ? '0.7' : '0.8')
const changefreq = r => (r === '/blog' ? 'weekly' : 'monthly')
const today = readFileSync(join(dist, 'index.html'), 'utf8') && new Date(statSync(join(dist, 'index.html')).mtime).toISOString().slice(0, 10)

writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(r => `  <url>\n    <loc>${SITE}${r === '/' ? '/' : r + '/'}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq(r)}</changefreq>\n    <priority>${priority(r)}</priority>\n  </url>`).join('\n') +
  `\n</urlset>\n`)
console.log(`[postbuild] sitemap.xml (${pages.length} urls)`)

/* ---------------- 3 + 4. blog feed and llms.txt ---------------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Read the markdown front matter directly. Scraping JSON-LD back out of the
// rendered HTML worked in principle but is brittle, and the .md files are the
// actual source of truth.
const blogSrc = 'src/content/blog'
const meta = (existsSync(blogSrc) ? readdirSync(blogSrc) : [])
  .filter(f => f.endsWith('.md'))
  .map(f => {
    const raw = readFileSync(join(blogSrc, f), 'utf8')
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
    if (!m) return null
    const fm = {}
    for (const line of m[1].split(/\r?\n/)) {
      const kv = /^(\w+):\s*(.*)$/.exec(line)
      if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
    }
    return { slug: fm.slug || f.replace(/\.md$/, ''), title: fm.title, description: fm.description, date: fm.date, draft: fm.draft === 'true' }
  })
  .filter(p => p && p.date && !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

writeFileSync(join(dist, 'rss.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n` +
  `  <title>Working With God, writing</title>\n  <link>${SITE}/blog/</link>\n` +
  `  <description>Essays from Dr. Eliyahu Lotzar on leading with God rather than just for Him.</description>\n` +
  `  <language>en-us</language>\n  <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>\n` +
  meta.map(p => `  <item>\n    <title>${esc(p.title)}</title>\n    <link>${SITE}/blog/${p.slug}/</link>\n    <guid isPermaLink="true">${SITE}/blog/${p.slug}/</guid>\n    <pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate>\n    <description>${esc(p.description)}</description>\n  </item>`).join('\n') +
  `\n</channel>\n</rss>\n`)
console.log(`[postbuild] rss.xml (${meta.length} items)`)

writeFileSync(join(dist, 'llms.txt'),
`# Working With God

> Faith-based leadership coaching and community from Dr. Eliyahu Lotzar, Ed.D., MSW.
> The practice teaches leaders to work WITH God rather than only FOR Him, using the
> Ten Modes of Elevated Leadership from his book of the same name.

Dr. Eliyahu Lotzar is an executive coach, group facilitator and organizational
consultant based in Reston, Virginia. He holds an Ed.D. in Executive Leadership and
an MSW, is a licensed clinical therapist by training, a former business owner, and is
certified in the Adizes methodology, DiSC and Arbinger. He has been coaching,
counseling and facilitating leadership groups for over 30 years, and has worked
specifically with CEOs and owners for the past seven.

## Core pages
${pages.filter(r => !r.startsWith('/blog')).map(r => `- [${r === '/' ? 'Home' : r.slice(1).replace(/-/g, ' ')}](${SITE}${r === '/' ? '/' : r + '/'})`).join('\n')}

## Writing
${meta.map(p => `- [${p.title}](${SITE}/blog/${p.slug}/): ${p.description}`).join('\n')}

## Key concepts
- Working With God: leading in real-time dialogue with God about strategy, hiring,
  budgets and timing, rather than making a plan and asking for it to be blessed.
- The Ten Modes of Elevated Leadership: a Biblically-founded framework for
  identifying which operational mode a decision calls for.
- Modal Agility: the skill of shifting between leadership modes as the situation
  requires, rather than mastering a single default mode.
- The WWG Roundtable: a free monthly in-person gathering for owners, CEOs and senior
  leaders near Chantilly, Virginia, third Wednesdays, 8:00 to 9:55 a.m.

## Contact
- Book a call: ${SITE}/contact/
- Email: Eliyahu@WorkingWithGod.live
`)
console.log('[postbuild] llms.txt')
