import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Monitor, Signal } from 'lucide-react';
import Cover from './Cover';

// NOTE: courses intentionally show NO price – they are listing + enquiry only.
export default function CourseCard({ course }) {
  return (
    <article className="card course-card">
      <Link to={`/courses/${course.id}`} className="card-media">
        <Cover item={course} kind="Course" height={150} />
        <span className="tag">{course.level}</span>
      </Link>
      <div className="card-body">
        <Link to={`/courses/${course.id}`}><h3 className="card-title">{course.title}</h3></Link>
        <div className="meta-row">
          <span><Clock size={14} /> {course.duration}</span>
          <span><Monitor size={14} /> {course.mode}</span>
          <span><Signal size={14} /> {course.level}</span>
        </div>
        <ul className="outcome-list">
          {course.outcomes.slice(0, 2).map((o) => (
            <li key={o}><CheckCircle2 size={15} /> {o}</li>
          ))}
        </ul>
        <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm btn-block">
          View details &amp; enquire <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
