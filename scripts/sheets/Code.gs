/**
 * WORKING WITH GOD — form submissions, notification emails, and site content.
 * ============================================================================
 *
 * WHAT THIS DOES
 *   1. The website posts each form submission straight here. This writes a row
 *      to the matching tab and emails Eliyahu the full details.
 *   2. It serves the "Site content" tab to the website as data, so the sponsor
 *      of the month can be changed by editing a cell — no rebuild, no deploy.
 *
 * WHY IT IS SHAPED THIS WAY
 *   The previous version relied on Netlify's outgoing webhook to deliver
 *   submissions here. That can never work reliably: Apps Script answers every
 *   POST with a 302 redirect it cannot be told not to send, Netlify counts a
 *   302 as a failed delivery, and Netlify silently disables a webhook after a
 *   handful of failures. So the webhook died *while working correctly*, with
 *   no alert and no delivery log. Everything that used to compensate for that
 *   — a Netlify API token, a 15-minute polling trigger, two id schemes and a
 *   clock-skew dedupe window — is gone. The browser talks to this script
 *   directly and reads the answer, so a failure is visible in two seconds to
 *   the one person who still has the data: the visitor.
 *
 * INSTALLING — read this, it is the part people get wrong
 *   1. Open the spreadsheet, Extensions > Apps Script. Paste this over
 *      everything in Code.gs. Save.
 *   2. Run `setup` once from the dropdown at the top. Approve the permissions
 *      prompt. It creates the tabs, installs the daily check, and emails you a
 *      test message so you know mail works.
 *   3. Deploy > New deployment > Web app.
 *        Execute as:      Me
 *        Who has access:  Anyone          <-- must be exactly this. Not
 *                                             "Anyone with a Google Account".
 *      Copy the /exec URL. That goes in the website's VITE_SHEET_ENDPOINT.
 *
 *   TO UPDATE THIS CODE LATER: Deploy > Manage deployments > pencil icon >
 *   Version: New version > Deploy. Do NOT choose "New deployment" — that mints
 *   a different URL, leaves the old one serving the old code, and the change
 *   appears to do nothing at all.
 *
 * IF SOMETHING SEEMS WRONG
 *   Run `diagnose` from the dropdown. It checks every link in the chain in
 *   order and tells you the first one that is broken, in plain English.
 */

// ===========================================================================
// SETTINGS — the only lines you would normally change
// ===========================================================================

// Where the "someone submitted a form" emails go. Comma-separate for several.
const NOTIFY_TO = 'eliyahu@workingwithgod.live';

// Turn all notification email off (rows are still written).
const NOTIFY = true;

// A ceiling on notification emails per day. Google allows 100 recipients a day
// on a consumer account. This endpoint is public by necessity, so without a
// ceiling anyone who finds the URL could burn the whole quota in a minute and
// silence every real alert for the rest of the day. Past this number rows are
// still written and the Status tab still records them — only the individual
// emails pause.
const MAX_EMAILS_PER_DAY = 60;

// Tab names.
const STATUS_TAB  = 'Status';
const CONTENT_TAB = 'Site content';

// ===========================================================================
// The forms on the site. One permanent tab each.
// ===========================================================================

// `hubspot` maps our field names to HubSpot's internal property names. A form
// with no `hubspot` block is never sent to HubSpot — the daily-quote list is
// deliberately left out, because on HubSpot's free tier those subscribers would
// eat the 1,000-contact allowance fastest and its 2,000-emails-a-month ceiling
// cannot send a daily quote to more than about 66 people anyway.
const FORMS = {
  'roundtable': {
    label: 'Roundtable',
    subject: 'Roundtable registration',
    columns: ['firstName', 'lastName', 'email', 'phone', 'org'],
    headers: ['First Name', 'Last Name', 'Email', 'Phone', 'Organization'],
    hubspot: { email: 'email', firstName: 'firstname', lastName: 'lastname',
               phone: 'phone', org: 'company' },
  },
  'contact': {
    label: 'Contact',
    subject: 'Contact form message',
    columns: ['name', 'email', 'phone', 'message'],
    headers: ['Name', 'Email', 'Phone', 'Message'],
    hubspot: { email: 'email', name: 'firstname', phone: 'phone', message: 'message' },
  },
  'dailyQuote': {
    label: 'Daily quote',
    subject: 'Daily quote signup',
    columns: ['name', 'email'],
    headers: ['Name', 'Email'],
  },
};

// Used for a form name not listed above, so a form added to the site later
// records itself instead of failing.
const FALLBACK = {
  label: 'Other',
  subject: 'Form submission',
  columns: ['name', 'email', 'phone'],
  headers: ['Name', 'Email', 'Phone'],
};

function specFor(formName) {
  const spec = FORMS[formName] || FALLBACK;
  return {
    label: spec.label,
    subject: spec.subject,
    columns: spec.columns,
    hubspot: spec.hubspot || null,
    // 'Ref' is the submission's own id, generated by the browser before the
    // first attempt and reused on a retry. That is what makes a retry safe:
    // the same submission carries the same Ref, so it can never land twice.
    // The sheet itself is therefore the record of what has been seen — not a
    // stored list that could be cleared or outgrow a storage limit.
    headers: ['Month', 'Received'].concat(spec.headers).concat(['Other', 'Notes', 'Ref']),
  };
}

// ===========================================================================
// Small helpers
// ===========================================================================

/** The spreadsheet this script lives inside. */
function targetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'This script is not attached to a spreadsheet. It has to be created from ' +
      'inside the sheet (Extensions > Apps Script), not from script.google.com.');
  }
  return ss;
}

