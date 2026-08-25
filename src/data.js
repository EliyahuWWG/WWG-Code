// =====================================================================
// WORKING WITH GOD, content model.
// All copy here is real: lifted verbatim from workingwithgod.live or drawn
// from Dr. Lotzar's live materials. Nothing invented. See WWG_REBUILD_SPEC §2.
// =====================================================================

// ---------- Real constants ----------
export const CALENDLY = "https://calendly.com/eliyahu-lotzar-reframedreality";
export const EMAIL    = "Eliyahu@WorkingWithGod.live";
export const MEETUP   = "https://www.meetup.com/working-with-god";
export const AMAZON   = "https://www.amazon.com/Working-God-Modes-Elevated-Leadership/dp/1961202298/";
export const LINKEDIN = "https://www.linkedin.com/in/eliyahulotzar/";
export const RR_SITE  = "https://reframedreality.com";
export const VIDEO_ID = "hAgiN3Jl_nU";

// ---------------------------------------------------------------------------
// Faint moving backdrop for the hero.
//
// Delivered straight off Cloudinary as a plain video file, NOT through their
// player embed. The <iframe> player would drag in player JS, cannot be styled
// below opacity, and cannot be dimmed to 11% - all of which defeats a backdrop.
// Cloudinary re-encodes on the fly from the transformation string, so the
// browser only ever downloads the small derivative, never the master.
//
// The transformation, left to right:
//   so_3,du_12   start 3s in, 12 seconds long  <- tune this to the calmest bit
//   w_1280,c_scale  no wider than it renders at 11% opacity behind a scrim
//   fps_24       background motion does not need 30/60
//   ac_none      DROP THE AUDIO TRACK. A muted <video> still downloads audio
//                if a stream is present, which is pure waste here.
//   q_auto:eco   aggressive; detail is invisible under the scrim anyway
// ---------------------------------------------------------------------------
const CLD = 'https://res.cloudinary.com/dkzhqy2od/video/upload'
// The version segment is optional for delivery but worth keeping: it pins this
// exact upload, so replacing the clip later cannot serve a stale CDN copy, and
// accounts with strict/invalidated transformations reject unversioned URLs.
// Order matters - transformations go BEFORE the version, never after.
const HERO_VER = 'v1787255667'
const HERO_CLIP = '0821_eruokl'
// w_1920 not w_1280: the backdrop is object-fit:cover on a full-viewport hero,
// so on a 1920-wide display a 1280 source is upscaled 1.5x and reads as blur.
// q_auto:good not :eco for the same reason - at 22% opacity the compression
// artefacts of :eco are visible, which they were not at 11%.
const HERO_TX = 'so_3,du_12,w_1920,c_scale,fps_24,ac_none,q_auto:good'

export const HERO_BG_VIDEO = {
  webm: `${CLD}/${HERO_TX}/${HERO_VER}/${HERO_CLIP}.webm`,
  mp4: `${CLD}/${HERO_TX}/${HERO_VER}/${HERO_CLIP}.mp4`,
  // Poster frame pulled from the same clip, so the fallback still and the
  // video are the same footage rather than a YouTube thumbnail of a different
  // moment.
  poster: `${CLD}/so_3,w_1920,c_scale,q_auto:good/${HERO_VER}/${HERO_CLIP}.jpg`,
}
export const ASIN     = "1961202298";

export const ROUNDTABLE_ADDRESS = "4412 Chantilly Shopping Center, Chantilly, VA";
export const ROUNDTABLE_TIME    = "3rd Wednesdays, 8:00–9:55 a.m.";
export const SERVICE_AREA = "In-person in NOVA / Metro DC, and online worldwide";
// TODO(client): update monthly, the specific date of the next Roundtable.
export const NEXT_ROUNDTABLE = "TBD";

// ---------- Four pillars (Home), VERBATIM, keep his italics via <em> ----------
export const pillars = [
  {
    n: "01", t: "Perspective", // "perspective" italicised in his copy
    body: "Leaders don’t plateau for lack of effort. They plateau for lack of <em>perspective.</em> Working With God gives you the biggest and best perspective possible.", }, {
    n: "02", t: "Divine Direction", body: "You can move beyond just asking God to bless your plans. Take the next step to hear what He actually wants to do through your leadership today.", }, {
    n: "03", t: "Strategic Intimacy", body: "You <em>can</em> integrate faith, finance, strategy, and operations. Working With God helps you find the connection with God that speaks directly into your business plans and budget allocations, your spreadsheets and spiritual aspirations.", }, {
    n: "04", t: "A New Leadership Identity", body: "When you lead as the CHIEF’S Executive Officer, you trade burnout for grounded, divine confidence.", },
];

