import { describe, it, expect } from 'vitest'
import { merge, hasText } from '../src/lib/siteContent'
import {
  parseISODate, formatMeetingDate, thirdWednesday, thirdWednesdayOnOrAfter, ensureFutureISO,
} from '../src/lib/meetingDate'
import {
  SPONSOR_LINE, NEXT_ROUNDTABLE, NEXT_ROUNDTABLE_ISO, ROUNDTABLE_MEETING_TIME, SANITY,
  roundtableIntro, roundtableWhatHappens, roundtableWhoShouldAttend,
} from '../src/data'
import { roundtableEventSchema } from '../src/seo/schema'

// The sponsor and the meeting date are the two things Eliyahu changes most
// weeks, and they now arrive from the editor rather than from a deploy. That
// makes this file the seam where a half-finished edit, a deleted document, an
// editor that is down, or simply a week where he forgot would otherwise reach
// the live page. Every test here is a way that used to be able to go wrong
// quietly.

const TODAY = '2026-10-01'
const line = text => [{
  _type: 'block', _key: 'b', style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: 's', text, marks: [] }],
}]

describe('falling back to what was deployed', () => {
  it('keeps the deployed values when the editor returns nothing', () => {
    for (const nothing of [null, undefined, {}, 'not an object']) {
      const out = merge(nothing, TODAY)
      expect(out.sponsorLine).toBe(SPONSOR_LINE)
      expect(out.roundtable.next).toBe(NEXT_ROUNDTABLE)
      expect(out.roundtable.time).toBe(ROUNDTABLE_MEETING_TIME)
    }
  })

  // The failure this prevents: clicking into the sponsor field, clicking out,
  // and publishing an empty block that erases the sponsor from the page.
  it('does not let an emptied field wipe the sponsor', () => {
    const out = merge({ sponsorLine: line('   '), roundtableTime: '  ' }, TODAY)
    expect(out.sponsorLine).toBe(SPONSOR_LINE)
    expect(out.roundtable.time).toBe(ROUNDTABLE_MEETING_TIME)
  })

  it('ignores a date the editor could not have produced', () => {
    for (const bad of ['', null, 'October 21st', '2026-13-01', '2026-02-31', '21/10/2026']) {
      expect(merge({ nextRoundtable: bad }, TODAY).roundtable.next).toBe(NEXT_ROUNDTABLE)
    }
  })

  it('takes a real edit', () => {
    const out = merge({ sponsorLine: line('Someone Else'), nextRoundtable: '2026-11-18' }, TODAY)
    expect(out.sponsorLine[0].children[0].text).toBe('Someone Else')
    expect(out.roundtable.next).toBe('November 18th')
  })
})

describe('the date never being in the past', () => {
  // If he has not got to it yet, the page would otherwise advertise a meeting
  // that already happened, and the sponsor heading - which takes its month
  // from the same value - would be a month behind with it.
  it('rolls a date that has gone by forward to the next third Wednesday', () => {
    const out = merge({ nextRoundtable: '2026-09-16' }, '2026-10-01')
    expect(out.roundtable.next).toBe('October 21st')
  })

  it('leaves the date alone on the morning of the meeting', () => {
    expect(merge({ nextRoundtable: '2026-10-21' }, '2026-10-21').roundtable.next).toBe('October 21st')
  })

  it('rolls to the following month once this month’s has passed', () => {
    expect(merge({ nextRoundtable: '2026-10-21' }, '2026-10-22').roundtable.next).toBe('November 18th')
  })

  it('crosses the year end', () => {
    expect(thirdWednesdayOnOrAfter('2026-12-17')).toBe('2027-01-20')
  })

  // A date he has deliberately moved is his decision, not a mistake to correct.
  it('never touches a future date, even an unusual one', () => {
    expect(merge({ nextRoundtable: '2026-10-29' }, TODAY).roundtable.next).toBe('October 29th')
    expect(ensureFutureISO('2027-03-02', TODAY)).toBe('2027-03-02')
  })

  it('agrees with the calendar', () => {
    expect([[2026, 10], [2026, 11], [2026, 12], [2027, 1]].map(([y, m]) => thirdWednesday(y, m)))
      .toEqual([21, 18, 16, 20])
  })
})

