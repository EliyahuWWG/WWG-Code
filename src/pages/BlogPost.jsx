import { Link, useParams } from 'react-router-dom'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import Seo from '../components/Seo'
import { breadcrumbSchema, articleSchema } from '../seo/schema'
import { getPost, posts, formatDate, postSlugs } from '../blog'

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

  const others = posts.filter(p => p.slug !== post.slug).slice(0, 2)

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
      />

      <section className="phero phero-post">
        <div className="container">
          <Link className="backlink" to="/blog">Writing</Link>
          <h1 className="h1 mt-3 balance">{post.title}</h1>
          <p className="postmeta postmeta-hero">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{post.readingMinutes} min read</span>
            <span aria-hidden="true"> · </span>
            <span>Dr. Eliyahu Lotzar</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Compiled from markdown at build time (vite.config.js markdown-posts). */}
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.tags?.length > 0 && (
            <ul className="tagrow mt-4" aria-label="Topics">
              {post.tags.map(t => <li key={t} className="tag">{t}</li>)}
            </ul>
          )}
        </div>
      </section>

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
