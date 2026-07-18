import { LINKEDIN, WWG, EMAIL, testimonials } from '../data'

export const SITE_URL = 'https://reframedreality.com'
export const SITE_NAME = 'Reframed Reality'

const PERSON_ID = `${SITE_URL}/#eliyahu-lotzar`
const ORG_ID = `${SITE_URL}/#organization`

// Dr. Eliyahu Lotzar — used on Home and About.
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Dr. Eliyahu Lotzar',
    honorificSuffix: 'Ed.D., MSW',
    jobTitle: 'Executive Coach & Organizational Development Consultant',
    description:
      'Organizational therapist, executive coach, and author of Working With God: The Ten Modes of Elevated Leadership. Founder of Reframed Reality, LLC in the Washington, DC area.',
    url: `${SITE_URL}/about`,
    worksFor: { '@id': ORG_ID },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'St. John Fisher University' },
      { '@type': 'CollegeOrUniversity', name: 'The Hebrew University of Jerusalem' },
      { '@type': 'CollegeOrUniversity', name: 'Michigan State University' },
    ],
    knowsAbout: [
      'Executive coaching',
      'Organizational development',
      'Organizational health assessment',
      'Leadership team alignment',
      'Adizes methodology',
      'Everything DiSC facilitation',
      'Strategic planning',
      'Faith-based leadership coaching',
    ],
    knowsLanguage: ['en', 'he'],
    sameAs: [LINKEDIN, WWG],
  }
}

// Site-wide business entity — emitted on Home.
export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'Reframed Reality, LLC',
    description:
      'Organizational development and executive coaching consultancy: organizational health assessment, leadership team alignment, strategic planning, DiSC facilitation, and faith-based leadership coaching for CEOs, executives, and national associations.',
    url: SITE_URL,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Reston',
      addressRegion: 'VA',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Washington DC–Baltimore Area' },
      { '@type': 'AdministrativeArea', name: 'Northern Virginia' },
      { '@type': 'Country', name: 'United States' },
    ],
    founder: { '@id': PERSON_ID },
    sameAs: [LINKEDIN, WWG],
    // Real client quotes from src/data.js — no invented ratings.
    review: testimonials.slice(0, 4).map(t => ({
      '@type': 'Review',
      reviewBody: t.q,
      author: { '@type': 'Person', name: t.who },
    })),
  }
}

// The book — emitted on the Working With God page.
export function bookSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'Working With God: The Ten Modes of Elevated Leadership',
    author: { '@id': PERSON_ID },
    url: WWG,
    description:
      'Introduces the Modal Leadership method — ten operating modes that help leaders analyze, pray, discern, decide, and implement, bringing God into real business decisions.',
    inLanguage: 'en',
    workExample: [
      { '@type': 'Book', bookFormat: 'https://schema.org/Hardcover' },
      { '@type': 'Book', bookFormat: 'https://schema.org/EBook' },
      { '@type': 'Book', bookFormat: 'https://schema.org/AudiobookFormat' },
    ],
  }
}

// items: [{ name, path }] — Home is prepended automatically.
export function breadcrumbSchema(items) {
  const list = [{ name: 'Home', path: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}

// faqs: [{ q, a }] — must be the same array the visible FAQ renders.
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