/**
 * Google Sheets treats a value beginning = + - or @ as a FORMULA, not text.
 * Every value here was typed by a stranger on the internet. Without this, a
 * submission could carry a formula that quietly emails the contents of your
 * sheet somewhere else the moment you open it. A leading apostrophe forces
 * Sheets to keep it as text; the apostrophe itself is not displayed.
 */
function asText(v) {
  if (v === undefined || v === null) return '';
  const s = (typeof v === 'object') ? JSON.stringify(v) : String(v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

/** Removes everything nobody typed. */
function cleanFields(raw) {
  const f = {};
  Object.keys(raw || {}).forEach(function (k) { f[k] = raw[k]; });
  // Never stored: the honeypot, the form's own name, our own plumbing.
  ['form-name', 'form_name', 'bot-field', 'key', 'submissionId'].forEach(function (k) {
    delete f[k];
  });
  // Attached by the browser or the host, not typed by anyone. An IP address
  // and a browser string are personal data we have no reason to keep.
  ['ip', 'user_agent', 'referrer', 'title', 'site_url', 'created_at', 'id',
   'human_fields', 'ordered_human_fields', 'number', 'form_id',
   'summary', 'body', 'first_name', 'last_name', 'company'
  ].forEach(function (k) { delete f[k]; });
  return f;
}

function validEmail(v) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v || '').trim());
}

/** "Ann Ray" from whichever shape the form sent, so subjects stay readable. */
function personName(f) {
  const joined = [f.firstName, f.lastName].filter(Boolean).join(' ').trim();
  return (f.name || joined || f.email || 'someone').toString().slice(0, 80);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Today, in the sheet's own timezone, as a stable key for daily counters. */
function todayKey(tz) {
  return Utilities.formatDate(new Date(), tz || 'UTC', 'yyyy-MM-dd');
}

// ===========================================================================
// Tabs — found and repaired by NAME, never by counting
// ===========================================================================

/**
 * Maps heading text to column number for the row-1 headings this tab actually
 * has: {'Email': 5, 'Ref': 10, ...}.
 *
 * Reading by name rather than by position is the whole point. The owner WILL
 * add a column — a "Paid?" or a "Called them back" — and under the previous
 * version that silently stopped the form recording anything, permanently,
 * because the headings no longer lined up with fixed offsets. Now an inserted
 * column shifts an index in this map and nothing else notices.
 */
function headerMap(sheet) {
  const width = sheet.getLastColumn();
  const map = {};
  if (width < 1) return map;
  const head = sheet.getRange(1, 1, 1, width).getValues()[0];
  for (var i = 0; i < head.length; i++) {
    const name = String(head[i] || '').trim();
    if (name && !map[name]) map[name] = i + 1;
  }
  return map;
}

/** A tab trimmed narrower than we need makes every getRange throw. */
function growTo(sheet, columns) {
  const have = sheet.getMaxColumns();
  if (have < columns) sheet.insertColumnsAfter(have, columns - have);
}

/**
 * Returns the tab for this form, creating it or adding whatever headings are
 * missing. It never refuses and never renames anything the owner made: a
 * heading we need but cannot find is appended at the far right, so the owner's
 * own columns and notes are left exactly where they are.
 */
function ensureTab(ss, spec) {
  var sheet = ss.getSheetByName(spec.label);
  if (!sheet) sheet = ss.insertSheet(spec.label);

  // Either brand new, or an existing tab that was left empty — an earlier
  // version wrote headings only when it created the tab itself, so a tab that
  // existed but was blank never got any and every write went under nothing.
  if (sheet.getLastRow() === 0) {
    growTo(sheet, spec.headers.length);
    sheet.appendRow(spec.headers);
    styleTab(sheet, spec);
    return sheet;
  }

  // Tab exists with content. Add only the headings it is missing.
  var map = headerMap(sheet);
  const missing = spec.headers.filter(function (h) { return !map[h]; });
  if (missing.length) {
    var next = sheet.getLastColumn() + 1;
    growTo(sheet, next + missing.length - 1);
    sheet.getRange(1, next, 1, missing.length).setValues([missing]);
    map = headerMap(sheet);
  }
  if (map['Ref']) { try { sheet.hideColumns(map['Ref']); } catch (e) {} }
  return sheet;
}

/**
 * Looks, not data. A sheet that already carries a filter makes createFilter
 * throw, and a throw here would abort a write that had otherwise succeeded —
 * losing a registration over a column width.
 */
function styleTab(sheet, spec) {
  try {
    sheet.getRange(1, 1, 1, spec.headers.length)
      .setFontWeight('bold').setBackground('#02061f').setFontColor('#f7f4ec');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, spec.headers.length).createFilter();
    sheet.setColumnWidth(1, 90);
    sheet.setColumnWidth(2, 150);
    for (var c = 0; c < spec.columns.length; c++) {
      var wide = spec.columns[c] === 'message' || spec.columns[c] === 'org';
      sheet.setColumnWidth(c + 3, wide ? 360 : 200);
    }
    sheet.setColumnWidth(spec.headers.length - 2, 220);   // Other
    sheet.setColumnWidth(spec.headers.length - 1, 260);   // Notes
    sheet.hideColumns(spec.headers.length);               // Ref
  } catch (cosmetic) {
    console.warn('tab ready, formatting skipped: ' + cosmetic);
  }
}

