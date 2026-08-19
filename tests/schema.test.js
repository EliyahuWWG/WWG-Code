import { describe, it, expect } from 'vitest'
import { articleSchema, blogSchema, breadcrumbSchema, personSchema, organizationSchema, SITE_URL } from '../src/seo/schema'
import { posts } from '../src/blog'

// Structured data is what search engines and LLM crawlers actually parse, and
// a typo here fails silently: the page still renders, the rich result just
// never appears.
describe('structured data', () => {
  it('emits valid JSON for every schema builder', () => {
    const all = [personSchema(), organizationSchema(), blogSchema(posts), articleSchema(posts[0]),
                 breadcrumbSchema([{ name: 'Writing', path: '/blog' }])]
    for (const s of all) {
      expect(() => JSON.parse(JSON.stringify(s))).not.toThrow()
      expect(s['@context']).toBe('https://schema.org')
      expect(s['@type']).toBeTruthy()
    }
  })

  it('gives BlogPosting everything Google requires for an article result', () => {
    const a = articleSchema(posts[0])
    expect(a['@type']).toBe('BlogPosting')
    expect(a.headline).toBeTruthy()
    expect(a.headline.length).toBeLessThanOrEqual(110)  // Google truncates past ~110
    expect(a.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(a.author).toHaveProperty('@id')
    expect(a.publisher).toHaveProperty('@id')
    expect(a.url.startsWith(SITE_URL)).toBe(true)
  })

  it('points author and publisher at nodes that actually exist', () => {
    // Dangling @id references are the most common way this markup breaks.
    const a = articleSchema(posts[0])
    expect(a.author['@id']).toBe(personSchema()['@id'])
    expect(a.publisher['@id']).toBe(organizationSchema()['@id'])
  })

  it('numbers breadcrumb positions from 1, in order, with Home prepended', () => {
    const b = breadcrumbSchema([{ name: 'Writing', path: '/blog' }, { name: 'A post', path: '/blog/a' }])
    expect(b.itemListElement.map(i => i.position)).toEqual([1, 2, 3])
    expect(b.itemListElement[0].name).toBe('Home')
    expect(b.itemListElement[2].item).toBe(`${SITE_URL}/blog/a`)
  })

  it('lists every published post in the Blog node', () => {
    expect(blogSchema(posts).blogPost).toHaveLength(posts.length)
  })
})
