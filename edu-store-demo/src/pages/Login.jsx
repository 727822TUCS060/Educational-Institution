import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function Login() {
  const { login } = useAuth();
  const { notify } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = await login(form.email, form.password);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    notify(`Welcome back, ${res.user.name.split(' ')[0]}!`);
    // Owners land on the admin panel; students go back to where they came from.
    const target = res.user.role === 'owner' ? '/admin' : location.state?.from || '/';
    navigate(target, { replace: true });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="muted">Login to buy books, track orders and manage your account.</p>

        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          {error && <div className="alert">{error}</div>}
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
            {busy ? <><Loader2 size={18} className="spin" /> Logging in…</> : <><LogIn size={18} /> Login</>}
          </button>
        </form>

        <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