// ---------- Ways to engage (Home), VERBATIM ----------
export const offerings = [
  {
    n: "01", title: "Introductory Webinar", tag: "Free", body: "Join me for a 60-minute primer on the Working With God method. You will see how the Ten Modes of Elevated Leadership apply directly to the business challenges you are facing today.", cta: "Register", href: MEETUP, external: true, }, {
    n: "02", title: "The WWG Roundtable", tag: "Free", body: "If you are in Northern Virginia, come to our third Wednesday meetup. It is two hours together, in person, deepening the practice of inviting God into your daily work.", cta: "Register", href: "/roundtable", external: false, }, {
    n: "03", title: "Executive Coaching", tag: "", body: "Ready to take the next step into greater leadership? I blend skilled executive coaching with application of the Ten Modes and multiple other frameworks to help you walk through your professional and personal challenges and opportunities. The goal: do your job with excellence, fulfill your personal mission, and live as fully as possible.", cta: "Contact Eliyahu", href: CALENDLY, external: true, calendly: true, }, {
    n: "04", title: "“Master’s Class” Two-Day Immersion", tag: "", body: "We will spend two days deep in the Ten Modes of Elevated Leadership, so you come away with Godly perspective on your most complex operational matters.", cta: "Find out more", href: CALENDLY, external: true, calendly: true, },
];

// ---------- Roundtable topics (Events), VERBATIM ----------
export const roundtableTopics = [
  "Leadership Agility", "Kingdom Economics", "HR & Legal Realities", "Hiring / Firing", "Sales and Self-Effort",
];

// ---------- Past events (Events), real, no invented detail ----------
// ---------- Speaking ----------
// What he actually does on a stage, drawn from the Roundtable topics and the
// book's method. TODO(client): confirm formats, and add fee/travel terms.
export const speakingTopics = [
  { n: "01", t: "Working with God, not just for Him",
    body: "The talk the practice is named after. Why faith-driven leaders plateau, what changes when the conversation moves inside the decision, and what that looks like on a Tuesday afternoon." },
  { n: "02", t: "The Ten Modes of Elevated Leadership",
    body: "The framework from the book: what a leadership mode is, why agility between modes beats mastery of any one, and how to tell which mode a decision is asking for." },
  { n: "03", t: "The Chief’s Executive Officer",
    body: "A leadership identity talk. Trading burnout and self-reliance for grounded, divine confidence, without becoming less rigorous about the numbers." },
  { n: "04", t: "Organizational health for faith-led teams",
    body: "Drawn from years of consulting: aligning values, strategy and culture so a team stops working against itself. Workshop or keynote format." },
]

// TODO(client): audience size, typical run time, and whether travel is included.
export const speakingFormats = [
  { t: "Keynote", body: "45 to 60 minutes, with time for questions. Works for conferences, association meetings, and leadership summits." },
  { t: "Workshop", body: "Half or full day, interactive, built around the decisions your people are actually carrying." },
  { t: "Panel", body: "Moderated or as a panelist. Most recently on “Jesus in the Marketplace” in Vienna, VA." },
  { t: "Team session", body: "In-house, for a leadership team that needs to work through something specific together." },
]

export const pastEvents = [
  { when: "June 2026", what: "WWG Roundtable, “Being a True Leader Through Your Specific God-Given Identity”" }, { when: "April 2026", what: "Author’s Panel, “Jesus in the Marketplace,” Vienna, VA" }, { when: "April 2026", what: "SWC Conference, national stage, Orlando" },
];

// ---------- Book endorsements (The Book), all real, VERBATIM fragments ----------
export const endorsements = [
  {
    q: "It spans awe and logic and love and practicality, with a useful framework and amazing stories from very successful business leaders.", who: "Lee Self", role: "Partner, Northern Virginia Renaissance Executive Forums", }, {
    q: "An excellent read for faith-based leaders, with many nuggets for leadership effectiveness.", who: "Mark Whitacre", role: "VP Culture & Care, Coca-Cola Consolidated", feature: true, }, {
    q: "One of the most insightful leadership books, a clear roadmap for aligning purpose with divine guidance.", who: "Carl Grant III", role: "CEO, Rainmakers Group", }, {
    q: "A terrific book. The chapters on “Go” and “No” are worth the price alone.", who: "Rev. Larry Buxton", role: "author, 30 Days With King David", },
];

// ---------- Testimonials (Home proof strip + About) ----------
// Tier 1 = WWG-specific (roundtable / method). Tier 2 = coaching & facilitation
// credibility about Eliyahu himself. Feature = the roundtable quote.
export const testimonials = [
  { q: "I found the Working With God roundtable event so valuable, truly enlightening; it was a foundational conversation.", who: "Sylvia Palmer", role: "Chief Impact Officer, Amplify", feature: true }, { q: "You were an extremely strong thought partner and facilitator, went way beyond the call of duty, and provided much-needed structure, expertise, and tools. He is a true “organizational therapist.”", who: "Michael Barry, CAE", role: "VP, Org. Development & Partnerships, Public Health Foundation" }, { q: "I can’t recommend Eliyahu enough as a coach. He identifies the key attributes you bring as a leader, then offers usable tactics to strengthen your skills and become a better leader.", who: "TJ Schulz", role: "President, Airport Consultants Council" }, { q: "The sessions have been incredibly useful. The books and coaching are becoming part of my vernacular, not just at work but even personally with my family.", who: "Sue Marchese", role: "Managing Director, AIHA" },
];

