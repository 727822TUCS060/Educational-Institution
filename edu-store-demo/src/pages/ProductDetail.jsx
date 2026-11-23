import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import Cover from '../components/Cover';
import LoadState from '../components/LoadState';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { discountPct, formatINR } from '../lib';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart, notify, loading } = useStore();
  const { isOwner } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.id === id);

  if (!product && loading) {
    return <div className="container section"><LoadState /></div>;
  }

  if (!product) {
    return (
      <div className="container section center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">Back to products</Link>
      </div>
    );
  }

  const out = product.stock <= 0;
  const off = discountPct(product.price, product.mrp);
  const guard = () => {
    if (isOwner) {
      notify('Owner accounts manage the store – log in as a student to buy.', 'error');
      return false;
    }
    return true;
  };

  return (
    <div className="container section-sm">
      <Link to="/products" className="back-link"><ArrowLeft size={16} /> Back to products</Link>
      <div className="detail-grid">
        <div className="detail-media card">
          <Cover item={product} height={420} />
        </div>
        <div>
          <span className="tag static">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>
          <p className="muted">by {product.author}</p>
          <div className="rating big"><Star size={16} fill="currentColor" /> {product.rating} rating</div>

          <div className="price-row big">
            <span className="price">{formatINR(product.price)}</span>
            {off > 0 && (<><span className="mrp">{formatINR(product.mrp)}</span><span className="off">{off}% off</span></>)}
          </div>

          <p className="detail-desc">{product.description}</p>

          <p className={`stock ${out ? 'out' : product.stock < 10 ? 'low' : 'in'}`}>
            {out ? 'Out of stock' : product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
          </p>

          {!out && (
            <div className="qty-row">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
              </div>
              <button
                className="btn btn-outline"
                onClick={() => guard() && addToCart(product.id, qty) && notify('Added to cart')}
              >
                <ShoppingCart size={16} /> Add to cart
              </button>
              <button
                className="btn btn-primary"
                onClick={() => guard() && addToCart(product.id, qty) && navigate('/checkout')}
              >
                Buy now
              </button>
            </div>
          )}

          <div className="info-box"><Truck size={18} /> Free delivery on orders above ₹500 · Delivered in 3–5 working days</div>
        </div>
      </div>
    </div>
  );
}
