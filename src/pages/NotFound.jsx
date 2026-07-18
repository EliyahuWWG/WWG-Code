import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import Arrow from '../components/Arrow'
import { openCalendly, warmCalendly } from '../components/useCalendly'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found | Reframed Reality</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section className="phero" style={{ minHeight: '72vh' }}>
        <div className="container">
          <div className="label"><span className="idx">(404)</span> &nbsp;Not found</div>
          <h1 className="h1 mt-3 balance">This page wandered off.</h1>
          <p className="lead">The address you followed doesn’t exist — or it’s been reframed into something better. The rest of the site is exactly where it should be.</p>
          <div className="row mt-3">
            <Link to="/" className="btn btn-onink">Back to the homepage <Arrow /></Link>
            <Link to="/book-a-call" onClick={openCalendly} onPointerEnter={warmCalendly} onFocus={warmCalendly} className="tlink lt">Book a discovery call</Link>
          </div>
        </div>
      </section>
    </>
  )
}

// react-router lazy() route entry
export const Component = NotFound
