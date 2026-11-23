import { Loader2, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Shows "Loading…" or an error with Retry while the sheet data is being fetched.
// Renders nothing once data has loaded.
export default function LoadState() {
  const { loading, loadError, reload } = useStore();
  if (loading) {
    return (
      <div className="empty load-box"><Loader2 size={22} className="spin" /> Loading from database…</div>
    );
  }
  if (loadError) {
    return (
      <div className="empty load-box error">
        <p>{loadError}</p>
        <button className="btn btn-outline btn-sm" onClick={reload}><RefreshCw size={15} /> Try again</button>
      </div>
    );
  }
  return null;
}
