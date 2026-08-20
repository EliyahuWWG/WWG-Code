import { Link, useParams } from 'react-router-dom'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import Seo from '../components/Seo'
import { breadcrumbSchema, articleSchema } from '../seo/schema'
import { getPost, posts, formatDate, postSlugs, relatedPosts } from '../blog'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="h2">That piece is not here.</h1>
          <p className="mt-2 muted">It may have moved. <Link className="tlink" to="/blog">See everything else</Link>.</p>
        </div>
      </section>
    )
  }

  // Scored by shared tags, not just the next two by date.
  const others = relatedPosts(post.slug, 2)

  return (
    <>
      <Seo
        title={`${post.title} | Working With God`}
        description={post.description}
        path={`/blog/${post.slug}`}
        schema={[
          breadcrumbSchema([{ name: 'Writing', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
          articleSchema(post),
        ]}
        article={{ published: post.date, modified: post.updated, tags: post.tags }}
      />

      {/* One <article> wrapping header + body, so a crawler can see where the
          piece starts and ends rather than inferring it from a div soup. */}
      <article className="post">
        {/* Compact header, not the full-viewport .phero the marketing pages
            use. An article should not spend a whole screen before the first
            sentence. Light ground, because that is what you read on. */}
        <header className="post-head">
          <div className="container">
            {/* Visible breadcrumb. BreadcrumbList JSON-LD already existed, but
                Google prefers the markup and the rendering to agree. */}
            <nav aria-label="Breadcrumb" className="crumbs">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/blog">Writing</Link></li>
                <li aria-current="page">{post.title}</li>
              </ol>
            </nav>
            <h1 className="h1 mt-3 balance">{post.title}</h1>
            <p className="postmeta postmeta-hero">
              <span>By <a rel="author" href="/about">Dr. Eliyahu Lotzar</a>, Ed.D., MSW</span>
              <span aria-hidden="true"> · </span>
              <span>Published <time dateTime={post.date}>{formatDate(post.date)}</time></span>
              <span aria-hidden="true"> · </span>
              <span>{post.readingMinutes} min read</span>
            </p>
          </div>
        </header>

        <div className="post-body">
          <div className="container">
            {/* Compiled from markdown at build time (vite.config.js markdown-posts). */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

            <footer className="post-foot">
              {post.tags?.length > 0 && (
                <>
                  <h2 className="vh">Topics</h2>
                  <ul className="tagrow">
                    {post.tags.map(t => <li key={t} className="tag">{t}</li>)}
                  </ul>
                </>
              )}
              <p className="post-byline">
                Written by <a href="/about" rel="author">Dr. Eliyahu Lotzar</a>, Ed.D., MSW.
                If any of this lands, <Link to="/contact">start a conversation</Link>.
              </p>
            </footer>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="section on-bone">
          <div className="container">
            <div className="sec-head"><h2 className="h2">Keep reading.</h2></div>
            <div className="ilist mt-4">
              {others.map(p => (
                <article className="irow" key={p.slug}>
                  <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
                  <div>
                    <p>{p.description}</p>
                    <Link className="go" to={`/blog/${p.slug}`}>Read it <Arrow /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  )
}

// Prerender one static page per post.
export function getStaticPaths() {
  return postSlugs.map(s => `blog/${s}`)
}

export const Component = BlogPost
