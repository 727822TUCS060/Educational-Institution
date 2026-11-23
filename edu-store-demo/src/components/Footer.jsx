import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand light">
            <span className="brand-mark"><GraduationCap size={22} /></span>
            <span>Vidya <b>Academy</b></span>
          </div>
          <p className="footer-text">
            Coaching, study materials and mock tests for competitive and government job exams.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/products">Books &amp; Materials</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/exam-calendar">Exam Calendar</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>
        <div>
          <h4>Reach us</h4>
          <span className="footer-line"><MapPin size={15} /> 12, Main Road, Krishnagiri</span>
          <span className="footer-line"><Phone size={15} /> +91 98765 43210</span>
          <span className="footer-line"><Mail size={15} /> hello@vidyaacademy.demo</span>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Vidya Academy · Demo prototype – no real payments are processed.</div>
    </footer>
  );
}
