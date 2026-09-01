/**
 * Working With God — form submissions to a Google Sheet.
 *
 * WHAT THIS IS
 * A Google Apps Script Web App that receives a form submission and writes it
 * into a sheet organised one tab per month (2026-09, 2026-10, ...), then emails
 * Eliyahu. Runs on a free consumer Google account. Nothing to host, nothing to
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
// ---------------------------------------------------------------------------

// Column order. Add to the end if a form grows; existing tabs keep their shape.
const COLUMNS = ['Received', 'Form', 'Name', 'Email', 'Phone', 'Organization', 'Message', 'Notes'];

function doPost(e) {
  try {
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
  return { form: form, receivedAt: receivedAt, fields: fields };
}

/** Appends to the tab for the submission's month, creating it if needed. */
function writeRow(payload) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const tabName = Utilities.formatDate(payload.receivedAt, ss.getSpreadsheetTimeZone(), 'yyyy-MM');
  let sheet = ss.getSheetByName(tabName);

  if (!sheet) {
    sheet = ss.insertSheet(tabName, 0);          // newest month first
    sheet.appendRow(COLUMNS);
    const head = sheet.getRange(1, 1, 1, COLUMNS.length);
    head.setFontWeight('bold').setBackground('#02061f').setFontColor('#f7f4ec');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);   // Received
    sheet.setColumnWidth(7, 380);   // Message
    sheet.setColumnWidth(8, 260);   // Notes, his to fill in
  }

  const f = payload.fields;
  sheet.appendRow([
    Utilities.formatDate(payload.receivedAt, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm'),
    payload.form,
    f.name || '', f.email || '', f.phone || '', f.org || f.organization || '',
    f.message || '',
    '',                                           // Notes, left empty on purpose
  ]);

  return { tab: tabName, rowNumber: sheet.getLastRow() };
}

function notify(payload, row) {
  const f = payload.fields;
  const label = payload.form === 'roundtable' ? 'Roundtable registration' : 'Form submission';
  const lines = Object.keys(f).map(function (k) { return k + ': ' + f[k]; }).join('\n');

  MailApp.sendEmail({
    to: NOTIFY_TO,
    // Reply goes to the person who filled the form, not into a void. This is the
    // one thing Netlify's own notification cannot do.
    replyTo: f.email || undefined,
    subject: label + ' — ' + (f.name || f.email || 'no name'),
    body:
      label + '\n\n' + lines +
      '\n\nRecorded in the ' + row.tab + ' tab, row ' + row.rowNumber + '.\n' +
      SpreadsheetApp.openById(SHEET_ID).getUrl(),
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
