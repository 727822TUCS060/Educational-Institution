import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, KeyRound, Loader2, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function Register() {
  const { register } = useAuth();
  const { notify } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: 'student', name: '', email: '', phone: '', password: '', confirm: '', ownerCode: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const er = {};
    if (form.name.trim().length < 3) er.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email';
    if (!/^[0-9]{10}$/.test(form.phone)) er.phone = 'Enter a 10-digit mobile number';
    if (form.password.length < 6) er.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) er.confirm = 'Passwords do not match';
    if (form.role === 'owner' && !form.ownerCode.trim()) er.ownerCode = 'Owner access code is required';
    setErrors(er);
    if (Object.keys(er).length) return;

    setBusy(true);
    const res = await register(form);
    setBusy(false);
    if (!res.ok) return setServerError(res.error);
    notify('Account created successfully!');
    navigate(res.user.role === 'owner' ? '/admin' : '/', { replace: true });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="muted">Choose how you will use the website.</p>

        <form onSubmit={submit} noValidate>
          <div className="role-options">
            <label className={`role-option ${form.role === 'student' ? 'active' : ''}`}>
              <input type="radio" name="role" checked={form.role === 'student'} onChange={() => setForm((f) => ({ ...f, role: 'student' }))} />
              <GraduationCap size={22} />
              <b>Student</b>
              <span>Buy books, enquire about courses</span>
            </label>
            <label className={`role-option ${form.role === 'owner' ? 'active' : ''}`}>
              <input type="radio" name="role" checked={form.role === 'owner'} onChange={() => setForm((f) => ({ ...f, role: 'owner' }))} />
              <ShieldCheck size={22} />
              <b>Owner (Admin)</b>
              <span>Manage books and courses</span>
            </label>
          </div>

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
          <div className="grid-2">
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" />
              {errors.password && <span className="err">{errors.password}</span>}
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" />
              {errors.confirm && <span className="err">{errors.confirm}</span>}
            </div>
          </div>

          {form.role === 'owner' && (
            <div className="field">
              <label><KeyRound size={14} /> Owner access code</label>
              <input type="password" value={form.ownerCode} onChange={set('ownerCode')} placeholder="Provided by the institute" />
              {errors.ownerCode && <span className="err">{errors.ownerCode}</span>}
            </div>
          )}

          {serverError && <div className="alert">{serverError}</div>}
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
            {busy ? <><Loader2 size={18} className="spin" /> Creating account…</> : <><UserPlus size={18} /> Register</>}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
