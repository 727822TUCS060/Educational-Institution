/**
 * Vidya Academy – Google Sheets backend (users, books, courses, exams)
 * Paste into Extensions > Apps Script of your Google Sheet, run setup() once,
 * then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
 */

// Anyone registering as "owner" must enter this code. CHANGE IT.
const OWNER_CODE = 'VIDYA-OWNER-2026';
const SESSION_SECONDS = 21600; // 6 hours (max allowed by CacheService)

const HEADERS = {
  users:   ['id', 'name', 'email', 'phone', 'passwordHash', 'role', 'createdAt'],
  books:   ['id', 'title', 'author', 'category', 'price', 'mrp', 'stock', 'rating', 'image', 'description'],
  courses: ['id', 'title', 'duration', 'level', 'mode', 'eligibility', 'description', 'outcomes', 'syllabus'],
  // Exam calendar. Dates are plain text 'YYYY-MM-DD'. 'topics' = syllabus topics separated by |
  exams:   ['id', 'name', 'body', 'category', 'posts', 'notification', 'applyStart', 'lastDate', 'examDate', 'examEnd',
            'calendarDate', 'examLabel', 'eligibility', 'pattern', 'topics', 'applyUrl', 'officialUrl', 'departmental'],
};
const EXAM_DATE_FIELDS = ['notification', 'applyStart', 'lastDate', 'examDate', 'examEnd', 'calendarDate'];
const EXAM_CATEGORIES = ['TNPSC', 'Railways', 'Banking', 'UPSC', 'SSC', 'Defence', 'Other'];
const CATEGORIES = ['Textbook', 'Study Material', 'Workbook', 'Exam Guide'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const MODES = ['Classroom', 'Online', 'Hybrid'];

/* ------------------------------------------------------------------ */
/*  ONE-TIME SETUP – run this function once from the editor            */
/* ------------------------------------------------------------------ */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const h = HEADERS[name];
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#e8edf9');
    sh.setFrozenRows(1);
  });
  // keep phone as text so numbers never lose formatting
  ss.getSheetByName('users').getRange('D:D').setNumberFormat('@');
  // keep exam dates as text ('2026-11-25') so Google Sheets never converts them to real dates
  const exSheet = ss.getSheetByName('exams');
  EXAM_DATE_FIELDS.forEach(function (f) {
    const col = HEADERS.exams.indexOf(f) + 1;
    exSheet.getRange(2, col, exSheet.getMaxRows() - 1, 1).setNumberFormat('@');
  });

  const books = ss.getSheetByName('books');
  if (books.getLastRow() < 2) {
    [
      ['Mastering Mathematics – Class 10', 'Dr. R. Sundaram', 'Textbook', 450, 550, 40, 4.7, '', 'Chapter-wise guide with solved examples and practice sets.'],
      ['NEET Biology Rapid Revision Notes', 'Vidya Academy Faculty', 'Study Material', 349, 499, 60, 4.8, '', 'Crisp topic-wise notes with mnemonics and flowcharts.'],
      ['English Grammar & Composition Workbook', 'Ms. Priya Venkat', 'Workbook', 275, 325, 80, 4.4, '', 'Practice-driven grammar and writing workbook with answer keys.'],
    ].forEach(function (r) { books.appendRow([newId('b')].concat(r)); });
  }
  const courses = ss.getSheetByName('courses');
  if (courses.getLastRow() < 2) {
    courses.appendRow([newId('c'), 'NEET Foundation Program', '12 Months', 'Intermediate', 'Classroom',
      'Class 11 students or 10th pass', 'A structured year-long program for Physics, Chemistry and Biology.',
      'Strong concepts in PCB|40+ full-length mock tests|Personal mentor support',
      'Mechanics|Organic Chemistry|Human Physiology|Mock Tests']);
    courses.appendRow([newId('c'), 'Spoken English & Communication', '3 Months', 'Beginner', 'Classroom',
      'Open to all', 'Practical communication training with group discussions.',
      'Fluent daily English|Interview skills|Certificate of completion',
      'Grammar in Use|Conversation|Public Speaking']);
  }
  // Sample exam calendar (November 2026). Add / edit / delete exams from the Admin panel or directly in this sheet.
  const exams = ss.getSheetByName('exams');
  if (exams.getLastRow() < 2) {
    SEED_EXAMS.forEach(function (e) { appendObj('exams', Object.assign({ id: newId('x') }, e)); });
  }
}

