# Vidya Academy – Frontend Workflow Demo (React)

Client demo of an educational institution website that sells books / study materials online and lists courses (enquiry only, no course pricing). Data is stored in Google Sheets (see below).

## Run it

```bash
npm install
npm run dev        # opens http://localhost:5173
npm run build      # production build in /dist
```

Requires Node 18+.

## Database: Google Sheets

Users, books and courses are stored in a Google Sheet through a Google Apps Script web app (`apps-script/Code.gs`).
The API URL is set in `src/api.js` (or `VITE_API_URL` in a `.env` file).

1. Create a Google Sheet > Extensions > Apps Script > paste `apps-script/Code.gs`.
2. Change `OWNER_CODE` at the top, run `setup()` once, then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
3. Put the Web app URL in `src/api.js`.
4. If you edit `Code.gs` later, use Deploy > Manage deployments > Edit > New version, so the same URL keeps working.

There are no built-in logins. Open **Register**, choose **Student** or **Owner**. Owner registration needs the `OWNER_CODE`.

Sheet tabs: `users`, `books`, `courses` (created by `setup()`).
Cart, orders and enquiries are kept in the browser (localStorage) for the demo.

## Pages

**Public / student**
- Home – hero, stats, featured books, popular courses, how it works, testimonials
- Books & Materials – search, category filter, sort, product detail, add to cart / buy now
- Courses – list with outcomes, course detail with syllabus and **enquiry form** (no price)
- Contact – details + message form
- Login / Register – Student or Owner role, validation, role-aware redirect
- Cart → Checkout (simulated payment) → My Orders

**Owner admin panel (`/admin`)**
- Dashboard – counts, revenue, recent enquiries/orders, low-stock alert
- Products – add / edit / delete
- Courses – add / edit / delete (outcomes and syllabus, no price)
- Enquiries – view, set status (New / Contacted / Closed), delete
- Orders – update status (Placed / Shipped / Delivered / Cancelled)

Admin routes are protected: students are redirected away, guests go to login.

## Suggested demo script (5–7 minutes)

0. Register an Owner account first (needs the owner code), then a Student account.
1. Home page → browse books → open a product → Add to cart.
2. Click Buy now while logged out → redirected to Login → Register a new student.
3. Checkout with address + payment → order success → My Orders.
4. Courses → open a course → show outcomes → submit enquiry form.
5. Logout → login as **Owner** → Dashboard shows the new order and enquiry.
6. Products: add a book, edit its price, delete one. Show it appears on the public site.
7. Courses: add a course with outcomes. Enquiries: mark one as Contacted. Orders: mark Shipped.
8. Sidebar → **Clear demo orders** to empty the browser-side orders/enquiries before the next demo.

## Project structure

```
src/
  main.jsx, App.jsx        routing + route guards
  index.css                design system and all styles
  lib.js                   formatters and useLocalStorage hook
  data/seed.js             demo books, courses, users
  context/
    AuthContext.jsx        login / register / roles
    StoreContext.jsx       products, courses, cart, orders, enquiries
  components/              Navbar, Footer, Modal, Toast, Cover, cards, EnquiryForm
  pages/                   Home, Products, ProductDetail, Courses, CourseDetail,
                           Contact, Login, Register, Cart, Checkout, MyOrders
  pages/admin/             AdminLayout, Dashboard, AdminProducts, AdminCourses,
                           AdminEnquiries, AdminOrders
```

## Moving to a real backend later

All data access goes through `AuthContext` and `StoreContext`. To go live, replace the `localStorage` calls in those two files with API calls (Node/Express, Django, Laravel, etc.), move the role check to the server (JWT + role middleware), and replace the simulated checkout with a payment gateway such as Razorpay.

> Note: passwords are stored in plain text in `localStorage` for demo purposes only. Never do this in production.