/** Every Ref already in the tab. The sheet is the record of what we have seen. */
function refsInSheet(sheet, refCol) {
  const seen = {};
  const last = sheet.getLastRow();
  if (!refCol || last < 2) return seen;
  const values = sheet.getRange(2, refCol, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    // A leading apostrophe is how Sheets stores a forced-text value.
    const v = String(values[i][0] || '').trim().replace(/^'/, '');
    if (v) seen[v] = true;
  }
  return seen;
}

// ===========================================================================
// Writing a submission
// ===========================================================================

/**
 * Builds the row in the order this tab's headings actually appear, so a column
 * the owner inserted in the middle does not shift anyone's answers.
 */
function buildRow(sheet, spec, fields, ref, when, tz) {
  const map = headerMap(sheet);
  const width = Math.max(sheet.getLastColumn(), spec.headers.length);
  const row = new Array(width).fill('');

  function put(heading, value) {
    const col = map[heading];
    if (col) row[col - 1] = value;
  }

  put('Month', Utilities.formatDate(when, tz, 'MMMM yyyy'));
  put('Received', Utilities.formatDate(when, tz, 'yyyy-MM-dd HH:mm'));

  // Named fields go under their own headings.
  const used = {};
  for (var i = 0; i < spec.columns.length; i++) {
    const key = spec.columns[i];
    put(spec.headers[i + 2], asText(fields[key]));
    used[key] = true;
  }

  // Anything the form sent that has no column of its own. Never dropped —
  // a field added to the site before it is added here still gets recorded.
  const extras = [];
  Object.keys(fields).forEach(function (k) {
    if (used[k]) return;
    const v = String(fields[k] || '').trim();
    if (v) extras.push(k + ': ' + v);
  });
  if (extras.length) put('Other', asText(extras.join(' | ').slice(0, 900)));

  put('Ref', asText(ref));
  return row;
}

/** Appends the row. Returns the row number it landed on. */
function writeRow(sheet, row) {
  const at = sheet.getLastRow() + 1;
  sheet.getRange(at, 1, 1, row.length).setValues([row]);
  return at;
}

// ===========================================================================
// Telling somebody
// ===========================================================================

/**
 * The submission email. This is the thing the client actually asked for, so it
 * carries everything: who, what form, when, every answer, and a link to the
 * row. Reply-to is the person who submitted, so replying just works.
 */
function notify(spec, fields, when, tz, sheetUrl, rowNumber) {
  if (!NOTIFY) return { sent: false, reason: 'notifications are switched off' };

  const props = PropertiesService.getScriptProperties();
  const key = 'sent:' + todayKey(tz);
  const already = Number(props.getProperty(key) || 0);
  if (already >= MAX_EMAILS_PER_DAY) {
    return { sent: false, reason: 'daily email ceiling reached (' + MAX_EMAILS_PER_DAY + ')' };
  }

  const who = personName(fields);
  // Newlines stripped and length capped: a subject line is the one place a
  // submission could otherwise be made to look like a message from Google.
  const subject = (spec.subject + ' — ' + who).replace(/[\r\n]+/g, ' ').slice(0, 120);

  var body = spec.subject + '\n';
  body += 'Received ' + Utilities.formatDate(when, tz, 'EEEE d MMMM yyyy, h:mm a') + '\n\n';

  // Named fields first, in the order they appear on the form.
  for (var i = 0; i < spec.columns.length; i++) {
    const label = spec.headers[i + 2];
    const value = String(fields[spec.columns[i]] || '').trim();
    body += label + ': ' + (value || '—') + '\n';
  }
  // Then anything else the form sent.
  const named = {};
  spec.columns.forEach(function (c) { named[c] = true; });
  Object.keys(fields).forEach(function (k) {
    if (named[k]) return;
    const v = String(fields[k] || '').trim();
    if (v) body += k + ': ' + v + '\n';
  });

  body += '\nRow ' + rowNumber + ' of the ' + spec.label + ' tab.\n';
  if (sheetUrl) body += sheetUrl + '\n';
  body += '\nThis is sent automatically when someone submits a form on ' +
          'workingwithgod.live. The details above are exactly what they typed.\n';

  const options = { name: 'Working With God website' };
  // Only trust it as a reply address if it is actually an address.
  if (validEmail(fields.email)) options.replyTo = String(fields.email).trim();

  MailApp.sendEmail(Object.assign({
    to: NOTIFY_TO,
    subject: subject,
    body: body,
  }, options));

  props.setProperty(key, String(already + 1));
  return { sent: true };
}

/**
 * One email per topic per day, so a fault that repeats cannot empty the daily
 * mail quota — which would take the ordinary submission alerts down with it.
 * Falls back to the Status tab, because an alert about email is worthless if
 * it can only be delivered by email.
 */
function alertOwner(topic, subject, body) {
  const props = PropertiesService.getScriptProperties();
  const stamp = 'alert:' + topic + ':' + todayKey(sheetTimeZone());
  if (props.getProperty(stamp)) return;

  // Stamped BEFORE the attempt, not after. Stamping only on success means a
  // fault that also breaks email — the likeliest kind — retries on every
  // single submission and fills the Status tab with the same line.
  props.setProperty(stamp, '1');

  try {
    if (NOTIFY) {
      MailApp.sendEmail({ to: NOTIFY_TO, subject: subject, body: body,
                          name: 'Working With God website' });
    }
  } catch (mailFailed) {
    console.error('alert email failed: ' + mailFailed);
  }
  // Always, not just on failure: the Status tab is the record that survives a
  // deleted email.
  logStatus(subject, body);
}

/**
 * The heartbeat and the incident log in one tab. Written on every submission
 * and every daily check, so a Status tab whose last line is old is itself the
 * warning — there is no other way for a non-technical owner to see silence.
 */
function logStatus(headline, detail) {
  try {
    const ss = targetSheet();
    var sheet = ss.getSheetByName(STATUS_TAB);
    if (!sheet) {
      sheet = ss.insertSheet(STATUS_TAB);
      sheet.appendRow(['When', 'What happened', 'Detail']);
      try {
        sheet.getRange(1, 1, 1, 3).setFontWeight('bold')
          .setBackground('#02061f').setFontColor('#f7f4ec');
        sheet.setFrozenRows(1);
        sheet.setColumnWidth(1, 160);
        sheet.setColumnWidth(2, 320);
        sheet.setColumnWidth(3, 520);
      } catch (e) {}
    }
    const tz = ss.getSpreadsheetTimeZone() || 'UTC';
    sheet.appendRow([
      Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'),
      String(headline).slice(0, 300),
      String(detail || '').slice(0, 900),
    ]);
    // Keep it from growing without limit.
    const last = sheet.getLastRow();
    if (last > 400) sheet.deleteRows(2, last - 300);
  } catch (e) {
    console.error('could not write Status: ' + e);
  }
}

function sheetTimeZone() {
  try { return targetSheet().getSpreadsheetTimeZone() || 'UTC'; }
  catch (e) { return 'UTC'; }
}

// ===========================================================================
// Receiving a submission
// ===========================================================================

/**
 * Accepts what the browser actually sends. The site posts JSON with a
 * text/plain content type — deliberately, because that is still a CORS
 * "simple" request, so the browser sends it without a preflight that Apps
 * Script cannot answer. Form-encoded bodies are accepted too, so a plain HTML
 * form or an old build still works.
 */
function parseIncoming(e) {
  var fields = {};
  const contents = (e && e.postData && e.postData.contents) || '';

  if (contents) {
    const trimmed = contents.trim();
    if (trimmed.charAt(0) === '{') {
      try {
        const parsed = JSON.parse(trimmed);
        // A Netlify-shaped payload keeps the answers one level down.
        fields = (parsed && parsed.data && typeof parsed.data === 'object')
          ? Object.assign({}, parsed, parsed.data)
          : parsed;
      } catch (bad) {
        throw new Error('The body was not readable JSON.');
      }
    } else {
      trimmed.split('&').forEach(function (pair) {
        if (!pair) return;
        const bits = pair.split('=');
        const k = decodeURIComponent(bits[0].replace(/\+/g, ' '));
        const v = decodeURIComponent((bits.slice(1).join('=') || '').replace(/\+/g, ' '));
        fields[k] = v;
      });
    }
  }
  // Query-string values too, so a submission can be tested from a browser bar.
  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (k) {
      if (fields[k] === undefined) fields[k] = e.parameter[k];
    });
  }

  const formName = String(fields['form-name'] || fields['form_name'] || '').trim();
  return {
    form: formName,
    // The browser mints this before its first attempt and reuses it on a
    // retry, which is what makes retrying safe.
    ref: String(fields.submissionId || fields.id || '').trim(),
    honeypot: String(fields['bot-field'] || '').trim(),
    fields: cleanFields(fields),
  };
}

