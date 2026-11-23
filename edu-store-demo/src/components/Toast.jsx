import { CheckCircle2, XCircle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;
  const Icon = toast.type === 'error' ? XCircle : CheckCircle2;
  return (
    <div className={`toast ${toast.type}`} role="status">
      <Icon size={18} /> {toast.message}
    </div>
  );
}
