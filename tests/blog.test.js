import { describe, it, expect } from 'vitest'
import { posts, postSlugs, getPost, formatDate } from '../src/blog'

describe('blog index', () => {
  it('compiles every markdown file to html at build time', () => {
    expect(posts.length).toBeGreaterThan(0)
    for (const p of posts) {
      expect(p.html, `${p.slug} has no compiled html`).toBeTruthy()
      expect(p.html).toContain('<p>')
    }
  })

  it('gives every post the front matter the SEO layer depends on', () => {
    for (const p of posts) {
      expect(p.title, `${p.slug} title`).toBeTruthy()
      expect(p.description, `${p.slug} description`).toBeTruthy()
      expect(p.date, `${p.slug} date`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(p.readingMinutes).toBeGreaterThan(0)
    }
  })

  it('keeps descriptions inside the length Google will actually render', () => {
    for (const p of posts) {
      expect(p.description.length, `${p.slug} description too long`).toBeLessThanOrEqual(200)
    }
  })

  it('has unique slugs', () => {
    expect(new Set(postSlugs).size).toBe(postSlugs.length)
  })

  it('sorts newest first', () => {
    const dates = posts.map(p => +new Date(p.date))
    expect([...dates].sort((a, b) => b - a)).toEqual(dates)
  })

  it('looks a post up by slug', () => {
    expect(getPost(postSlugs[0])?.slug).toBe(postSlugs[0])
    expect(getPost('does-not-exist')).toBeUndefined()
  })

  it('formats dates without drifting a day across timezones', () => {
    expect(formatDate('2026-08-04')).toBe('August 4, 2026')
    expect(formatDate('2026-01-01')).toBe('January 1, 2026')
  })
})
