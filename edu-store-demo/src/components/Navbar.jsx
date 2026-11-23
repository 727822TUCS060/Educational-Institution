import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, LogOut, Menu, Package, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { user, isOwner, logout } = useAuth();
  const { cartCount, notify } = useStore();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenu(false);
    setOpen(false);
    notify('You have been logged out.');
    navigate('/');
  };

  // The cart is only for logged-in users: guests are sent to login and brought back to the cart afterwards.
  const openCart = (e) => {
    close();
    if (!user) {
      e.preventDefault();
      notify('Please login to view your cart.', 'error');
      navigate('/login', { state: { from: '/cart' } });
    }
  };

  const close = () => {
    setOpen(false);
    setMenu(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark"><GraduationCap size={22} /></span>
          <span>
            Vidya <b>Academy</b>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/products" onClick={close}>Books &amp; Materials</NavLink>
          <NavLink to="/courses" onClick={close}>Courses</NavLink>
          <NavLink to="/exam-calendar" onClick={close}>Exam Calendar</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>

          {/* mobile-only auth actions */}
          <div className="nav-mobile-auth">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline btn-block" onClick={close}>Login</Link>
                <Link to="/register" className="btn btn-accent btn-block" onClick={close}>Register</Link>
              </>
            ) : (
              <>
                {isOwner && <Link to="/admin" className="btn btn-outline btn-block" onClick={close}>Admin Panel</Link>}
                {!isOwner && <Link to="/my-orders" className="btn btn-outline btn-block" onClick={close}>My Orders</Link>}
                <button className="btn btn-danger btn-block" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </nav>

        <div className="nav-actions">
          {!isOwner && (
            <Link to="/cart" className="icon-btn" aria-label="Cart" onClick={openCart}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
            </Link>
          )}

          {!user ? (
            <div className="nav-auth-desktop">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-accent">Register</Link>
            </div>
          ) : (
            <div className="user-menu nav-auth-desktop">
              <button className="user-chip" onClick={() => setMenu((m) => !m)}>
                <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-chip-text">
                  {user.name.split(' ')[0]}
                  <small className={`role-pill ${user.role}`}>{isOwner ? 'Owner' : 'Student'}</small>
                </span>
              </button>
              {menu && (
                <div className="dropdown">
                  <div className="dropdown-head">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  {isOwner ? (
                    <Link to="/admin" onClick={close}><LayoutDashboard size={16} /> Admin Panel</Link>
                  ) : (
                    <Link to="/my-orders" onClick={close}><Package size={16} /> My Orders</Link>
                  )}
                  <button onClick={handleLogout}><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          )}

          <button className="icon-btn menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
