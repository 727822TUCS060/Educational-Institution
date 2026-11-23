import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Landmark, Lock, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../lib';

const METHODS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'Card', label: 'Credit / Debit card', icon: CreditCard },
  { id: 'COD', label: 'Cash on delivery', icon: Landmark },
];

export default function Checkout() {
  const { user, isOwner } = useAuth();
  const { cartItems, cartTotal, placeOrder, notify } = useStore();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('UPI');
  const [done, setDone] = useState(null);
  const [errors, setErrors] = useState({});
  const [addr, setAddr] = useState({ name: user.name, phone: user.phone || '', line: '', city: '', pin: '' });
  const shipping = cartTotal >= 500 ? 0 : 50;

  const set = (k) => (e) => setAddr((a) => ({ ...a, [k]: e.target.value }));

  if (done) {
    return (
      <div className="container section center success-page">
        <CheckCircle2 size={64} />
        <h2>Order placed successfully!</h2>
        <p className="muted">Order ID <b>{done.id}</b> · Total paid {formatINR(done.total)}</p>
        <p className="muted">A confirmation has been sent to {done.userEmail}. (Demo – no real payment taken.)</p>
        <div className="hero-cta center-row">
          <Link to="/my-orders" className="btn btn-primary">View my orders</Link>
          <Link to="/products" className="btn btn-outline">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="container section center">
        <h2>Owner accounts can’t place orders</h2>
        <p className="muted">Log in with a student account to test the buying flow.</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container section center">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">Browse products</Link>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!addr.name.trim()) er.name = 'Required';
    if (!/^[0-9]{10}$/.test(addr.phone)) er.phone = '10-digit number';
    if (!addr.line.trim()) er.line = 'Required';
    if (!addr.city.trim()) er.city = 'Required';
    if (!/^[0-9]{6}$/.test(addr.pin)) er.pin = '6-digit PIN';
    setErrors(er);
    if (Object.keys(er).length) return;
    const order = placeOrder({ user, address: addr, payment });
    notify('Order placed!');
    setDone(order);
  };

  return (
    <div className="container section-sm">
      <h1 className="page-title">Checkout</h1>
      <form className="cart-grid" onSubmit={submit} noValidate>
        <div>
          <div className="card pad">
            <h3>Delivery address</h3>
            <div className="grid-2">
              <div className="field"><label>Full name</label><input value={addr.name} onChange={set('name')} />{errors.name && <span className="err">{errors.name}</span>}</div>
              <div className="field"><label>Mobile</label><input value={addr.phone} onChange={set('phone')} />{errors.phone && <span className="err">{errors.phone}</span>}</div>
            </div>
            <div className="field"><label>Address</label><input value={addr.line} onChange={set('line')} placeholder="House no, street, area" />{errors.line && <span className="err">{errors.line}</span>}</div>
            <div className="grid-2">
              <div className="field"><label>City</label><input value={addr.city} onChange={set('city')} />{errors.city && <span className="err">{errors.city}</span>}</div>
              <div className="field"><label>PIN code</label><input value={addr.pin} onChange={set('pin')} />{errors.pin && <span className="err">{errors.pin}</span>}</div>
            </div>
          </div>

          <div className="card pad">
            <h3>Payment method</h3>
            <div className="pay-options">
              {METHODS.map(({ id, label, icon: Icon }) => (
                <label key={id} className={`pay-option ${payment === id ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === id} onChange={() => setPayment(id)} />
                  <Icon size={20} /> {label}
                </label>
              ))}
            </div>
            <p className="muted small"><Lock size={13} /> Demo mode: payment is simulated. Connect a gateway (Razorpay / Stripe) later.</p>
          </div>
        </div>

        <aside className="card pad summary">
          <h3>Order summary</h3>
          {cartItems.map(({ product, qty }) => (
            <div className="sum-row" key={product.id}><span>{product.title} × {qty}</span><b>{formatINR(product.price * qty)}</b></div>
          ))}
          <div className="sum-row"><span>Shipping</span><b>{shipping === 0 ? 'Free' : formatINR(shipping)}</b></div>
          <div className="sum-row total"><span>Total</span><b>{formatINR(cartTotal + shipping)}</b></div>
          <button className="btn btn-accent btn-block btn-lg" type="submit">Place order</button>
          <button type="button" className="link-center plain" onClick={() => navigate('/cart')}>Back to cart</button>
        </aside>
      </form>
    </div>
  );
}
