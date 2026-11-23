import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen, CalendarDays, ExternalLink, GraduationCap, LayoutDashboard, LogOut, Menu, MessageSquare, RotateCcw, ShoppingBag, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: BookOpen },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { to: '/admin/exams', label: 'Exam Calendar', icon: CalendarDays },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { notify, resetDemo } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin">
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <Link to="/" className="brand light"><span className="brand-mark"><GraduationCap size={22} /></span><span>Vidya <b>Admin</b></span></Link>
        <nav>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon size={18} /> {label}</NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <button onClick={() => window.confirm('Clear demo orders, enquiries and cart stored in this browser? Books and courses in Google Sheets are not affected.') && resetDemo()}>
            <RotateCcw size={16} /> Clear demo orders
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <button className="icon-btn admin-burger" onClick={() => setOpen((o) => !o)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
          <div>
            <strong>Welcome, {user.name}</strong>
            <span className="role-pill owner">Owner</span>
          </div>
          <div className="admin-top-actions">
            <Link to="/" className="btn btn-outline btn-sm"><ExternalLink size={15} /> View site</Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => { logout(); notify('Logged out'); navigate('/'); }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>
        <div className="admin-content"><Outlet /></div>
      </div>
    </div>
  );
}
