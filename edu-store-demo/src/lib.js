import { useEffect, useState } from 'react';

export const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

export const discountPct = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

// useState that persists to localStorage (our "database" for the demo)
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked – ignore in demo */
    }
  }, [key, value]);
  return [value, setValue];
}