/**
 * The one entry point for a submission.
 *
 * Contract: never throw, always answer. The browser is waiting on this and
 * shows the visitor whatever it says, so an unhandled error would be shown to
 * a real person mid-registration. Every answer is JSON with an `ok` flag.
 */
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length > 100000) {
      alertOwner('toobig', 'Working With God — an oversized submission was refused',
        'Something posted a body of ' + raw.length + ' characters to the form ' +
        'address, which is far larger than any real submission. It was refused. ' +
        'No action is needed unless a real person tells you their message would ' +
        'not send.');
      return json({ ok: false, error: 'too large' });
    }

    const payload = parseIncoming(e);

    // The honeypot is a field hidden from people and irresistible to bots.
    // Answer normally so the bot learns nothing.
    if (payload.honeypot) return json({ ok: true, skipped: 'bot' });

    if (!payload.form) return json({ ok: false, error: 'no form name' });

    const ss    = targetSheet();
    const tz    = ss.getSpreadsheetTimeZone() || 'UTC';
    const spec  = specFor(payload.form);
    const when  = new Date();

    const lock = LockService.getScriptLock();
    // Short: two people submitting in the same second is the only contention
    // here, and the browser is waiting. A long wait would time out the request
    // that is being protected.
    const locked = lock.tryLock(8000);
    try {
      const sheet  = ensureTab(ss, spec);
      const map    = headerMap(sheet);
      const refCol = map['Ref'];
      const ref    = payload.ref ||
                     ('s_' + payload.form + '_' + Utilities.formatDate(when, tz, 'yyyyMMddHHmm') +
                      '_' + String(payload.fields.email || '').toLowerCase());

      const seen = refsInSheet(sheet, refCol);
      if (seen[ref]) {
        // A retry of something already recorded. Answering ok is correct: from
        // the visitor's point of view it did work, and it is on the sheet.
        return json({ ok: true, duplicate: true });
      }

      const row = buildRow(sheet, spec, payload.fields, ref, when, tz);
      const at  = writeRow(sheet, row);

      // The row exists from here on. Nothing below may undo that, and nothing
      // below may cause this to be written a second time.
      var mail = { sent: false, reason: 'not attempted' };
      try {
        mail = notify(spec, payload.fields, when, tz, ss.getUrl() || '', at);
      } catch (mailFailed) {
        mail = { sent: false, reason: String(mailFailed) };
      }

      if (!mail.sent) {
        // This used to be swallowed, which meant a registration could be
        // recorded with nobody told and the Status tab still reading "all
        // good". Silence about a missing notification is the worst outcome
        // here, so it is recorded even when it cannot be emailed.
        PropertiesService.getScriptProperties()
          .setProperty('mailfail:' + todayKey(tz), '1');
        logStatus('A submission was saved but the email did NOT send',
          spec.label + ' row ' + at + ' — ' + mail.reason +
          '. The details are safe in the sheet. Check the row.');
        alertOwner('mailfail',
          'Working With God — a form was saved but the email did not send',
          'Someone submitted the ' + spec.label + ' form and it is safely on ' +
          'row ' + at + ' of your spreadsheet, but the notification email ' +
          'could not be sent (' + mail.reason + ').\n\n' +
          'Nothing is lost — open the sheet to see it. If this keeps happening, ' +
          'send us a screenshot of the Status tab.');
      } else {
        logStatus('New ' + spec.label + ' submission',
          personName(payload.fields) + ' — row ' + at + ', email sent.');
      }

      // Last, and strictly additive. Skips silently when HubSpot is not set up.
      const hs = pushToHubSpot(payload.form, spec, payload.fields);
      if (!hs.ok && hs.reason !== 'not configured' && hs.reason !== 'form not mapped to HubSpot') {
        // Worth recording, not worth alarming anyone: the sheet has the data.
        logStatus('HubSpot copy did not go through',
          spec.label + ' row ' + at + ' — ' + hs.reason +
          '. The row and the email are unaffected.');
      }

      return json({ ok: true, row: at, emailed: mail.sent });
    } finally {
      if (locked) { try { lock.releaseLock(); } catch (e2) {} }
    }
  } catch (err) {
    // Answering with ok:false rather than throwing: a thrown error becomes an
    // HTML error page, which the browser cannot read and the visitor cannot
    // act on.
    try {
      alertOwner('writefail', 'Working With God — a form submission could not be saved',
        'A submission arrived but could not be written to the spreadsheet.\n\n' +
        'The error was: ' + err + '\n\n' +
        'Run "diagnose" from the Apps Script editor, or send us this message.');
    } catch (e3) {}
    return json({ ok: false, error: String(err) });
  }
}

