import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, Banknote, BookOpen, Briefcase, GraduationCap, HeartHandshake, Landmark, MessageSquareQuote,
  Shield, ShieldCheck, Train, Truck, Users,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadState from '../components/LoadState';
import CourseCard from '../components/CourseCard';
import { useStore } from '../context/StoreContext';
import { STATUS_LABEL, dayOf, examWhen, fmt, monthOf, statusOf, upcomingExams } from '../data/exams';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const stats = [
  { icon: Users, value: '12,000+', label: 'Aspirants trained' },
  { icon: BookOpen, value: '150+', label: 'Books & study packs' },
  { icon: Award, value: '25+', label: 'Years of excellence' },
  { icon: Briefcase, value: '1,800+', label: 'Govt. job selections' },
];

const examCategories = [
  { icon: Landmark, title: 'UPSC & TNPSC', text: 'Civil services, Group 1, 2 & 4 with prelims-to-mains coaching.' },
  { icon: Banknote, title: 'Banking & SSC', text: 'IBPS, SBI, RRB and SSC CGL / CHSL with timed mock tests.' },
  { icon: Train, title: 'Railways', text: 'RRB NTPC, Group D and ALP preparation with previous-year papers.' },
  { icon: Shield, title: 'Defence & Police', text: 'NDA, CDS and State Police exam coaching with fitness guidance.' },
  { icon: GraduationCap, title: 'Teaching exams', text: 'TET, CTET and TRB with subject-wise and pedagogy classes.' },
  { icon: Briefcase, title: 'Entrance exams', text: 'NEET, JEE and CUET for a strong start to your career.' },
];

const features = [
  { icon: ShieldCheck, title: 'Trusted content', text: 'Prepared and reviewed by experienced faculty, updated every academic year.' },
  { icon: Truck, title: 'Doorstep delivery', text: 'Order books and materials online and get them delivered across India.' },
  { icon: HeartHandshake, title: 'Personal guidance', text: 'Counsellors help you choose the right course and study plan.' },
];

const testimonials = [
  { name: 'Kavya S.', role: 'NEET aspirant', text: 'The study material was clear and exam-focused. Ordering online was effortless and it arrived in two days.' },
  { name: 'Mr. Ramesh', role: 'Parent', text: 'The counsellors explained the course outcomes honestly. My son’s marks improved within one term.' },
  { name: 'Arun K.', role: 'TNPSC Group 4 selected', text: 'Weekly tests and current-affairs notes made a real difference in my preparation.' },
];

export default function Home() {
  const { products, courses, exams } = useStore();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Competitive exams · Government jobs</span>
            <h1>Crack competitive exams. <em>Secure your government job.</em></h1>
            <p className="hero-text">
              Expert coaching, exam-focused study materials and weekly mock tests for UPSC, TNPSC, Banking, SSC,
              Railways and other government exams — everything you need to turn preparation into a career.
            </p>
            <div className="hero-cta">
              <Link to="/courses" className="btn btn-accent btn-lg">Explore exam courses <ArrowRight size={18} /></Link>
              <Link to="/contact" className="btn btn-light btn-lg">Free counselling</Link>
            </div>
            <ul className="hero-points">
              <li>Experienced faculty</li>
              <li>Weekly mock tests</li>
              <li>Current-affairs notes</li>
            </ul>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-card c1"><Landmark size={28} /><b>Government exams</b><span>UPSC · TNPSC · SSC · Banking</span></div>
            <div className="hero-card c2"><Briefcase size={28} /><b>1,800+ selections</b><span>Placed in government jobs</span></div>
            <div className="hero-card c3"><Award size={28} /><b>94% success</b><span>Across competitive exams</span></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats container">
        {stats.map(({ icon: Icon, value, label }) => (
          <div className="stat" key={label}>
            <Icon size={26} />
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* EXAMS WE PREPARE FOR */}
      <section className="section container">
        <div className="section-head center-head">
          <div>
            <span className="eyebrow dark">Exams we prepare you for</span>
            <h2>Your path to a government career</h2>
          </div>
        </div>
        <div className="grid-3">
          {examCategories.map(({ icon: Icon, title, text }) => (
            <Link to="/courses" className="exam-card" key={title}>
              <span className="feature-icon"><Icon size={24} /></span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
              <span className="link-arrow small">View courses <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* EXAM CALENDAR PREVIEW */}
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow dark">Exam calendar</span>
              <h2>Important exam dates</h2>
            </div>
            <Link to="/exam-calendar" className="link-arrow">Full calendar <ArrowRight size={16} /></Link>
          </div>
          <div className="home-exams">
            {upcomingExams(exams, 4).map((e) => (
              <Link to="/exam-calendar" className="home-exam" key={e.id}>
                <span className="exam-date mini"><b>{dayOf(e)}</b><span>{MON[monthOf(e)]}</span></span>
                <span className="home-exam-text">
                  <b>{e.name}</b>
                  <small>{e.lastDate ? `Last date ${fmt(e.lastDate)}` : examWhen(e)}</small>
                </span>
                <span className={`exam-status ${statusOf(e)}`}>{STATUS_LABEL[statusOf(e)]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow dark">Online store</span>
            <h2>Featured books &amp; materials</h2>
          </div>
          <Link to="/products" className="link-arrow">View all <ArrowRight size={16} /></Link>
        </div>
        <LoadState />
        <div className="grid-4">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* COURSES */}
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow dark">Coaching programs</span>
              <h2>Popular courses</h2>
            </div>
            <Link to="/courses" className="link-arrow">All courses <ArrowRight size={16} /></Link>
          </div>
          <div className="grid-3">
            {courses.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section container">
        <div className="section-head center-head">
          <div>
            <span className="eyebrow dark">Why Vidya Academy</span>
            <h2>Learning made simple and reliable</h2>
          </div>
        </div>
        <div className="grid-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="feature" key={title}>
              <span className="feature-icon"><Icon size={24} /></span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center-head">
            <div>
              <span className="eyebrow dark">How it works</span>
              <h2>From browsing to learning in 3 steps</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step"><span>1</span><h4>Browse &amp; choose</h4><p className="muted">Explore books, materials and courses with detailed outcomes.</p></div>
            <div className="step"><span>2</span><h4>Buy or enquire</h4><p className="muted">Purchase books online, or send a quick enquiry for any course.</p></div>
            <div className="step"><span>3</span><h4>Start learning</h4><p className="muted">Receive your books at home and get a call from our counsellor.</p></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section container">
        <div className="section-head center-head">
          <div>
            <span className="eyebrow dark">Testimonials</span>
            <h2>What students &amp; parents say</h2>
          </div>
        </div>
        <div className="grid-3">
          {testimonials.map((t) => (
            <figure className="card testimonial" key={t.name}>
              <MessageSquareQuote size={26} />
              <blockquote>{t.text}</blockquote>
              <figcaption><b>{t.name}</b><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container">
        <div className="cta-band">
          <div>
            <h2>Ready to start your exam journey?</h2>
            <p>Talk to our counsellors – we’ll guide you to the right exam and study plan.</p>
            <Link to="/about" className="cta-link">Know more about us →</Link>
          </div>
          <Link to="/contact" className="btn btn-accent btn-lg">Contact us</Link>
        </div>
      </section>
    </>
  );
}
