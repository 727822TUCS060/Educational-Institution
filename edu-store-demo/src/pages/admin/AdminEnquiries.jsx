import { useState } from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../components/Modal';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../lib';

const STATUSES = ['New', 'Contacted', 'Closed'];

export default function AdminEnquiries() {
  const { enquiries, updateEnquiryStatus, deleteEnquiry, notify } = useStore();
  const [filter, setFilter] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const list = enquiries.filter((e) => filter === 'All' || e.status === filter);

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title">Enquiries</h1>
        <div className="chips tight">
          {['All', ...STATUSES].map((s) => (
            <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card pad center muted">No enquiries to show.</div>
      ) : (
        list.map((e) => (
          <div className="card pad enquiry" key={e.id}>
            <div className="enquiry-top">
              <div>
                <b>{e.name}</b> <span className="muted small">· {formatDate(e.date)}</span>
                <div className="tag static">{e.courseTitle}</div>
              </div>
              <select value={e.status} className={`status-select ${e.status.toLowerCase()}`} onChange={(ev) => { updateEnquiryStatus(e.id, ev.target.value); notify('Status updated'); }}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {e.message && <p className="enquiry-msg">“{e.message}”</p>}
            <div className="enquiry-foot">
              <span><Mail size={15} /> {e.email}</span>
              <span><Phone size={15} /> {e.phone}</span>
              <button className="icon-btn danger" onClick={() => setDeleting(e)} aria-label="Delete"><Trash2 size={17} /></button>
            </div>
          </div>
        ))
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete enquiry?"
          message={`Remove the enquiry from ${deleting.name}?`}
          onCancel={() => setDeleting(null)}
          onConfirm={() => { deleteEnquiry(deleting.id); notify('Enquiry deleted'); setDeleting(null); }}
        />
      )}
    </>
  );
}