const SEED_EXAMS = [
      {
          "name": "IBPS Specialist Officers – Mains (CRP SPL-XVI)",
          "body": "IBPS",
          "category": "Banking",
          "posts": "Specialist Officers",
          "notification": "",
          "applyStart": "",
          "lastDate": "",
          "examDate": "2026-11-01",
          "examEnd": "",
          "calendarDate": "2026-11-01",
          "examLabel": "Mains: 1 Nov 2026",
          "eligibility": "",
          "pattern": "Prelims (English, Reasoning, Quant) followed by a Mains professional-knowledge test, then interview.",
          "topics": "English Language|Reasoning Ability|Quantitative Aptitude|Professional Knowledge (post-specific)",
          "applyUrl": "https://ibpsreg.ibps.in/crpspxvimy26/",
          "officialUrl": "https://www.ibps.in",
          "departmental": false
      },
      {
          "name": "TNPSC Group 4 (CCSE-IV) 2026",
          "body": "TNPSC",
          "category": "TNPSC",
          "posts": "6,574 posts – VAO, Junior Assistant, Typist, Steno-Typist, Tax Collector, Forest Guard…",
          "notification": "",
          "applyStart": "2026-10-06",
          "lastDate": "2026-11-05",
          "examDate": "2027-01-10",
          "examEnd": "",
          "calendarDate": "2026-11-05",
          "examLabel": "Exam: 10 Jan 2027 · 9:30 am – 12:30 pm",
          "eligibility": "SSLC (Class 10) pass for most posts · typewriting / shorthand for Typist & Steno · age 18/21+ as on 1 Jul 2026",
          "pattern": "Single objective paper, 200 Qs, 300 marks, 3 hrs: Part A Tamil Eligibility Test (100 Qs, qualifying) + Part B General Studies (75) & Aptitude/Mental Ability (25).",
          "topics": "General Tamil: grammar, literature, Thirukkural|General Studies: science, geography, history & culture, Indian polity & economy|Indian National Movement & Tamil Nadu administration|Aptitude: percentage, ratio, time & work, interest, area & volume|Mental ability: series, puzzles, logical reasoning",
          "applyUrl": "https://apply.tnpscexams.in/registration?app_id=UElZMDAwMDAwMQ==",
          "officialUrl": "https://www.tnpsc.gov.in",
          "departmental": false
      },
      {
          "name": "RRB NTPC Graduate (CEN 06/2026)",
          "body": "RRB",
          "category": "Railways",
          "posts": "3,548 posts – Goods Train Manager, Senior Clerk cum Typist, Jr. Accounts Asst., Chief Commercial cum Ticket Supervisor",
          "notification": "",
          "applyStart": "2026-10-08",
          "lastDate": "2026-11-08",
          "examDate": "2026-12-24",
          "examEnd": "",
          "calendarDate": "2026-11-08",
          "examLabel": "CBT-1: 4th week of Dec 2026 (tentative)",
          "eligibility": "Bachelor’s degree · age 18–33 as on 1 Jan 2027 (relaxation as per rules)",
          "pattern": "CBT-1 (100 Qs, 90 min) → CBT-2 (120 Qs, 90 min) → document verification & medical. Negative marking ⅓. Station Master also has a computer-based aptitude test.",
          "topics": "Mathematics: number system, percentage, ratio, time & work, geometry, mensuration|General Intelligence & Reasoning: analogies, series, coding, Venn diagrams|General Awareness: current affairs, history, polity, geography, science, economy",
          "applyUrl": "https://www.rrbapply.gov.in/#/auth/home",
          "officialUrl": "https://rrb.indianrailways.gov.in",
          "departmental": false
      },
      {
          "name": "IBPS RRB Officer Scale I – Prelims (CRP RRBs-XV)",
          "body": "IBPS",
          "category": "Banking",
          "posts": "Officers Scale I, II & III",
          "notification": "",
          "applyStart": "",
          "lastDate": "2026-09-27",
          "examDate": "2026-11-21",
          "examEnd": "2026-12-20",
          "calendarDate": "2026-11-21",
          "examLabel": "Prelims 21–22 Nov · Mains 20 Dec 2026",
          "eligibility": "",
          "pattern": "Scale I: online prelims (Reasoning + Numerical Ability, 80 Qs, 45 min) then mains (200 marks, 2 hrs). Scale II & III: single mains exam, then interview.",
          "topics": "Reasoning|Numerical Ability|English / Hindi|General Awareness|Computer Knowledge|Professional knowledge (Scale II & III)",
          "applyUrl": "https://ibpsreg.ibps.in/rrbxvaug26/",
          "officialUrl": "https://www.ibps.in",
          "departmental": false
      },
      {
          "name": "RRB Station Master (CEN 08/2026)",
          "body": "RRB",
          "category": "Railways",
          "posts": "1,265 Station Master posts",
          "notification": "",
          "applyStart": "2026-10-27",
          "lastDate": "2026-11-25",
          "examDate": "",
          "examEnd": "",
          "calendarDate": "2026-11-25",
          "examLabel": "Exam date to be announced",
          "eligibility": "Graduate in any discipline (see official notification for age & category details)",
          "pattern": "CBT-1 (100 Qs, 90 min) → CBT-2 (120 Qs, 90 min) → document verification & medical. Negative marking ⅓. Station Master also has a computer-based aptitude test.",
          "topics": "Mathematics: number system, percentage, ratio, time & work, geometry, mensuration|General Intelligence & Reasoning: analogies, series, coding, Venn diagrams|General Awareness: current affairs, history, polity, geography, science, economy",
          "applyUrl": "https://www.rrbapply.gov.in/#/auth/home",
          "officialUrl": "https://rrb.indianrailways.gov.in",
          "departmental": false
      }
  ];

