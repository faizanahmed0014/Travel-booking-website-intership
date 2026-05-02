import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeClass = ({ isActive }) => isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900">Travelly</Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm sm:gap-4">
          <NavLink to="/" className={activeClass}>Home</NavLink>
          <NavLink to="/hotels" className={activeClass}>Hotels</NavLink>
          <NavLink to="/flights" className={activeClass}>Flights</NavLink>
          {user && <NavLink to="/dashboard" className={activeClass}>Dashboard</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={activeClass}>Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{user.name}</span>
              <button onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700">Logout</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-50">Login</Link>
              <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700">Register</Link>
              <Link to="/admin/login" className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400">Admin</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