describe('the wording he can change himself', () => {
  it('falls back to the deployed copy when the editor says nothing', () => {
    const r = merge(null, TODAY).roundtable
    expect(r.where).toBe(roundtableIntro.where)
    expect(r.overview).toEqual(roundtableIntro.overview)
    expect(r.whatHappens).toEqual(roundtableWhatHappens)
    expect(r.whoShouldAttend).toEqual(roundtableWhoShouldAttend)
    expect(r.note).toBe(roundtableIntro.privacy)
  })

  it('takes a real edit to any of it', () => {
    const r = merge({
      roundtableWhere: 'Somewhere else entirely',
      roundtableOverview: ['One paragraph.', 'Two paragraphs.'],
      whatHappens: ['A thing'],
      whoShouldAttend: ['Someone'],
      registrationNote: 'New small print.',
    }, TODAY).roundtable
    expect(r.where).toBe('Somewhere else entirely')
    expect(r.overview).toEqual(['One paragraph.', 'Two paragraphs.'])
    expect(r.whatHappens).toEqual(['A thing'])
    expect(r.whoShouldAttend).toEqual(['Someone'])
    expect(r.note).toBe('New small print.')
  })

  // Adding a row in the editor creates an empty one. Without this the live
  // page renders a stray empty bullet for as long as it takes him to type.
  it('drops the blank rows of a list being edited', () => {
    expect(merge({ whatHappens: ['Kept', '', '   ', 'Also kept'] }, TODAY).roundtable.whatHappens)
      .toEqual(['Kept', 'Also kept'])
  })

  it('does not let an emptied field blank a section', () => {
    const r = merge({ roundtableWhere: '  ', whatHappens: [], whoShouldAttend: ['', ' '] }, TODAY).roundtable
    expect(r.where).toBe(roundtableIntro.where)
    expect(r.whatHappens).toEqual(roundtableWhatHappens)
    expect(r.whoShouldAttend).toEqual(roundtableWhoShouldAttend)
  })

  it('ignores a field that is not the shape it should be', () => {
    const r = merge({ whatHappens: 'not a list', roundtableOverview: { nope: 1 } }, TODAY).roundtable
    expect(r.whatHappens).toEqual(roundtableWhatHappens)
    expect(r.overview).toEqual(roundtableIntro.overview)
  })
})

describe('writing the date out', () => {
  // Parsed by hand rather than with new Date(), which reads a bare date as
  // midnight UTC and shows the day before to anyone west of Greenwich. The
  // Roundtable is in Virginia.
  it('never shifts the day, whatever the timezone', () => {
    expect(formatMeetingDate('2026-10-21')).toBe('October 21st')
    expect(formatMeetingDate('2026-01-01')).toBe('January 1st')
  })

  it('gets the awkward endings right', () => {
    const on = d => formatMeetingDate(`2026-03-${String(d).padStart(2, '0')}`).split(' ')[1]
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 31].map(on))
      .toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '31st'])
  })

  it('refuses a date that does not exist', () => {
    expect(parseISODate('2026-02-31')).toBeNull()
    expect(parseISODate('2026-00-10')).toBeNull()
  })
})

describe('telling real text from empty text', () => {
  it('sees text, and only text', () => {
    expect(hasText(line('Jones'))).toBe(true)
    expect(hasText(line(''))).toBe(false)
    expect(hasText([])).toBe(false)
    expect(hasText(null)).toBe(false)
    expect(hasText([{ _type: 'block' }])).toBe(false)
  })
})

describe('the sponsor line that ships with the site', () => {
  const spans = SPONSOR_LINE[0].children
  const defs = SPONSOR_LINE[0].markDefs

  it('names Michele R. Jones and links both organisations', () => {
    expect(spans.map(s => s.text).join('')).toContain('Michele R. Jones')
    expect(spans.filter(s => s.marks.length).map(s => s.text))
      .toEqual(['Mining For Gems', 'Time To Fly Foundation'])
  })

  // Every mark on a span must point at a link that actually exists, or the
  // words quietly render as plain text and the link is lost.
  it('has a real https link behind every marked span', () => {
    for (const s of spans) {
      for (const m of s.marks) {
        const def = defs.find(d => d._key === m)
        expect(def, `no markDef for ${m}`).toBeTruthy()
        expect(def.href.startsWith('https://')).toBe(true)
      }
    }
  })
})

describe('what the deployed page says about itself', () => {
  it('writes the date out from the one place it is typed', () => {
    expect(NEXT_ROUNDTABLE).toBe(formatMeetingDate(NEXT_ROUNDTABLE_ISO))
    expect(NEXT_ROUNDTABLE).not.toBe('')
  })

  // Without startDate the Event markup is invalid and Google drops it, which
  // is what was happening before: eventSchedule describes the pattern but
  // never says when the next one is.
  it('gives search engines a real date for the next meeting', () => {
    const e = roundtableEventSchema()
    expect(e.startDate).toBe(`${NEXT_ROUNDTABLE_ISO}T08:00`)
    expect(e.endDate).toBe(`${NEXT_ROUNDTABLE_ISO}T09:55`)
    expect(e.location).toBeTruthy()
    expect(e.offers.price).toBe('0')
  })

  it('points at a project, and carries no token', () => {
    expect(SANITY.projectId).toMatch(/^[a-z0-9]+$/)
    expect(SANITY.dataset).toBe('production')
    expect(JSON.stringify(SANITY)).not.toMatch(/sk[A-Za-z0-9]{20}/)
  })
})