/* ------------------------------------------------------------------ */
/*  HTTP entry points                                                  */
/* ------------------------------------------------------------------ */
// Public reads:  GET <url>?action=books   |   ?action=courses
function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'ping';
    if (action === 'books') return json({ ok: true, data: rows('books').map(cleanBook) });
    if (action === 'courses') return json({ ok: true, data: rows('courses').map(cleanCourse) });
    if (action === 'exams') { fillExamIds(); return json({ ok: true, data: rows('exams').map(cleanExam).filter(function (x) { return x.name && x.calendarDate; }) }); }
    return json({ ok: true, message: 'Vidya Academy API is running' });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

// All writes + auth:  POST <url>  body (as text/plain JSON): { action, token, ...data }
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const body = JSON.parse(e.postData.contents);
    const a = body.action;

    if (a === 'register') return json(register(body));
    if (a === 'login') return json(login(body));
    if (a === 'me') return json({ ok: true, user: requireUser(body.token) });
    if (a === 'logout') { CacheService.getScriptCache().remove(body.token); return json({ ok: true }); }

    // everything below is owner-only
    requireOwner(body.token);
    if (a === 'addBook') return json({ ok: true, data: saveBook(null, body.data) });
    if (a === 'updateBook') return json({ ok: true, data: saveBook(body.id, body.data) });
    if (a === 'deleteBook') return json(removeRow('books', body.id));
    if (a === 'addCourse') return json({ ok: true, data: saveCourse(null, body.data) });
    if (a === 'updateCourse') return json({ ok: true, data: saveCourse(body.id, body.data) });
    if (a === 'deleteCourse') return json(removeRow('courses', body.id));
    if (a === 'addExam') return json({ ok: true, data: saveExam(null, body.data) });
    if (a === 'updateExam') return json({ ok: true, data: saveExam(body.id, body.data) });
    if (a === 'deleteExam') return json(removeRow('exams', body.id));

    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */
function register(b) {
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const phone = String(b.phone || '').trim();
  const password = String(b.password || '');
  const role = b.role === 'owner' ? 'owner' : 'student';

  if (name.length < 3) throw new Error('Enter your full name');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email');
  if (!/^[0-9]{10}$/.test(phone)) throw new Error('Enter a 10-digit mobile number');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  if (role === 'owner' && b.ownerCode !== OWNER_CODE) throw new Error('Invalid owner access code');
  if (rows('users').some(function (u) { return String(u.email).toLowerCase() === email; })) {
    throw new Error('An account with this email already exists');
  }

  const salt = Utilities.getUuid().slice(0, 12);
  const user = { id: newId('u'), name: name, email: email, phone: phone,
    passwordHash: salt + ':' + hash(password, salt), role: role, createdAt: new Date() };
  appendObj('users', user);
  return { ok: true, token: startSession(user), user: publicUser(user) };
}

function login(b) {
  const email = String(b.email || '').trim().toLowerCase();
  const user = rows('users').filter(function (u) { return String(u.email).toLowerCase() === email; })[0];
  if (!user) throw new Error('Invalid email or password');
  const parts = String(user.passwordHash).split(':');
  if (hash(String(b.password || ''), parts[0]) !== parts[1]) throw new Error('Invalid email or password');
  return { ok: true, token: startSession(user), user: publicUser(user) };
}

