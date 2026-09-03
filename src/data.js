// =====================================================================
// WORKING WITH GOD, content model.
// All copy here is real: lifted verbatim from workingwithgod.live or drawn
// from Dr. Lotzar's live materials. Nothing invented. See WWG_REBUILD_SPEC §2.
// =====================================================================

// ---------- Real constants ----------
export const CALENDLY = "https://calendly.com/eliyahu-lotzar-reframedreality";
// The specific event type behind the Services CTA, per Eliyahu 3 Sep. CALENDLY
// above is his whole scheduling page; this goes straight to one meeting type.
// Deliberately without the ?back=1&month=... he sent: those are artifacts of the
// browser session he copied it from, and month= would pin the calendar to
// September 2026 for good, so from October it would open on a month in the past.
export const CALENDLY_ZOOM = "https://calendly.com/eliyahu-lotzar-reframedreality/zoom-with-eliyahu-lotzar";
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
// ===========================================================================
//  MONTHLY ROUNDTABLE UPDATE  <-- the only two lines that change each month
// ===========================================================================
//  Eliyahu updates these on the 3rd Wednesday, after the session or the day
//  after. Edit the two strings below, save, commit, push. Nothing else moves.
//
//    NEXT_ROUNDTABLE  the date shown under "Next meeting"
//    SPONSOR          who is sponsoring, shown under "September's Sponsor"
//
//  The sponsor LABEL derives its month from NEXT_ROUNDTABLE automatically, so
//  changing the date is enough to relabel it. See roundtableSponsorLabel().
//
//  SPONSOR is an object so the name can carry a link. `href` and `creds` are
//  both optional — leave either out and that part is simply not rendered, so a
//  sponsor with no website still works without touching the page.
// ===========================================================================
export const NEXT_ROUNDTABLE = "September 16th";
export const SPONSOR = {
  name: "Lyle Martin",
  creds: "BFA, CEPA",
  role: "Financial Advisor with Thrivent\u2019s Northeast Advisor Group",
  href: "https://connect.thrivent.com/lyle-martin",
};

// "September 16th" -> "September's Sponsor". Falls back to a plain "Sponsor"
// if the date is ever left as TBD or written in a form with no month in it.
export function roundtableSponsorLabel(next = NEXT_ROUNDTABLE) {
  const month = String(next).trim().split(/\s+/)[0];
  const known = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  return known.includes(month) ? `${month}\u2019s Sponsor` : "Sponsor";
}

// ===========================================================================
//  ROUNDTABLE POP-UP COPY  —  his words, from the doc he sent 1 Sep.
//  Shown above the registration form in the pop-up. The month in the heading
//  is derived from NEXT_ROUNDTABLE so changing that one date is still enough.
// ===========================================================================
export function roundtableMonth(next = NEXT_ROUNDTABLE) {
  const month = String(next).trim().split(/\s+/)[0];
  const known = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  return known.includes(month) ? month.toUpperCase() : "";
}

export const roundtableIntro = {
  where: "4412 Chantilly Shopping Center, Chantilly, VA. We\u2019re in Starbucks\u2019 private room in the back.",
  when: "Third Wednesday of each month, 8:00 \u2013 9:55 AM",
  overview: [
    "The Working With God Roundtable is a vibrant, Christ-centered ministry designed to equip local business professionals to integrate their faith with their work. Through monthly gatherings, we offer a space to grow your leadership ability, connect with like-minded individuals, explore practical topics like time management, organizational development, what God wants in your marketing copy, and more\u2014all with expertise, prayer, and a biblical lens.",
    "Whether you\u2019re a seasoned business owner, organizational professional, or just starting out, join us in Working With God.",
  ],
  series: { lead: "We are currently in a series of sessions exploring ", link: "The Ten Modes of Elevated Leadership", href: "/blog/the-ten-modes-explained" },
};

// What happens in the room, per Eliyahu 27 Aug.
export const roundtableWhatHappens = [
  "Learning, conversation, increased self-awareness, increased connection with God, and business application",
  "One leadership topic each month, taken from faith-forward business and thought leaders",
  "Current series: The Ten Modes of Elevated Leadership in practice",
  "Fellowship and professional networking",
];

