import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🏢</span>
            <div>
              <h1 className="text-3xl font-bold">Orical Technology</h1>
              <p className="text-white/50 text-sm font-light">LLP — Ahmedabad, Est. 2022</p>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            {['Tender Bidding & Consultancy', 'GeM Portal Registration', 'ISO & MSME Certification', 'Compliance Solutions'].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-white/60 text-sm font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" autoComplete="off">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-1 font-light">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉</span>
              <input
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-black transition-all duration-200 focus:shadow-sm"
                placeholder="Email address" type="email" autoComplete="off"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
              <input
                className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-black transition-all duration-200 focus:shadow-sm"
                placeholder="Password" type={showPass ? 'text' : 'password'} autoComplete="new-password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition text-xs">
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ transition: 'all 0.2s ease' }}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm relative overflow-hidden
              ${loading ? 'bg-gray-800 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-95'} text-white`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <p className="text-sm text-center text-gray-400 mt-5">
            No account? <Link to="/register" className="text-black font-medium hover:underline transition">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
