import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { seedEnquiries } from '../data/seed';
import { SEED_EXAMS } from '../data/exams';
import { uid, useLocalStorage } from '../lib';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

/* ---------- Per-user cart storage ----------
   A logged-in user's cart is saved under their own key, so one user never sees another's cart.
   Guests (not logged in) have an in-memory cart only. Logging out empties the cart completely. */
const cartKey = (userId) => `edu_cart_${userId}`;

const readCart = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(cartKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeCart = (userId, cart) => {
  try {
    localStorage.setItem(cartKey(userId), JSON.stringify(cart));
  } catch {
    /* storage blocked – ignore */
  }
};

const removeCart = (userId) => {
  try {
    localStorage.removeItem(cartKey(userId));
  } catch {
    /* ignore */
  }
};

// Combine two carts, adding quantities for the same book
const mergeCarts = (a, b) => {
  const map = new Map();
  [...a, ...b].forEach((i) => {
    map.set(i.productId, { productId: i.productId, qty: (map.get(i.productId)?.qty || 0) + i.qty });
  });
  return [...map.values()];
};

export function StoreProvider({ children }) {
  const { user, token, logout } = useAuth();
  const userId = user ? user.id : null;

  // Books and courses come from Google Sheets
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  // Exam calendar ("exams" sheet). Falls back to the built-in sample until the sheet answers.
  const [exams, setExams] = useState(SEED_EXAMS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Orders and enquiries are stored in the browser. Each order carries the user's id,
  // and students only ever see their own orders (see MyOrders page).
  const [enquiries, setEnquiries] = useLocalStorage('edu_enquiries', seedEnquiries);
  const [orders, setOrders] = useLocalStorage('edu_orders', []);
  const [cart, setCart] = useState(() => readCart(userId)); // [{ productId, qty }]
  const [toast, setToast] = useState(null);

  // Remove the old shared cart key used by earlier versions
  useEffect(() => {
    localStorage.removeItem('edu_cart');
  }, []);

  // When the user logs in or out, switch the cart accordingly
  const prevUserId = useRef(userId);
  useEffect(() => {
    const prev = prevUserId.current;
    if (prev === userId) return;
    prevUserId.current = userId;

    if (!userId) {
      // LOGOUT: wipe the cart from memory and from storage
      if (prev) removeCart(prev);
      setCart([]);
    } else {
      // LOGIN: load this user's saved cart and add anything picked while browsing as a guest.
      // (Read storage here, before the save effect below runs, so nothing is overwritten.)
      const stored = readCart(userId);
      setCart((guestCart) => mergeCarts(stored, guestCart));
    }
  }, [userId]);

  // Save the cart only while someone is logged in
  useEffect(() => {
    if (userId) writeCart(userId, cart);
  }, [cart, userId]);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast((t) => (t && Date.now() - t.id >= 2800 ? null : t)), 3000);
  }, []);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [b, c, x] = await Promise.all([
        apiGet('books'),
        apiGet('courses'),
        // the calendar must never break the shop: if the sheet has no "exams" support yet, keep the sample
        apiGet('exams').catch(() => null),
      ]);
      setProducts(b.data);
      setCourses(c.data);
      if (x && Array.isArray(x.data)) setExams(x.data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Owner-only calls. If the session has expired the user is logged out.
  const authed = async (action, payload) => {
    try {
      return await apiPost(action, payload, token);
    } catch (err) {
      if (/session expired/i.test(err.message)) logout();
      throw err;
    }
  };

  /* ---------- Products (owner CRUD → "books" sheet) ---------- */
  const addProduct = async (data) => {
    const res = await authed('addBook', { data });
    setProducts((p) => [res.data, ...p]);
  };
  const updateProduct = async (id, data) => {
    const res = await authed('updateBook', { id, data });
    setProducts((p) => p.map((x) => (x.id === id ? res.data : x)));
  };
  const deleteProduct = async (id) => {
    await authed('deleteBook', { id });
    setProducts((p) => p.filter((x) => x.id !== id));
    setCart((c) => c.filter((i) => i.productId !== id));
  };

  /* ---------- Courses (owner CRUD → "courses" sheet, no pricing) ---------- */
  const addCourse = async (data) => {
    const res = await authed('addCourse', { data });
    setCourses((c) => [res.data, ...c]);
  };
  const updateCourse = async (id, data) => {
    const res = await authed('updateCourse', { id, data });
    setCourses((c) => c.map((x) => (x.id === id ? res.data : x)));
  };
  const deleteCourse = async (id) => {
    await authed('deleteCourse', { id });
    setCourses((c) => c.filter((x) => x.id !== id));
  };

  /* ---------- Exam calendar (owner CRUD → "exams" sheet) ---------- */
  const addExam = async (data) => {
    const res = await authed('addExam', { data });
    setExams((x) => [...x, res.data]);
  };
  const updateExam = async (id, data) => {
    const res = await authed('updateExam', { id, data });
    setExams((x) => x.map((e) => (e.id === id ? res.data : e)));
  };
  const deleteExam = async (id) => {
    await authed('deleteExam', { id });
    setExams((x) => x.filter((e) => e.id !== id));
  };

  /* ---------- Enquiries (browser only) ---------- */
  const addEnquiry = (data) =>
    setEnquiries((e) => [
      { ...data, id: uid('e'), userId, status: 'New', date: new Date().toISOString() },
      ...e,
    ]);
  const updateEnquiryStatus = (id, status) =>
    setEnquiries((e) => e.map((x) => (x.id === id ? { ...x, status } : x)));
  const deleteEnquiry = (id) => setEnquiries((e) => e.filter((x) => x.id !== id));

  /* ---------- Cart ---------- */
  const addToCart = (productId, qty = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return false;
    setCart((c) => {
      const existing = c.find((i) => i.productId === productId);
      if (existing) {
        return c.map((i) =>
          i.productId === productId ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
        );
      }
      return [...c, { productId, qty: Math.min(qty, product.stock) }];
    });
    return true;
  };
  const setCartQty = (productId, qty) => {
    const product = products.find((p) => p.id === productId);
    const max = product ? product.stock : 1;
    setCart((c) =>
      c.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, Math.min(qty, max)) } : i))
    );
  };
  const removeFromCart = (productId) => setCart((c) => c.filter((i) => i.productId !== productId));
  const clearCart = () => setCart([]);

  const cartItems = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
        .filter((i) => i.product),
    [cart, products]
  );
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

  /* ---------- Orders (browser only, each order belongs to a user) ---------- */
  const placeOrder = ({ user: buyer, address, payment }) => {
    const order = {
      id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
      userId: buyer.id,
      userName: buyer.name,
      userEmail: buyer.email,
      items: cartItems.map((i) => ({
        productId: i.productId,
        title: i.product.title,
        price: i.product.price,
        qty: i.qty,
      })),
      total: cartTotal,
      address,
      payment,
      status: 'Placed',
      date: new Date().toISOString(),
    };
    setOrders((o) => [order, ...o]);
    clearCart();
    return order;
  };
  const updateOrderStatus = (id, status) =>
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));

  // Clears only the browser-side demo data (orders, enquiries, carts). Sheets data is untouched.
  const resetDemo = () => {
    Object.keys(localStorage)
      .filter((k) => k === 'edu_enquiries' || k === 'edu_orders' || k.startsWith('edu_cart'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.href = '/';
  };

  const value = {
    products, courses, exams, enquiries, orders, toast, loading, loadError, reload: loadCatalog,
    addProduct, updateProduct, deleteProduct,
    addCourse, updateCourse, deleteCourse,
    addExam, updateExam, deleteExam,
    addEnquiry, updateEnquiryStatus, deleteEnquiry,
    cartItems, cartCount, cartTotal, addToCart, setCartQty, removeFromCart, clearCart,
    placeOrder, updateOrderStatus, notify, resetDemo,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);