import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate('/dashboard');
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Invalid credentials', type: 'error' });
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <Toast message={toast.message} type={toast.type} />
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Login to Travelly</h1>
        <p className="mt-2 text-slate-600">Access your dashboard and manage bookings with secure JWT authentication.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </label>
          <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Login</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">Don’t have an account? <Link to="/register" className="font-semibold text-slate-900">Register</Link></p>
        <p className="mt-3 text-center text-sm text-slate-600">Admin? <Link to="/admin/login" className="font-semibold text-slate-900">Login here</Link></p>
      </div>
    </main>
  );
};

export default Login;
