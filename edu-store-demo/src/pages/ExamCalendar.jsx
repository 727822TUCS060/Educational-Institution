import { useMemo, useState } from 'react';
import { CalendarDays, CalendarX, ChevronLeft, ChevronRight, ExternalLink, FileText, GraduationCap, Info, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  CATEGORIES, STATUS_LABEL, calendarNote, dayOf, examWhen, fmt, monthOf, sortExams, statusOf, yearOf,
} from '../data/exams';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthGrid({ year, month, exams }) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const byDay = {};
  exams.forEach((e) => { (byDay[dayOf(e)] ||= []).push(e); });

  return (
    <div className="cal-grid" role="grid" aria-label={`${MONTHS[month]} ${year}`}>
      {DOW.map((d) => <div className="cal-dow" key={d}>{d}</div>)}
      {cells.map((d, i) => (
        <div key={i} className={`cal-cell ${d ? '' : 'empty'} ${isThisMonth && d === today.getDate() ? 'today' : ''} ${byDay[d] ? 'has' : ''}`}>
          {d && <span className="cal-num">{d}</span>}
          {(byDay[d] || []).map((e) => (
            <a key={e.id} href={`#exam-${e.id}`} className={`cal-event ${statusOf(e)}`} title={e.name}>{e.body}</a>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExamCard({ exam }) {
  const status = statusOf(exam);
  const isOpen = status === 'open' || status === 'soon';
  return (
    <article className="exam-row card" id={`exam-${exam.id}`}>
      <div className="exam-date">
        <b>{dayOf(exam)}</b>
        <span>{MONTHS[monthOf(exam)].slice(0, 3)}</span>
        <small>{calendarNote(exam)}</small>
      </div>
      <div className="exam-main">
        <div className="exam-head">
          <h3>{exam.name}</h3>
          <span className={`exam-status ${status}`}>{STATUS_LABEL[status]}</span>
        </div>
        <p className="muted small">{exam.body === exam.category ? exam.body : `${exam.body} · ${exam.category}`}{exam.posts ? ` · ${exam.posts}` : ''}</p>

        <div className="exam-dates">
          {exam.applyStart && <span><CalendarDays size={14} /> Apply from <b>{fmt(exam.applyStart)}</b></span>}
          {exam.lastDate && <span><CalendarX size={14} /> Last date <b>{fmt(exam.lastDate)}</b></span>}
          <span><MapPin size={14} /> <b>{examWhen(exam)}</b></span>
        </div>
        {exam.eligibility && <p className="exam-elig"><GraduationCap size={15} /> {exam.eligibility}</p>}

        {(exam.pattern || exam.topics.length > 0) && (
          <details className="syllabus-box">
            <summary><FileText size={15} /> Syllabus &amp; exam pattern</summary>
            {exam.pattern && <p className="exam-pattern">{exam.pattern}</p>}
            {exam.topics.length > 0 && <ul className="topic-chips">{exam.topics.map((t) => <li key={t}>{t}</li>)}</ul>}
          </details>
        )}

        <div className="exam-actions">
          <a href={exam.applyUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-sm ${isOpen ? 'btn-accent' : 'btn-outline'}`}>
            {isOpen ? 'Apply Now' : 'Application link'} <ExternalLink size={14} />
          </a>
          {exam.officialUrl && <a href={exam.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">Official website</a>}
        </div>
      </div>
    </article>
  );
}

export default function ExamCalendar() {
  const { exams: allExams, loading } = useStore();
  const ALL_EXAMS = useMemo(() => sortExams(allExams), [allExams]);
  const now = new Date();
  // years: this year, next year and any year that has an exam
  const YEARS = useMemo(
    () => [...new Set([now.getFullYear(), now.getFullYear() + 1, ...ALL_EXAMS.map(yearOf)])].sort(),
    [ALL_EXAMS] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [cat, setCat] = useState('All');

  const counts = useMemo(() => {
    const c = Array(12).fill(0);
    ALL_EXAMS.filter((e) => yearOf(e) === year).forEach((e) => { c[monthOf(e)] += 1; });
    return c;
  }, [year, ALL_EXAMS]);

  const list = ALL_EXAMS.filter((e) => yearOf(e) === year && monthOf(e) === month && (cat === 'All' || e.category === cat));

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Exam Calendar {year}</h1>
          <p>Government &amp; competitive exam dates, syllabus and application links in one place.</p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="sample-note">
          <Info size={18} />
          <span>
            Exam dates are tentative and may change – please confirm on the official website before applying.
            {loading && ' Updating calendar…'}
          </span>
        </div>

        <div className="cal-toolbar">
          <div className="year-switch">
            <button className="icon-btn" aria-label="Previous year" disabled={YEARS.indexOf(year) <= 0} onClick={() => setYear(YEARS[YEARS.indexOf(year) - 1])}><ChevronLeft size={20} /></button>
            <strong>{year}</strong>
            <button className="icon-btn" aria-label="Next year" disabled={YEARS.indexOf(year) >= YEARS.length - 1} onClick={() => setYear(YEARS[YEARS.indexOf(year) + 1])}><ChevronRight size={20} /></button>
          </div>
          <div className="chips tight">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c === 'All' ? 'All exams' : c}</button>
            ))}
          </div>
        </div>

        <div className="month-tabs" role="tablist" aria-label="Months">
          {MONTHS.map((m, i) => (
            <button key={m} role="tab" aria-selected={month === i} className={`month-tab ${month === i ? 'active' : ''}`} onClick={() => setMonth(i)}>
              {m.slice(0, 3)}
              {counts[i] > 0 && <span className="month-count">{counts[i]}</span>}
            </button>
          ))}
        </div>

        <div className="cal-layout">
          <div className="card pad cal-card">
            <h3 className="cal-title">{MONTHS[month]} {year}</h3>
            <MonthGrid year={year} month={month} exams={list} />
            <div className="cal-legend">
              <span><i className="dot open" /> Applications open</span>
              <span><i className="dot closed" /> Closed</span>
              <span><i className="dot over" /> Completed</span>
            </div>
          </div>

          <div className="exam-list">
            {list.length === 0 ? (
              <div className="empty">
                <CalendarDays size={30} />
                <p>No exams listed for {MONTHS[month]} {year}{cat !== 'All' ? ` in ${cat}` : ''} in this sample calendar.</p>
              </div>
            ) : (
              list.map((e) => <ExamCard key={e.id} exam={e} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
