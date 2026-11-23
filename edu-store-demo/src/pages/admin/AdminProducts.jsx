import { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Modal, { ConfirmDialog } from '../../components/Modal';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/seed';
import { formatINR } from '../../lib';

const blank = { title: '', author: '', category: CATEGORIES[0], price: '', mrp: '', stock: '', image: '', description: '' };

function ProductForm({ initial, onSave, onCancel, busy }) {
  const [f, setF] = useState(initial ? { ...initial } : blank);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = 'Title is required';
    if (!f.author.trim()) er.author = 'Author is required';
    if (!(Number(f.price) > 0)) er.price = 'Enter a valid price';
    if (!(Number(f.mrp) >= Number(f.price))) er.mrp = 'MRP must be ≥ price';
    if (!(Number(f.stock) >= 0) || f.stock === '') er.stock = 'Enter stock quantity';
    if (!f.description.trim()) er.description = 'Add a short description';
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave({ ...f, price: Number(f.price), mrp: Number(f.mrp), stock: Number(f.stock) });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="field"><label>Title</label><input value={f.title} onChange={set('title')} />{errors.title && <span className="err">{errors.title}</span>}</div>
      <div className="grid-2">
        <div className="field"><label>Author</label><input value={f.author} onChange={set('author')} />{errors.author && <span className="err">{errors.author}</span>}</div>
        <div className="field"><label>Category</label>
          <select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </div>
      <div className="grid-3-form">
        <div className="field"><label>Price (₹)</label><input type="number" value={f.price} onChange={set('price')} />{errors.price && <span className="err">{errors.price}</span>}</div>
        <div className="field"><label>MRP (₹)</label><input type="number" value={f.mrp} onChange={set('mrp')} />{errors.mrp && <span className="err">{errors.mrp}</span>}</div>
        <div className="field"><label>Stock</label><input type="number" value={f.stock} onChange={set('stock')} />{errors.stock && <span className="err">{errors.stock}</span>}</div>
      </div>
      <div className="field"><label>Image URL <span className="muted small">(optional – a cover is generated if empty)</span></label><input value={f.image} onChange={set('image')} placeholder="https://..." /></div>
      <div className="field"><label>Description</label><textarea rows={4} value={f.description} onChange={set('description')} />{errors.description && <span className="err">{errors.description}</span>}</div>
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : initial ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, notify } = useStore();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = products.filter((p) => (p.title + p.author + p.category).toLowerCase().includes(q.toLowerCase()));

  const save = async (data) => {
    setBusy(true);
    try {
      if (editing === 'new') {
        await addProduct(data);
        notify('Product added');
      } else {
        await updateProduct(editing.id, data);
        notify('Product updated');
      }
      setEditing(null);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteProduct(deleting.id);
      notify('Product deleted');
      setDeleting(null);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title">Products</h1>
        <button className="btn btn-primary" onClick={() => setEditing('new')}><Plus size={17} /> Add product</button>
      </div>

      <div className="card">
        <div className="table-tools">
          <div className="search"><Search size={17} /><input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <span className="muted small">{list.length} item(s)</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.title}</b><div className="muted small">{p.author}</div></td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)} <span className="mrp">{formatINR(p.mrp)}</span></td>
                  <td><span className={`status ${p.stock === 0 ? 'cancelled' : p.stock < 10 ? 'new' : 'delivered'}`}>{p.stock === 0 ? 'Out' : p.stock}</span></td>
                  <td className="right">
                    <button className="icon-btn" title="Edit" onClick={() => setEditing(p)}><Pencil size={17} /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(p)}><Trash2 size={17} /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={5} className="center muted">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add product' : 'Edit product'} onClose={() => setEditing(null)} wide>
          <ProductForm initial={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} busy={busy} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete product?"
          message={`“${deleting.title}” will be removed from the store permanently.`}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
