import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { title: '', portal: 'Other', referenceNo: '', value: '', deadline: '', status: 'identified', notes: '' };

const statusStyle = {
  identified: 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300',
  applied: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black',
  won: 'bg-black text-white dark:bg-white dark:text-black',
  lost: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-gray-200 text-gray-400 dark:bg-zinc-600 dark:text-gray-400',
};

export default function Tenders() {
  const [tenders, setTenders] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/tenders').then(r => setTenders(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/tenders/${editing}`, form); setEditing(null); }
    else await api.post('/tenders', form);
    api.get('/tenders').then(r => setTenders(r.data));
    setForm(empty); setShowForm(false);
  };

  const totalValue = tenders.reduce((s, t) => s + (t.value || 0), 0);
  const won = tenders.filter(t => t.status === 'won').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Tenders</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">{tenders.length} total · {won} won · ₹{totalValue.toLocaleString()} value</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add Tender
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Tender Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Reference No" value={form.referenceNo} onChange={e => setForm({ ...form, referenceNo: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Value (₹)" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.portal} onChange={e => setForm({ ...form, portal: e.target.value })}>
            {['GeM', 'CPPP', 'State', 'Private', 'Other'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['identified', 'applied', 'won', 'lost', 'cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" placeholder="Deadline" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} Tender
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Title', 'Portal', 'Ref No', 'Value', 'Deadline', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {tenders.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No tenders yet.</td></tr>
            ) : tenders.map(t => (
              <tr key={t._id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                <td className="px-5 py-4 font-medium">{t.title}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.portal}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.referenceNo || '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.value ? `₹${Number(t.value).toLocaleString()}` : '—'}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[t.status]}`}>{t.status}</span></td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm({ ...t, deadline: t.deadline?.slice(0, 10) || '', value: t.value || '' }); setEditing(t._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/tenders/${t._id}`).then(() => setTenders(p => p.filter(x => x._id !== t._id)))} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
