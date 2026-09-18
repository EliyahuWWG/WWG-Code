# Working With God — project instructions

Read this before touching anything. It records the things that have already
gone wrong once, so they don't go wrong again.

## What this is

The website for Dr. Eliyahu Lotzar (workingwithgod.live) — a React/Vite static
site prerendered with `vite-react-ssg`, hosted on Netlify, built and maintained
by EchoPulse. Eliyahu is not technical. He owns the Netlify account and the
GitHub repo; EchoPulse does the work.

## Two repos exist. Only one of them matters.

| Remote | URL | Use it? |
|---|---|---|
| `client` | `github.com/EliyahuWWG/WWG-Code` | **YES — this is the one Netlify deploys from** |
| `origin` | `github.com/shauryak890/reframedrealityreact` | No. Pushing here deploys nothing. |

Always `git push client main`. A push to `origin` looks like it worked and
changes nothing on the live site — this has already happened once.

## Deploys cost real money. Check before you push.

Netlify moved to credit-based pricing. The free plan is **300 credits a month,
a hard cap**, and **a production deploy costs 15 credits**. That is 20 deploys
a month, after which every project on the account is **paused** and visitors
get a "Site not available" page. There is no way to buy more on the free plan.

As of 10 Sep 2026 the balance was around **45 credits — three deploys.**

So:

- **Batch changes.** Ten copy edits in one commit is one deploy. Ten commits is
  ten deploys and a paused site.
- Deploy previews and branch deploys cost **nothing**. Work on a branch, merge
  when you're actually shipping.
- Failed builds cost nothing and publish nothing.
- Never spend a deploy on something the spreadsheet can change (see below).

## Always run this before pushing

```
npm run verify
```

Build + 45 site tests + 50 Apps Script tests. If it fails locally it will fail
on Netlify, and you'll have learned that for free instead of for 15 credits.

## Content Eliyahu changes himself — do NOT put it in code

The **sponsor of the month** and the **next roundtable date** live in the
"Site content" tab of the registrations spreadsheet. He edits a cell; the page
picks it up within five minutes. No commit, no rebuild, no credits.

`src/data.js` still holds the same values as a **fallback** for when the sheet
is unreachable. Keep them roughly current, but they are not the source.
See `src/lib/siteContent.js`.

## Forms go straight to Apps Script. Do not reintroduce the webhook.

The browser posts submissions directly to a Google Apps Script web app
(`scripts/sheets/Code.gs`), which writes the row and emails Eliyahu.

Netlify's outgoing webhook is **deliberately gone**. Apps Script answers every
POST with a 302 it cannot suppress, Netlify counts that as a failed delivery,
and Netlify silently disables a webhook after a handful of failures. That path
died *while working correctly* and took the whole pipeline with it. If someone
suggests wiring it back up, this is why not.

`DEPLOY.md` has the install and update steps for the script, including the
"New version, not New deployment" trap.

## House CSS conventions that will catch you out

- **`<em>` in running text renders BOLD, not italic.** Deliberate — see the
  comment at `p em, li em, .lead em` in `src/index.css`. If you mark up a book
  title with `<em>` it will come out bold and look like shouting.
- **Use `.work-title`** for the title of a work. Italic, inherits weight.
- `btn-onink` = light button for dark sections. `btn-solid` = dark button for
  light sections. Getting these backwards makes a button invisible.
- Line breaks in headings are controlled with a non-breaking space, not `<br>`,
  so they stay correct at every width. See the hero line in `src/pages/Home.jsx`.

## Do not touch without asking

- **DNS at GoDaddy.** The domain now points at Netlify (`A @ 75.2.60.5`,
  `CNAME www workingwithgod.netlify.app`). Every other row on that page is his
  Microsoft email. One wrong deletion takes his mail down.
- **The GoDaddy "Websites + Marketing" subscription.** Cancelling it deletes
  the old site *immediately* — it stops being the fallback the moment you do.
  It waits behind four checks in `docs/WWG-Going-Live.pdf`.
- **Nameservers.** Never. They hand over the whole domain including email.

## Client-facing documentation

- `docs/WWG-Going-Live.pdf` — the DNS migration, written for Eliyahu
- `docs/WWG-Setup-Guide.pdf` — forms, spreadsheet and notification emails

Both have `.source.html` alongside them. Edit the source, re-render, don't
hand-edit the PDF.

## Working style that suits this project

Eliyahu reads instructions literally and is cautious about breaking things —
reasonably so, since his email lives on the same GoDaddy page as his website.
When writing anything for him: name the exact screen, say edit vs add vs
delete explicitly, and tell him how to know it worked. Never write "you can't
break anything" — tell him how to put it back instead.
