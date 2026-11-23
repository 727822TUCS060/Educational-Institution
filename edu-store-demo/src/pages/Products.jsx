import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadState from '../components/LoadState';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/seed';

export default function Products() {
  const { products, loading, loadError } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('featured');

  const list = useMemo(() => {
    let r = products.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (p.title + p.author).toLowerCase().includes(q.toLowerCase())
    );
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [products, q, cat, sort]);

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Books &amp; Study Materials</h1>
          <p>Browse our collection and order online.</p>
        </div>
      </div>
      <div className="container section-sm">
        <div className="toolbar">
          <div className="search">
            <Search size={18} />
            <input placeholder="Search by title or author" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="chips">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <LoadState />
        {!loading && !loadError && list.length === 0 ? (
          <div className="empty">No products match your search.</div>
        ) : (
          <div className="grid-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
