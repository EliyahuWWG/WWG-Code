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

## What is NOT automated yet

- No CI. `npm run verify` runs locally, on trust. A GitHub Action running it on
  every PR would be an hour's work and worth it once more than one person is
  touching this.
- No Lighthouse budget in the pipeline.