// ===========================================================================
// HubSpot — optional, additive, and off until it is configured
// ===========================================================================

/**
 * Sends a copy of the submission to HubSpot so a registration also becomes a
 * contact in the CRM the client already uses.
 *
 * Three rules, and they are the whole design:
 *   1. It runs LAST, after the row is written and the email has been sent.
 *   2. It cannot throw. A HubSpot outage, a renamed field, a rate limit — none
 *      of it may reach the visitor or undo anything already done.
 *   3. It is OFF until someone puts the ids in Script Properties. No config,
 *      no call, no error. So this can ship before anyone has decided.
 *
 * The spreadsheet stays the record of truth. If HubSpot drifts out of sync the
 * Status tab says so and the data is still all in the sheet.
 *
 * Configure in the Apps Script editor: the gear icon (Project Settings) >
 * Script properties. Add:
 *      HUBSPOT_PORTAL_ID          the 7-8 digit Hub ID
 *      HUBSPOT_FORM_ROUNDTABLE    that form's GUID
 *      HUBSPOT_FORM_CONTACT       that form's GUID
 * Neither value is secret — both appear in any HubSpot embed code on a public
 * page, which is why the endpoint needs no password. They live in properties
 * rather than in this file so a form can be repointed without editing code.
 */
function pushToHubSpot(formName, spec, fields) {
  try {
    if (!spec.hubspot) return { ok: false, reason: 'form not mapped to HubSpot' };

    const props = PropertiesService.getScriptProperties();
    const portalId = String(props.getProperty('HUBSPOT_PORTAL_ID') || '').trim();
    const formGuid = String(
      props.getProperty('HUBSPOT_FORM_' + String(formName).toUpperCase()) || '').trim();
    if (!portalId || !formGuid) return { ok: false, reason: 'not configured' };

    // Only fields the HubSpot form actually declares. Anything else comes back
    // as a 400 FIELD_NOT_IN_FORM_DEFINITION, so page details go in `context`.
    const payloadFields = [];
    Object.keys(spec.hubspot).forEach(function (ours) {
      const value = String(fields[ours] === undefined ? '' : fields[ours]).trim();
      if (!value) return;
      payloadFields.push({ objectTypeId: '0-1', name: spec.hubspot[ours], value: value });
    });
    if (!payloadFields.length) return { ok: false, reason: 'nothing to send' };

    const res = UrlFetchApp.fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/' +
        encodeURIComponent(portalId) + '/' + encodeURIComponent(formGuid),
      {
        method: 'post',
        contentType: 'application/json',
        muteHttpExceptions: true,     // a 4xx must not throw
        payload: JSON.stringify({
          submittedAt: String(Date.now()),
          fields: payloadFields,
          context: {
            pageUri: 'https://workingwithgod.live/',
            pageName: spec.subject,
          },
        }),
      });

    const code = res.getResponseCode();
    if (code >= 200 && code < 300) return { ok: true, reason: 'ok' };
    return { ok: false, reason: 'HubSpot said ' + code + ': ' +
             String(res.getContentText() || '').slice(0, 300) };
  } catch (err) {
    return { ok: false, reason: String(err) };
  }
}

// ===========================================================================
// Site content — the sponsor of the month, editable with no deploy
// ===========================================================================

/**
 * The default rows for the content tab. Key, value, and a plain-English note
 * telling the owner what the cell controls. The website falls back to the
 * values built into it if this tab is ever empty or unreachable, so a mistake
 * here can leave the sponsor stale but can never leave the page broken.
 */
const CONTENT_DEFAULTS = [
  ['sponsor.name',   'Lyle Martin', 'The sponsor\'s name, shown under "September\'s Sponsor"'],
  ['sponsor.creds',  'BFA, CEPA',   'Letters after the name. Leave blank for none.'],
  ['sponsor.role',   'Financial Advisor with Thrivent’s Northeast Advisor Group',
                     'The line under the name. Leave blank for none.'],
  ['sponsor.href',   'https://connect.thrivent.com/lyle-martin',
                     'Link for the sponsor\'s name. Leave blank and it is plain text.'],
  ['roundtable.next', 'September 16th',
                      'The date under "Next meeting". The sponsor heading takes its month from this.'],
];

