# Deploying

Netlify. Production from `main`; every other branch gets its own reviewable URL.

## One-time setup

1. **He creates the Netlify account**, or you create it and add him as an owner.
   It should be in his name — if the relationship ends, the site should not
   leave with you.
2. **New site → import from GitHub** → pick this repo.
   Build command and publish directory come from `netlify.toml`; leave the
   defaults alone.
3. **Environment variables** (Site settings → Environment):

   | Key | Value |
   |---|---|
   | `VITE_FORM_ENDPOINT` | leave UNSET to use Netlify Forms, or set to a Formspree/Web3Forms URL |

4. **Forms.** The three forms are pre-registered via the static copies in
   `index.html`. After the first deploy, check Site settings → Forms lists
   `contact`, `roundtable` and `dailyQuote`. If it does not, the build-time
   crawler did not see them and nothing will be delivered.
5. **Notifications** → send form submissions to his inbox. Do this before
   launch, not after: a form that silently swallows a lead is the worst
   possible failure here.
6. **Domain.** Add `workingwithgod.live`, then repoint the A and CNAME records
   at GoDaddy. Do NOT touch the MX or TXT records — that is his email.

## Staging

Nothing extra to configure. Once the repo is connected:

- **Any branch** → `https://<branch>--<site>.netlify.app`
- **Any pull request** → its own preview URL, posted on the PR

So the review loop becomes:

```
git checkout -b round-2
# ...work...
git push -u origin round-2
```

and you send him that URL instead of screenshots. Both are `noindex` at the
header level (see `netlify.toml`), so previews never compete with the real site
in search.

## Before every deploy

```
npm run verify     # build, then the full test suite
```

That catches the things that are invisible in review: a route that stopped
prerendering, a missing meta description, a broken sitemap, three.js leaking
into the initial bundle.

## Deploys cost credits — this is now a real constraint

Netlify moved to credit-based pricing. The free plan is **300 credits a month,
a hard cap**, and a **production deploy costs 15 credits**. That is **20
production deploys a month**, after which every project on the account is
paused and visitors get a "Site not available" page. You cannot buy more
credits on the free plan; you upgrade or you wait for the next cycle.

Deploy previews and branch deploys cost **nothing**. So:

- Work on a branch. Push freely — branch deploys are free and give you a live
  preview URL to send Eliyahu.
- Merge to `main` only when you are actually shipping. Batch several changes
  into one merge rather than merging each one.
- Never spend a production deploy on a content change that the spreadsheet can
  make instead (see below).

Form submissions are free and unlimited on credit plans — that changed on
14 April 2026, before which they cost 1 credit each. If this account is still
on a *legacy* plan the rules are different and worse (100 form submissions per
site per month, and hitting it requires a paid upgrade to restore the account).
Check under Team settings → Usage & billing.

## The spreadsheet backend (`scripts/sheets/Code.gs`)

Submissions go **straight from the browser** to a Google Apps Script web app,
which writes the row and emails Eliyahu the full details. Netlify's outgoing
webhook is no longer involved and must not be re-added: Apps Script answers
every POST with a 302 it cannot suppress, Netlify counts that as a failed
delivery, and Netlify silently disables a webhook after a handful of failures.
That path died while working correctly, which is what broke the pipeline.

Installing or updating the script:

1. Spreadsheet → Extensions → Apps Script. Paste `Code.gs` over everything.
2. Run `setup` once from the dropdown; approve the permission prompt.
3. Deploy → **Manage deployments → pencil icon → Version: New version**.
   Choosing "New deployment" instead mints a *different* URL, leaves the old
   one serving the old code, and the change appears to do nothing.
4. Web app settings must be **Execute as: Me**, **Who has access: Anyone** —
   not "Anyone with a Google Account", which makes it ask visitors to sign in.
5. Put the `/exec` URL in `VITE_SHEET_ENDPOINT` (Netlify → environment
   variables). No `?key=` on the end any more.
6. Run `diagnose` from the dropdown. It checks each link in the chain and names
   the first broken one in plain English.

`npm run test:sheets` runs the script's own test suite (41 checks) in Node
against a mocked Apps Script. It is part of `npm run verify`.

## HubSpot (optional, off by default)

The script can send a copy of each Roundtable and Contact submission to HubSpot
so a registration also becomes a CRM contact. It is **off until configured** —
with no properties set it makes no call and logs nothing, so this ships safely
whether or not anyone decides to use it.

To turn it on, in the Apps Script editor: gear icon (Project Settings) → Script
properties → add `HUBSPOT_PORTAL_ID` (the 7–8 digit Hub ID, found by clicking
the account name top-right in HubSpot) and `HUBSPOT_FORM_ROUNDTABLE` /
`HUBSPOT_FORM_CONTACT` (each form's GUID, from Marketing → Forms → the form →
Get embed code → the `data-form-id` value).

Build those two forms in HubSpot **first**, with field names exactly `email`,
`firstname`, `lastname`, `phone`, `company`, `message`. HubSpot rejects the
whole submission with a 400 if it receives a field the form does not declare.
The forms are never embedded on the site — they exist only as API targets; the
React forms are untouched.

Three things to know:

- The daily-quote list is **deliberately not** sent. HubSpot's free tier caps at
  1,000 contacts and its 2,000-emails-a-month ceiling cannot send a daily quote
  to more than about 66 people, so those subscribers would spend the allowance
  for no benefit.
- The push runs **last**, after the row and the email, and cannot throw. A
  HubSpot outage or a renamed field is recorded on the Status tab and changes
  nothing else.
- Watch the contact count. HubSpot's free tier is **1,000 contacts** (this
  changed from the 1,000,000 that most guides still quote — verify in the actual
  portal). Contacts dedupe by email address, so one person submitting three
  forms is one contact.

## Changing the sponsor without a deploy

The monthly sponsor and the next roundtable date live in the **"Site content"**
tab of the registrations spreadsheet, not in the code. Eliyahu edits a cell and
the page picks it up within five minutes — no commit, no rebuild, no credits.
`src/data.js` still holds the same values as the fallback shown if the sheet
cannot be reached, so keep them roughly current but they are not the source.

To make an edit appear immediately rather than within five minutes, run
`publishContentNow` from the Apps Script dropdown.

## What is NOT automated yet

- No CI. `npm run verify` runs locally, on trust. A GitHub Action running it on
  every PR would be an hour's work and worth it once more than one person is
  touching this.
- No Lighthouse budget in the pipeline.
- Netlify Forms still receives a duplicate copy of every submission
  (`VITE_KEEP_NETLIFY_FORMS=true`) as a shadow store. Compare it against the
  sheet after a month; if they agree, set it to `false` and retire it.
