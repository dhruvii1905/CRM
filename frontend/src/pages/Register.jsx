import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthLeftPanel from '../components/AuthLeftPanel';

const validate = (form) => {
  const e = {};
  if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
  if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Phone must be 10 digits';
  if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
  if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
  return e;
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'agent' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate(form);
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);
    setApiError('');
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      navigate('/login');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500'];

  const inputClass = (field) =>
    `w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:shadow-sm ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-black'}`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AuthLeftPanel />

      <div className="flex-1 flex items-center justify-center px-8 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" autoComplete="off">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Create account</h2>
            <p className="text-gray-400 text-sm mt-1 font-light">Fill in your details to get started</p>
          </div>

          {apiError && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠</span> {apiError}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                <input className={inputClass('name')} placeholder="Full Name"
                  value={form.name} onChange={e => handleChange('name', e.target.value)} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉</span>
                <input className={inputClass('email')} placeholder="Email address" type="email" autoComplete="off"
                  value={form.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📱</span>
                <input className={inputClass('phone')} placeholder="Phone number (optional)" type="tel"
                  value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                <input
                  className={`w-full border rounded-xl pl-10 pr-12 py-3 text-sm outline-none transition-all duration-200 focus:shadow-sm ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-black'}`}
                  placeholder="Password" type={showPass ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password} onChange={e => handleChange('password', e.target.value)} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition text-xs">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{strengthLabel[strength]}</span>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                <input
                  className={`w-full border rounded-xl pl-10 pr-12 py-3 text-sm outline-none transition-all duration-200 focus:shadow-sm ${errors.confirm ? 'border-red-400 bg-red-50' : form.confirm && form.confirm === form.password ? 'border-green-400' : 'border-gray-200 focus:border-black'}`}
                  placeholder="Confirm Password" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                  value={form.confirm} onChange={e => handleChange('confirm', e.target.value)} />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition text-xs">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.confirm && form.confirm === form.password && !errors.confirm && (
                <p className="text-green-500 text-xs mt-1 ml-1">✓ Passwords match</p>
              )}
              {errors.confirm && <p className="text-red-500 text-xs mt-1 ml-1">⚠ {errors.confirm}</p>}
            </div>

            {/* Role */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👔</span>
              <select className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-black transition bg-white"
                value={form.role} onChange={e => handleChange('role', e.target.value)}>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200
              ${loading ? 'bg-gray-800 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-95'}`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>

          <p className="text-sm text-center text-gray-400 mt-5">
            Already have an account? <Link to="/login" className="text-black font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
