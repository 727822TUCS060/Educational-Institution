import { useMemo, useState } from 'react';
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Modal, { ConfirmDialog } from '../../components/Modal';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES, STATUS_LABEL, fmt, sortExams, statusOf } from '../../data/exams';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const blank = {
  name: '', body: '', category: CATEGORIES[0], posts: '', notification: '', applyStart: '', lastDate: '', examDate: '', examEnd: '',
  calendarDate: '', examLabel: '', eligibility: '', pattern: '', topics: '', applyUrl: '', officialUrl: '', departmental: false,
};

// topics are stored as an array; the form edits them one per line
const toForm = (e) => ({ ...blank, ...e, topics: (e.topics || []).join('\n') });
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const isUrl = (u) => /^https?:\/\/\S+$/i.test(u.trim());

function ExamForm({ initial, onSave, onCancel, busy }) {
  const [f, setF] = useState(initial ? toForm(initial) : blank);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Exam name is required';
    if (!isUrl(f.applyUrl)) er.applyUrl = 'Enter the application form link (starting with https://)';
    if (f.officialUrl.trim() && !isUrl(f.officialUrl)) er.officialUrl = 'Must start with https://';
    if (!f.calendarDate && !f.examDate && !f.lastDate) er.calendarDate = 'Pick a calendar date (or an exam date / last date)';
    if (f.applyStart && f.lastDate && f.lastDate < f.applyStart) er.lastDate = 'Cannot be before the start date';
    if (f.examDate && f.examEnd && f.examEnd < f.examDate) er.examEnd = 'Cannot be before the exam date';
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave({ ...f, topics: lines(f.topics), calendarDate: f.calendarDate || f.examDate || f.lastDate });
  };

  const date = (k, label, hint) => (
    <div className="field">
      <label>{label}</label>
      <input type="date" value={f[k]} onChange={set(k)} />
      {hint && <span className="muted small">{hint}</span>}
      {errors[k] && <span className="err">{errors[k]}</span>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <div className="field"><label>Exam name</label><input value={f.name} onChange={set('name')} placeholder="e.g. TNPSC Group 2 (CCSE-II) 2027" />{errors.name && <span className="err">{errors.name}</span>}</div>
      <div className="grid-2">
        <div className="field"><label>Conducting body</label><input value={f.body} onChange={set('body')} placeholder="e.g. TNPSC, UPSC, SSC, IBPS, RRB" /></div>
        <div className="field"><label>Category</label><select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
      </div>
      <div className="field"><label>Posts / vacancies</label><input value={f.posts} onChange={set('posts')} placeholder="e.g. 6,574 posts – VAO, Junior Assistant…" /></div>

      <h4 className="form-sub">Dates</h4>
      <div className="grid-3-form">
        {date('applyStart', 'Application opens')}
        {date('lastDate', 'Last date to apply')}
        {date('notification', 'Notification date')}
      </div>
      <div className="grid-3-form">
        {date('examDate', 'Exam date (first day)')}
        {date('examEnd', 'Exam end date', 'Only for multi-day / multi-stage exams')}
        {date('calendarDate', 'Show on calendar on', 'Leave blank to use the exam date, else the last date')}
      </div>
      <div className="field"><label>Exam date text <span className="muted small">(optional – shown instead of the date)</span></label><input value={f.examLabel} onChange={set('examLabel')} placeholder="e.g. Prelims 21–22 Nov · Mains 20 Dec 2026" /></div>

      <h4 className="form-sub">Links</h4>
      <div className="field"><label>Application form link</label><input value={f.applyUrl} onChange={set('applyUrl')} placeholder="https://…  (opens when students click Apply Now)" />{errors.applyUrl && <span className="err">{errors.applyUrl}</span>}</div>
      <div className="field"><label>Official website <span className="muted small">(optional)</span></label><input value={f.officialUrl} onChange={set('officialUrl')} placeholder="https://…" />{errors.officialUrl && <span className="err">{errors.officialUrl}</span>}</div>

      <h4 className="form-sub">Details</h4>
      <div className="field"><label>Eligibility <span className="muted small">(optional)</span></label><input value={f.eligibility} onChange={set('eligibility')} placeholder="e.g. Any degree · age 18–30" /></div>
      <div className="field"><label>Exam pattern</label><textarea rows={3} value={f.pattern} onChange={set('pattern')} placeholder="Papers, marks, duration, negative marking…" /></div>
      <div className="field"><label>Syllabus topics <span className="muted small">(one per line)</span></label><textarea rows={4} value={f.topics} onChange={set('topics')} /></div>

      <label className="check-row">
        <input type="checkbox" checked={f.departmental} onChange={(e) => setF((x) => ({ ...x, departmental: e.target.checked }))} />
        <span>Departmental exam (serving employees only) – never shown in the top announcement bar</span>
      </label>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : initial ? 'Save changes' : 'Add exam'}</button>
      </div>
    </form>
  );
}

