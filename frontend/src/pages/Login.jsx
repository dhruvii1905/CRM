import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login(form.email, form.password); navigate('/'); }
    catch { setError('Invalid email or password'); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏢</span>
          <div>
            <h1 className="text-3xl font-bold">Orical Technology</h1>
            <p className="text-white/50 text-sm font-light">LLP — Ahmedabad, Est. 2022</p>
          </div>
        </div>
        <p className="text-white/50 text-base font-light mt-4 leading-relaxed">Tender Bidding • GeM Registration • ISO & MSME • Compliance Solutions</p>
      </div>
      <div className="flex-1 flex items-center justify-center px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-1 font-light">Sign in to your account</p>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          <div className="space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              placeholder="Email address" type="email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              placeholder="Password" type="password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
            Sign In
          </button>
          <p className="text-sm text-center text-gray-400">
            No account? <Link to="/register" className="text-black font-medium hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
