import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, IndianRupee, MessageSquare, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate, formatINR } from '../../lib';

export default function Dashboard() {
  const { products, courses, enquiries, orders } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const newEnq = enquiries.filter((e) => e.status === 'New').length;
  const lowStock = products.filter((p) => p.stock < 10);

  const cards = [
    { label: 'Products', value: products.length, icon: BookOpen, to: '/admin/products', tone: 'blue' },
    { label: 'Courses', value: courses.length, icon: GraduationCap, to: '/admin/courses', tone: 'green' },
    { label: 'New enquiries', value: newEnq, icon: MessageSquare, to: '/admin/enquiries', tone: 'amber' },
    { label: 'Orders', value: orders.length, icon: ShoppingBag, to: '/admin/orders', tone: 'purple' },
    { label: 'Revenue', value: formatINR(revenue), icon: IndianRupee, to: '/admin/orders', tone: 'rose' },
  ];

  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <div className="stat-cards">
        {cards.map(({ label, value, icon: Icon, to, tone }) => (
          <Link to={to} className={`stat-card ${tone}`} key={label}>
            <span className="stat-icon"><Icon size={22} /></span>
            <div><strong>{value}</strong><span>{label}</span></div>
          </Link>
        ))}
      </div>

      <div className="admin-two">
        <div className="card pad">
          <h3>Recent enquiries</h3>
          {enquiries.length === 0 ? <p className="muted">No enquiries yet.</p> : enquiries.slice(0, 5).map((e) => (
            <div className="list-row" key={e.id}>
              <div><b>{e.name}</b><span className="muted small"> · {e.courseTitle}</span></div>
              <span className={`status ${e.status.toLowerCase()}`}>{e.status}</span>
            </div>
          ))}
          <Link to="/admin/enquiries" className="link-arrow">View all</Link>
        </div>

        <div className="card pad">
          <h3>Recent orders</h3>
          {orders.length === 0 ? <p className="muted">No orders yet. Place one as a student to see it here.</p> : orders.slice(0, 5).map((o) => (
            <div className="list-row" key={o.id}>
              <div><b>{o.id}</b><span className="muted small"> · {o.userName} · {formatDate(o.date)}</span></div>
              <b>{formatINR(o.total)}</b>
            </div>
          ))}
          <Link to="/admin/orders" className="link-arrow">View all</Link>
        </div>
      </div>

      <div className="card pad">
        <h3>Low stock alert</h3>
        {lowStock.length === 0 ? <p className="muted">All products are well stocked.</p> : lowStock.map((p) => (
          <div className="list-row" key={p.id}>
            <span>{p.title}</span>
            <span className={`status ${p.stock === 0 ? 'cancelled' : 'new'}`}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</span>
          </div>
        ))}
      </div>
    </>
  );
}
