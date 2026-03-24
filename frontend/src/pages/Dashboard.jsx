import { useEffect, useState } from 'react';
import api from '../api/axios';

const cols = {
  Customers: ['name', 'email', 'phone', 'company', 'status'],
  Leads: ['name', 'email', 'phone', 'source', 'status'],
  Tasks: ['title', 'description', 'status', 'priority'],
};

export default function Dashboard() {
  const [data, setData] = useState({ Customers: [], Leads: [], Tasks: [] });
  const [active, setActive] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/customers'), api.get('/leads'), api.get('/tasks')]).then(
      ([c, l, t]) => setData({ Customers: c.data, Leads: l.data, Tasks: t.data })
    );
  }, []);

  const cards = [
    { label: 'Customers', icon: '👥', desc: 'Total registered customers' },
    { label: 'Leads', icon: '📊', desc: 'Active sales leads' },
    { label: 'Tasks', icon: '✓', desc: 'Pending & ongoing tasks' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-light">Welcome back — here's your overview</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {cards.map(c => (
          <button key={c.label} onClick={() => setActive(active === c.label ? null : c.label)}
            className={`text-left p-6 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md
              ${active === c.label
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-white'}`}>
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="text-4xl font-bold">{data[c.label].length}</p>
            <p className="text-lg font-semibold mt-1">{c.label}</p>
            <p className={`text-xs mt-1 font-light ${active === c.label ? 'text-white/70 dark:text-black/60' : 'text-gray-400 dark:text-gray-500'}`}>{c.desc}</p>
          </button>
        ))}
      </div>

      {active && (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{active}</h2>
            <span className="text-sm text-gray-400">{data[active].length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
                <tr>
                  {cols[active].map(h => (
                    <th key={h} className="px-5 py-3 font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data[active].length === 0 ? (
                  <tr><td colSpan={cols[active].length} className="px-5 py-8 text-center text-gray-400">No data found</td></tr>
                ) : data[active].map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                    {cols[active].map(col => (
                      <td key={col} className="px-5 py-3">
                        {col === 'status' || col === 'priority' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/10 dark:bg-white/10">{row[col]}</span>
                        ) : row[col] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
