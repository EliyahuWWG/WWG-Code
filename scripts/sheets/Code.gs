/**
 * Working With God — form submissions to a Google Sheet.
 *
 * WHAT THIS IS
 * A Google Apps Script Web App that receives a form submission and writes it
 * into a sheet with one tab per form ("Roundtable", "Contact", "Daily quote"),
 * each row stamped with its month so it can be filtered, then emails Eliyahu. Runs on a free consumer Google account. Nothing to host, nothing to
 * patch, no server.
 *
 * IT ACCEPTS TWO SHAPES, deliberately:
 *   1. A Netlify form-submission webhook  ->  { form_name, created_at, data:{...} }
 *   2. A direct browser POST from the site ->  form-encoded fields
 * That matters because whether Netlify's webhook is free is undocumented. If it
 * turns out to be gated, point VITE_FORM_ENDPOINT at this same URL and the site
 * posts here directly instead. Same script, same sheet, no rewrite.
 *
 * SETUP (once, ~5 minutes)
 *   1. Create a Google Sheet. Note its ID from the URL:
 *      docs.google.com/spreadsheets/d/<THIS PART>/edit
 *   2. Extensions > Apps Script. Paste this file in. Set the two constants below.
 *   3. Deploy > New deployment > type: Web app
 *        Execute as:      Me
 *        Who has access:  Anyone            <-- must be "Anyone", not
 *                                               "Anyone with a Google Account".
 *                                               Netlify is unauthenticated.
 *   4. Authorise when prompted. Copy the /exec URL.
 *   5. Paste that URL into Netlify:
 *        Project configuration > Notifications > Emails and webhooks
 *        > Form submission notifications > add an outgoing webhook
 *
 * UPDATING IT LATER
 *   Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 *   That keeps the SAME URL. Choosing "New deployment" instead mints a new URL
 *   and silently orphans the one Netlify is calling.
 */

// ---------------------------------------------------------------------------
const SHEET_ID   = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const NOTIFY_TO  = 'eliyahu@workingwithgod.live';   // comma-separate for several
const NOTIFY     = true;   // set false to write to the sheet only
// A shared password of your own invention. The Web App has to be open to
// "Anyone" for Netlify to reach it, so this is what stops a stranger who finds
// the URL from writing rows and firing emails at you. Append it to the address
// you give Netlify:  https://script.google.com/.../exec?key=YOUR-SECRET
// Leave it empty to switch the check off entirely (not recommended).
const SECRET     = 'PASTE_A_LONG_RANDOM_STRING_HERE';
// ---------------------------------------------------------------------------

/**
 * One tab per form, for good:  "Roundtable", "Contact", "Daily quote".
 * Each form gets only the columns it actually uses, so Eliyahu opens a tab and
 * sees a clean list instead of a grid half full of blanks. The month is a
 * column rather than a tab, so three tabs is all there will ever be.
 *
 * `label` is what appears on the tab and in the email subject.
 * `columns` are the fields written, in order, after Received.
 * Anything a form sends that is NOT listed here still gets written, into the
 * "Other" column as name: value. Nothing a visitor types is ever dropped.
 */
const FORMS = {
  'roundtable': {
    label: 'Roundtable',
    subject: 'Roundtable registration',
    columns: ['name', 'email', 'phone', 'org'],
    headers: ['Name', 'Email', 'Phone', 'Organization'],
  },
  'contact': {
    label: 'Contact',
    subject: 'Contact form message',
    columns: ['name', 'email', 'phone', 'message'],
    headers: ['Name', 'Email', 'Phone', 'Message'],
  },
  'dailyQuote': {
    label: 'Daily quote',
    subject: 'Daily quote signup',
    columns: ['name', 'email'],
    headers: ['Name', 'Email'],
  },
};

// Used for any form name not listed above, so a new form added to the site
// still records itself instead of failing.
const FALLBACK = {
  label: 'Other',
  subject: 'Form submission',
  columns: ['name', 'email', 'phone'],
  headers: ['Name', 'Email', 'Phone'],
};

function specFor(formName) {
  var spec = FORMS[formName] || FALLBACK;
  // A tab is only ever built from this, so widths and headers stay in step.
  // Month leads so the sheet can be sorted or filtered by it in one click.
  return {
    label: spec.label,
    subject: spec.subject,
    columns: spec.columns,
    headers: ['Month', 'Received'].concat(spec.headers).concat(['Other', 'Notes']),
  };
}

function doPost(e) {
  try {
    // Wrong or missing key: record nothing, but still answer 200. An error
    // status would make Netlify retry, and a chatty rejection would tell a
    // prober they had found something worth attacking.
    const key = (e && e.parameter && e.parameter.key) || '';
    if (SECRET && key !== SECRET) {
      console.warn('rejected: bad or missing key');
      return json({ ok: true });
    }
    const payload = parseIncoming(e);
    const row = writeRow(payload);
    if (NOTIFY) notify(payload, row);
    return json({ ok: true, tab: row.tab });
  } catch (err) {
    // Never throw. A 500 makes Netlify retry, which would duplicate rows.
    // Log it, tell the operator, and still answer 200.
    console.error(err);
    try {
      MailApp.sendEmail(NOTIFY_TO, 'WWG form: submission failed to record',
        'A submission came in but could not be written to the sheet.\n\n' +
        'Error: ' + err + '\n\nRaw body:\n' + (e && e.postData ? e.postData.contents : '(none)'));
    } catch (_) {}
    return json({ ok: false });
  }
}

