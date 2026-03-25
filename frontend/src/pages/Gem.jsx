import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { registrationNo: '', category: '', status: 'not-started', registrationDate: '', expiryDate: '', portalUsername: '', notes: '' };

const statusStyle = {
  'not-started': 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400',
  'in-progress': 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black',
  'registered': 'bg-black text-white dark:bg-white dark:text-black',
  'suspended': 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
  'expired': 'bg-gray-200 text-gray-400 dark:bg-zinc-600 dark:text-gray-400',
};

export default function Gem() {
  const [gems, setGems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/gem').then(r => setGems(r.data));
    api.get('/customers').then(r => setCustomers(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/gem/${editing}`, form); setEditing(null); }
    else await api.post('/gem', form);
    api.get('/gem').then(r => setGems(r.data));
    setForm(empty); setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">GeM Portal</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">{gems.length} registrations · {gems.filter(g => g.status === 'registered').length} active</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add GeM Entry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition col-span-2"
            value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
            <option value="">Select Client</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Registration No" value={form.registrationNo} onChange={e => setForm({ ...form, registrationNo: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['not-started', 'in-progress', 'registered', 'suspended', 'expired'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Portal Username" value={form.portalUsername} onChange={e => setForm({ ...form, portalUsername: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" placeholder="Registration Date" value={form.registrationDate} onChange={e => setForm({ ...form, registrationDate: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" placeholder="Expiry Date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} GeM Entry
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Client', 'Reg No', 'Category', 'Username', 'Status', 'Expiry', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {gems.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No GeM entries yet.</td></tr>
            ) : gems.map(g => (
              <tr key={g._id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                <td className="px-5 py-4 font-medium">{g.client?.name || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{g.registrationNo || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{g.category || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{g.portalUsername || '—'}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[g.status]}`}>{g.status}</span></td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{g.expiryDate ? new Date(g.expiryDate).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm({ ...g, client: g.client?._id || '', registrationDate: g.registrationDate?.slice(0, 10) || '', expiryDate: g.expiryDate?.slice(0, 10) || '' }); setEditing(g._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/gem/${g._id}`).then(() => setGems(p => p.filter(x => x._id !== g._id)))} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