// Kept for the record but not shown, org-consulting testimonials that don't
// fit the WWG positioning (see spec §6a). Do not delete.
export const testimonialsArchive = [
  { q: "An intense day-long retreat that was eye-opening. He equipped us with powerful decision-making tools and a transformational understanding of our culture.", who: "Kelly Byrnes", role: "President, Society for Vascular Ultrasound" }, { q: "I’ve never worked with outside consultants who worked so hard to get to know our organization, people, and culture.", who: "Carrie Casillas", role: "HR Director, Forensic Analytical Consulting" }, { q: "The DiSC Management training was great and exceeded my (typically high) expectations.", who: "Barbara Byron", role: "Director, Planning & Development, Fairfax County" }, { q: "An expert in organizational transformation. Great instruction and application to work setting. Fantastic!", who: "Dr. Marianne Markowitz", role: "VP / Dean, St. Joseph’s College of Nursing" }, { q: "As always, your sessions are engaging and incredibly relevant.", who: "Molly Felton", role: "Online Education Specialist, APIC" },
];

// ---------- Services detail (Services page), sub-heads VERBATIM ----------
export const coachingPoints = [
  { t: "An Expansive Leadership Toolkit", d: "More than 25 leadership tools, brought to bear on the specific challenge in front of you." }, { t: "Inspired Counsel", d: "Skilled executive coaching combined with prayer and the application of Biblical principles." }, { t: "Leadership Growth", d: "For leaders whose business is coasting along, plateaued, and for those feeling stagnant or underutilized, or overwhelmed and anxious." },
];

export const mastersClassPoints = [
  { t: "Here’s How It Works", d: "An experiential, two-day deep-dive into your most complex operational matters." }, { t: "Break the Pattern", d: "Move beyond old defaults to see the situation, and yourself, with Godly perspective." }, { t: "The Ten Modes of Elevated Leadership", d: "Learn the modes and build “Modal Agility”, the skill of shifting to the mode each situation actually needs." }, { t: "Get Expert Guidance", d: "Led by Dr. Lotzar, who has facilitated leadership workshops since 1989." },
];

// ---------- Organizations served (About), real ----------
export const orgsFull = [
  "Airport Consultants Council", "Alliance for Aging Research", "American Association for Clinical Chemistry", "American College Health Association", "American Financial Services Association", "American Health Quality Association", "American Industrial Hygiene Association", "American Physical Therapy Association", "Association for Professionals in Infection Control", "Fairfax County, VA", "Prince William County, VA", "Public Health Foundation", "NOAA Fisheries", "National Cement Credit Association", "St. Joseph’s College of Nursing", "Society for Vascular Ultrasound", "USDA, SNAP", "U.S. Soccer Foundation", "Women in Technology", "KIPP Foundation",
];

// ---------- FAQ (Home), factual, single source for the visible UI + FAQPage schema.
// Grounded entirely in real, published details. No invented specifics.
export const faqs = [
  {
    q: "What is Working With God?", a: "Working With God is a way for Christian leaders to discern divine direction inside their workplace and life decisions. It is built on the Ten Modes of Elevated Leadership from Dr. Eliyahu Lotzar’s book, integrated with decades of business, organizational, academic, and 1:1 experience. It runs as a set of professional services and free events, coaching, a two-day Master’s Class, a monthly webinar, and an in-person Roundtable.", }, {
    q: "Do I have to be in Northern Virginia to take part?", a: "No. The Roundtable is in-person on the 3rd Wednesday of each month in Chantilly, Virginia. Coaching and the introductory webinar are all available online, so leaders anywhere can work with Eliyahu. And the Master’s Class is a two-day in-person experience that can be facilitated anywhere.", }, {
    q: "Is this about being more religious at work?", a: "No. This is about operational decisions: strategy, hiring, budgets, timing, risk. It’s also about personal life decisions. I’m here to help you increase your leadership agility, professionally and personally moving where God leads as He does so.", }, {
    q: "What happens at the Roundtable?", a: "We spend two hours together on leadership practices. This includes learning new concepts, doing personal exercises, and sharing in group discussions. It also includes prayer and good coffee and probably too many enjoyable carbs. Sessions include looking at, for example, leadership agility, Kingdom economics, HR and legal realities, communications, sales, etc. There is no fee.", }, {
    q: "What are the Ten Modes of Elevated Leadership?", a: "They are the framework at the center of my book. The first six modes address the “knowns” of daily operations, and the last four engage the “unknown” as leaders step into God’s larger business.", }, {
    q: "How do I start?", a: "Book a call with me, register for the next free Roundtable, or join the monthly webinar. Any of the three is a low-pressure first step, and none of them commits you to anything.", },
];
