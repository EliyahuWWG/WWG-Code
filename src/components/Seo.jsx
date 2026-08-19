import { Head } from 'vite-react-ssg'
import { SITE_URL, SITE_NAME } from '../seo/schema'

const AUTHOR = 'Dr. Eliyahu Lotzar'

/**
 * Per-route head. Rendered into the static HTML at build time by
 * vite-react-ssg (react-helmet-async underneath) and kept in sync on the
 * client during SPA navigation.
 *
 * `article` turns on the Open Graph article namespace, which is what social
 * cards and several LLM crawlers read to date a piece and attribute it.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image = '/og.png',
  type = 'website',
  schema = [],
  article = null,          // { published, modified, tags }
}) {
  const url = `${SITE_URL}${path}`
  const img = image.startsWith('http') ? image : `${SITE_URL}${image}`
  const ogType = article ? 'article' : type

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="author" content={AUTHOR} />
      <link rel="canonical" href={url} />

      {/* Feed autodiscovery: readers, aggregators and several crawlers look
          for this rather than guessing /rss.xml. */}
      <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME}, writing`} href={`${SITE_URL}/rss.xml`} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content={title} />

      {article && <meta property="article:published_time" content={article.published} />}
      {article && <meta property="article:modified_time" content={article.modified || article.published} />}
      {article && <meta property="article:author" content={AUTHOR} />}
      {article?.tags?.map(t => <meta key={t} property="article:tag" content={t} />)}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={title} />

      {schema.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Head>
  )
}
