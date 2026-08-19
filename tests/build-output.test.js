import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * These assert against dist/, not against source. Everything the client's SEO
 * depends on is produced by the build (prerendering, postbuild, the Vite
 * plugins), so unit-testing components would not catch a regression in any of
 * it. Run `npm run build` first; the suite skips itself if dist is absent.
 */
const DIST = 'dist'
const has = existsSync(DIST) && existsSync(join(DIST, 'index.html'))
const read = (p) => readFileSync(join(DIST, p), 'utf8')
// HTML comments can contain literal tags (and did), which makes naive tag
// counting wrong. Strip them before counting anything.
const stripHtmlComments = (s) => s.replace(/<!--[\s\S]*?-->/g, '')

const routes = []
if (has) {
  const walk = (dir, base = '') => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) {
        if (name === 'assets' || name === 'fonts') continue
        walk(full, `${base}/${name}`)
      } else if (name === 'index.html') routes.push(base || '/')
    }
  }
  walk(DIST)
}

describe.skipIf(!has)('build output', () => {
  it('prerenders every route to real HTML, not an empty shell', () => {
    expect(routes.length).toBeGreaterThanOrEqual(11)
    for (const r of routes) {
      const html = read(join(r === '/' ? '' : r, 'index.html'))
      const body = html.slice(html.search(/<div id="root"/))
      expect(body.length, `${r} looks like an empty shell`).toBeGreaterThan(2000)
      expect(html, `${r} has no <h1>`).toMatch(/<h1[\s>]/)
    }
  })

  it('gives every page exactly one title, one canonical and one h1', () => {
    for (const r of routes) {
      const html = stripHtmlComments(read(join(r === '/' ? '' : r, 'index.html')))
      expect((html.match(/<title[^>]*>/g) || []).length, `${r} titles`).toBe(1)
      expect((html.match(/<h1[\s>]/g) || []).length, `${r} h1s`).toBe(1)
      // The 404 deliberately has neither a canonical nor an index directive.
      if (r !== '/404') {
        expect((html.match(/rel="canonical"/g) || []).length, `${r} canonicals`).toBe(1)
      }
    }
  })

  it('gives every page a description and self-referencing canonical', () => {
    for (const r of routes) {
      if (r === '/404') continue
      const html = read(join(r === '/' ? '' : r, 'index.html'))
      const desc = /<meta[^>]*name="description"[^>]*content="([^"]+)"/.exec(html)
      expect(desc, `${r} has no meta description`).toBeTruthy()
      expect(desc[1].length).toBeGreaterThan(50)
      const canon = /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/.exec(html)[1]
      expect(canon).toBe(`https://workingwithgod.live${r === '/' ? '/' : r}`)
    }
  })

  it('marks blog posts as articles with a date and an author', () => {
    const postRoutes = routes.filter(r => r.startsWith('/blog/'))
    expect(postRoutes.length).toBeGreaterThan(0)
    for (const r of postRoutes) {
      const html = read(join(r, 'index.html'))
      expect(html, `${r} og:type`).toMatch(/property="og:type"[^>]*content="article"/)
      expect(html, `${r} published_time`).toContain('article:published_time')
      expect(html, `${r} author`).toMatch(/name="author"/)
      expect(html, `${r} BlogPosting`).toContain('"BlogPosting"')
      expect(html, `${r} <article>`).toMatch(/<article[\s>]/)
      expect(html, `${r} <time>`).toMatch(/<time[^>]*datetime=/i)
    }
  })

  it('emits a real 404 page for Netlify to serve with a 404 status', () => {
    expect(existsSync(join(DIST, '404.html'))).toBe(true)
  })

  it('keeps the 404 out of the index and gives it no canonical', () => {
    // A canonical on a 404 tells Google the page is real; a missing noindex
    // lets every typo'd URL into the index as a soft 404.
    const html = read('404/index.html')
    expect(html).toMatch(/name="robots"[^>]*content="[^"]*noindex/)
    expect(html).not.toContain('rel="canonical"')
  })

  it('does not preload the on-demand three.js chunk', () => {
    // Regression guard: this cost every /the-book visitor ~190 KB gz for a
    // component most of them never trigger.
    const html = read('the-book/index.html')
    expect(html).not.toMatch(/modulepreload[^>]*three\.module/)
  })

  it('ships no legacy .woff fallbacks', () => {
    const fonts = []
    const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach(e =>
      e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.woff') && fonts.push(e.name))
    walk(DIST)
    expect(fonts).toEqual([])
  })

  it('generates a sitemap covering every prerendered route except the 404', () => {
    const xml = read('sitemap.xml')
    for (const r of routes) {
      if (r === '/404') continue
      expect(xml, `${r} missing from sitemap`).toContain(`https://workingwithgod.live${r === '/' ? '/' : r + '/'}`)
    }
    expect(xml).not.toContain('/404')
  })

  it('generates an RSS feed with one item per published post', () => {
    const rss = read('rss.xml')
    const items = (rss.match(/<item>/g) || []).length
    expect(items).toBe(routes.filter(r => r.startsWith('/blog/')).length)
    expect(rss).toContain('<atom:link')
  })

  it('generates llms.txt and llms-full.txt with the post bodies inlined', () => {
    expect(read('llms.txt')).toContain('# Working With God')
    const full = read('llms-full.txt')
    expect(full).toContain('# Full text of all posts')
    // A real paragraph from a post, so a broken tag-stripper is caught.
    expect(full.length).toBeGreaterThan(read('llms.txt').length + 2000)
    expect(full).not.toMatch(/<\/?(p|div|h2)[\s>]/)
  })

  it('names the AI crawlers explicitly in robots.txt', () => {
    const robots = read('robots.txt')
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
      expect(robots, `${bot} missing`).toContain(bot)
    }
    expect(robots).toContain('Sitemap:')
  })
})
