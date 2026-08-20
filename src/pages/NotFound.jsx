import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import Arrow from '../components/Arrow'
import BookCallLink from '../components/BookCallLink'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found | Working With God</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section className="phero" style={{ minHeight: '72vh' }}>
        <div className="container">
          <div className="eyebrow">(404) · Not found</div>
          <h1 className="h1 mt-3 balance">This page wandered off.</h1>
          <p className="lead">The address you followed doesn’t exist. The rest of the site is exactly where it should be.</p>
          <div className="row mt-3">
            <Link to="/" className="btn btn-onink">Back to the homepage <Arrow /></Link>
            <BookCallLink className="tlink" arrow={false}>Book a call</BookCallLink>
          </div>
        </div>
      </section>
    </>
  )
}

// react-router lazy() route entry
export const Component = NotFound