function startSession(user) {
  const token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put(token, JSON.stringify(publicUser(user)), SESSION_SECONDS);
  return token;
}
function requireUser(token) {
  const s = token && CacheService.getScriptCache().get(token);
  if (!s) throw new Error('Session expired – please log in again');
  return JSON.parse(s);
}
function requireOwner(token) {
  const u = requireUser(token);
  if (u.role !== 'owner') throw new Error('Owner access required');
  return u;
}
function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: String(u.phone), role: u.role };
}
function hash(password, salt) {
  const d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password, Utilities.Charset.UTF_8);
  return d.map(function (x) { return ('0' + (x & 0xff).toString(16)).slice(-2); }).join('');
}

/* ------------------------------------------------------------------ */
/*  Books & courses                                                    */
/* ------------------------------------------------------------------ */
function saveBook(id, d) {
  d = d || {};
  if (!String(d.title || '').trim()) throw new Error('Title is required');
  if (!String(d.author || '').trim()) throw new Error('Author is required');
  if (CATEGORIES.indexOf(d.category) < 0) throw new Error('Invalid category');
  const price = Number(d.price), mrp = Number(d.mrp), stock = Number(d.stock);
  if (!(price > 0)) throw new Error('Enter a valid price');
  if (!(mrp >= price)) throw new Error('MRP must be at least the price');
  if (!(stock >= 0)) throw new Error('Enter stock quantity');
  const obj = { title: d.title, author: d.author, category: d.category, price: price, mrp: mrp,
    stock: stock, rating: Number(d.rating) || 4.5, image: d.image || '', description: d.description || '' };
  return cleanBook(id ? updateObj('books', id, obj) : appendObj('books', Object.assign({ id: newId('b') }, obj)));
}

function saveCourse(id, d) {
  d = d || {};
  if (!String(d.title || '').trim()) throw new Error('Title is required');
  if (!String(d.duration || '').trim()) throw new Error('Duration is required');
  if (LEVELS.indexOf(d.level) < 0) throw new Error('Invalid level');
  if (MODES.indexOf(d.mode) < 0) throw new Error('Invalid mode');
  const outcomes = toList(d.outcomes);
  if (!outcomes.length) throw new Error('Add at least one outcome');
  // NOTE: courses intentionally have no price field.
  const obj = { title: d.title, duration: d.duration, level: d.level, mode: d.mode,
    eligibility: d.eligibility || '', description: d.description || '',
    outcomes: outcomes.join('|'), syllabus: toList(d.syllabus).join('|') };
  return cleanCourse(id ? updateObj('courses', id, obj) : appendObj('courses', Object.assign({ id: newId('c') }, obj)));
}

/* ------------------------------------------------------------------ */
/*  Exam calendar                                                      */
/* ------------------------------------------------------------------ */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// A date cell can arrive as text ('2026-11-25') or as a real Date if someone typed it into the sheet.
function dateStr(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const t = String(v === null || v === undefined ? '' : v).trim();
  return DATE_RE.test(t) ? t : '';
}

function saveExam(id, d) {
  d = d || {};
  const name = String(d.name || '').trim();
  if (!name) throw new Error('Exam name is required');
  if (EXAM_CATEGORIES.indexOf(d.category) < 0) throw new Error('Invalid category');
  const dates = {};
  EXAM_DATE_FIELDS.forEach(function (f) {
    const v = String(d[f] || '').trim();
    if (v && !DATE_RE.test(v)) throw new Error('Use the date format YYYY-MM-DD for ' + f);
    dates[f] = v;
  });
  // The calendar needs one date to place the exam on
  dates.calendarDate = dates.calendarDate || dates.examDate || dates.lastDate;
  if (!dates.calendarDate) throw new Error('Enter the calendar date, exam date or last date');
  if (dates.applyStart && dates.lastDate && dates.lastDate < dates.applyStart) throw new Error('Last date cannot be before the start date');
  if (dates.examDate && dates.examEnd && dates.examEnd < dates.examDate) throw new Error('Exam end cannot be before the exam date');
  const applyUrl = String(d.applyUrl || '').trim();
  if (!/^https?:\/\/\S+$/i.test(applyUrl)) throw new Error('Enter the application link starting with https://');
  const officialUrl = String(d.officialUrl || '').trim();
  if (officialUrl && !/^https?:\/\/\S+$/i.test(officialUrl)) throw new Error('Official website must start with https://');

  const obj = Object.assign({ name: name, body: String(d.body || '').trim(), category: d.category,
    posts: String(d.posts || '').trim(), examLabel: String(d.examLabel || '').trim(),
    eligibility: String(d.eligibility || '').trim(), pattern: String(d.pattern || '').trim(),
    topics: toList(d.topics).join('|'), applyUrl: applyUrl, officialUrl: officialUrl,
    departmental: d.departmental === true || String(d.departmental).toUpperCase() === 'TRUE' }, dates);
  return cleanExam(id ? updateObj('exams', id, obj) : appendObj('exams', Object.assign({ id: newId('x') }, obj)));
}

