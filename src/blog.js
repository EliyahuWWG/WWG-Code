// Blog index. Markdown in src/content/blog/*.md is compiled to HTML at build
// time by the `markdown-posts` plugin in vite.config.js, so no markdown
// library ships to the browser.
const modules = import.meta.glob('./content/blog/*.md', { eager: true })

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const p = mod.default || mod
    return { ...p, slug: p.slug || path.split('/').pop().replace(/\.md$/, '') }
  })
  // Drafts stay out of the live site but remain in the repo for the client to
  // finish. Flip `draft: false` in the front matter to publish.
  .filter(p => !p.draft || import.meta.env.DEV)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export const postSlugs = posts.map(p => p.slug)
export const getPost = slug => posts.find(p => p.slug === slug)

export const formatDate = iso =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })

/**
 * Related posts, scored by shared tags rather than taken by date.
 *
 * Date order is arbitrary on a small blog: post 3 is "related" to post 1 only
 * because nothing else exists. Tag overlap at least means the reader who
 * finished a piece on the Ten Modes is offered the other Ten Modes piece.
 *
 * Ties break on recency, and if nothing shares a tag it falls back to the
 * newest posts, so the slot is never empty.
 */
export function relatedPosts(slug, limit = 2) {
  const current = getPost(slug)
  if (!current) return posts.slice(0, limit)

  const tags = new Set(current.tags || [])
  const scored = posts
    .filter(p => p.slug !== slug)
    .map(p => ({
      post: p,
      shared: (p.tags || []).filter(t => tags.has(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared || new Date(b.post.date) - new Date(a.post.date))

  const withTag = scored.filter(s => s.shared > 0).map(s => s.post)
  if (withTag.length >= limit) return withTag.slice(0, limit)

  // Top up from the newest posts that are not already included.
  const filler = scored.map(s => s.post).filter(p => !withTag.includes(p))
  return [...withTag, ...filler].slice(0, limit)
}
