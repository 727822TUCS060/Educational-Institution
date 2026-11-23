import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatDate, formatINR } from '../lib';

export default function MyOrders() {
  const { user } = useAuth();
  const { orders } = useStore();
  const mine = orders.filter((o) => o.userId === user.id);

  return (
    <div className="container section-sm">
      <h1 className="page-title">My orders</h1>
      {mine.length === 0 ? (
        <div className="card pad center empty-cart">
          <PackageOpen size={52} />
          <h3>No orders yet</h3>
          <p className="muted">Your purchased books will appear here.</p>
          <Link to="/products" className="btn btn-primary">Browse books</Link>
        </div>
      ) : (
        mine.map((o) => (
          <div className="card pad order-card" key={o.id}>
            <div className="order-head">
              <div><b>{o.id}</b><span className="muted small"> · {formatDate(o.date)}</span></div>
              <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            {o.items.map((i) => (
              <div className="sum-row" key={i.productId}><span>{i.title} × {i.qty}</span><b>{formatINR(i.price * i.qty)}</b></div>
            ))}
            <div className="sum-row total"><span>Total ({o.payment})</span><b>{formatINR(o.total)}</b></div>
            <p className="muted small">Deliver to: {o.address.name}, {o.address.line}, {o.address.city} – {o.address.pin}</p>
          </div>
        ))
      )}
    </div>
  );
}