// A GET is handy for confirming the deployment is live in a browser.
function doGet() {
  return json({ ok: true, note: 'WWG form endpoint is live. POST submissions here.' });
}

/**
 * Normalises either input shape into { form, receivedAt, fields }.
 * Netlify's webhook body is JSON; a direct form post is urlencoded. We branch on
 * what actually arrived rather than on a configured mode, so one deployment
 * serves both and switching between them needs no change here.
 */
function parseIncoming(e) {
  const raw = e && e.postData ? e.postData.contents : '';
  let form = 'unknown', receivedAt = new Date(), fields = {};

  if (raw && raw.trim().charAt(0) === '{') {
    const body = JSON.parse(raw);
    // Netlify nests the submitted fields under `data` and names the form in
    // `form_name`. Both are undocumented, so fall back rather than assume.
    fields = body.data || body;
    form = body.form_name || fields['form-name'] || 'unknown';
    if (body.created_at) {
      const t = new Date(body.created_at);
      if (!isNaN(t.getTime())) receivedAt = t;
    }
  } else {
    fields = (e && e.parameter) ? e.parameter : {};
    form = fields['form-name'] || 'unknown';
  }

  delete fields['form-name'];
  delete fields['bot-field'];   // honeypot, never worth storing
  delete fields['key'];         // the shared secret, never write it into the sheet
  return { form: form, receivedAt: receivedAt, fields: fields };
}

/**
 * Appends to this form's tab. There is exactly one tab per form and it is never
 * replaced, so the sheet stays at three tabs no matter how many years pass.
 * The month lives in the first column instead, which is filterable and sortable
 * and does not multiply.
 */
function writeRow(payload) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const spec = specFor(payload.form);
  const tz = ss.getSpreadsheetTimeZone();
  const month = Utilities.formatDate(payload.receivedAt, tz, 'yyyy-MM');

  let sheet = ss.getSheetByName(spec.label);
  if (!sheet) {
    sheet = ss.insertSheet(spec.label);
    sheet.appendRow(spec.headers);
    const head = sheet.getRange(1, 1, 1, spec.headers.length);
    head.setFontWeight('bold').setBackground('#02061f').setFontColor('#f7f4ec');
    sheet.setFrozenRows(1);
    // A filter on row 1 is what makes "show me only October" a two-click job.
    sheet.getRange(1, 1, 1, spec.headers.length).createFilter();
    sheet.setColumnWidth(1, 90);                           // Month
    sheet.setColumnWidth(2, 150);                          // Received
    for (var i = 0; i < spec.columns.length; i++) {
      var wide = spec.columns[i] === 'message' || spec.columns[i] === 'org';
      sheet.setColumnWidth(i + 3, wide ? 360 : 200);
    }
    sheet.setColumnWidth(spec.headers.length - 1, 220);     // Other
    sheet.setColumnWidth(spec.headers.length, 260);         // Notes
  }

  const f = payload.fields;
  const known = {};
  const values = spec.columns.map(function (key) {
    known[key] = true;
    // `org` and `organization` are the same thing to a person filling the form.
    var v = f[key];
    if ((v === undefined || v === '') && key === 'org') v = f.organization;
    return v || '';
  });

  // Anything the form sent that this spec does not name. Keeps a field added to
  // the site later from vanishing before anyone notices.
  const extra = Object.keys(f)
    .filter(function (k) { return !known[k] && k !== 'organization' && String(f[k]).trim() !== ''; })
    .map(function (k) { return k + ': ' + f[k]; })
    .join('\n');

  sheet.appendRow(
    [month, Utilities.formatDate(payload.receivedAt, tz, 'yyyy-MM-dd HH:mm')]
      .concat(values)
      .concat([extra, ''])                       // Other, then Notes left empty
  );

  return { tab: spec.label, month: month, rowNumber: sheet.getLastRow() };
}

function notify(payload, row) {
  const f = payload.fields;
  const label = specFor(payload.form).subject;
  const lines = Object.keys(f).map(function (k) { return k + ': ' + f[k]; }).join('\n');

  MailApp.sendEmail({
    to: NOTIFY_TO,
    // Reply goes to the person who filled the form, not into a void. This is the
    // one thing Netlify's own notification cannot do.
    replyTo: f.email || undefined,
    subject: label + ' — ' + (f.name || f.email || 'no name'),
    body:
      label + '\n\n' + lines +
      '\n\nRecorded in the ' + row.tab + ' tab, row ' + row.rowNumber + ' (' + row.month + ').\n' +
      SpreadsheetApp.openById(SHEET_ID).getUrl(),
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
