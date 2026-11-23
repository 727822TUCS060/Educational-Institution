/**
 * EXAM CALENDAR DATA
 * ------------------------------------------------------------------
 * The live calendar is managed by the admin (Admin panel > Exam Calendar, or the "exams" sheet in
 * Google Sheets). The exams below are only the built-in November 2026 sample that is shown if the
 * Google Sheet cannot be reached.
 *
 * Dates are 'YYYY-MM-DD'.
 *   calendarDate : the key date this exam is pinned to on the calendar (deadline / exam day)
 *   notification : date the notification is / was published
 *   applyStart   : first day to apply   (null = already open when listed)
 *   lastDate     : last day to apply
 *   examDate     : (first) exam day     examEnd: last exam day (optional)
 *   examLabel    : free text shown instead of the date (e.g. "Dec 2026, tentative")
 *   departmental : true = for serving employees only (never shown in the announcement bar)
 *
 * Sources: UPSC Examination Calendar 2027, SSC / IBPS calendars 2026-27, TNPSC and RRB
 * notifications as reported by Careers360 / Testbook. Dates are tentative – always confirm
 * on the official website before applying.
 */

export const CATEGORIES = ['TNPSC', 'Railways', 'Banking', 'UPSC', 'SSC', 'Defence', 'Other'];

// Direct links to each exam's online application form / registration portal.
export const APPLY = {
  tnpscGroup4: 'https://apply.tnpscexams.in/registration?app_id=UElZMDAwMDAwMQ==',
  rrb: 'https://www.rrbapply.gov.in/#/auth/home',
  ibpsRrbOfficer: 'https://ibpsreg.ibps.in/rrbxvaug26/',
  ibpsRrbOfficeAssistant: 'https://ibpsreg.ibps.in/rrboaxvaug26/',
  ibpsSpl: 'https://ibpsreg.ibps.in/crpspxvimy26/',
};

export const SITES = {
  upsc: { official: 'https://upsc.gov.in', apply: 'https://upsconline.gov.in' },
  tnpsc: { official: 'https://www.tnpsc.gov.in', apply: 'https://www.tnpscexams.in' },
  ssc: { official: 'https://ssc.gov.in', apply: 'https://ssc.gov.in' },
  rrb: { official: 'https://rrb.indianrailways.gov.in', apply: 'https://rrbapply.gov.in' },
  ibps: { official: 'https://www.ibps.in', apply: 'https://www.ibps.in' },
};

/* ---------- reusable syllabus blocks ---------- */
const IBPS_RRB_OA_PRE = {
  pattern: 'Online prelims: Reasoning (40) + Numerical Ability (40) = 80 Qs, 80 marks, 45 min. Sectional cut-offs apply.',
  topics: ['Reasoning: puzzles, seating arrangement, syllogism, coding-decoding', 'Numerical Ability: simplification, DI, number series, arithmetic'],
};
const IBPS_RRB_MAINS = {
  pattern: 'Online mains: Reasoning, Numerical Ability, English/Hindi, General Awareness and Computer Knowledge (40 Qs each, 200 marks, 2 hrs).',
  topics: ['Reasoning', 'Numerical Ability', 'English / Hindi language', 'General Awareness (banking & current affairs)', 'Computer Knowledge'],
};
const NTPC = {
  pattern: 'CBT-1 (100 Qs, 90 min) → CBT-2 (120 Qs, 90 min) → document verification & medical. Negative marking ⅓. Station Master also has a computer-based aptitude test.',
  topics: ['Mathematics: number system, percentage, ratio, time & work, geometry, mensuration', 'General Intelligence & Reasoning: analogies, series, coding, Venn diagrams', 'General Awareness: current affairs, history, polity, geography, science, economy'],
};

