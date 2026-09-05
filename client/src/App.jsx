import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import BookService from './pages/BookService';
import BuyNewCar from './pages/BuyNewCar';
import Branches from './pages/Branches';
import Contact from './pages/Contact';
import { AdminAuthProvider, ProtectedRoute } from './context/AdminAuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBuyRequests from './pages/admin/AdminBuyRequests';
import AdminBranches from './pages/admin/AdminBranches';
import AdminContent from './pages/admin/AdminContent';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/buy-new-car" element={<BuyNewCar />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<AdminCars />} />
        <Route path="buy-requests" element={<AdminBuyRequests />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="branches" element={<AdminBranches />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
    </Routes>
  );
}

export default App;