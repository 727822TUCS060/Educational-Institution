import { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Modal, { ConfirmDialog } from '../../components/Modal';
import { useStore } from '../../context/StoreContext';
import { LEVELS, MODES } from '../../data/seed';

const blank = {
  title: '', duration: '', level: LEVELS[0], mode: MODES[0], eligibility: '', description: '', outcomes: '', syllabus: '',
};

// Courses are stored with outcomes/syllabus as arrays; the form edits them one-per-line.
const toForm = (c) => ({ ...c, outcomes: c.outcomes.join('\n'), syllabus: c.syllabus.join('\n') });
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);

function CourseForm({ initial, onSave, onCancel, busy }) {
  const [f, setF] = useState(initial ? toForm(initial) : blank);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = 'Title is required';
    if (!f.duration.trim()) er.duration = 'Duration is required';
    if (!f.description.trim()) er.description = 'Add a description';
    if (lines(f.outcomes).length === 0) er.outcomes = 'Add at least one outcome';
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave({ ...f, outcomes: lines(f.outcomes), syllabus: lines(f.syllabus) });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="field"><label>Course title</label><input value={f.title} onChange={set('title')} />{errors.title && <span className="err">{errors.title}</span>}</div>
      <div className="grid-3-form">
        <div className="field"><label>Duration</label><input value={f.duration} onChange={set('duration')} placeholder="e.g. 6 Months" />{errors.duration && <span className="err">{errors.duration}</span>}</div>
        <div className="field"><label>Level</label><select value={f.level} onChange={set('level')}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></div>
        <div className="field"><label>Mode</label><select value={f.mode} onChange={set('mode')}>{MODES.map((m) => <option key={m}>{m}</option>)}</select></div>
      </div>
      <div className="field"><label>Eligibility</label><input value={f.eligibility} onChange={set('eligibility')} /></div>
      <div className="field"><label>Description</label><textarea rows={3} value={f.description} onChange={set('description')} />{errors.description && <span className="err">{errors.description}</span>}</div>
      <div className="field"><label>Outcomes <span className="muted small">(one per line)</span></label><textarea rows={4} value={f.outcomes} onChange={set('outcomes')} />{errors.outcomes && <span className="err">{errors.outcomes}</span>}</div>
      <div className="field"><label>Syllabus highlights <span className="muted small">(one per line)</span></label><textarea rows={3} value={f.syllabus} onChange={set('syllabus')} /></div>
      <p className="muted small">Courses have no price – students send an enquiry to know fees and batch details.</p>
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : initial ? 'Save changes' : 'Add course'}
        </button>
      </div>
    </form>
  );
}

export default function AdminCourses() {
  const { courses, addCourse, updateCourse, deleteCourse, notify } = useStore();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const list = courses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));

  const save = async (data) => {
    setBusy(true);
    try {
      if (editing === 'new') {
        await addCourse(data);
        notify('Course added');
      } else {
        await updateCourse(editing.id, data);
        notify('Course updated');
      }
      setEditing(null);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteCourse(deleting.id);
      notify('Course deleted');
      setDeleting(null);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title">Courses</h1>
        <button className="btn btn-primary" onClick={() => setEditing('new')}><Plus size={17} /> Add course</button>
      </div>

      <div className="card">
        <div className="table-tools">
          <div className="search"><Search size={17} /><input placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <span className="muted small">{list.length} course(s)</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Course</th><th>Duration</th><th>Level</th><th>Mode</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.title}</b><div className="muted small">{c.outcomes.length} outcomes</div></td>
                  <td>{c.duration}</td>
                  <td>{c.level}</td>
                  <td>{c.mode}</td>
                  <td className="right">
                    <button className="icon-btn" title="Edit" onClick={() => setEditing(c)}><Pencil size={17} /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(c)}><Trash2 size={17} /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="center muted">No courses found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add course' : 'Edit course'} onClose={() => setEditing(null)} wide>
          <CourseForm initial={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} busy={busy} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete course?"
          message={`“${deleting.title}” will be removed from the website.`}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
