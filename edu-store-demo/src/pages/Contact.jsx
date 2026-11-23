import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm';

export default function Contact() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions about books, courses or admissions? We’re happy to help.</p>
        </div>
      </div>
      <div className="container section-sm contact-grid">
        <div>
          <div className="card pad contact-info">
            <div className="contact-item"><span><MapPin size={20} /></span><div><b>Visit us</b><p className="muted">12, Main Road, Krishnagiri, Tamil Nadu 635001</p></div></div>
            <div className="contact-item"><span><Phone size={20} /></span><div><b>Call us</b><p className="muted">+91 98765 43210</p></div></div>
            <div className="contact-item"><span><Mail size={20} /></span><div><b>Email</b><p className="muted">hello@vidyaacademy.demo</p></div></div>
            <div className="contact-item"><span><Clock size={20} /></span><div><b>Working hours</b><p className="muted">Mon – Sat, 9:00 AM – 6:00 PM</p></div></div>
          </div>
          <div className="map-box">Map placeholder – embed Google Maps here</div>
        </div>
        <EnquiryForm title="Send us a message" />
      </div>
    </>
  );
}
