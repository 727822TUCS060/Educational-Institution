import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Megaphone, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { daysUntil, featuredExam, fmt } from '../data/exams';

const KEY = 'vidya-announcement-dismissed';
const read = () => { try { return sessionStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { sessionStorage.setItem(KEY, v); } catch { /* ignore */ } };

// Top bar showing the latest government exam that is open for applications.
export default function AnnouncementBar() {
  const { exams } = useStore();
  const featured = featuredExam(exams);
  const [hidden, setHidden] = useState(() => featured && read() === featured.exam.id);
  if (!featured || hidden) return null;

  const { exam, status } = featured;
  const left = status === 'open' ? daysUntil(exam.lastDate) : null;
  const when =
    status === 'open'
      ? left === 0 ? 'Last date: today!' : `Last date ${fmt(exam.lastDate)}${left > 0 ? ` · ${left} day${left > 1 ? 's' : ''} left` : ''}`
      : `Applications open ${fmt(exam.applyStart)}`;

  return (
    <div className="announce" role="region" aria-label="Latest exam announcement">
      <div className="container announce-inner">
        <span className="announce-tag"><Megaphone size={14} /> {status === 'open' ? 'Latest' : 'Coming soon'}</span>
        <p className="announce-text">
          <b>{exam.name}</b>
          {exam.posts && <span className="announce-posts"> – {exam.posts.split('–')[0].trim()}</span>}
          <span className="announce-when"> · {when}</span>
        </p>
        <div className="announce-actions">
          <a href={exam.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm announce-btn">
            Apply Now <ExternalLink size={14} />
          </a>
          <Link to="/exam-calendar" className="announce-link">Exam calendar</Link>
        </div>
        <button
          className="announce-close"
          aria-label="Dismiss announcement"
          onClick={() => { write(exam.id); setHidden(true); }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
