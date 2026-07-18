import { Head } from 'vite-react-ssg'
import { SITE_URL, SITE_NAME } from '../seo/schema'

// Per-route head management. Rendered into the static HTML at build time by
// vite-react-ssg (react-helmet-async under the hood) and kept in sync on the
// client during SPA navigation.
export default function Seo({ title, description, path = '/', image = '/og.png', type = 'website', schema = [] }) {
  const url = `${SITE_URL}${path}`
  const img = image.startsWith('http') ? image : `${SITE_URL}${image}`
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Head>
  )
}
