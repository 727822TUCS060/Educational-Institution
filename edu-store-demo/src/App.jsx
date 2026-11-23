import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import ExamCalendar from './pages/ExamCalendar';
import AnnouncementBar from './components/AnnouncementBar';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCourses from './pages/admin/AdminCourses';
import AdminExams from './pages/admin/AdminExams';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminOrders from './pages/admin/AdminOrders';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Any logged-in user
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}

// Owner only
function RequireOwner() {
  const { user, isOwner } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!isOwner) return <Navigate to="/" replace />;
  return <Outlet />;
}

function PublicLayout() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { toast } = useStore();
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public + customer pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          {/* Common aliases for the home page (/home, /home/, /index.html) */}
          <Route path="/home/*" element={<Navigate to="/" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/exam-calendar" element={<ExamCalendar />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>
          <Route path="*" element={<div className="container section center"><h2>Page not found</h2></div>} />
        </Route>

        {/* Owner admin panel */}
        <Route element={<RequireOwner />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>
      <Toast toast={toast} />
    </>
  );
}
