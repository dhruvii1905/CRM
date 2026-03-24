import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/leads', label: 'Leads', icon: '📊' },
  { to: '/tasks', label: 'Tasks', icon: '✓' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();

  return (
    <aside style={{ backgroundColor: '#0f0f0f' }} className="w-64 min-h-screen flex flex-col text-white shadow-2xl flex-shrink-0">
      {/* Company Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🏢</span>
          <h1 className="text-base font-bold leading-tight">Orical Technology</h1>
        </div>
        <p className="text-xs text-white/40 font-light pl-7">LLP — Ahmedabad</p>
        <p className="text-xs text-white/30 font-light mt-1 pl-7 leading-relaxed">Tender & Compliance Solutions</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm
              ${pathname === l.to
                ? 'bg-white text-black'
                : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
            <span>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {/* Dark/Light Toggle */}
        <button onClick={toggle}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/8 hover:bg-white/15 transition text-sm font-medium border border-white/10">
          <span className="flex items-center gap-2">
            <span>{dark ? '☀' : '☾'}</span>
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </span>
          <span className="relative w-9 h-5 rounded-full" style={{ backgroundColor: dark ? '#ffffff40' : '#ffffff20' }}>
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
              style={{ left: dark ? '18px' : '2px' }}
            />
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-white/40 capitalize">{user?.role}</p>
          </div>
          <button onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
