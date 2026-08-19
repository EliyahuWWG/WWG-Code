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