function ensureContentTab(ss) {
  var sheet = ss.getSheetByName(CONTENT_TAB);
  if (sheet) return sheet;
  sheet = ss.insertSheet(CONTENT_TAB);
  sheet.appendRow(['Setting', 'Value', 'What this changes']);
  sheet.getRange(2, 1, CONTENT_DEFAULTS.length, 3).setValues(CONTENT_DEFAULTS);
  try {
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold')
      .setBackground('#02061f').setFontColor('#f7f4ec');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 380);
    sheet.setColumnWidth(3, 420);
    sheet.getRange(1, 1, sheet.getMaxRows(), 1).setFontFamily('Courier New');
  } catch (e) {}
  return sheet;
}

/** Reads the content tab into {sponsor: {...}, roundtable: {...}}. */
function readContent() {
  const ss = targetSheet();
  const sheet = ss.getSheetByName(CONTENT_TAB);
  if (!sheet || sheet.getLastRow() < 2) return {};
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const out = {};
  rows.forEach(function (r) {
    const key = String(r[0] || '').trim();
    if (!key) return;
    const value = String(r[1] === null || r[1] === undefined ? '' : r[1]).trim();
    const bits = key.split('.');
    if (bits.length === 2) {
      if (!out[bits[0]]) out[bits[0]] = {};
      out[bits[0]][bits[1]] = value;
    } else {
      out[key] = value;
    }
  });
  return out;
}

/**
 * What the website asks for. Public, and deliberately dull: the sponsor is
 * already printed on a public page, and an earlier version of this endpoint
 * returned the spreadsheet's name and tab list to anyone who asked, which is
 * nobody's business.
 *
 * Cached for five minutes so a burst of visitors cannot exhaust the script's
 * execution quota, and so the page stays fast. An edit to the sponsor is live
 * within five minutes without any rebuild.
 */
function doGet(e) {
  const what = (e && e.parameter && e.parameter.what) || 'content';
  if (what !== 'content') return json({ ok: true });

  const cache = CacheService.getScriptCache();
  const hit = cache.get('content');
  if (hit) {
    return ContentService.createTextOutput(hit)
      .setMimeType(ContentService.MimeType.JSON);
  }
  var body;
  try {
    body = JSON.stringify({ ok: true, content: readContent() });
  } catch (err) {
    body = JSON.stringify({ ok: false, error: 'content unavailable' });
  }
  try { cache.put('content', body, 300); } catch (e2) {}
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

/** Clears the five-minute cache so a sponsor edit shows immediately. */
function publishContentNow() {
  try { CacheService.getScriptCache().remove('content'); } catch (e) {}
  const c = readContent();
  logStatus('Site content republished',
    'Sponsor is now: ' + ((c.sponsor && c.sponsor.name) || '(blank)'));
  return c;
}

// ===========================================================================
// Health — the daily check and the Monday summary
// ===========================================================================

/**
 * Runs once a day. Its job is to put a dated line on the Status tab whether or
 * not anything happened, so that an old last line means something. A heartbeat
 * that only appears when there is news cannot distinguish "quiet" from "dead".
 */
function dailyCheck() {
  const tz = sheetTimeZone();
  const props = PropertiesService.getScriptProperties();
  const failedToday = props.getProperty('mailfail:' + todayKey(tz));
  var quota = -1;
  try { quota = MailApp.getRemainingDailyQuota(); } catch (e) {}

  logStatus('Daily check — all fine',
    'Emails left to send today: ' + (quota < 0 ? 'unknown' : quota) +
    (failedToday ? '. NOTE: an email failed to send today.' : '') + '.');

  if (quota === 0) {
    alertOwner('quota', 'Working With God — today\'s email limit is used up',
      'Google allows a limited number of emails a day from this account and ' +
      'today\'s are gone. Form submissions are still being saved to the ' +
      'spreadsheet — only the notification emails are paused, and they resume ' +
      'automatically tomorrow.');
  }
}

/**
 * Monday morning. This is the signal the owner actually reads: a number that
 * arrives whether or not anything happened, so an email that does NOT arrive
 * is itself the alarm.
 */
function weeklyDigest() {
  if (!NOTIFY) return;
  const ss = targetSheet();
  const tz = ss.getSpreadsheetTimeZone() || 'UTC';
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  var total = 0;
  var lines = [];
  Object.keys(FORMS).forEach(function (name) {
    const spec = specFor(name);
    const sheet = ss.getSheetByName(spec.label);
    if (!sheet || sheet.getLastRow() < 2) { lines.push(spec.label + ': 0'); return; }
    const map = headerMap(sheet);
    const col = map['Received'];
    if (!col) { lines.push(spec.label + ': (cannot read)'); return; }
    const values = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).getValues();
    var n = 0;
    values.forEach(function (v) {
      const when = new Date(String(v[0]).replace(/-/g, '/'));
      if (!isNaN(when.getTime()) && when >= since) n++;
    });
    total += n;
    lines.push(spec.label + ': ' + n);
  });

  MailApp.sendEmail({
    to: NOTIFY_TO,
    name: 'Working With God website',
    subject: 'Website: ' + total + ' submission' + (total === 1 ? '' : 's') + ' last week',
    body:
      'A weekly note so you know the website is still collecting properly.\n\n' +
      lines.join('\n') + '\n\n' +
      'Total: ' + total + '\n\n' +
      (ss.getUrl() || '') + '\n\n' +
      'If this email ever stops arriving on a Monday, something needs looking ' +
      'at — tell us, even if everything else seems fine.',
  });
  logStatus('Weekly summary sent', total + ' submissions in the last 7 days.');
}

// ===========================================================================
// Setup and diagnosis — the two things you run by hand
// ===========================================================================