function cleanExam(r) {
  const o = {
    id: r.id, name: String(r.name || ''), body: String(r.body || ''), category: String(r.category || 'Other'),
    posts: String(r.posts || ''), examLabel: String(r.examLabel || ''), eligibility: String(r.eligibility || ''),
    pattern: String(r.pattern || ''), topics: toList(r.topics), applyUrl: String(r.applyUrl || ''),
    officialUrl: String(r.officialUrl || ''),
    departmental: r.departmental === true || String(r.departmental).toUpperCase() === 'TRUE',
  };
  EXAM_DATE_FIELDS.forEach(function (f) { o[f] = dateStr(r[f]); });
  o.calendarDate = o.calendarDate || o.examDate || o.lastDate;
  return o;
}

// If the owner types a new exam straight into the sheet, give the row an id so the website can see it.
function fillExamIds() {
  const sh = sheet('exams');
  const last = sh.getLastRow();
  if (last < 2) return;
  const vals = sh.getRange(2, 1, last - 1, 2).getValues(); // id, name
  vals.forEach(function (r, i) {
    if (r[0] === '' && String(r[1]).trim() !== '') sh.getRange(i + 2, 1).setValue(newId('x'));
  });
}

function cleanBook(r) {
  return { id: r.id, title: r.title, author: r.author, category: r.category, price: Number(r.price),
    mrp: Number(r.mrp), stock: Number(r.stock), rating: Number(r.rating) || 0, image: r.image || '',
    description: r.description || '' };
}
function cleanCourse(r) {
  return { id: r.id, title: r.title, duration: r.duration, level: r.level, mode: r.mode,
    eligibility: r.eligibility || '', description: r.description || '',
    outcomes: toList(r.outcomes), syllabus: toList(r.syllabus) };
}
function toList(v) {
  if (Array.isArray(v)) return v.map(String).map(function (s) { return s.trim(); }).filter(Boolean);
  return String(v || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
}

/* ------------------------------------------------------------------ */
/*  Sheet helpers                                                      */
/* ------------------------------------------------------------------ */
function sheet(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Sheet "' + name + '" not found – run setup() first');
  return sh;
}
function rows(name) {
  const v = sheet(name).getDataRange().getValues();
  const head = v.shift();
  return v.filter(function (r) { return r[0] !== ''; }).map(function (r) {
    const o = {};
    head.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
}
function appendObj(name, obj) {
  sheet(name).appendRow(HEADERS[name].map(function (h) { return obj[h] === undefined ? '' : obj[h]; }));
  return obj;
}
function rowIndex(name, id) {
  const ids = sheet(name).getRange(1, 1, sheet(name).getLastRow(), 1).getValues();
  for (let i = 1; i < ids.length; i++) if (ids[i][0] === id) return i + 1;
  throw new Error('Record not found');
}
function updateObj(name, id, patch) {
  const idx = rowIndex(name, id);
  const sh = sheet(name);
  const cur = sh.getRange(idx, 1, 1, HEADERS[name].length).getValues()[0];
  const merged = {};
  HEADERS[name].forEach(function (h, i) { merged[h] = patch[h] !== undefined ? patch[h] : cur[i]; });
  merged.id = id;
  sh.getRange(idx, 1, 1, HEADERS[name].length).setValues([HEADERS[name].map(function (h) { return merged[h]; })]);
  return merged;
}
function removeRow(name, id) {
  sheet(name).deleteRow(rowIndex(name, id));
  return { ok: true };
}
function newId(prefix) { return prefix + Utilities.getUuid().replace(/-/g, '').slice(0, 8); }
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}