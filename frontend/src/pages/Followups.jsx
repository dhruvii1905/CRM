import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { title: '', relatedModel: 'Customer', dueDate: '', status: 'pending', notes: '' };

const statusStyle = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300',
  done: 'bg-black text-white dark:bg-white dark:text-black',
  overdue: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

export default function Followups() {
  const [followups, setFollowups] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/followups').then(r => setFollowups(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.put(`/followups/${editing}`, form); setEditing(null); }
    else await api.post('/followups', form);
    api.get('/followups').then(r => setFollowups(r.data));
    setForm(empty); setShowForm(false);
  };

  const overdue = followups.filter(f => f.status === 'overdue').length;
  const pending = followups.filter(f => f.status === 'pending').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Follow-ups</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">{pending} pending · <span className="text-red-400">{overdue} overdue</span></p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditing(null); }}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-80 transition text-sm">
          + Add Follow-up
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition col-span-2"
            placeholder="Follow-up Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.relatedModel} onChange={e => setForm({ ...form, relatedModel: e.target.value })}>
            {['Customer', 'Lead', 'Tender'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
          <select className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 outline-none focus:border-black transition"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['pending', 'done', 'overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent transition"
            placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">Cancel</button>
            <button className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 transition">
              {editing ? 'Update' : 'Save'} Follow-up
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-left">
            <tr>{['Title', 'Related To', 'Due Date', 'Status', 'Notes', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {followups.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No follow-ups yet.</td></tr>
            ) : followups.map(f => (
              <tr key={f._id} className={`border-t border-gray-100 dark:border-zinc-700 transition ${f.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-700'}`}>
                <td className="px-5 py-4 font-medium">{f.title}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{f.relatedModel}</td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[f.status]}`}>{f.status}</span></td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{f.notes || '—'}</td>
                <td className="px-5 py-4 flex gap-3">
                  <button onClick={() => { setForm({ ...f, dueDate: f.dueDate?.slice(0, 10) || '' }); setEditing(f._id); setShowForm(true); }} className="text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => api.delete(`/followups/${f._id}`).then(() => setFollowups(p => p.filter(x => x._id !== f._id)))} className="text-sm font-medium text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
