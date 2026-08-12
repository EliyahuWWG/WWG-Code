import { LINKEDIN, AMAZON, ASIN, EMAIL, RR_SITE, ROUNDTABLE_ADDRESS, endorsements } from '../data'

export const SITE_URL = 'https://workingwithgod.live'
export const SITE_NAME = 'Working With God'

const PERSON_ID = `${SITE_URL}/#eliyahu-lotzar`
const ORG_ID = `${SITE_URL}/#organization`
const BOOK_ID = `${SITE_URL}/#book`

// Dr. Eliyahu Lotzar — used on Home and About.
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Dr. Eliyahu Lotzar',
    honorificSuffix: 'Ed.D., MSW',
    jobTitle: 'Executive Coach, Facilitator & Author',
    description:
      'Executive coach, group facilitator, and author of Working With God: The Ten Modes of Elevated Leadership. Helps Christian business leaders bring God into real operational decisions.',
    url: `${SITE_URL}/about`,
    worksFor: { '@id': ORG_ID },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'St. John Fisher University' },
      { '@type': 'CollegeOrUniversity', name: 'The Hebrew University of Jerusalem' },
    ],
    knowsAbout: [
      'Faith-based leadership',
      'Christian executive coaching',
      'Working With God method',
      'The Ten Modes of Elevated Leadership',
      'Modal Leadership',
      'Group facilitation',
    ],
    author: { '@id': BOOK_ID },
    sameAs: [LINKEDIN, AMAZON, RR_SITE],
  }
}

// The Working With God practice — emitted site-wide on Home.
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'Working With God',
    description:
      'Faith-based leadership coaching, a two-day Master’s Class, an introductory webinar, and a free monthly Roundtable — helping Christian business leaders discern divine direction in strategy, hiring, budgets, and timing. Built on the Ten Modes of Elevated Leadership.',
    url: SITE_URL,
    email: EMAIL,
    founder: { '@id': PERSON_ID },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Northern Virginia' },
      { '@type': 'AdministrativeArea', name: 'Washington, DC Metro' },
      { '@type': 'Country', name: 'United States' },
    ],
    sameAs: [LINKEDIN, AMAZON, RR_SITE],
  }
}

// The book — emitted on The Book page. Real ASIN, no invented ratings.
export function bookSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': BOOK_ID,
    name: 'Working With God: The Ten Modes of Elevated Leadership',
    author: { '@id': PERSON_ID },
    url: AMAZON,
    sameAs: AMAZON,
    isbn: ASIN,
    description:
      'A practical way to partner with God in the middle of your toughest work challenges. Introduces Modal Leadership — the first six modes address the “knowns” of daily operations; the last four engage the “unknown.”',
    inLanguage: 'en',
    workExample: [
      { '@type': 'Book', bookFormat: 'https://schema.org/Hardcover' },
      { '@type': 'Book', bookFormat: 'https://schema.org/EBook' },
      { '@type': 'Book', bookFormat: 'https://schema.org/AudiobookFormat' },
    ],
    // Real endorsements as reviews — no numeric ratings (none are published).
    review: endorsements.map(e => ({
      '@type': 'Review',
      reviewBody: e.q,
      author: { '@type': 'Person', name: e.who },
    })),
  }
}

// The Roundtable — recurring, free, in-person. Emitted on Events + Roundtable.
export function roundtableEventSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'The Working With God Roundtable',
    description:
      'A free, in-person monthly meetup for Christian business leaders — two hours combining leadership practice, scripture, and prayer. Refreshments provided.',
    eventSchedule: {
      '@type': 'Schedule',
      byDay: 'https://schema.org/Wednesday',
      byMonthWeek: 3,
      startTime: '08:00',
      endTime: '09:55',
      repeatFrequency: 'P1M',
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Private room, Starbucks — Chantilly Shopping Center',
      address: ROUNDTABLE_ADDRESS,
    },
    organizer: { '@id': ORG_ID },
    performer: { '@id': PERSON_ID },
    isAccessibleForFree: true,
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
