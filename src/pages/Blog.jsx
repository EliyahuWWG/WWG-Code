import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import Arrow from '../components/Arrow'
import Seo from '../components/Seo'
import { breadcrumbSchema, blogSchema } from '../seo/schema'
import { posts, formatDate } from '../blog'

export default function Blog() {
  return (
    <>
      <Seo
        title="Writing on faith, leadership, and the work itself | Working With God"
        description="Essays from Dr. Eliyahu Lotzar on leading with God rather than just for Him: modal leadership, discerning divine direction in real decisions, and what happens at the monthly Roundtable."
        path="/blog"
        schema={[breadcrumbSchema([{ name: 'Writing', path: '/blog' }]), blogSchema(posts)]}
      />

      <section className="phero">
        <div className="container">
          <div className="eyebrow">Writing</div>
          <h1 className="h1 mt-3 balance">Thinking out loud about faith and the work.</h1>
          <p className="lead">Short essays on leading with God rather than just for Him. Written for people who run things and have to decide something on Monday.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="muted">The first pieces are on their way.</p>
          ) : (
            <Reveal className="ilist draw" stagger={0.08}>
              {posts.map((p, i) => (
                <article className="irow postrow" key={p.slug}>
                  <div className="n">{String(i + 1).padStart(2, '0')}</div>
                  <h2 className="posttitle">
                    <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                  </h2>
                  <div>
                    <p>{p.description}</p>
                    <p className="postmeta">
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      <span aria-hidden="true"> · </span>
                      <span>{p.readingMinutes} min read</span>
                    </p>
                    <Link className="go" to={`/blog/${p.slug}`}>Read it <Arrow /></Link>
                  </div>
                </article>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <CTA />
    </>
  )
}

export const Component = Blog
