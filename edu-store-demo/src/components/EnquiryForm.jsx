import { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

// Used on each course page (course enquiry) and on the Contact page (general enquiry).
export default function EnquiryForm({ course, title = 'Enquire about this course', compact = false }) {
  const { user } = useAuth();
  const { addEnquiry, notify } = useStore();
  const empty = { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a 10-digit mobile number';
    if (!course && !form.message.trim()) e.message = 'Please write a short message';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    addEnquiry({
      courseId: course?.id || null,
      courseTitle: course?.title || 'General enquiry',
      ...form,
    });
    notify('Enquiry sent! Our team will contact you shortly.');
    setSent(true);
    setForm(empty);
  };

  if (sent) {
    return (
      <div className="card form-card success-box">
        <h3>Thank you!</h3>
        <p className="muted">
          We received your enquiry{course ? ` for ${course.title}` : ''}. Our counsellor will call you within one working day.
        </p>
        <button className="btn btn-outline" onClick={() => setSent(false)}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className={`card form-card ${compact ? 'compact' : ''}`} onSubmit={submit} noValidate>
      <h3>{title}</h3>
      {course && <p className="muted small">Fill in your details and we'll share the fees, batch timings and admission process.</p>}
      <div className="field">
        <label>Full name</label>
        <input value={form.name} onChange={set('name')} placeholder="Your name" />
        {errors.name && <span className="err">{errors.name}</span>}
      </div>
      <div className="grid-2">
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
          {errors.email && <span className="err">{errors.email}</span>}
        </div>
        <div className="field">
          <label>Mobile</label>
          <input value={form.phone} onChange={set('phone')} placeholder="10-digit number" />
          {errors.phone && <span className="err">{errors.phone}</span>}
        </div>
      </div>
      <div className="field">
        <label>Message {course && <span className="muted small">(optional)</span>}</label>
        <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Tell us what you'd like to know" />
        {errors.message && <span className="err">{errors.message}</span>}
      </div>
      <button className="btn btn-primary btn-block" type="submit"><Send size={16} /> Submit enquiry</button>
    </form>
  );
}
