# Daily quote signup: the welcome sequence

**Status: copy is written and ready. Nothing is connected.** The signup form
collects addresses today and sends nothing, which is worse than not collecting
them — people forget they subscribed and mark the first email as spam.

Everything below is a draft in his voice for him to approve or rewrite. Nothing
here should go out under his name without him reading it.

---

## What needs to happen first (not code)

1. **Pick an ESP.** For this list size and cadence, MailerLite or Buttondown are
   the sane options. ConvertKit if he ever wants to sell the book directly.
2. **Authenticate the sending domain** — SPF, DKIM and DMARC on
   `workingwithgod.live`. A daily send from an unauthenticated domain lands in
   Promotions at best and spam at worst.
   Warning: he may already have MX records for his inbox. Adding a sending
   domain must not touch those.
3. **Point the form at it.** The signup currently posts through
   `submitForm('quote-signup')` in `src/components/forms/submit.js`. Every ESP
   gives you either an endpoint or an embed; wire it there.
4. **Decide the actual cadence.** "Daily quote" means ~250 emails a year. That
   is a real content commitment. A weekly send is far more likely to survive
   contact with his calendar, and the form copy would need to change to match.

---

## Sequence

### Email 1 — immediately on signup
**Subject:** You're in
**Preview:** And here's the first one.

> Thanks for signing up.
>
> Starting tomorrow you'll get one short line from me each workday morning.
> Not a devotional, not a sermon. Usually a sentence or two about the kind of
> decision you're likely to face before lunch.
>
> Here's the first one, so you know what you're getting:
>
> **"You cannot lead from a perspective you have not asked for."**
>
> If it ever stops being useful, the unsubscribe link is at the bottom of every
> one and I will not be offended.
>
> Dr. Eliyahu Lotzar
> Ed.D., MSW

---

### Email 2 — day 3
**Subject:** The difference between for and with
**Preview:** It shows up in the middle of the board meeting, not before it.

> Most leaders I meet work *for* something. For a mission, for their people,
> for their family. The faith-driven ones almost always tell me they work for
> God.
>
> That is a good place to stand. It is not the only one.
>
> Working *for* God usually means you make the plan, then ask Him to bless it.
> The prayer sits on either end of the decision. It rarely sits inside it.
>
> Working *with* God moves the conversation into the decision itself. Not
> "bless this", but "what do You want to do here?"
>
> That is a harder question, because the answer is sometimes no. It is also a
> more useful one.
>
> [Read the longer version →](https://workingwithgod.live/blog/working-with-god-not-just-for-him/)

---

### Email 3 — day 7
**Subject:** Why effort stops working
**Preview:** Almost no stuck leader I've met was trying less hard.

> In thirty years of this work I have almost never met a plateaued leader who
> was not trying hard.
>
> They plateau for lack of perspective, not effort. They are solving the
> problem from inside the same frame that produced it, with more energy each
> time.
>
> Here is something to try this week. Take a decision you have been sitting on.
> Ask what mode you have been operating in on it, and be honest, because it is
> almost certainly your default. Then ask what mode the situation is actually
> asking for.
>
> If those two answers are different, you have found the reason it is stuck.
>
> [More on the Ten Modes →](https://workingwithgod.live/blog/the-ten-modes-explained/)

---

### Email 4 — day 14
**Subject:** An invitation, no charge
**Preview:** Third Wednesdays, near Chantilly.

> A short one.
>
> Once a month I sit down with eight to fifteen owners, CEOs and senior leaders
> near Chantilly, Virginia. Two hours. We take one real leadership challenge,
> open scripture on it, and pray over the actual things — the cash flow
> problem, the partner who is not pulling their weight, the decision someone
> has been avoiding for six weeks.
>
> There is no charge and there is always coffee.
>
> Most people arrive expecting to learn something, and they usually do. The
> thing they mention afterwards is different: it is the relief of saying the
> hard thing out loud in a room where nobody panics.
>
> What is said at the table stays at the table.
>
> [Come once and see →](https://workingwithgod.live/events/)

---

### Email 5 — day 30
**Subject:** Want to talk about something specific?
**Preview:** No pitch. Bring the thing you're stuck on.

> You have been reading these for a month, so let me make one offer and then go
> back to the quotes.
>
> If there is a decision you are carrying — a hire, a number, a conversation
> you keep postponing — I will spend thirty minutes on it with you. No pitch.
> You describe it, I mostly listen, and you leave with one thing to try whether
> or not we ever work together.
>
> [Book a time →](https://workingwithgod.live/book-a-call/)
>
> And if not, that is completely fine. The quotes keep coming either way.

---

## After the sequence

The daily (or weekly) quote takes over. Two rules worth holding to:

- **One idea per send, no housekeeping.** The moment these become newsletters
  with three sections, open rates fall off.
- **Link out roughly one send in five, not every time.** A list that only ever
  gets asked for something stops opening.

## Measurement

Tag the links with UTMs so the traffic is attributable:
`?utm_source=daily-quote&utm_medium=email&utm_campaign=welcome-3`

`useCalendly.js` already forwards `utm_*` into Calendly, so a booking that
started in an email will carry that attribution all the way into his calendar.
