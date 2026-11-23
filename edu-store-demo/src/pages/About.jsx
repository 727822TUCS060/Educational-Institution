import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, BookOpen, Briefcase, CheckCircle2, Eye, GraduationCap, Quote, Target, Users,
} from 'lucide-react';

const stats = [
  { icon: Award, value: '25+', label: 'Years of excellence' },
  { icon: Users, value: '12,000+', label: 'Aspirants trained' },
  { icon: Briefcase, value: '1,800+', label: 'Government job selections' },
  { icon: GraduationCap, value: '40+', label: 'Expert faculty' },
];

const values = [
  'Exam-focused, syllabus-aligned teaching',
  'Weekly tests with detailed performance analysis',
  'Personal mentoring and doubt-clearing sessions',
  'Affordable fees with scholarships for deserving students',
];

// NOTE: names and details below are sample content – replace with your real faculty.
const faculty = [
  { name: 'Dr. R. Meenakshi', role: 'Director & Polity Faculty', exp: '22 yrs experience', subject: 'UPSC · TNPSC' },
  { name: 'Mr. S. Karthikeyan', role: 'Quantitative Aptitude', exp: '15 yrs experience', subject: 'Banking · SSC' },
  { name: 'Ms. P. Lakshmi', role: 'English & Reasoning', exp: '12 yrs experience', subject: 'Banking · Railways' },
  { name: 'Mr. A. Venkatesh', role: 'General Studies & Current Affairs', exp: '18 yrs experience', subject: 'TNPSC · SSC' },
  { name: 'Dr. M. Fathima', role: 'Tamil & General Knowledge', exp: '14 yrs experience', subject: 'TNPSC Group 2 / 4' },
  { name: 'Mr. K. Balaji', role: 'Mathematics & Science', exp: '16 yrs experience', subject: 'Railways · Defence' },
];

const achievers = [
  { name: 'Arun Kumar', post: 'Group 4 – VAO', exam: 'TNPSC', year: '2025', quote: 'Weekly tests and current-affairs notes made the difference.' },
  { name: 'Divya Bharathi', post: 'Probationary Officer', exam: 'IBPS PO', year: '2025', quote: 'The mock tests felt exactly like the real exam.' },
  { name: 'Suresh Raj', post: 'Sub-Inspector', exam: 'TNUSRB', year: '2024', quote: 'Faculty guidance kept me consistent for a full year.' },
  { name: 'Nandhini S.', post: 'Assistant Section Officer', exam: 'SSC CGL', year: '2024', quote: 'Clear concepts and constant doubt-clearing support.' },
  { name: 'Prakash M.', post: 'Loco Pilot', exam: 'RRB ALP', year: '2024', quote: 'Previous-year papers and revision plans were superb.' },
  { name: 'Keerthana R.', post: 'Teacher (BT Assistant)', exam: 'TRB', year: '2023', quote: 'Subject-wise classes helped me score confidently.' },
];

const initials = (n) => n.replace(/^(Dr|Mr|Ms)\.\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('');

export default function About() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>About Vidya Academy</h1>
          <p>Guiding aspirants to competitive exam success and government careers for over 25 years.</p>
        </div>
      </div>

      {/* ABOUT */}
      <section className="section container">
        <div className="about-grid">
          <div>
            <span className="eyebrow dark">Who we are</span>
            <h2 className="about-title">A trusted name in competitive exam coaching</h2>
            <p className="about-text">
              Vidya Academy was founded with a simple purpose: to help every aspirant — from small towns to big cities —
              prepare for competitive and government exams with confidence. Over 25 years, we have trained thousands of
              students for UPSC, TNPSC, Banking, SSC, Railways, Defence and teaching exams.
            </p>
            <p className="about-text">
              Our structured classes, exam-oriented study materials, regular mock tests and personal mentoring give
              students a clear path from the first day of preparation to the day they receive their appointment order.
            </p>
            <ul className="outcome-list big about-list">
              {values.map((v) => (
                <li key={v}><CheckCircle2 size={18} /> {v}</li>
              ))}
            </ul>
          </div>
          <div className="about-stats">
            {stats.map(({ icon: Icon, value, label }) => (
              <div className="about-stat" key={label}>
                <Icon size={24} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center-head">
            <div>
              <span className="eyebrow dark">Our purpose</span>
              <h2>Vision &amp; Mission</h2>
            </div>
          </div>
          <div className="vm-grid">
            <div className="vm-card">
              <span className="feature-icon"><Eye size={26} /></span>
              <h3>Our Vision</h3>
              <p className="muted">
                To be the most trusted institution for competitive exam preparation — empowering every aspirant to
                secure a respected government career and contribute to nation-building.
              </p>
            </div>
            <div className="vm-card">
              <span className="feature-icon"><Target size={26} /></span>
              <h3>Our Mission</h3>
              <ul className="outcome-list">
                <li><CheckCircle2 size={16} /> Deliver quality, exam-focused coaching at affordable cost.</li>
                <li><CheckCircle2 size={16} /> Nurture discipline, concept clarity and exam temperament through regular tests.</li>
                <li><CheckCircle2 size={16} /> Provide personal mentoring so no aspirant is left behind.</li>
                <li><CheckCircle2 size={16} /> Build integrity and confidence in every student we teach.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FACULTY */}
      <section className="section container">
        <div className="section-head center-head">
          <div>
            <span className="eyebrow dark">Meet our mentors</span>
            <h2>Our Faculties</h2>
          </div>
        </div>
        <div className="grid-3">
          {faculty.map((f) => (
            <div className="person-card" key={f.name}>
              <span className="person-avatar">{initials(f.name)}</span>
              <h3>{f.name}</h3>
              <p className="person-role">{f.role}</p>
              <div className="person-meta">
                <span><BookOpen size={14} /> {f.subject}</span>
                <span><Award size={14} /> {f.exp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVERS */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center-head">
            <div>
              <span className="eyebrow dark">Success stories</span>
              <h2>Our Achievers</h2>
            </div>
          </div>
          <div className="grid-3">
            {achievers.map((a) => (
              <figure className="achiever-card" key={a.name}>
                <div className="achiever-top">
                  <span className="person-avatar sm">{initials(a.name)}</span>
                  <div>
                    <b>{a.name}</b>
                    <span className="achiever-post">{a.post}</span>
                  </div>
                </div>
                <div className="achiever-badges">
                  <span className="tag static">{a.exam}</span>
                  <span className="tag static">{a.year}</span>
                </div>
                <blockquote><Quote size={16} /> {a.quote}</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container">
        <div className="cta-band" style={{ marginTop: 56 }}>
          <div>
            <h2>Your name could be next on our achievers list</h2>
            <p>Join Vidya Academy and start preparing with expert guidance today.</p>
          </div>
          <div className="hero-cta">
            <Link to="/courses" className="btn btn-accent btn-lg">View courses <ArrowRight size={18} /></Link>
            <Link to="/contact" className="btn btn-light btn-lg">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