export default function AdminExams() {
  const { exams, addExam, updateExam, deleteExam, notify } = useStore();
  const [q, setQ] = useState('');
  const [month, setMonth] = useState('All');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = useMemo(
    () =>
      sortExams(exams).filter(
        (e) =>
          e.name.toLowerCase().includes(q.toLowerCase()) &&
          (month === 'All' || e.calendarDate.slice(0, 7) === month)
      ),
    [exams, q, month]
  );
  // months that actually have exams, e.g. "2026-11"
  const months = useMemo(() => [...new Set(sortExams(exams).map((e) => e.calendarDate.slice(0, 7)))], [exams]);

  const run = async (fn, okMsg, after) => {
    setBusy(true);
    try {
      await fn();
      notify(okMsg);
      after();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const save = (data) =>
    run(
      () => (editing === 'new' ? addExam(data) : updateExam(editing.id, data)),
      editing === 'new' ? 'Exam added to the calendar' : 'Exam updated',
      () => setEditing(null)
    );

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title">Exam Calendar</h1>
        <button className="btn btn-primary" onClick={() => setEditing('new')}><Plus size={17} /> Add exam</button>
      </div>
      <p className="muted small admin-hint">
        Exams added here appear on the public Exam Calendar for their month. The latest exam that is open for applications is shown in the top
        announcement bar automatically. You can also edit the <b>exams</b> sheet in Google Sheets directly.
      </p>

      <div className="card">
        <div className="table-tools">
          <div className="search"><Search size={17} /><input placeholder="Search exams" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Filter by month">
            <option value="All">All months</option>
            {months.map((m) => <option key={m} value={m}>{MONTHS[Number(m.slice(5)) - 1]} {m.slice(0, 4)}</option>)}
          </select>
          <span className="muted small">{list.length} exam(s)</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Exam</th><th>Category</th><th>Calendar date</th><th>Last date</th><th>Status</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td><b>{e.name}</b><div className="muted small">{e.body}{e.departmental ? ' · Departmental' : ''}</div></td>
                  <td>{e.category}</td>
                  <td>{fmt(e.calendarDate)}</td>
                  <td>{e.lastDate ? fmt(e.lastDate) : '—'}</td>
                  <td><span className={`exam-status ${statusOf(e)}`}>{STATUS_LABEL[statusOf(e)]}</span></td>
                  <td className="right">
                    <a className="icon-btn" title="Open application link" href={e.applyUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={17} /></a>
                    <button className="icon-btn" title="Edit" onClick={() => setEditing(e)}><Pencil size={17} /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(e)}><Trash2 size={17} /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={6} className="center muted">No exams found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add exam' : 'Edit exam'} onClose={() => setEditing(null)} wide>
          <ExamForm initial={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} busy={busy} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete exam?"
          message={`“${deleting.name}” will be removed from the calendar.`}
          onCancel={() => setDeleting(null)}
          onConfirm={() => run(() => deleteExam(deleting.id), 'Exam deleted', () => setDeleting(null))}
        />
      )}
    </>
  );
}
