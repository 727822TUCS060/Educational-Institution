import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import Cover from './Cover';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { discountPct, formatINR } from '../lib';

export default function ProductCard({ product }) {
  const { addToCart, notify } = useStore();
  const { isOwner } = useAuth();
  const navigate = useNavigate();
  const out = product.stock <= 0;
  const off = discountPct(product.price, product.mrp);

  const handleAdd = () => {
    if (isOwner) return notify('Owner accounts manage the store – log in as a student to buy.', 'error');
    if (addToCart(product.id)) notify('Added to cart');
  };

  const handleBuy = () => {
    if (isOwner) return notify('Owner accounts manage the store – log in as a student to buy.', 'error');
    if (addToCart(product.id)) navigate('/checkout');
  };

  return (
    <article className="card product-card">
      <Link to={`/products/${product.id}`} className="card-media">
        <Cover item={product} />
        <span className="tag">{product.category}</span>
        {out && <span className="tag out">Out of stock</span>}
      </Link>
      <div className="card-body">
        <Link to={`/products/${product.id}`}><h3 className="card-title">{product.title}</h3></Link>
        <p className="muted small">by {product.author}</p>
        <div className="rating"><Star size={14} fill="currentColor" /> {product.rating}</div>
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          {off > 0 && (
            <>
              <span className="mrp">{formatINR(product.mrp)}</span>
              <span className="off">{off}% off</span>
            </>
          )}
        </div>
        <div className="card-actions">
          <button className="btn btn-outline btn-sm" disabled={out} onClick={handleAdd}>
            <ShoppingCart size={15} /> Add
          </button>
          <button className="btn btn-primary btn-sm" disabled={out} onClick={handleBuy}>Buy now</button>
        </div>
      </div>
    </article>
  );
}
