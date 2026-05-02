import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Flights from './pages/Flights';
import HotelDetail from './pages/HotelDetail';
import FlightDetail from './pages/FlightDetail';
import EntityDetail from './pages/EntityDetail';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  const ProtectedRoute = ({ children, adminOnly }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/flights/:id" element={<FlightDetail />} />
        <Route path="/entities/:type/:id" element={<EntityDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