/**
 * Idempotent. Run it as often as you like: it creates whatever is missing,
 * repairs whatever it can, replaces the triggers with a known-good pair, and
 * sends one test email so you know mail works. Then run `diagnose`.
 */
function setup() {
  const out = [];
  const ss = targetSheet();
  out.push('Spreadsheet: ' + ss.getName());

  Object.keys(FORMS).forEach(function (name) {
    const spec = specFor(name);
    ensureTab(ss, spec);
    out.push('Tab ready: ' + spec.label);
  });
  ensureContentTab(ss);
  out.push('Tab ready: ' + CONTENT_TAB);
  logStatus('Setup run', 'Tabs checked and triggers reinstalled.');
  out.push('Tab ready: ' + STATUS_TAB);

  // Replace rather than add. Running setup twice used to be a way to end up
  // with two triggers doing the same work.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    const fn = t.getHandlerFunction();
    if (fn === 'dailyCheck' || fn === 'weeklyDigest' || fn === 'syncFromNetlify') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('dailyCheck').timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger('weeklyDigest').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7).create();
  out.push('Daily check and Monday summary installed.');

  try {
    MailApp.sendEmail({
      to: NOTIFY_TO,
      name: 'Working With God website',
      subject: 'Working With God — setup test',
      body: 'This is the test message sent by "setup". If you are reading it, ' +
            'notification emails from the website will reach you.\n\n' +
            ss.getUrl(),
    });
    out.push('Test email sent to ' + NOTIFY_TO + '.');
  } catch (mailFailed) {
    out.push('COULD NOT SEND THE TEST EMAIL: ' + mailFailed);
  }

  out.push('');
  out.push('Next: Deploy > New deployment > Web app, Execute as Me, ' +
           'Who has access ANYONE. Then run diagnose.');
  const text = out.join('\n');
  console.log(text);
  return text;
}

/**
 * Checks every link in the chain, in dependency order, and names the FIRST one
 * that is broken. Never throws — a diagnostic that dies halfway is worse than
 * none — so every check sits in its own try/catch.
 *
 * The result is printed, written to the Status tab so it can be screenshotted,
 * and returned.
 */