// Replaces the old "Topics have included" tag row.
export const roundtableWhoShouldAttend = [
  "Leaders, whether you lead from above, beside, below, or all three.",
  "Those who want to use the WWG Ten Modes of Elevated Leadership method along with other methods to walk more closely with God in your work, your career, and your relationships",
  "Typically it\u2019s for those in Northern Virginia close enough to meet in person, but you\u2019re welcome wherever you are coming from!",
];

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
    n: "04", title: "“Master’s Class” Two-Day Immersion", tag: "", body: "We will spend two days deep in the Ten Modes of Elevated Leadership, so you come away with Godly perspective on your most complex operational matters.", // Per Eliyahu 27 Aug: this goes to the Master's Class section on /services,
    // NOT straight to Calendly. Someone reading about a two-day immersion is not
    // ready to book a time slot yet.
    cta: "Find out more", href: "/services#masters-class", external: false, }, {
    // Fifth way in, per Eliyahu 3 Sep. It was a trailing sentence under the list
    // and read like an afterthought; it is an offering like the rest.
    n: "05", title: "Read my book", tag: "", body: "Working With God: The Ten Modes of Elevated Leadership. The whole method, in your own time, if you would rather start on your own.",
    cta: "Read my book", href: "/the-book", external: false,
    cover: { webp: "/book-cover.webp", jpg: "/book-cover.jpg", alt: "Working With God: The Ten Modes of Elevated Leadership, by Dr. Eliyahu Lotzar" }, },
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
// ---------- Podcast / interview appearances (Speaking page) ----------
// Sent by Eliyahu 27 Aug. He asked for these "someplace"; the Speaking page is
// where a booker looks for evidence he can hold a room, so they live there.
//
// `kind` decides what the card does, and it is deliberately honest:
//   youtube  real inline playback, facade first so no player JS loads up front
//   apple    real inline playback via Apple's own embed player
//   link     opens in a new tab, and is NOT given a play button, because
//            neither host publishes an embed we can depend on. A play button
//            that navigates away is a lie to the person clicking it.
export const appearances = [
  {
    kind: "youtube",
    id: "mGIw56y3uHQ",
    t: "Follower of One: Meet Our Member",
    where: "YouTube",
    href: "https://www.youtube.com/watch?v=mGIw56y3uHQ",
  },
  {
    kind: "apple",
    t: "E165: Paige Whitaker and Dr. Eliyahu Lotzar",
    where: "Apple Podcasts",
    note: "His segment starts around 20:30.",
    // Apple's embed host mirrors the public URL path. `t` is seconds.
    embed: "https://embed.podcasts.apple.com/it/podcast/e165-paige-whitaker-and-dr-eliyahu-lozar-double-feature/id1679055134?i=1000769618129&t=1230",
    href: "https://podcasts.apple.com/it/podcast/e165-paige-whitaker-and-dr-eliyahu-lozar-double-feature/id1679055134?i=1000769618129",
  },
  {
    kind: "link",
    t: "Walk By Faith",
    where: "Talks For Christ",
    href: "https://talksforchrist.com/podcasts/walk-by-faith/",
  },
  {
    kind: "link",
    t: "On intent and the personal growth journey",
    where: "LinkedIn",
    href: "https://www.linkedin.com/posts/marc-stoecker_intent-personalgrowthjourney-ugcPost-7432076857531047936-Ovzh/",
  },
];

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
// Verbatim from Eliyahu, 27 Aug. Order matters: the Services page numbers these
// 01..04 from the array index, so Leadership Growth must stay first.
// NOTE(client): 03 and 04 are written in the third person because he wrote them
// that way. Everything else on the site is first person. Worth asking him.
export const coachingPoints = [
  { t: "Leadership Growth", d: "The \u201CWhy\u201D of coaching is simple: being a better you. That may mean just needing a thought partner, or maybe it means needing a breakthrough, but loving what you do more and doing it better means leadership growth." },
  { t: "An Expansive Leadership Toolkit", d: "More than 25 leadership frameworks, plus business and organizational experience in multiple sectors, help bring you through your specific challenge or opportunity." },
  { t: "Deep Listening", d: "He doesn\u2019t just give advice. Dr. Lotzar is a soft skills and organizational culture expert with decades of counseling and transformational coaching experience. He hears you and helps you get results." },
  { t: "Two Types of Coaching", d: "Option One is thought-partnership coaching, for situations where a neutral sounding board and experienced thought partner is sufficient. We meet once a month with an extendable six-month agreement. Option Two is transformational coaching for when you want to move past a plateau or change the relationships around you. We meet every two weeks for the first two months, you have operational \u201Cto-do\u201D homework in between sessions, and then we taper to once a month in a six-month extendible agreement.", bold: ["Option One", "Option Two"] },
];

// Set apart on the Services page, under the coaching button. His pick.
export const coachingScripture = {
  text: "Two are better than one, because they have a good return for their labor\u2026 [and] a cord of three strands is not easily broken.",
  ref: "Ecclesiastes 4:9-12",
};

export const mastersClassPoints = [
  { t: "Here’s How It Works", d: "We spend quality time exploring each of the Ten Modes. For each mode we focus on the concept, the experience, and the application of that mode to one or more of your current challenges or opportunities. You experience the fellowship of fellow professionals who want to advance in intimacy with God at least as much as they want to advance their business, organizational, or career situation. There are learnings, prayers, insights, take-away tools, and a powerful sense of actualizing possibility. And of course, food and drink." },
  { t: "Break the Pattern", d: "Move beyond old defaults to see the situation, and yourself, with Godly perspective." },
  { t: "The Ten Modes of Elevated Leadership", d: "Learn the modes and build “Modal Agility”, the skill of shifting to the mode each situation actually needs." },
  { t: "Results", d: "You are able to flow more easily between modes and more closely follow where God is leading. That increased modal agility brings increased mission success and spiritual strength and contentment." },
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
