import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Cover from '../components/Cover';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../lib';

export default function Cart() {
  const { cartItems, cartTotal, setCartQty, removeFromCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = cartTotal === 0 || cartTotal >= 500 ? 0 : 50;

  if (cartItems.length === 0) {
    return (
      <div className="container section center empty-cart">
        <ShoppingBag size={56} />
        <h2>Your cart is empty</h2>
        <p className="muted">Browse our books and study materials to get started.</p>
        <Link to="/products" className="btn btn-primary">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="container section-sm">
      <h1 className="page-title">Shopping cart</h1>
      <div className="cart-grid">
        <div className="card">
          {cartItems.map(({ product, qty }) => (
            <div className="cart-row" key={product.id}>
              <div className="cart-thumb"><Cover item={product} height={86} /></div>
              <div className="cart-info">
                <Link to={`/products/${product.id}`}><b>{product.title}</b></Link>
                <span className="muted small">{product.author}</span>
                <span className="price small-price">{formatINR(product.price)}</span>
              </div>
              <div className="qty">
                <button onClick={() => setCartQty(product.id, qty - 1)}><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setCartQty(product.id, qty + 1)}><Plus size={14} /></button>
              </div>
              <b className="line-total">{formatINR(product.price * qty)}</b>
              <button className="icon-btn danger" onClick={() => removeFromCart(product.id)} aria-label="Remove"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <aside className="card pad summary">
          <h3>Order summary</h3>
          <div className="sum-row"><span>Subtotal</span><b>{formatINR(cartTotal)}</b></div>
          <div className="sum-row"><span>Shipping</span><b>{shipping === 0 ? 'Free' : formatINR(shipping)}</b></div>
          <div className="sum-row total"><span>Total</span><b>{formatINR(cartTotal + shipping)}</b></div>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate(user ? '/checkout' : '/login', { state: { from: '/checkout' } })}>
            {user ? 'Proceed to checkout' : 'Login to checkout'}
          </button>
          <Link to="/products" className="link-center">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