const exams = [
  {
    id: 'ibps-spl-xvi', name: 'IBPS Specialist Officers – Mains (CRP SPL-XVI)', body: 'IBPS', category: 'Banking',
    posts: 'Specialist Officers', applyStart: null, lastDate: null,
    calendarDate: '2026-11-01', examDate: '2026-11-01', examLabel: 'Mains: 1 Nov 2026',
    applyUrl: APPLY.ibpsSpl, officialUrl: SITES.ibps.official,
    pattern: 'Prelims (English, Reasoning, Quant) followed by a Mains professional-knowledge test, then interview.',
    topics: ['English Language', 'Reasoning Ability', 'Quantitative Aptitude', 'Professional Knowledge (post-specific)'],
  },
  {
    id: 'tnpsc-group4-2026', name: 'TNPSC Group 4 (CCSE-IV) 2026', body: 'TNPSC', category: 'TNPSC',
    posts: '6,574 posts – VAO, Junior Assistant, Typist, Steno-Typist, Tax Collector, Forest Guard…',
    applyStart: '2026-10-06', lastDate: '2026-11-05', calendarDate: '2026-11-05', examDate: '2027-01-10',
    examLabel: 'Exam: 10 Jan 2027 · 9:30 am – 12:30 pm',
    eligibility: 'SSLC (Class 10) pass for most posts · typewriting / shorthand for Typist & Steno · age 18/21+ as on 1 Jul 2026',
    applyUrl: APPLY.tnpscGroup4, officialUrl: SITES.tnpsc.official,
    pattern: 'Single objective paper, 200 Qs, 300 marks, 3 hrs: Part A Tamil Eligibility Test (100 Qs, qualifying) + Part B General Studies (75) & Aptitude/Mental Ability (25).',
    topics: ['General Tamil: grammar, literature, Thirukkural', 'General Studies: science, geography, history & culture, Indian polity & economy', 'Indian National Movement & Tamil Nadu administration', 'Aptitude: percentage, ratio, time & work, interest, area & volume', 'Mental ability: series, puzzles, logical reasoning'],
  },
  {
    id: 'rrb-ntpc-grad', name: 'RRB NTPC Graduate (CEN 06/2026)', body: 'RRB', category: 'Railways',
    posts: '3,548 posts – Goods Train Manager, Senior Clerk cum Typist, Jr. Accounts Asst., Chief Commercial cum Ticket Supervisor',
    applyStart: '2026-10-08', lastDate: '2026-11-08', calendarDate: '2026-11-08', examDate: '2026-12-24',
    examLabel: 'CBT-1: 4th week of Dec 2026 (tentative)',
    eligibility: 'Bachelor’s degree · age 18–33 as on 1 Jan 2027 (relaxation as per rules)',
    applyUrl: APPLY.rrb, officialUrl: SITES.rrb.official, ...NTPC,
  },
  {
    id: 'ibps-rrb-xv-officer', name: 'IBPS RRB Officer Scale I – Prelims (CRP RRBs-XV)', body: 'IBPS', category: 'Banking',
    posts: 'Officers Scale I, II & III', applyStart: null, lastDate: '2026-09-27',
    calendarDate: '2026-11-21', examDate: '2026-11-21', examEnd: '2026-12-20', examLabel: 'Prelims 21–22 Nov · Mains 20 Dec 2026',
    applyUrl: APPLY.ibpsRrbOfficer, officialUrl: SITES.ibps.official,
    pattern: 'Scale I: online prelims (Reasoning + Numerical Ability, 80 Qs, 45 min) then mains (200 marks, 2 hrs). Scale II & III: single mains exam, then interview.',
    topics: ['Reasoning', 'Numerical Ability', 'English / Hindi', 'General Awareness', 'Computer Knowledge', 'Professional knowledge (Scale II & III)'],
  },
  {
    id: 'rrb-station-master', name: 'RRB Station Master (CEN 08/2026)', body: 'RRB', category: 'Railways',
    posts: '1,265 Station Master posts', applyStart: '2026-10-27', lastDate: '2026-11-25',
    calendarDate: '2026-11-25', examDate: null, examLabel: 'Exam date to be announced',
    eligibility: 'Graduate in any discipline (see official notification for age & category details)',
    applyUrl: APPLY.rrb, officialUrl: SITES.rrb.official, ...NTPC,
  },
];

/* ---------- helpers ---------- */
export const toDate = (s) => (s ? new Date(`${s}T00:00:00`) : null);
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
export const daysUntil = (s) => Math.round((toDate(s) - startOfToday()) / 86400000);
export const fmt = (s, withYear = true) =>
  toDate(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) });

/** open | soon | closed | over | tba */
export function statusOf(e) {
  const today = startOfToday();
  const start = toDate(e.applyStart);
  const last = toDate(e.lastDate);
  const end = toDate(e.examEnd || e.examDate);
  if (end && today > end) return 'over';
  if (start && today < start) return 'soon';
  if (last && today <= last) return 'open';
  if (!start && !last) return 'tba';
  return 'closed';
}

export const STATUS_LABEL = {
  open: 'Applications open',
  soon: 'Opens soon',
  closed: 'Applications closed',
  over: 'Exam completed',
  tba: 'Dates awaited',
};

export const yearOf = (e) => Number(e.calendarDate.slice(0, 4));
export const monthOf = (e) => Number(e.calendarDate.slice(5, 7)) - 1;
export const dayOf = (e) => Number(e.calendarDate.slice(8, 10));
/** why the exam sits on its calendar date */
export const calendarNote = (e) =>
  e.calendarDate === e.lastDate ? 'Last date to apply' : e.calendarDate === e.examDate ? 'Exam date' : 'Key date';

export const sortExams = (list) => [...list].sort((a, b) => a.calendarDate.localeCompare(b.calendarDate));
export const SEED_EXAMS = sortExams(exams);

/** Text for the "when is the exam" line */
export const examWhen = (e) =>
  e.examLabel ||
  (e.examDate ? `Exam: ${fmt(e.examDate)}${e.examEnd && e.examEnd !== e.examDate ? ` – ${fmt(e.examEnd)}` : ''}` : 'Exam date to be announced');

/** The next n exams on the calendar from today (falls back to the latest n if none are ahead) */
export function upcomingExams(list, n = 4) {
  const sorted = sortExams(list);
  const today = new Date().toISOString().slice(0, 10);
  const ahead = sorted.filter((e) => e.calendarDate >= today);
  return (ahead.length ? ahead : sorted.reverse()).slice(0, n);
}

/**
 * Exam for the announcement bar: the most recently announced exam that is still open
 * for applications (public exams only); otherwise the next one opening soon.
 * Returns null when nothing qualifies (the bar then hides itself).
 */
export function featuredExam(list = SEED_EXAMS) {
  const key = (e) => e.applyStart || '';
  const open = list.filter((e) => !e.departmental && statusOf(e) === 'open')
    .sort((a, b) => key(b).localeCompare(key(a)) || (a.lastDate || '').localeCompare(b.lastDate || ''));
  if (open.length) return { exam: open[0], status: 'open' };
  const soon = list.filter((e) => !e.departmental && statusOf(e) === 'soon')
    .sort((a, b) => a.applyStart.localeCompare(b.applyStart));
  return soon.length ? { exam: soon[0], status: 'soon' } : null;
}
