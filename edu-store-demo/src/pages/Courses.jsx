import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import LoadState from '../components/LoadState';
import { useStore } from '../context/StoreContext';
import { MODES } from '../data/seed';

export default function Courses() {
  const { courses, loading, loadError } = useStore();
  const [q, setQ] = useState('');
  const [mode, setMode] = useState('All');

  const list = useMemo(
    () =>
      courses.filter(
        (c) => (mode === 'All' || c.mode === mode) && c.title.toLowerCase().includes(q.toLowerCase())
      ),
    [courses, q, mode]
  );

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Our Courses</h1>
          <p>Explore programs, see what you will achieve, and enquire for fees and batches.</p>
        </div>
      </div>
      <div className="container section-sm">
        <div className="toolbar">
          <div className="search">
            <Search size={18} />
            <input placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="chips">
          {['All', ...MODES].map((m) => (
            <button key={m} className={`chip ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
              {m === 'All' ? 'All modes' : m}
            </button>
          ))}
        </div>
        <LoadState />
        {!loading && !loadError && list.length === 0 ? (
          <div className="empty">No courses found.</div>
        ) : (
          <div className="grid-3">
            {list.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </div>
    </>
  );
}
