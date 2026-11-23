import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, ListChecks, Monitor, Signal, UserCheck } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm';
import LoadState from '../components/LoadState';
import { useStore } from '../context/StoreContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { courses, loading } = useStore();
  const course = courses.find((c) => c.id === id);

  if (!course && loading) {
    return <div className="container section"><LoadState /></div>;
  }

  if (!course) {
    return (
      <div className="container section center">
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary">Back to courses</Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Link to="/courses" className="back-link light"><ArrowLeft size={16} /> All courses</Link>
          <h1>{course.title}</h1>
          <div className="meta-row light">
            <span><Clock size={16} /> {course.duration}</span>
            <span><Monitor size={16} /> {course.mode}</span>
            <span><Signal size={16} /> {course.level}</span>
          </div>
        </div>
      </div>

      <div className="container section-sm course-grid">
        <div>
          <div className="card pad">
            <h3>About this course</h3>
            <p className="muted">{course.description}</p>
            <p className="eligibility"><UserCheck size={17} /> <b>Eligibility:</b> {course.eligibility}</p>
          </div>

          <div className="card pad">
            <h3>What you will achieve</h3>
            <ul className="outcome-list big">
              {course.outcomes.map((o) => (
                <li key={o}><CheckCircle2 size={18} /> {o}</li>
              ))}
            </ul>
          </div>

          <div className="card pad">
            <h3>Syllabus highlights</h3>
            <ul className="syllabus">
              {course.syllabus.map((s) => (
                <li key={s}><ListChecks size={16} /> {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="sticky-side">
          <EnquiryForm course={course} />
        </aside>
      </div>
    </>
  );
}