function diagnose() {
  const L = [];
  var firstFail = '';
  function line(n, state, text, fix) {
    L.push(n + '  ' + state + '  ' + text);
    if (fix) L.push('        FIX: ' + fix);
    if (state === 'FAIL' && !firstFail) firstFail = text;
  }

  // 01 — which code is running
  try {
    line('01', 'INFO', 'Notify to: ' + NOTIFY_TO + ' · notifications ' +
      (NOTIFY ? 'ON' : 'OFF') + ' · daily email ceiling ' + MAX_EMAILS_PER_DAY);
  } catch (e) { line('01', 'FAIL', 'Could not read the settings: ' + e); }

  // 02 — is it attached to a spreadsheet at all
  var ss = null, tz = 'UTC';
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      line('02', 'FAIL', 'This script is not attached to any spreadsheet.',
        'It must be created from inside the sheet: Extensions > Apps Script.');
    } else {
      tz = ss.getSpreadsheetTimeZone() || 'UTC';
      line('02', 'PASS', 'Attached to "' + ss.getName() + '" (timezone ' + tz + ')');
    }
  } catch (e) { line('02', 'FAIL', 'Cannot open the spreadsheet: ' + e); }

  // 03 — permissions, one service at a time
  try {
    var perms = [];
    try { SpreadsheetApp.getActiveSpreadsheet().getName(); perms.push('sheets ok'); }
    catch (e) { perms.push('SHEETS BLOCKED'); }
    try { MailApp.getRemainingDailyQuota(); perms.push('email ok'); }
    catch (e) { perms.push('EMAIL BLOCKED'); }
    try { ScriptApp.getProjectTriggers(); perms.push('triggers ok'); }
    catch (e) { perms.push('TRIGGERS BLOCKED'); }
    try { PropertiesService.getScriptProperties().getKeys(); perms.push('storage ok'); }
    catch (e) { perms.push('STORAGE BLOCKED'); }
    const blocked = perms.join(', ').indexOf('BLOCKED') >= 0;
    line('03', blocked ? 'FAIL' : 'PASS', 'Permissions: ' + perms.join(', '),
      blocked ? 'Run "setup" from the dropdown and approve the permission prompt.' : '');
  } catch (e) { line('03', 'FAIL', 'Could not check permissions: ' + e); }

  // 04 — is it published, and at what address
  try {
    const url = ScriptApp.getService().getUrl();
    if (!url) {
      line('04', 'FAIL', 'This script has not been published as a web app.',
        'Deploy > New deployment > Web app, Execute as Me, Who has access ANYONE.');
    } else if (url.indexOf('/exec') < 0) {
      line('04', 'FAIL', 'The published address ends /dev, not /exec: ' + url,
        'Use the /exec address. The /dev one only works while you are signed in.');
    } else {
      line('04', 'PASS', 'Published at ' + url);
    }
  } catch (e) { line('04', 'FAIL', 'Could not read the deployment: ' + e); }

  // 05 — the public round trip. This is the only check that proves the
  // "Who has access" setting, because it is the only one that asks the way a
  // stranger's browser asks: with no Google session at all.
  try {
    const url = ScriptApp.getService().getUrl();
    if (url && url.indexOf('/exec') >= 0) {
      const res = UrlFetchApp.fetch(url + '?what=content', {
        muteHttpExceptions: true, followRedirects: true,
      });
      const code = res.getResponseCode();
      const text = String(res.getContentText() || '').slice(0, 120);
      if (code === 200 && text.indexOf('{') === 0) {
        line('05', 'PASS', 'The public address answers correctly (' + code + ')');
      } else if (text.toLowerCase().indexOf('sign in') >= 0 || code === 401 || code === 403) {
        line('05', 'FAIL', 'The public address asks for a Google sign-in (' + code + ').',
          'Deploy > Manage deployments > pencil > Who has access: ANYONE. ' +
          'Not "Anyone with a Google Account".');
      } else {
        line('05', 'WARN', 'The public address answered ' + code + ': ' + text);
      }
    } else {
      line('05', '----', 'Skipped — nothing published to test.');
    }
  } catch (e) { line('05', 'WARN', 'Could not test the public address: ' + e); }

  // 06 — tabs, reported in full rather than stopping at the first problem
  try {
    if (ss) {
      Object.keys(FORMS).forEach(function (name) {
        const spec = specFor(name);
        const sheet = ss.getSheetByName(spec.label);
        if (!sheet) {
          line('06', 'WARN', 'Tab "' + spec.label + '" does not exist yet.',
            'It is created automatically on the first submission, or run "setup".');
          return;
        }
        const map = headerMap(sheet);
        const missing = spec.headers.filter(function (h) { return !map[h]; });
        const rows = Math.max(0, sheet.getLastRow() - 1);
        if (missing.length) {
          line('06', 'WARN', 'Tab "' + spec.label + '" (' + rows + ' rows) is missing: ' +
            missing.join(', '),
            'Run "setup" — the missing headings are added at the right, ' +
            'nothing you added is moved.');
        } else {
          line('06', 'PASS', 'Tab "' + spec.label + '" — ' + rows + ' rows, all headings present');
        }
      });
    }
  } catch (e) { line('06', 'FAIL', 'Could not read the tabs: ' + e); }

  // 07 — can it actually write and then tidy up after itself
  try {
    if (ss) {
      const spec = specFor('__selftest');
      const sheet = ensureTab(ss, spec);
      const before = sheet.getLastRow();
      const row = buildRow(sheet, spec, { name: 'Self test', email: 'test@example.com' },
        'selftest_' + Date.now(), new Date(), tz);
      const at = writeRow(sheet, row);
      sheet.deleteRow(at);
      const after = sheet.getLastRow();
      line('07', after === before ? 'PASS' : 'WARN',
        'Wrote a test row and removed it again (row ' + at + ')');
    }
  } catch (e) {
    line('07', 'FAIL', 'Could not write to the spreadsheet: ' + e,
      'Usually means permissions — run "setup" and approve the prompt.');
  }

  // 08 — email
  try {
    const quota = MailApp.getRemainingDailyQuota();
    line('08', quota > 0 ? 'PASS' : 'FAIL',
      'Emails left to send today: ' + quota,
      quota > 0 ? '' : 'Wait until tomorrow. Rows are still being saved meanwhile.');
  } catch (e) { line('08', 'FAIL', 'Cannot check the email quota: ' + e); }

  // 09 — triggers
  try {
    const names = ScriptApp.getProjectTriggers().map(function (t) {
      return t.getHandlerFunction();
    });
    const haveDaily = names.indexOf('dailyCheck') >= 0;
    line('09', haveDaily ? 'PASS' : 'WARN',
      'Scheduled jobs: ' + (names.length ? names.join(', ') : 'none'),
      haveDaily ? '' : 'Run "setup" to install the daily check and Monday summary.');
  } catch (e) { line('09', 'WARN', 'Could not list the scheduled jobs: ' + e); }

  // 10 — site content
  try {
    const c = readContent();
    const sponsor = (c.sponsor && c.sponsor.name) || '';
    line('10', sponsor ? 'PASS' : 'WARN',
      'Site content: sponsor is "' + (sponsor || '(blank)') + '", next roundtable "' +
      ((c.roundtable && c.roundtable.next) || '(blank)') + '"',
      sponsor ? '' : 'Fill in the "' + CONTENT_TAB + '" tab, or run "setup".');
  } catch (e) { line('10', 'WARN', 'Could not read the content tab: ' + e); }

  // 11 — HubSpot, if anyone has set it up
  try {
    const props = PropertiesService.getScriptProperties();
    const portal = props.getProperty('HUBSPOT_PORTAL_ID');
    if (!portal) {
      line('11', '----', 'HubSpot: not set up (optional — nothing depends on it)');
    } else {
      const mapped = Object.keys(FORMS).filter(function (n) { return FORMS[n].hubspot; });
      const missing = mapped.filter(function (n) {
        return !props.getProperty('HUBSPOT_FORM_' + n.toUpperCase());
      });
      line('11', missing.length ? 'WARN' : 'PASS',
        'HubSpot: portal ' + portal + (missing.length
          ? ', but no form id for: ' + missing.join(', ') : ', all forms mapped'),
        missing.length ? 'Add HUBSPOT_FORM_' + missing[0].toUpperCase() +
          ' in Project Settings > Script properties.' : '');
    }
  } catch (e) { line('11', '----', 'Could not check HubSpot.'); }

  // 12 — anything recorded as going wrong recently
  try {
    const keys = PropertiesService.getScriptProperties().getKeys()
      .filter(function (k) { return k.indexOf('mailfail:') === 0; });
    line('12', keys.length ? 'WARN' : 'PASS',
      keys.length ? 'An email failed to send on: ' + keys.map(function (k) {
        return k.split(':')[1];
      }).join(', ') : 'No failed emails recorded.');
  } catch (e) { line('12', '----', 'No history available.'); }

  L.push('');
  L.push(firstFail ? 'VERDICT: ' + firstFail
                   : 'VERDICT: every check passed.');
  L.push(firstFail
    ? 'Fix that one thing and run diagnose again — it will show the next.'
    : 'If a submission still does not arrive, send us the whole of this list.');

  const text = L.join('\n');
  console.log(text);
  logStatus('Diagnose run', firstFail || 'every check passed');
  return text;
}
