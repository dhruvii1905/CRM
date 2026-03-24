import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/auth/register', form); navigate('/login'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
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
            <h2 className="text-3xl font-bold">Create account</h2>
            <p className="text-gray-400 text-sm mt-1 font-light">Fill in your details to get started</p>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          <div className="space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition bg-white"
              value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
            Create Account
          </button>
          <p className="text-sm text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-black font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
