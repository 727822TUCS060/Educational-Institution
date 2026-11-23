import { useStore } from '../../context/StoreContext';
import { formatDate, formatINR } from '../../lib';

const STATUSES = ['Placed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { orders, updateOrderStatus, notify } = useStore();

  return (
    <>
      <div className="admin-head"><h1 className="admin-title">Orders</h1></div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><b>{o.id}</b><div className="muted small">{formatDate(o.date)} · {o.payment}</div></td>
                  <td>{o.userName}<div className="muted small">{o.address.city} – {o.address.pin}</div></td>
                  <td>{o.items.map((i) => <div key={i.productId} className="small">{i.title} × {i.qty}</div>)}</td>
                  <td><b>{formatINR(o.total)}</b></td>
                  <td>
                    <select
                      className={`status-select ${o.status.toLowerCase()}`}
                      value={o.status}
                      onChange={(e) => { updateOrderStatus(o.id, e.target.value); notify('Order status updated'); }}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="center muted">No orders yet. Log in as a student and buy a book to see it here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
